import Link from 'next/link';

const modules = [
  'Project & Site Management',
  'Supervisor Assignment & Email Notifications',
  'Worker Management & Rate History',
  'Attendance & Working Hours',
  'Labour Calculation & Approval',
  'Daily Reports & PDF Export',
  'Materials, Inventory & Procurement',
  'Equipment, Fuel & Maintenance',
  'Issues, Safety & site diary',
  'Budgets, Expenses & Forecasting',
  'Analytics, Audit Logs & Notifications',
];

const phases = [
  {
    name: 'Phase 1',
    items: ['Authentication', 'Projects', 'Workers', 'Attendance', 'Daily Reports', 'Materials', 'Audit Logs'],
  },
  {
    name: 'Phase 2',
    items: ['Equipment', 'Suppliers', 'Procurement', 'Budgets', 'BOQ', 'Safety', 'Schedules'],
  },
  {
    name: 'Phase 3',
    items: ['WhatsApp/SMS', 'Offline Sync', 'Client Portal', 'Forecasting', 'AI summaries', 'Advanced analytics'],
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Construction Site Management</p>
              <h1 className="mt-2 text-4xl font-bold">Daily Reporting System</h1>
            </div>
            <Link
              href="#modules"
              className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Explore Modules
            </Link>
          </div>
          <p className="max-w-4xl text-base text-slate-200">
            A scalable platform for managing construction projects, site teams, attendance, labour, materials,
            equipment, daily reporting, safety, budgets, documents, notifications, and PDF-ready reporting.
          </p>
        </header>

        <section className="mb-10 grid gap-5 md:grid-cols-3">
          <StatCard label="Projects" value="Unlimited" detail="Scalable by infrastructure and data capacity" />
          <StatCard label="Roles" value="6+" detail="Admin, PM, Supervisor, Storekeeper, Finance, Safety Officer" />
          <StatCard label="Lifecycle" value="7 stages" detail="Draft → Pending Approval → Approved → Active → On Hold → Completed → Archived" />
        </section>

        <section id="modules" className="mb-10 rounded-2xl border border-white/10 bg-slate-950/50 p-8">
          <h2 className="mb-6 text-2xl font-semibold text-cyan-300">Core Modules</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modules.map((module) => (
              <div key={module} className="rounded-xl border border-white/10 bg-slate-900/70 p-4 shadow-lg">
                <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300">
                  ✓
                </div>
                <p className="text-sm font-medium text-slate-100">{module}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {phases.map((phase) => (
            <div key={phase.name} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-xl font-semibold text-cyan-300">{phase.name}</h3>
              <ul className="space-y-3 text-sm text-slate-200">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="inline-block h-2 w-2 rounded-full bg-cyan-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-cyan-400/20 bg-slate-950/50 p-6 shadow-xl">
      <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">{label}</p>
      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-300">{detail}</p>
    </div>
  );
}
