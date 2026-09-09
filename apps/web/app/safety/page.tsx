'use client';

import { FormEvent, useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function SafetyPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    severity: 'Medium',
    location: '',
    actions: '',
    reportedBy: '',
  });

  async function loadRecords() {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/safety-records`);
      const data = await res.json();
      setRecords(data);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecords();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    await fetch(`${apiBase}/api/safety-records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    setForm({ title: '', severity: 'Medium', location: '', actions: '', reportedBy: '' });
    loadRecords();
  }

  return (
    <DashboardLayout title="Safety">
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-cyan-300">Safety records</h2>

          {loading ? (
            <p className="text-slate-300">Loading...</p>
          ) : records.length ? (
            <div className="space-y-3">
              {records.map((item) => (
                <div key={item.id} className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-white">{item.title}</p>
                    <span className="rounded-full bg-amber-500/20 px-2 py-1 text-xs text-amber-200">{item.severity}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">Location: {item.location}</p>
                  <p className="mt-2 text-sm text-slate-300">Actions: {item.actions}</p>
                  <p className="mt-2 text-xs text-slate-400">Reported by {item.reportedBy}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-300">No safety records yet.</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-cyan-300">Log incident</h2>

          <div className="space-y-4">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Incident title" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />
            <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />
            <textarea value={form.actions} onChange={(e) => setForm({ ...form, actions: e.target.value })} placeholder="Actions taken" className="min-h-28 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />
            <input value={form.reportedBy} onChange={(e) => setForm({ ...form, reportedBy: e.target.value })} placeholder="Reported by" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />

            <button type="submit" className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
              Save safety record
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
