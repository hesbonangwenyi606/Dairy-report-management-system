'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { getCurrentUser, type StoredUser } from '../../lib/auth';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const SUPERVISOR_STORAGE_KEY = 'construction-site-supervisor-data';

type SupervisorWorker = {
  id: string;
  name: string;
  role: string;
  phone: string;
};

type SupervisorResource = {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  usedFor: string;
  photo?: string;
};

type SupervisorAchievement = {
  id: string;
  title: string;
  details: string;
  photo?: string;
};

type SupervisorData = {
  workers: SupervisorWorker[];
  resources: SupervisorResource[];
  achievements: SupervisorAchievement[];
};

const defaultSupervisorData: SupervisorData = {
  workers: [
    { id: 'sup-worker-1', name: 'Jean Mugenzi', role: 'Bricklayer', phone: '+250788111111' },
  ],
  resources: [
    {
      id: 'sup-resource-1',
      name: 'Cement',
      quantity: '120',
      unit: 'bags',
      usedFor: 'Foundation work',
      photo: '',
    },
  ],
  achievements: [
    {
      id: 'sup-achievement-1',
      title: 'Foundation completed',
      details: 'Completed the main foundation slab for the current site phase.',
      photo: '',
    },
  ],
};

export default function DashboardPage() {
  const [user, setUser] = useState<StoredUser | null>(null);
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

  const [supervisorData, setSupervisorData] = useState<SupervisorData>(defaultSupervisorData);
  const [workerForm, setWorkerForm] = useState({ name: '', role: 'Worker', phone: '' });
  const [resourceForm, setResourceForm] = useState({ name: '', quantity: '', unit: 'bags', usedFor: '' });
  const [achievementForm, setAchievementForm] = useState({ title: '', details: '' });
  const [resourcePhoto, setResourcePhoto] = useState('');
  const [achievementPhoto, setAchievementPhoto] = useState('');

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

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

  useEffect(() => {
    if (!user || user.role !== 'Supervisor') {
      return;
    }

    try {
      const saved = window.localStorage.getItem(SUPERVISOR_STORAGE_KEY);

      if (saved) {
        setSupervisorData(JSON.parse(saved));
      } else {
        window.localStorage.setItem(SUPERVISOR_STORAGE_KEY, JSON.stringify(defaultSupervisorData));
      }
    } catch {
      setSupervisorData(defaultSupervisorData);
    }
  }, [user]);

  const updateSupervisorData = (next: SupervisorData) => {
    setSupervisorData(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SUPERVISOR_STORAGE_KEY, JSON.stringify(next));
    }
  };

  const handleWorkerSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!workerForm.name.trim()) {
      return;
    }

    const next = {
      ...supervisorData,
      workers: [
        {
          id: `supervisor-worker-${Date.now()}`,
          name: workerForm.name,
          role: workerForm.role,
          phone: workerForm.phone,
        },
        ...supervisorData.workers,
      ],
    };

    updateSupervisorData(next);
    setWorkerForm({ name: '', role: 'Worker', phone: '' });
  };

  const handleResourceSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!resourceForm.name.trim()) {
      return;
    }

    const next = {
      ...supervisorData,
      resources: [
        {
          id: `supervisor-resource-${Date.now()}`,
          name: resourceForm.name,
          quantity: resourceForm.quantity,
          unit: resourceForm.unit,
          usedFor: resourceForm.usedFor,
          photo: resourcePhoto,
        },
        ...supervisorData.resources,
      ],
    };

    updateSupervisorData(next);
    setResourceForm({ name: '', quantity: '', unit: 'bags', usedFor: '' });
    setResourcePhoto('');
  };

  const handleAchievementSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!achievementForm.title.trim()) {
      return;
    }

    const next = {
      ...supervisorData,
      achievements: [
        {
          id: `supervisor-achievement-${Date.now()}`,
          title: achievementForm.title,
          details: achievementForm.details,
          photo: achievementPhoto,
        },
        ...supervisorData.achievements,
      ],
    };

    updateSupervisorData(next);
    setAchievementForm({ title: '', details: '' });
    setAchievementPhoto('');
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>, setImage: (value: string) => void) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(String(reader.result ?? ''));
    };
    reader.readAsDataURL(file);
  };

  const adminSiteCards = projects.map((project) => {
    const projectWorkers = workers.filter((worker) => worker.projectCode === project.code);
    const projectReports = reports.filter((report) => report.projectCode === project.code);
    const projectMaterials = materials.filter((material) => material.projectCode === project.code);

    return {
      project,
      workers: projectWorkers,
      reports: projectReports,
      materials: projectMaterials,
    };
  });

  if (!user) {
    return (
      <DashboardLayout title="Dashboard">
        <p className="text-slate-300">Loading your dashboard...</p>
      </DashboardLayout>
    );
  }

  if (user.role === 'Admin') {
    return (
      <DashboardLayout title="Admin Dashboard">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <StatCard label="Projects" value={summary.projects.toString()} detail="Tracked project records" />
          <StatCard label="Workers" value={summary.workers.toString()} detail="Team members in the system" />
          <StatCard label="Attendance" value={summary.attendance.toString()} detail="Recorded attendance entries" />
          <StatCard label="Reports" value={summary.reports.toString()} detail="Daily reports submitted" />
          <StatCard label="Materials" value={summary.materials.toString()} detail="Material items tracked" />
          <StatCard label="Audit Alerts" value={summary.alerts.toString()} detail="System activity records" />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Panel title="All site reports">
            {loading ? (
              <p className="text-slate-300">Loading...</p>
            ) : adminSiteCards.length ? (
              <div className="space-y-4">
                {adminSiteCards.map(({ project, workers: projectWorkers, reports: projectReports, materials: projectMaterials }) => (
                  <div key={project.id} className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{project.name}</p>
                        <p className="text-sm text-slate-300">{project.code} • {project.location}</p>
                      </div>
                      <span className="rounded-full bg-cyan-500/20 px-2 py-1 text-xs text-cyan-200">{project.status}</span>
                    </div>

                    <div className="mt-3 grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
                      <p>Workers: {projectWorkers.length}</p>
                      <p>Reports: {projectReports.length}</p>
                      <p>Materials: {projectMaterials.length}</p>
                    </div>

                    <div className="mt-4 space-y-2">
                      {projectReports.length ? (
                        projectReports.slice(0, 4).map((report) => (
                          <div key={report.id} className="rounded-lg border border-white/10 bg-slate-950/60 p-3">
                            <p className="font-medium text-cyan-200">{report.reportNumber}</p>
                            <p className="text-sm text-slate-300">
                              {report.date} • {report.workersPresent} workers • {report.totalHours} hrs
                            </p>
                            <p className="mt-1 text-xs text-slate-400">Status: {report.status}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-300">No daily reports submitted for this site yet.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-300">No site data available.</p>
            )}
          </Panel>

          <Panel title="Latest activity">
            {loading ? (
              <p className="text-slate-300">Loading...</p>
            ) : logs.length ? (
              <div className="space-y-3">
                {logs.slice(0, 8).map((log) => (
                  <div key={log.id} className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                    <p className="font-medium text-cyan-200">{log.action}</p>
                    <p className="text-sm text-slate-300">{log.details}</p>
                    <p className="mt-1 text-xs text-slate-400">{new Date(log.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-300">No activity logs yet.</p>
            )}
          </Panel>
        </div>
      </DashboardLayout>
    );
  }

  if (user.role === 'Supervisor') {
    return (
      <DashboardLayout title="Supervisor Dashboard">
        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <StatCard label="Workers" value={supervisorData.workers.length.toString()} detail="Team members added" />
          <StatCard label="Resources" value={supervisorData.resources.length.toString()} detail="Resource entries logged" />
          <StatCard label="Achievements" value={supervisorData.achievements.length.toString()} detail="Completed milestones" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Panel title="Add worker">
            <form onSubmit={handleWorkerSubmit} className="space-y-4">
              <input
                value={workerForm.name}
                onChange={(e) => setWorkerForm({ ...workerForm, name: e.target.value })}
                placeholder="Worker name"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none"
              />
              <input
                value={workerForm.role}
                onChange={(e) => setWorkerForm({ ...workerForm, role: e.target.value })}
                placeholder="Role"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none"
              />
              <input
                value={workerForm.phone}
                onChange={(e) => setWorkerForm({ ...workerForm, phone: e.target.value })}
                placeholder="Phone"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none"
              />
              <button type="submit" className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
                Add worker
              </button>
            </form>
          </Panel>

          <Panel title="Today’s resources used">
            <form onSubmit={handleResourceSubmit} className="space-y-4">
              <input
                value={resourceForm.name}
                onChange={(e) => setResourceForm({ ...resourceForm, name: e.target.value })}
                placeholder="Resource name"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  value={resourceForm.quantity}
                  onChange={(e) => setResourceForm({ ...resourceForm, quantity: e.target.value })}
                  placeholder="Quantity"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none"
                />
                <input
                  value={resourceForm.unit}
                  onChange={(e) => setResourceForm({ ...resourceForm, unit: e.target.value })}
                  placeholder="Unit"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none"
                />
              </div>

              <input
                value={resourceForm.usedFor}
                onChange={(e) => setResourceForm({ ...resourceForm, usedFor: e.target.value })}
                placeholder="Used for"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none"
              />

              <label className="block text-sm text-slate-300">Resource photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleImageUpload(event, setResourcePhoto)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-200"
              />

              <button type="submit" className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
                Save resource
              </button>
            </form>
          </Panel>

          <Panel title="Site achievement">
            <form onSubmit={handleAchievementSubmit} className="space-y-4">
              <input
                value={achievementForm.title}
                onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })}
                placeholder="Achievement title"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none"
              />
              <textarea
                value={achievementForm.details}
                onChange={(e) => setAchievementForm({ ...achievementForm, details: e.target.value })}
                placeholder="Achievement details"
                className="min-h-28 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none"
              />

              <label className="block text-sm text-slate-300">Achievement photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleImageUpload(event, setAchievementPhoto)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-200"
              />

              <button type="submit" className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
                Save achievement
              </button>
            </form>
          </Panel>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <Panel title="Workers on this site">
            {supervisorData.workers.length ? (
              <div className="space-y-3">
                {supervisorData.workers.map((worker) => (
                  <div key={worker.id} className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                    <p className="font-semibold text-white">{worker.name}</p>
                    <p className="text-sm text-slate-300">{worker.role}</p>
                    <p className="text-xs text-slate-400">{worker.phone || 'No phone number'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-300">No workers added yet.</p>
            )}
          </Panel>

          <Panel title="Resources used today">
            {supervisorData.resources.length ? (
              <div className="space-y-3">
                {supervisorData.resources.map((resource) => (
                  <div key={resource.id} className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{resource.name}</p>
                        <p className="text-sm text-slate-300">
                          {resource.quantity} {resource.unit}
                        </p>
                      </div>
                      {resource.photo ? (
                        <img src={resource.photo} alt={resource.name} className="h-12 w-12 rounded-lg object-cover" />
                      ) : null}
                    </div>
                    <p className="mt-2 text-xs text-slate-400">Used for: {resource.usedFor || 'Not specified'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-300">No resources logged yet.</p>
            )}
          </Panel>

          <Panel title="Achievements and archive">
            {supervisorData.achievements.length ? (
              <div className="space-y-3">
                {supervisorData.achievements.map((achievement) => (
                  <div key={achievement.id} className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-white">{achievement.title}</p>
                      {achievement.photo ? (
                        <img src={achievement.photo} alt={achievement.title} className="h-12 w-12 rounded-lg object-cover" />
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm text-slate-300">{achievement.details || 'No details provided.'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-300">No achievements recorded yet.</p>
            )}
          </Panel>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-slate-300">Welcome back, {user.name}. Your role dashboard is being prepared.</p>
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
