'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function DashboardPage() {
  const [summary, setSummary] = useState({
    projects: 0,
    workers: 0,
    attendance: 0,
    reports: 0,
    materials: 0,
    alerts: 0,
  });
  const [projects, setProjects] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [summaryRes, projectsRes, workersRes, reportsRes, materialsRes, logsRes] = await Promise.all([
          fetch(`${apiBase}/api/summary`),
          fetch(`${apiBase}/api/projects`),
          fetch(`${apiBase}/api/workers`),
          fetch(`${apiBase}/api/daily-reports`),
          fetch(`${apiBase}/api/materials`),
          fetch(`${apiBase}/api/audit-logs`),
        ]);

        const [summaryData, projectsData, workersData, reportsData, materialsData, logsData] = await Promise.all([
          summaryRes.json(),
          projectsRes.json(),
          workersRes.json(),
          reportsRes.json(),
          materialsRes.json(),
          logsRes.json(),
        ]);

        setSummary(summaryData);
        setProjects(projectsData);
        setWorkers(workersData);
        setReports(reportsData);
        setMaterials(materialsData);
        setLogs(logsData);
      } catch {
        setSummary({ projects: 0, workers: 0, attendance: 0, reports: 0, materials: 0, alerts: 0 });
        setProjects([]);
        setWorkers([]);
        setReports([]);
        setMaterials([]);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <DashboardLayout title="Dashboard">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Projects" value={summary.projects.toString()} detail="Tracked project records" />
        <StatCard label="Workers" value={summary.workers.toString()} detail="Team members in the system" />
        <StatCard label="Attendance" value={summary.attendance.toString()} detail="Recorded attendance entries" />
        <StatCard label="Reports" value={summary.reports.toString()} detail="Daily reports submitted" />
        <StatCard label="Materials" value={summary.materials.toString()} detail="Material items tracked" />
        <StatCard label="Audit Alerts" value={summary.alerts.toString()} detail="System activity records" />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Panel title="Projects overview">
          {loading ? (
            <p className="text-slate-300">Loading...</p>
          ) : projects.length ? (
            <div className="space-y-3">
              {projects.slice(0, 5).map((project) => (
                <div key={project.id} className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{project.name}</p>
                      <p className="text-sm text-slate-300">{project.code} • {project.location}</p>
                    </div>
                    <span className="rounded-full bg-cyan-500/20 px-2 py-1 text-xs text-cyan-200">{project.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-300">No project data available.</p>
          )}
        </Panel>

        <Panel title="Recent reports">
          {loading ? (
            <p className="text-slate-300">Loading...</p>
          ) : reports.length ? (
            <div className="space-y-3">
              {reports.slice(0, 5).map((report) => (
                <div key={report.id} className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                  <p className="font-medium text-cyan-200">{report.reportNumber}</p>
                  <p className="text-sm text-slate-300">{report.projectCode} • {report.workersPresent} workers • {report.totalHours} hrs</p>
                  <p className="mt-1 text-xs text-slate-400">{report.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-300">No reports yet.</p>
          )}
        </Panel>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <Panel title="Workers">
          {loading ? (
            <p className="text-slate-300">Loading...</p>
          ) : workers.length ? (
            <ul className="space-y-2 text-sm text-slate-200">
              {workers.slice(0, 6).map((worker) => (
                <li key={worker.id} className="rounded-lg border border-white/10 bg-slate-900/70 p-2">
                  {worker.fullName} • {worker.role}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-300">No workers available.</p>
          )}
        </Panel>

        <Panel title="Materials">
          {loading ? (
            <p className="text-slate-300">Loading...</p>
          ) : materials.length ? (
            <ul className="space-y-2 text-sm text-slate-200">
              {materials.slice(0, 6).map((material) => (
                <li key={material.id} className="rounded-lg border border-white/10 bg-slate-900/70 p-2">
                  {material.name} • {material.quantity} {material.unit}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-300">No material data yet.</p>
          )}
        </Panel>

        <Panel title="Latest activity">
          {loading ? (
            <p className="text-slate-300">Loading...</p>
          ) : logs.length ? (
            <ul className="space-y-2 text-sm text-slate-200">
              {logs.slice(0, 6).map((log) => (
                <li key={log.id} className="rounded-lg border border-white/10 bg-slate-900/70 p-2">
                  {log.action}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-300">No activity yet.</p>
          )}
        </Panel>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-cyan-400/20 bg-slate-900/70 p-6 shadow-xl">
      <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">{label}</p>
      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-300">{detail}</p>
    </div>
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
