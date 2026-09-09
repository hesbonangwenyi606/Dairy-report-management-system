'use client';

import { FormEvent, useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function AttendancePage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    workerName: '',
    projectCode: 'NRR-01',
    date: new Date().toISOString().slice(0, 10),
    status: 'Present',
    notes: '',
  });

  async function loadEntries() {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/attendance`);
      const data = await res.json();
      setEntries(data);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEntries();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    await fetch(`${apiBase}/api/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    setForm({ workerName: '', projectCode: 'NRR-01', date: new Date().toISOString().slice(0, 10), status: 'Present', notes: '' });
    loadEntries();
  }

  return (
    <DashboardLayout title="Attendance">
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-cyan-300">Attendance log</h2>

          {loading ? (
            <p className="text-slate-300">Loading...</p>
          ) : entries.length ? (
            <div className="space-y-3">
              {entries.map((entry) => (
                <div key={entry.id} className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{entry.workerName}</p>
                      <p className="text-sm text-slate-300">{entry.projectCode} • {entry.date}</p>
                    </div>
                    <span className="rounded-full bg-cyan-500/20 px-2 py-1 text-xs text-cyan-200">{entry.status}</span>
                  </div>
                  {entry.notes ? <p className="mt-2 text-sm text-slate-300">{entry.notes}</p> : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-300">No attendance entries yet.</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-cyan-300">Record attendance</h2>

          <div className="space-y-4">
            <input value={form.workerName} onChange={(e) => setForm({ ...form, workerName: e.target.value })} placeholder="Worker name" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />
            <input value={form.projectCode} onChange={(e) => setForm({ ...form, projectCode: e.target.value })} placeholder="Project code" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none">
              <option>Present</option>
              <option>Absent</option>
              <option>Late</option>
            </select>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />

            <button type="submit" className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
              Save attendance
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
