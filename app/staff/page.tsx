export const metadata = { robots: { index: false, follow: false }, title: "Staff portal" };
export default function Staff() {
  return (
    <main className="wrap">
      <h1>Staff portal</h1>
      <p>
        This protected workspace will provide fulfillment, administration, government-fee, sales,
        and attendance tools after staff authentication.
      </p>
      <div className="grid">
        {[
          "Fulfillment queue",
          "Administration",
          "Government fees",
          "Sales reports",
          "Attendance Center",
        ].map((item) => (
          <section className="card" key={item}>
            <h2>{item}</h2>
            <p>Staff-only API access required.</p>
          </section>
        ))}
      </div>
    </main>
  );
}
