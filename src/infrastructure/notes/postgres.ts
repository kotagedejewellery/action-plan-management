import { Pool } from "pg";

import { AppError } from "@/application/errors";
import type { NoteRepository, NoteWorkspaceRepository } from "@/application/ports";
import type { CollaborativeNote, NoteWorkspace, NoteWorkspaceMember } from "@/domain/models";

let pool: Pool | undefined;

function databaseUrl(): string {
  const value = process.env.NOTES_DATABASE_URL;
  if (!value) throw new AppError("Catatan Kolaboratif belum dikonfigurasi di server.", "UNAVAILABLE");
  return value;
}

export function notesPool(): Pool {
  if (!pool) pool = new Pool({ connectionString: databaseUrl() });
  return pool;
}

function iso(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : value;
}

function workspaceFrom(row: Record<string, unknown>): NoteWorkspace {
  return { id: String(row.id), name: String(row.name), ownerId: String(row.owner_id), createdAt: iso(row.created_at as Date | string), updatedAt: iso(row.updated_at as Date | string) };
}

function memberFrom(row: Record<string, unknown>): NoteWorkspaceMember {
  return { workspaceId: String(row.workspace_id), userId: String(row.user_id), role: row.role === "owner" ? "owner" : "member", createdAt: iso(row.created_at as Date | string) };
}

function noteFrom(row: Record<string, unknown>): CollaborativeNote {
  return { id: String(row.id), workspaceId: String(row.workspace_id), title: String(row.title), createdBy: String(row.created_by), createdAt: iso(row.created_at as Date | string), updatedAt: iso(row.updated_at as Date | string) };
}

export class PostgresNoteWorkspaceRepository implements NoteWorkspaceRepository {
  async listForUser(userId: string): Promise<NoteWorkspace[]> {
    const result = await notesPool().query("SELECT w.* FROM note_workspaces w INNER JOIN note_workspace_members m ON m.workspace_id = w.id WHERE m.user_id = $1 ORDER BY w.updated_at DESC", [userId]);
    return result.rows.map(workspaceFrom);
  }

  async findById(id: string): Promise<NoteWorkspace | null> {
    const result = await notesPool().query("SELECT * FROM note_workspaces WHERE id = $1", [id]);
    return result.rows[0] ? workspaceFrom(result.rows[0]) : null;
  }

  async createWithOwner(workspace: NoteWorkspace, owner: NoteWorkspaceMember): Promise<NoteWorkspace> {
    const client = await notesPool().connect();
    try {
      await client.query("BEGIN");
      const result = await client.query("INSERT INTO note_workspaces (id, name, owner_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *", [workspace.id, workspace.name, workspace.ownerId, workspace.createdAt, workspace.updatedAt]);
      await client.query("INSERT INTO note_workspace_members (workspace_id, user_id, role, created_at) VALUES ($1, $2, $3, $4)", [owner.workspaceId, owner.userId, owner.role, owner.createdAt]);
      await client.query("COMMIT");
      return workspaceFrom(result.rows[0]);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async listMembers(workspaceId: string): Promise<NoteWorkspaceMember[]> {
    const result = await notesPool().query("SELECT * FROM note_workspace_members WHERE workspace_id = $1 ORDER BY created_at ASC", [workspaceId]);
    return result.rows.map(memberFrom);
  }

  async addMember(member: NoteWorkspaceMember): Promise<NoteWorkspaceMember> {
    const result = await notesPool().query("INSERT INTO note_workspace_members (workspace_id, user_id, role, created_at) VALUES ($1, $2, $3, $4) RETURNING *", [member.workspaceId, member.userId, member.role, member.createdAt]);
    return memberFrom(result.rows[0]);
  }

  async removeMember(workspaceId: string, userId: string): Promise<void> {
    await notesPool().query("DELETE FROM note_workspace_members WHERE workspace_id = $1 AND user_id = $2", [workspaceId, userId]);
  }
}

export class PostgresNoteRepository implements NoteRepository {
  async listByWorkspace(workspaceId: string): Promise<CollaborativeNote[]> {
    const result = await notesPool().query("SELECT * FROM notes WHERE workspace_id = $1 ORDER BY updated_at DESC", [workspaceId]);
    return result.rows.map(noteFrom);
  }

  async findById(id: string): Promise<CollaborativeNote | null> {
    const result = await notesPool().query("SELECT * FROM notes WHERE id = $1", [id]);
    return result.rows[0] ? noteFrom(result.rows[0]) : null;
  }

  async create(note: CollaborativeNote): Promise<CollaborativeNote> {
    const result = await notesPool().query("INSERT INTO notes (id, workspace_id, title, created_by, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [note.id, note.workspaceId, note.title, note.createdBy, note.createdAt, note.updatedAt]);
    return noteFrom(result.rows[0]);
  }

  async updateTitle(note: CollaborativeNote): Promise<CollaborativeNote> {
    const result = await notesPool().query("UPDATE notes SET title = $2, updated_at = $3 WHERE id = $1 RETURNING *", [note.id, note.title, note.updatedAt]);
    return noteFrom(result.rows[0]);
  }

  async remove(id: string): Promise<void> {
    await notesPool().query("DELETE FROM notes WHERE id = $1", [id]);
  }
}

export async function loadNoteDocument(noteId: string): Promise<Uint8Array | null> {
  const result = await notesPool().query<{ state: Buffer }>("SELECT state FROM note_documents WHERE note_id = $1", [noteId]);
  return result.rows[0] ? new Uint8Array(result.rows[0].state) : null;
}

export async function storeNoteDocument(noteId: string, state: Uint8Array): Promise<void> {
  await notesPool().query(`
    WITH live_note AS (UPDATE notes SET updated_at = NOW() WHERE id = $1 RETURNING id)
    INSERT INTO note_documents (note_id, state, updated_at)
    SELECT id, $2, NOW() FROM live_note
    ON CONFLICT (note_id) DO UPDATE SET state = EXCLUDED.state, updated_at = EXCLUDED.updated_at
  `, [noteId, Buffer.from(state)]);
}
