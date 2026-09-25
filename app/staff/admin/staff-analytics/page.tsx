"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { staffJson, staffRole } from "@/lib/staff-client";
import { useInactivitySignout, useRequireStaffAuth } from "@/lib/staff-auth-hook";
import { BackLink, EmptyState, PageBand } from "@/components/staff/ui";

interface StaffMember {
  id: string;
  fullName: string;
  email: string;
  role: string;
  accountStatus: string;
  activeOrders: number;
}

function initials(name: string, email: string): string {
  const source = name.trim() || email;
  const parts = source.split(/[\s@.]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export default function StaffAnalyticsList() {
  useRequireStaffAuth();
  useInactivitySignout();
  const [isAdmin, setIsAdmin] = useState(false);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadRoster = useCallback(async () => {
    setError("");
    try {
      const roster = await staffJson<{ staff: StaffMember[] }>("/admin/staff");
      setStaff(roster.staff);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load staff analytics");
    }
  }, []);

  useEffect(() => {
    setIsAdmin(staffRole() === "ADMIN");
    if (staffRole() === "ADMIN") void loadRoster();
  }, [loadRoster]);

  const term = search.trim().toLowerCase();
  const filtered = staff.filter(
    (member) =>
      (roleFilter === "ALL" || member.role === roleFilter) &&
      (statusFilter === "ALL" || member.accountStatus === statusFilter) &&
      (!term ||
        member.fullName.toLowerCase().includes(term) ||
        member.email.toLowerCase().includes(term)),
  );
  const isFiltered = term !== "" || roleFilter !== "ALL" || statusFilter !== "ALL";
  const clearFilters = () => {
    setSearch("");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
  };

  if (!isAdmin) {
    return (
      <>
        <BackLink href="/staff">← Back to Open Orders</BackLink>
        <p role="alert" className="staff-alert error">
          Staff analytics is restricted to ADMIN.
        </p>
      </>
    );
  }

  return (
    <>
      <PageBand
        eyebrow="Administration — staff analytics"
        title="Staff Analytics"
        subtitle="Select a staff member to review their audit-derived operational performance and form history."
      />
      {error ? (
        <p role="alert" className="staff-alert error">
          {error}
        </p>
      ) : null}

      <div className="staff-panel">
        <div className="staff-filters" role="search" aria-label="Staff filters">
          <label className="search">
            Search name or email
            <input
              value={search}
              placeholder="Name or email…"
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <label>
            Role
            <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
              <option value="ALL">All roles</option>
              <option value="ADMIN">ADMIN</option>
              <option value="FULFILLMENT">FULFILLMENT</option>
              <option value="CS">CS</option>
            </select>
          </label>
          <label>
            Status
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="ALL">All statuses</option>
              <option value="active">active</option>
              <option value="pending">pending</option>
              <option value="disabled">disabled</option>
            </select>
          </label>
          {isFiltered ? (
            <div className="staff-filter-action">
              <button type="button" className="staff-btn secondary" onClick={clearFilters}>
                Clear
              </button>
            </div>
          ) : null}
        </div>
        {filtered.length === 0 ? (
          <EmptyState
            title="No staff match these filters."
            hint="Clear the search or choose another role/status."
          />
        ) : (
          <div className="staff-tablewrap">
            <table className="staff-table staff-cards-fallback staff-analytics-roster-table">
              <thead>
                <tr>
                  <th>Staff</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Active orders</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <span className="staff-staffcell">
                        <span className="staff-avatar" aria-hidden>
                          {initials(member.fullName, member.email)}
                        </span>
                        <span className="staff-staffmeta">
                          <span className="staff-staffname">
                            <strong>{member.fullName || "—"}</strong>
                          </span>
                          <span className="staff-staffemail" title={member.email || undefined}>
                            {member.email}
                          </span>
                        </span>
                      </span>
                    </td>
                    <td data-label="Role">
                      <span
                        className={`staff-pill ${member.role === "ADMIN" ? "navy" : member.role === "CS" ? "green" : "gray"}`}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`staff-pill ${member.accountStatus === "active" ? "green" : member.accountStatus === "pending" ? "navy" : "red"}`}
                      >
                        {member.accountStatus}
                      </span>
                    </td>
                    <td>{member.activeOrders}</td>
                    <td>
                      <Link
                        className="staff-btn"
                        href={`/staff/admin/staff-analytics/${member.id}`}
                      >
                        View analytics
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="staff-results-count">
        Showing {filtered.length} of {staff.length} staff accounts.
      </p>
    </>
  );
}
