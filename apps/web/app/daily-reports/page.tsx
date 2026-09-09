'use client';

import { FormEvent, useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function DailyReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    reportNumber: '',
    projectCode: 'NRR-01',
    date: new Date().toISOString().slice(0, 10),
    workersPresent: '0',
    totalHours: '0',
    status: 'Draft',
  });

  async function loadReports() {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/daily-reports`);
      const data = await res.json();
      setReports(data);
    } catch {
      setReports([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    await fetch(`${apiBase}/api/daily-reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...form,
        workersPresent: Number(form.workersPresent),
        totalHours: Number(form.totalHours),
      }),
    });

    setForm({ reportNumber: '', projectCode: 'NRR-01', date: new Date().toISOString().slice(0, 10), workersPresent: '0', totalHours: '0', status: 'Draft' });
    loadReports();
  }

  return (
    <DashboardLayout title="Daily Reports">
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-cyan-300">Reports</h2>

          {loading ? (
            <p className="text-slate-300">Loading...</p>
          ) : reports.length ? (
            <div className="space-y-3">
              {reports.map((report) => (
                <div key={report.id} className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{report.reportNumber}</p>
                      <p className="text-sm text-slate-300">{report.projectCode} • {report.date}</p>
                    </div>
                    <span className="rounded-full bg-cyan-500/20 px-2 py-1 text-xs text-cyan-200">{report.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">Workers: {report.workersPresent} • Hours: {report.totalHours}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-300">No daily reports created yet.</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-cyan-300">Create report</h2>

          <div className="space-y-4">
            <input value={form.reportNumber} onChange={(e) => setForm({ ...form, reportNumber: e.target.value })} placeholder="Report number" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />
            <input value={form.projectCode} onChange={(e) => setForm({ ...form, projectCode: e.target.value })} placeholder="Project code" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />
            <input type="number" value={form.workersPresent} onChange={(e) => setForm({ ...form, workersPresent: e.target.value })} placeholder="Workers present" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />
            <input type="number" value={form.totalHours} onChange={(e) => setForm({ ...form, totalHours: e.target.value })} placeholder="Total hours" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none">
              <option>Draft</option>
              <option>Approved</option>
              <option>Pending</option>
            </select>

            <button type="submit" className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
              Save report
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
