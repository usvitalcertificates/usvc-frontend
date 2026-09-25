"use client";

import { use, useCallback, useEffect, useState } from "react";
import { staffJson, staffRole } from "@/lib/staff-client";
import { useInactivitySignout, useRequireStaffAuth } from "@/lib/staff-auth-hook";
import { BackLink, EmptyState, PageBand, SkeletonRows, StatusPill } from "@/components/staff/ui";
import { activityCategory, dayKey, fullTime, humanizeActivity } from "@/components/staff/activity";

interface OrderActivityDetail {
  order: {
    id: string;
    publicNumber: string;
    certificate: string;
    stateCode: string;
    county: string;
    rush: boolean;
    status: string;
  };
  activity: {
    at: string;
    action: string;
    actorName: string;
    actorEmail?: string;
    detail?: Record<string, unknown>;
  }[];
}

export default function OrderActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  useRequireStaffAuth();
  useInactivitySignout();
  const [allowed, setAllowed] = useState(false);
  const [data, setData] = useState<OrderActivityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await staffJson<OrderActivityDetail>(`/admin/order-activity/${id}`));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load order activity");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const admin = staffRole() === "ADMIN";
    setAllowed(admin);
    if (admin) void load();
    else setLoading(false);
  }, [load]);

  if (!allowed && !loading) {
    return <p className="staff-alert error">Order activity is restricted to ADMIN.</p>;
  }

  const groups: { day: string; entries: OrderActivityDetail["activity"] }[] = [];
  for (const entry of data?.activity ?? []) {
    const day = dayKey(entry.at);
    const group = groups.find((candidate) => candidate.day === day);
    if (group) group.entries.push(entry);
    else groups.push({ day, entries: [entry] });
  }

  return (
    <>
      <BackLink href="/staff/admin?tab=activity">← Back to Orders Activity</BackLink>
      <PageBand
        eyebrow="Administration — order activity"
        title={data?.order.publicNumber || "Order activity"}
        subtitle={
          data
            ? `${data.order.stateCode} ${data.order.certificate} · ${data.order.county || "County unavailable"} · ${data.activity.length} recorded events`
            : "Complete, audit-derived activity history for this order."
        }
      />
      {error ? <p className="staff-alert error">{error}</p> : null}
      {loading ? (
        <div className="staff-panel">
          <SkeletonRows rows={7} />
        </div>
      ) : data ? (
        <div className="staff-order-activity-layout">
          <aside className="staff-panel staff-order-activity-summary">
            <h2>Order summary</h2>
            <dl>
              <div>
                <dt>Status</dt>
                <dd>
                  <StatusPill status={data.order.status} />
                </dd>
              </div>
              <div>
                <dt>Certificate</dt>
                <dd>
                  {data.order.stateCode} {data.order.certificate}
                </dd>
              </div>
              <div>
                <dt>County</dt>
                <dd>{data.order.county || "—"}</dd>
              </div>
              <div>
                <dt>Priority</dt>
                <dd>
                  {data.order.rush ? <span className="staff-pill amber">RUSH</span> : "Standard"}
                </dd>
              </div>
              <div>
                <dt>Total activity</dt>
                <dd>{data.activity.length}</dd>
              </div>
            </dl>
          </aside>
          <section className="staff-panel staff-order-activity-timeline">
            <div className="staff-order-activity-title">
              <div>
                <h2>Activity timeline</h2>
                <p>Newest activity appears first.</p>
              </div>
            </div>
            {groups.length === 0 ? (
              <EmptyState title="No activity recorded." />
            ) : (
              groups.map((group) => (
                <div key={group.day} className="staff-activity-day-group">
                  <p className="staff-day">{group.day}</p>
                  <ul className="staff-timeline">
                    {group.entries.map((entry, index) => (
                      <li
                        key={`${entry.at}-${index}`}
                        className={`cat-${activityCategory(entry.action)}`}
                      >
                        <div className="staff-activity-event">
                          <div>
                            <strong>{humanizeActivity(entry)}</strong>
                            <span>
                              {entry.actorName}
                              {entry.actorEmail ? ` · ${entry.actorEmail}` : ""}
                            </span>
                          </div>
                          <time title={fullTime(entry.at)}>
                            {new Date(entry.at).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </time>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </section>
        </div>
      ) : null}
    </>
  );
}
