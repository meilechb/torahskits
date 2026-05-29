"use client";

import { setSubscriberRole } from "@/lib/actions/admin";
import type { UserRole } from "@/lib/types";

const ROLES: UserRole[] = ["admin", "rebbi", "school", "free"];

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  rebbi: "Rebbi",
  school: "School",
  free: "Free",
};

export function SubscriberRow({ id, role }: { id: string; role: UserRole }) {
  return (
    <form action={setSubscriberRole}>
      <input type="hidden" name="id" value={id} />
      <select
        className="input"
        name="role"
        defaultValue={role}
        style={{ maxWidth: 150, padding: "8px 12px" }}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {ROLE_LABELS[r]}
          </option>
        ))}
      </select>
    </form>
  );
}
