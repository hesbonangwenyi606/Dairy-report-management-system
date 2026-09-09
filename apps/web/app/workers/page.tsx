'use client';

import { FormEvent, useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function WorkersPage() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    fullName: '',
    role: 'Worker',
    phone: '',
    projectCode: 'NRR-01',
    status: 'Active',
  });

  async function loadWorkers() {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/workers`);
      const data = await res.json();
      setWorkers(data);
    } catch {
      setWorkers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWorkers();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    await fetch(`${apiBase}/api/workers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    setForm({ fullName: '', role: 'Worker', phone: '', projectCode: 'NRR-01', status: 'Active' });
    loadWorkers();
  }

  return (
    <DashboardLayout title="Workers">
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-cyan-300">Worker directory</h2>

          {loading ? (
            <p className="text-slate-300">Loading...</p>
          ) : workers.length ? (
            <div className="space-y-3">
              {workers.map((worker) => (
                <div key={worker.id} className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{worker.fullName}</p>
                      <p className="text-sm text-slate-300">{worker.role} • {worker.projectCode}</p>
                    </div>
                    <span className="rounded-full bg-cyan-500/20 px-2 py-1 text-xs text-cyan-200">{worker.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">Phone: {worker.phone || 'Not provided'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-300">No workers added yet.</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-cyan-300">Add worker</h2>

          <div className="space-y-4">
            <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Full name" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />
            <input value={form.projectCode} onChange={(e) => setForm({ ...form, projectCode: e.target.value })} placeholder="Project code" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none">
              <option>Worker</option>
              <option>Supervisor</option>
              <option>Carpenter</option>
              <option>Engineer</option>
            </select>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none">
              <option>Active</option>
              <option>Leave</option>
              <option>Inactive</option>
            </select>

            <button type="submit" className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
              Save worker
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
