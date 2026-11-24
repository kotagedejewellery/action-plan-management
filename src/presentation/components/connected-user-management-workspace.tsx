"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";

import type {
  ActionPlanStatus,
  SafeUser,
  Division,
  UserRole,
} from "@/domain/models";
import { useFeedback } from "./feedback";
import { Pencil, Plus, Search, Trash } from "./icons";
import {
  AccountStatus,
  ConfirmDialog,
  DialogFrame,
  PageHeading,
} from "./workspace-ui";

type UserInput = {
  name: string;
  email: string;
  role: UserRole;
  divisionId?: string;
  status: "active" | "inactive";
  password?: string;
};
type StatusInput = Pick<ActionPlanStatus, "isActive" | "isCompleted">;

export function ConnectedUserManagementWorkspace({
  initialUsers,
  initialStatuses,
  divisions = [],
}: {
  initialUsers: SafeUser[];
  initialStatuses: ActionPlanStatus[];
  divisions?: Division[];
}) {
  const { notify } = useFeedback();
  const [members, setMembers] = useState(initialUsers);
  const [statuses, setStatuses] = useState(initialStatuses);
  const [query, setQuery] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("");
  const unmapped = members.filter(
    (member) => Boolean(member.sheetName) && !member.divisionId,
  ).length;
  const [editingMember, setEditingMember] = useState<SafeUser | "new" | null>(
    null,
  );
  const [deletingMember, setDeletingMember] = useState<SafeUser | null>(null);
  const [editingStatus, setEditingStatus] = useState<ActionPlanStatus | null>(
    null,
  );
  const filteredMembers = useMemo(
    () =>
      members.filter(
        (member) =>
          `${member.name} ${member.email}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (!divisionFilter ||
            (divisionFilter === "unmapped"
              ? Boolean(member.sheetName) && !member.divisionId
              : member.divisionId === divisionFilter ||
                divisions.some(
                  (division) =>
                    division.id === divisionFilter &&
                    division.bodUserId === member.id,
                ))),
      ),
    [members, query, divisionFilter, divisions],
  );

  async function saveMember(input: UserInput, member?: SafeUser) {
    const response = await fetch(
      member ? `/api/users/${member.id}` : "/api/users",
      {
        method: member ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      },
    );
    const body = await response.json();
    if (!response.ok)
      throw new Error(body.error ?? "User tidak dapat disimpan.");
    setMembers((current) =>
      member
        ? current.map((item) => (item.id === member.id ? body : item))
        : [...current, body],
    );
    setEditingMember(null);
    notify(
      "success",
      member ? "User diperbarui" : "User ditambahkan",
      "Perubahan akses telah tersimpan.",
    );
  }

  async function deleteMember(member: SafeUser, confirmationEmail: string) {
    const response = await fetch(`/api/users/${member.id}`, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ confirmationEmail }),
    });
    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      throw new Error(body.error ?? "User tidak dapat dihapus.");
    }
    setMembers((current) => current.filter((item) => item.id !== member.id));
    setDeletingMember(null);
    notify(
      "success",
      "Akun dihapus",
      "Akun tanpa riwayat berhasil dihapus permanen.",
    );
  }

  async function addStatus(label: string, isCompleted: boolean) {
    const response = await fetch("/api/statuses", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ label, isCompleted }),
    });
    const body = await response.json();
    if (!response.ok)
      throw new Error(body.error ?? "Status tidak dapat ditambahkan.");
    setStatuses((current) => [...current, body]);
    notify(
      "success",
      "Status ditambahkan",
      body.isCompleted
        ? `Status ${body.label} akan memindahkan Action Plan ke Riwayat.`
        : `Status ${body.label} siap dipakai oleh seluruh User.`,
    );
  }

  async function saveStatus(status: ActionPlanStatus, input: StatusInput) {
    const response = await fetch(`/api/statuses/${status.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });
    const body = await response.json();
    if (!response.ok)
      throw new Error(body.error ?? "Status tidak dapat diperbarui.");
    setStatuses((current) =>
      current.map((item) => (item.id === body.id ? body : item)),
    );
    setEditingStatus(null);
    notify(
      "success",
      "Status diperbarui",
      body.isActive
        ? "Status tersedia untuk Action Plan baru."
        : "Status tidak lagi tersedia untuk Action Plan baru.",
    );
  }

  return (
    <section className="w-full max-w-none">
      <PageHeading
        title="Users"
        description="Kelola akun, status akses, dan pilihan status Action Plan."
        action={
          <button
            onClick={() => setEditingMember("new")}
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#137d79] px-4 text-sm font-semibold text-white transition hover:bg-[#0e6865]"
          >
            <Plus className="size-4" />
            Tambah User
          </button>
        }
      />
      {unmapped > 0 && (
        <p className="mt-6 rounded-xl border border-[#e4c99c] bg-[#fff8e9] p-4 text-sm leading-6 text-[#80501b]">
          {unmapped} akun memiliki riwayat pekerjaan yang belum dipetakan ke
          divisi. Tinjau pemetaan agar riwayat tampil pada monitoring divisi
          yang tepat.
        </p>
      )}
      <div className="mt-8 flex flex-wrap justify-between gap-3 border-y py-4">
        <label className="text-sm text-[#294846]">
          <span className="sr-only">Filter divisi akun</span>
          <select
            aria-label="Filter divisi akun"
            value={divisionFilter}
            onChange={(event) => setDivisionFilter(event.target.value)}
            className="h-10 rounded-xl border bg-white px-3"
          >
            <option value="">Seluruh divisi</option>
            <option value="unmapped">Belum dipetakan ({unmapped})</option>
            {divisions.map((division) => (
              <option key={division.id} value={division.id}>
                {division.name}
              </option>
            ))}
          </select>
        </label>
        <label className="relative block w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#7f9290]" />
          <span className="sr-only">Cari User</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-10 w-full rounded-xl border bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-[#9aa9a8] focus:border-[#137d79]"
            placeholder="Cari nama atau email"
          />
        </label>
      </div>
      <p className="mt-4 text-xs text-[#516967] sm:hidden">
        Geser tabel untuk melihat divisi, status, dan tindakan akun.
      </p>
      <div className="mt-3 overflow-hidden rounded-2xl border bg-white shadow-[0_18px_36px_-32px_rgba(23,60,58,0.35)]">
        <div
          className="overflow-x-auto"
          role="region"
          aria-label="Tabel akun dan divisi, dapat digulir"
          tabIndex={0}
        >
          <table className="w-full min-w-[720px] text-left">
            <thead className="border-b bg-[#f7faf9] text-xs font-semibold tracking-[0.04em] text-[#708381]">
              <tr>
                <th className="px-5 py-3.5">USER</th>
                <th className="px-5 py-3.5">ROLE</th>
                <th className="px-5 py-3.5">DIVISI</th>
                <th className="px-5 py-3.5">STATUS</th>
                <th className="px-5 py-3.5 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="border-b last:border-0 hover:bg-[#fbfcfc]"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-full bg-[#edf3f2] text-xs font-bold text-[#526d69]">
                        {member.name.slice(0, 1).toUpperCase()}
                      </span>
                      <div>
                        <p className="font-medium text-[#244542]">
                          {member.name}
                        </p>
                        <p className="mt-0.5 text-sm text-[#748886]">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-[#f0f4f3] px-2.5 py-1 text-xs font-semibold text-[#526b68]">
                      {roleLabel(member.role)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#516967]">
                    {(member.role === "bod"
                      ? divisions.find(
                          (division) => division.bodUserId === member.id,
                        )?.name
                      : divisions.find(
                          (division) => division.id === member.divisionId,
                        )?.name) ??
                      (member.role === "admin"
                        ? "Seluruh divisi"
                        : "Belum dipetakan")}
                    {member.sheetName && !member.divisionId && (
                      <span className="mt-1 block text-xs text-[#80501b]">
                        Riwayat belum dipetakan
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <AccountStatus status={member.status} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {member.role === "bod" && (
                        <a
                          href={divisionManagementHref(
                            divisions,
                            member.id,
                          )}
                          className="inline-flex h-9 cursor-pointer items-center rounded-lg px-2 text-xs font-semibold text-[#176d69] transition hover:bg-[#e8f3f1]"
                        >
                          Divisi
                        </a>
                      )}
                      <button
                        onClick={() => setEditingMember(member)}
                        className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-[#4f6967] transition hover:bg-[#e8f3f1] hover:text-[#137d79]"
                        aria-label={`Edit ${member.name}`}
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => setDeletingMember(member)}
                        disabled={member.status !== "inactive"}
                        title={
                          member.status === "inactive"
                            ? "Hapus akun permanen"
                            : "Nonaktifkan akun terlebih dahulu"
                        }
                        className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-[#976055] transition hover:bg-[#fdf0ed] hover:text-[#a34c3f] disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Hapus ${member.name}`}
                      >
                        <Trash className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredMembers.length === 0 && (
          <div className="p-10 text-center text-sm text-[#748886]">
            Tidak ada user yang ditemukan.
          </div>
        )}
      </div>
      <section className="mt-8 rounded-2xl border bg-white p-5 shadow-[0_18px_36px_-32px_rgba(23,60,58,0.35)]">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-lg font-semibold text-[#244542]">
              Status Action Plan
            </h2>
            <p className="mt-1 text-sm text-[#748886]">
              Tambah, nonaktifkan, atau tandai status selesai untuk seluruh
              User.
            </p>
          </div>
          <StatusForm onAdd={addStatus} />
        </div>
        <div className="mt-4 divide-y rounded-xl border">
          {statuses.map((status) => (
            <div
              key={status.id}
              className="flex items-center justify-between gap-4 px-3 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#294846]">
                  {status.label}
                </p>
                <p className="mt-0.5 text-xs text-[#748886]">
                  {status.isActive ? "Aktif" : "Nonaktif"} ·{" "}
                  {status.isCompleted ? "Status selesai" : "Status proses"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingStatus(status)}
                className="h-10 shrink-0 rounded-xl px-3 text-sm font-semibold text-[#176d69] hover:bg-[#e8f3f1]"
              >
                Kelola
              </button>
            </div>
          ))}
        </div>
      </section>
      {editingMember && (
        <UserForm
          divisions={divisions}
          member={editingMember === "new" ? undefined : editingMember}
          onCancel={() => setEditingMember(null)}
          onSave={saveMember}
        />
      )}
      {deletingMember && (
        <DeleteUserDialog
          member={deletingMember}
          onCancel={() => setDeletingMember(null)}
          onDelete={deleteMember}
        />
      )}
      {editingStatus && (
        <StatusEditor
          status={editingStatus}
          onCancel={() => setEditingStatus(null)}
          onSave={saveStatus}
        />
      )}
    </section>
  );
}

function StatusForm({
  onAdd,
}: {
  onAdd: (label: string, isCompleted: boolean) => Promise<void>;
}) {
  const { notify } = useFeedback();
  const [label, setLabel] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onAdd(label, isCompleted);
      setLabel("");
      setIsCompleted(false);
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Status tidak dapat ditambahkan.";
      setError(message);
      notify("error", "Status belum ditambahkan", message);
    } finally {
      setSaving(false);
    }
  }
  return (
    <form onSubmit={submit} className="flex flex-col gap-2 sm:items-end">
      <div className="flex gap-2">
        <input
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          required
          maxLength={50}
          className="h-10 rounded-xl border px-3 text-sm outline-none focus:border-[#137d79]"
          placeholder="Contoh: Tertunda"
        />
        <button
          disabled={saving}
          className="h-10 rounded-xl bg-[#137d79] px-4 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Menambah..." : "Tambah status"}
        </button>
      </div>
      <label className="flex items-center gap-2 text-xs text-[#667c7c]">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={(event) => setIsCompleted(event.target.checked)}
          className="size-4 rounded border-[#b8c9c7] text-[#137d79]"
        />
        Status selesai — pindahkan Action Plan ke Riwayat
      </label>
      {error && (
        <p className="text-sm text-[#9a5b16]" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

function StatusEditor({
  status,
  onCancel,
  onSave,
}: {
  status: ActionPlanStatus;
  onCancel: () => void;
  onSave: (status: ActionPlanStatus, input: StatusInput) => Promise<void>;
}) {
  const [isActive, setIsActive] = useState(status.isActive);
  const [isCompleted, setIsCompleted] = useState(status.isCompleted);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const changed =
    isActive !== status.isActive || isCompleted !== status.isCompleted;
  const persist = async () => {
    setSaving(true);
    setError("");
    try {
      await onSave(status, { isActive, isCompleted });
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Status tidak dapat diperbarui.",
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <>
      <DialogFrame
        title={`Kelola status: ${status.label}`}
        description="Nama status dipertahankan agar riwayat Action Plan tetap konsisten."
        onClose={saving ? () => undefined : onCancel}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (changed) setConfirmationOpen(true);
            else onCancel();
          }}
          className="mt-6 space-y-4"
        >
          <label className="flex items-start gap-3 rounded-xl border p-3 text-sm text-[#294846]">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
              className="mt-0.5 size-4 rounded border-[#b8c9c7] text-[#137d79]"
            />
            <span>
              <span className="block font-semibold">Status aktif</span>
              <span className="mt-1 block text-[#748886]">
                Status aktif tersedia pada form Action Plan baru.
              </span>
            </span>
          </label>
          <label className="flex items-start gap-3 rounded-xl border p-3 text-sm text-[#294846]">
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={(event) => setIsCompleted(event.target.checked)}
              className="mt-0.5 size-4 rounded border-[#b8c9c7] text-[#137d79]"
            />
            <span>
              <span className="block font-semibold">
                Tandai sebagai status selesai
              </span>
              <span className="mt-1 block text-[#748886]">
                Action Plan dengan Status Sore ini akan tampil di Riwayat.
              </span>
            </span>
          </label>
          {error && (
            <p
              className="rounded-xl bg-[#fff1d7] px-3 py-2 text-sm text-[#9a5b16]"
              role="alert"
            >
              {error}
            </p>
          )}
          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="h-10 rounded-xl px-4 text-sm font-semibold text-[#59706f] hover:bg-[#f1f5f4] disabled:opacity-60"
            >
              Batal
            </button>
            <button
              disabled={saving || !changed}
              className="h-10 rounded-xl bg-[#137d79] px-4 text-sm font-semibold text-white hover:bg-[#0e6865] disabled:opacity-60"
            >
              Simpan status
            </button>
          </div>
        </form>
      </DialogFrame>
      {confirmationOpen && (
        <ConfirmDialog
          title="Simpan perubahan status?"
          description="Perubahan status aktif atau status selesai akan langsung memengaruhi pilihan Action Plan dan tampilan Riwayat."
          confirmLabel="Simpan perubahan"
          confirming={saving}
          onCancel={() => setConfirmationOpen(false)}
          onConfirm={() => {
            setConfirmationOpen(false);
            void persist();
          }}
        />
      )}
    </>
  );
}

function UserForm({
  member,
  divisions,
  onCancel,
  onSave,
}: {
  member?: SafeUser;
  divisions: Division[];
  onCancel: () => void;
  onSave: (input: UserInput, member?: SafeUser) => Promise<void>;
}) {
  const { notify } = useFeedback();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false);
  const [accessConfirmationOpen, setAccessConfirmationOpen] = useState(false);
  const [role, setRole] = useState<UserRole>(member?.role ?? "user");
  const assignedDivision = member
    ? divisions.find((division) => division.bodUserId === member.id)
    : undefined;
  const [pendingInput, setPendingInput] = useState<UserInput | null>(null);
  const [accessChanges, setAccessChanges] = useState<string[]>([]);

  const requestClose = () => {
    if (saving) return;
    if (dirty) setDiscardConfirmationOpen(true);
    else onCancel();
  };

  async function persist(input: UserInput) {
    setSaving(true);
    setError("");
    try {
      await onSave(input, member);
      setDirty(false);
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "User tidak dapat disimpan.";
      setError(message);
      notify("error", "User belum tersimpan", message);
    } finally {
      setSaving(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");
    if (!member && !password) {
      setError("Password wajib diisi untuk user baru.");
      notify(
        "error",
        "Password wajib diisi",
        "Masukkan password untuk akun baru.",
      );
      return;
    }
    if (password && password !== confirmPassword) {
      setError("Konfirmasi password tidak sama.");
      notify(
        "error",
        "Konfirmasi password berbeda",
        "Ulangi password yang sama.",
      );
      return;
    }
    const input: UserInput = {
      name: String(data.get("name")),
      email: String(data.get("email")),
      role: data.get("role") as UserInput["role"],
      status: data.get("status") as UserInput["status"],
      password: password || undefined,
      divisionId:
        String(data.get("divisionId") ?? member?.divisionId ?? "") || undefined,
    };
    const changes = member
      ? [
          input.role !== member.role &&
            `Role berubah dari ${roleLabel(member.role)} menjadi ${roleLabel(input.role)}.`,
          input.status !== member.status &&
            (input.status === "inactive"
              ? "Akun akan dinonaktifkan dan tidak dapat login."
              : "Akun akan diaktifkan kembali."),
          Boolean(input.password) && "Password akun akan diganti.",
          input.divisionId !== member.divisionId &&
            `Pemetaan awal ke divisi ${divisions.find((division) => division.id === input.divisionId)?.name}. BOD divisi tersebut dapat melihat seluruh pekerjaan akun ini. ID dan riwayat pekerjaan tetap dipertahankan. Perpindahan divisi belum tersedia.`,
        ].filter((change): change is string => Boolean(change))
      : [];
    if (changes.length > 0) {
      setPendingInput(input);
      setAccessChanges(changes);
      setAccessConfirmationOpen(true);
      return;
    }
    await persist(input);
  }

  return (
    <>
      <DialogFrame
        title={member ? "Edit User" : "Tambah User"}
        description="Atur role, status akses, dan password akun internal."
        onClose={requestClose}
      >
        <form
          onSubmit={submit}
          onChange={() => setDirty(true)}
          className="mt-6 space-y-4"
        >
          <UserField label="Nama">
            <input
              name="name"
              required
              defaultValue={member?.name}
              placeholder="Nama lengkap"
            />
          </UserField>
          <UserField label="Email">
            <input
              name="email"
              required
              type="email"
              defaultValue={member?.email}
              placeholder="nama@perusahaan.com"
            />
          </UserField>
          <div className="grid gap-4 sm:grid-cols-2">
            <UserField label={member ? "Password baru" : "Password"}>
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                required={!member}
                minLength={8}
                placeholder={
                  member ? "Kosongkan bila tidak diubah" : "Minimal 8 karakter"
                }
              />
            </UserField>
            <UserField label="Konfirmasi password">
              <input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required={!member}
                minLength={8}
                placeholder={
                  member ? "Ulangi bila mengubah password" : "Ulangi password"
                }
              />
            </UserField>
          </div>
          <p className="text-xs leading-5 text-[#748886]">
            {member
              ? "Isi kedua field hanya untuk mengganti password. Password lama tidak ditampilkan."
              : "Gunakan minimal 8 karakter."}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <UserField label="Role">
              <select
                name="role"
                value={role}
                onChange={(event) => setRole(event.target.value as UserRole)}
              >
                <option value="user">User</option>
                <option value="bod">BOD (memantau divisi)</option>
                <option value="admin">SuperAdmin</option>
              </select>
            </UserField>
            <UserField label="Status">
              <select name="status" defaultValue={member?.status ?? "active"}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </UserField>
          </div>
          {(role === "user" || Boolean(member?.sheetName)) && (
            <UserField
              label={
                role === "bod" ? "Divisi riwayat pekerjaan" : "Divisi anggota"
              }
            >
              {member?.divisionId ? (
                <>
                  <input
                    value={
                      divisions.find(
                        (division) => division.id === member.divisionId,
                      )?.name ?? member.divisionId
                    }
                    readOnly
                  />
                  <input
                    type="hidden"
                    name="divisionId"
                    value={member.divisionId}
                  />
                  <span className="mt-2 block text-xs leading-5 text-[#516967]">
                    Divisi tetap. Perpindahan divisi belum tersedia.
                  </span>
                </>
              ) : (
                <>
                  <select
                    name="divisionId"
                    required={
                      role === "user" && (!member || member.role !== "user")
                    }
                    defaultValue=""
                  >
                    <option value="">Belum dipetakan</option>
                    {divisions
                      .filter(
                        (division) =>
                          division.status === "active" &&
                          (!assignedDivision ||
                            division.id === assignedDivision.id),
                      )
                      .map((division) => (
                        <option key={division.id} value={division.id}>
                          {division.name}
                        </option>
                      ))}
                  </select>
                  <span className="mt-2 block text-xs leading-5 text-[#516967]">
                    Pemetaan pertama membuka akses BOD divisi ke seluruh riwayat
                    pekerjaan akun ini.{" "}
                    {assignedDivision &&
                      `Riwayat harus mengikuti penugasan BOD di ${assignedDivision.name}.`}
                  </span>
                </>
              )}
            </UserField>
          )}
          {role === "bod" && (
            <div className="rounded-xl border border-[#dce5e4] bg-[#f7faf9] p-4 text-sm text-[#294846]">
              <p className="font-semibold">Divisi yang dipantau</p>
              <p className="mt-1 text-[#516967]">
                {assignedDivision?.name ?? "Belum ditugaskan"}
              </p>
              <p className="mt-2 text-xs leading-5 text-[#667c7c]">
                Penugasan BOD dikelola dari Divisi agar satu divisi hanya
                memiliki satu BOD aktif.
              </p>
              <a
                href={
                  assignedDivision
                    ? `/divisions?divisionId=${encodeURIComponent(assignedDivision.id)}`
                    : "/divisions"
                }
                className="mt-3 inline-flex h-9 cursor-pointer items-center rounded-lg px-2 text-sm font-semibold text-[#176d69] transition hover:bg-[#e8f3f1]"
              >
                {assignedDivision
                  ? "Kelola penugasan divisi"
                  : "Tetapkan BOD di Divisi"}
              </a>
            </div>
          )}
          {error && (
            <p
              className="rounded-xl bg-[#fff1d7] px-3 py-2 text-sm text-[#9a5b16]"
              role="alert"
            >
              {error}
            </p>
          )}
          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={requestClose}
              disabled={saving}
              className="h-10 rounded-xl px-4 text-sm font-semibold text-[#59706f] hover:bg-[#f1f5f4] disabled:opacity-60"
            >
              Batal
            </button>
            <button
              disabled={saving}
              className="h-10 rounded-xl bg-[#137d79] px-4 text-sm font-semibold text-white hover:bg-[#0e6865] disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan User"}
            </button>
          </div>
        </form>
      </DialogFrame>
      {discardConfirmationOpen && (
        <ConfirmDialog
          title="Batalkan perubahan?"
          description="Perubahan User yang belum disimpan akan hilang."
          confirmLabel="Batalkan perubahan"
          onCancel={() => setDiscardConfirmationOpen(false)}
          onConfirm={onCancel}
        />
      )}
      {accessConfirmationOpen && (
        <ConfirmDialog
          title="Simpan perubahan akses?"
          description={
            <ul className="list-disc space-y-1 pl-5">
              {accessChanges.map((change) => (
                <li key={change}>{change}</li>
              ))}
            </ul>
          }
          confirmLabel="Simpan perubahan"
          confirming={saving}
          onCancel={() => {
            setAccessConfirmationOpen(false);
            setPendingInput(null);
          }}
          onConfirm={() => {
            if (pendingInput) {
              setAccessConfirmationOpen(false);
              void persist(pendingInput);
            }
          }}
        />
      )}
    </>
  );
}

function DeleteUserDialog({
  member,
  onCancel,
  onDelete,
}: {
  member: SafeUser;
  onCancel: () => void;
  onDelete: (member: SafeUser, confirmationEmail: string) => Promise<void>;
}) {
  const { notify } = useFeedback();
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const confirmed =
    confirmationEmail.trim().toLowerCase() === member.email.toLowerCase();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!confirmed) return;
    setSaving(true);
    setError("");
    try {
      await onDelete(member, confirmationEmail);
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Akun tidak dapat dihapus.";
      setError(message);
      notify("error", "Akun belum dihapus", message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <DialogFrame
      title={`Hapus akun: ${member.name}`}
      description="Penghapusan permanen hanya tersedia untuk akun nonaktif tanpa riwayat kerja, penugasan BOD, approval, atau akses Catatan."
      onClose={saving ? () => undefined : onCancel}
    >
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-[#294846]">
          Ketik email akun untuk konfirmasi
          <input
            aria-label="Email akun untuk konfirmasi"
            value={confirmationEmail}
            onChange={(event) => setConfirmationEmail(event.target.value)}
            autoComplete="off"
            className="mt-2 h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none transition focus:border-[#137d79]"
            placeholder={member.email}
          />
        </label>
        {error && (
          <p
            className="rounded-xl bg-[#fff1d7] px-3 py-2 text-sm text-[#9a5b16]"
            role="alert"
          >
            {error}
          </p>
        )}
        <div className="flex justify-end gap-3 border-t pt-5">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="h-10 cursor-pointer rounded-xl px-4 text-sm font-semibold text-[#59706f] hover:bg-[#f1f5f4] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Batal
          </button>
          <button
            disabled={!confirmed || saving}
            className="h-10 cursor-pointer rounded-xl bg-[#a34c3f] px-4 text-sm font-semibold text-white hover:bg-[#873c32] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Menghapus..." : "Hapus akun permanen"}
          </button>
        </div>
      </form>
    </DialogFrame>
  );
}

function UserField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-[#294846]">
      <span>{label}</span>
      <span className="mt-2 block [&_input]:h-11 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:px-3 [&_input]:text-sm [&_input]:outline-none [&_input:focus]:border-[#137d79] [&_select]:h-11 [&_select]:w-full [&_select]:rounded-xl [&_select]:border [&_select]:bg-white [&_select]:px-3 [&_select]:text-sm [&_select]:outline-none [&_select:focus]:border-[#137d79]">
        {children}
      </span>
    </label>
  );
}

function roleLabel(role: UserRole) {
  return role === "admin" ? "SuperAdmin" : role === "bod" ? "BOD" : "User";
}

function divisionManagementHref(divisions: Division[], bodUserId: string) {
  const division = divisions.find((candidate) => candidate.bodUserId === bodUserId);
  return division ? `/divisions?divisionId=${encodeURIComponent(division.id)}` : "/divisions";
}
