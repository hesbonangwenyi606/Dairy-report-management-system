'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

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
  const [summary, setSummary] = useState({ projects: 0, workers: 0, attendance: 0, reports: 0, materials: 0, alerts: 0 });
  const [projects, setProjects] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [summaryRes, projectsRes, workersRes, attendanceRes, reportsRes, materialsRes, logsRes] = await Promise.all([
          fetch(`${apiBase}/api/summary`),
          fetch(`${apiBase}/api/projects`),
          fetch(`${apiBase}/api/workers`),
          fetch(`${apiBase}/api/attendance`),
          fetch(`${apiBase}/api/daily-reports`),
          fetch(`${apiBase}/api/materials`),
          fetch(`${apiBase}/api/audit-logs`),
        ]);

        const [summaryData, projectsData, workersData, attendanceData, reportsData, materialsData, logsData] = await Promise.all([
          summaryRes.json(),
          projectsRes.json(),
          workersRes.json(),
          attendanceRes.json(),
          reportsRes.json(),
          materialsRes.json(),
          logsRes.json(),
        ]);

        setSummary(summaryData);
        setProjects(projectsData);
        setWorkers(workersData);
        setAttendance(attendanceData);
        setReports(reportsData);
        setMaterials(materialsData);
        setLogs(logsData);
      } catch {
        setSummary({ projects: 0, workers: 0, attendance: 0, reports: 0, materials: 0, alerts: 0 });
        setProjects([]);
        setWorkers([]);
        setAttendance([]);
        setReports([]);
        setMaterials([]);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Construction Site Management</p>
              <h1 className="mt-2 text-4xl font-bold">Daily Reporting System</h1>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="#modules"
                className="rounded-full border border-cyan-400/40 bg-slate-900/70 px-5 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300 hover:text-cyan-100"
              >
                Explore Modules
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Sign up
              </Link>
              <Link
                href="/signin"
                className="rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Sign in
              </Link>
            </div>
          </div>
          <p className="max-w-4xl text-base text-slate-200">
            A scalable platform for managing construction projects, site teams, attendance, labour, materials,
            equipment, daily reporting, safety, budgets, documents, notifications, and PDF-ready reporting.
          </p>
        </header>

        <section className="mb-10 grid gap-5 md:grid-cols-3">
          <StatCard label="Projects" value={String(summary.projects)} detail="Active and tracked project records" />
          <StatCard label="Workers" value={String(summary.workers)} detail="Field and supervisory team members" />
          <StatCard label="Lifecycle" value="7 stages" detail="Draft → Pending Approval → Approved → Active → On Hold → Completed → Archived" />
        </section>

        <section className="mb-10 grid gap-5 md:grid-cols-3">
          <StatCard label="Attendance" value={String(summary.attendance)} detail="Recorded worker attendance entries" />
          <StatCard label="Reports" value={String(summary.reports)} detail="Daily reports submitted and tracked" />
          <StatCard label="Materials" value={String(summary.materials)} detail="Inventory and material usage records" />
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

        <section className="mb-10 grid gap-6 lg:grid-cols-2">
          <Panel title="Projects">
            {loading ? <StatusText text="Loading..." /> : projects.length ? (
              <div className="space-y-3">
                {projects.map((project) => (
                  <div key={project.id} className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{project.name}</p>
                        <p className="text-sm text-slate-300">{project.code} • {project.location}</p>
                      </div>
                      <span className="rounded-full bg-cyan-500/20 px-2 py-1 text-xs text-cyan-200">{project.status}</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-slate-800">
                      <div className="h-2 rounded-full bg-cyan-400" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : <StatusText text="No project data available. Start the API and connect to the backend." />}
          </Panel>

          <Panel title="Recent Audit Logs">
            {loading ? <StatusText text="Loading..." /> : logs.length ? (
              <div className="space-y-3">
                {logs.slice(0, 5).map((log) => (
                  <div key={log.id} className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                    <p className="font-medium text-cyan-200">{log.action}</p>
                    <p className="text-sm text-slate-300">{log.details}</p>
                    <p className="mt-2 text-xs text-slate-400">{new Date(log.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : <StatusText text="No audit log entries yet." />}
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Panel title="Workers">
            {loading ? <StatusText text="Loading..." /> : workers.length ? (
              <ul className="space-y-2 text-sm text-slate-200">
                {workers.slice(0, 6).map((worker) => (
                  <li key={worker.id} className="rounded-lg border border-white/10 bg-slate-900/70 p-2">
                    {worker.fullName} • {worker.role}
                  </li>
                ))}
              </ul>
            ) : <StatusText text="No workers yet." />}
          </Panel>

          <Panel title="Attendance">
            {loading ? <StatusText text="Loading..." /> : attendance.length ? (
              <ul className="space-y-2 text-sm text-slate-200">
                {attendance.slice(0, 6).map((entry) => (
                  <li key={entry.id} className="rounded-lg border border-white/10 bg-slate-900/70 p-2">
                    {entry.workerName} — {entry.status}
                  </li>
                ))}
              </ul>
            ) : <StatusText text="No attendance recorded." />}
          </Panel>

          <Panel title="Materials">
            {loading ? <StatusText text="Loading..." /> : materials.length ? (
              <ul className="space-y-2 text-sm text-slate-200">
                {materials.slice(0, 6).map((material) => (
                  <li key={material.id} className="rounded-lg border border-white/10 bg-slate-900/70 p-2">
                    {material.name} — {material.quantity} {material.unit}
                  </li>
                ))}
              </ul>
            ) : <StatusText text="No materials tracked." />}
          </Panel>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
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

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <h3 className="mb-4 text-xl font-semibold text-cyan-300">{title}</h3>
      {children}
    </div>
  );
}

function StatusText({ text }: { text: string }) {
  return <p className="text-sm text-slate-300">{text}</p>;
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
