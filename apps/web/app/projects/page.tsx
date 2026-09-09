'use client';

import { FormEvent, useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    code: '',
    location: '',
    supervisor: '',
    status: 'Draft',
    progress: '0',
  });

  async function loadProjects() {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/projects`);
      const data = await res.json();
      setProjects(data);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const payload = {
      ...form,
      progress: Number(form.progress),
    };

    await fetch(`${apiBase}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    setForm({ name: '', code: '', location: '', supervisor: '', status: 'Draft', progress: '0' });
    loadProjects();
  }

  return (
    <DashboardLayout title="Projects">
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-cyan-300">Project list</h2>

          {loading ? (
            <p className="text-slate-300">Loading...</p>
          ) : projects.length ? (
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project.id} className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
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
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-300">No projects created yet.</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-cyan-300">Add project</h2>

          <div className="space-y-4">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Project name" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Project code" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />
            <input value={form.supervisor} onChange={(e) => setForm({ ...form, supervisor: e.target.value })} placeholder="Supervisor" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none">
              <option>Draft</option>
              <option>Active</option>
              <option>On Hold</option>
              <option>Completed</option>
            </select>
            <input
              type="number"
              min={0}
              max={100}
              value={form.progress}
              onChange={(e) => setForm({ ...form, progress: e.target.value })}
              placeholder="Progress %"
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none"
            />

            <button type="submit" className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
              Save project
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
