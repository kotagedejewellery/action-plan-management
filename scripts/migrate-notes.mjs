import { Client } from "pg";

const databaseUrl = process.env.NOTES_DATABASE_URL;
if (!databaseUrl) throw new Error("NOTES_DATABASE_URL wajib diisi sebelum menjalankan migrasi Notes.");

const client = new Client({ connectionString: databaseUrl });
await client.connect();
try {
  await client.query(`
    CREATE TABLE IF NOT EXISTS note_workspaces (id UUID PRIMARY KEY, name TEXT NOT NULL, owner_id TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL);
    CREATE TABLE IF NOT EXISTS note_workspace_members (workspace_id UUID NOT NULL REFERENCES note_workspaces(id) ON DELETE CASCADE, user_id TEXT NOT NULL, role TEXT NOT NULL CHECK (role IN ('owner', 'member')), created_at TIMESTAMPTZ NOT NULL, PRIMARY KEY (workspace_id, user_id));
    CREATE INDEX IF NOT EXISTS note_workspace_members_user_id_idx ON note_workspace_members(user_id);
    CREATE TABLE IF NOT EXISTS notes (id UUID PRIMARY KEY, workspace_id UUID NOT NULL REFERENCES note_workspaces(id) ON DELETE CASCADE, title TEXT NOT NULL, created_by TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL, title_updated_at TIMESTAMPTZ NOT NULL);
    CREATE INDEX IF NOT EXISTS notes_workspace_updated_at_idx ON notes(workspace_id, updated_at DESC);
    CREATE TABLE IF NOT EXISTS note_documents (note_id UUID PRIMARY KEY REFERENCES notes(id) ON DELETE CASCADE, state BYTEA NOT NULL, updated_at TIMESTAMPTZ NOT NULL);
    ALTER TABLE notes ADD COLUMN IF NOT EXISTS title_updated_at TIMESTAMPTZ;
    UPDATE notes SET title_updated_at = updated_at WHERE title_updated_at IS NULL;
    ALTER TABLE notes ALTER COLUMN title_updated_at SET NOT NULL;
  `);
  console.log("Migrasi Catatan Kolaboratif selesai.");
} finally {
  await client.end();
}
