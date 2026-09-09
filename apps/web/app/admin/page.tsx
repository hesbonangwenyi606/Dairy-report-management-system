'use client';

import { FormEvent, useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { getCurrentUser } from '../../lib/auth';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function AdminPage() {
  const currentUser = getCurrentUser();
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    status: 'Active',
    progress: '0',
    supervisor: '',
    location: '',
  });

  async function loadProjects() {
    setLoading(true);

    try {
      const res = await fetch(`${apiBase}/api/projects`);
      const data = await res.json();
      setProjects(data);

      if (data.length && !selectedProjectId) {
        setSelectedProjectId(data[0].id);
      }
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    const current = projects.find((project) => project.id === selectedProjectId);

    if (current) {
      setForm({
        status: current.status,
        progress: String(current.progress ?? 0),
        supervisor: current.supervisor ?? '',
        location: current.location ?? '',
      });
    }
  }, [selectedProjectId, projects]);

  const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!selectedProject) {
      return;
    }

    const updatedProjects = projects.map((project) => {
      if (project.id !== selectedProject.id) {
        return project;
      }

      return {
        ...project,
        status: form.status,
        progress: Number(form.progress),
        supervisor: form.supervisor || project.supervisor,
        location: form.location || project.location,
      };
    });

    setProjects(updatedProjects);
    setSelectedProjectId(selectedProject.id);
  }

  const activeSites = projects.filter((project) => project.status === 'Active').length;
  const onHoldSites = projects.filter((project) => project.status === 'On Hold').length;
  const completedSites = projects.filter((project) => project.status === 'Completed').length;

  if (currentUser?.role !== 'Admin') {
    return (
      <DashboardLayout title="Admin Portal">
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-8 text-center">
          <p className="text-xl font-semibold text-red-200">Access denied</p>
          <p className="mt-2 text-slate-300">Only Admin users can manage project sites.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Admin Portal">
      <div className="mb-8 grid gap-5 md:grid-cols-4">
        <StatCard label="Total Sites" value={projects.length.toString()} detail="Managed project sites" />
        <StatCard label="Active" value={activeSites.toString()} detail="Currently running sites" />
        <StatCard label="On Hold" value={onHoldSites.toString()} detail="Paused projects" />
        <StatCard label="Completed" value={completedSites.toString()} detail="Finished sites" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-cyan-300">Project sites</h2>
            <button
              onClick={loadProjects}
              className="rounded-xl border border-cyan-400/40 bg-slate-900/70 px-3 py-2 text-sm text-cyan-200 transition hover:bg-slate-800"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-slate-300">Loading project sites...</p>
          ) : projects.length ? (
            <div className="space-y-3">
              {projects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setSelectedProjectId(project.id)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    selectedProject?.id === project.id
                      ? 'border-cyan-400 bg-cyan-500/10'
                      : 'border-white/10 bg-slate-900/70 hover:bg-slate-900'
                  }`}
                >
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
                  <p className="mt-2 text-sm text-slate-300">Supervisor: {project.supervisor}</p>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-slate-300">No project sites found.</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-cyan-300">Manage selected site</h2>

          {selectedProject ? (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-slate-200">Site name</label>
                <input
                  value={selectedProject.name}
                  disabled
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white opacity-80"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-200">Project code</label>
                <input
                  value={selectedProject.code}
                  disabled
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white opacity-80"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-200">Location</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-200">Supervisor</label>
                <input
                  value={form.supervisor}
                  onChange={(e) => setForm({ ...form, supervisor: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-200">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none"
                >
                  <option>Draft</option>
                  <option>Active</option>
                  <option>On Hold</option>
                  <option>Completed</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-200">Progress %</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={form.progress}
                  onChange={(e) => setForm({ ...form, progress: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Save site updates
              </button>
            </div>
          ) : (
            <p className="text-slate-300">Select a site to manage it.</p>
          )}
        </form>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-cyan-400/20 bg-slate-900/70 p-5 shadow-xl">
      <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">{label}</p>
      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-300">{detail}</p>
    </div>
  );
}
