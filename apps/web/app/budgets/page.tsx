'use client';

import { FormEvent, useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    category: '',
    amount: '',
    projectCode: 'NRR-01',
    spent: '',
  });

  async function loadBudgets() {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/budgets`);
      const data = await res.json();
      setBudgets(data);
    } catch {
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBudgets();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    await fetch(`${apiBase}/api/budgets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    setForm({ category: '', amount: '', projectCode: 'NRR-01', spent: '' });
    loadBudgets();
  }

  return (
    <DashboardLayout title="Budgets">
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-cyan-300">Budget overview</h2>

          {loading ? (
            <p className="text-slate-300">Loading...</p>
          ) : budgets.length ? (
            <div className="space-y-3">
              {budgets.map((item) => (
                <div key={item.id} className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-white">{item.category}</p>
                    <span className="text-sm text-cyan-200">${item.amount}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">Project: {item.projectCode}</p>
                  <p className="mt-2 text-sm text-slate-300">Spent: ${item.spent}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-300">No budget entries yet.</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-cyan-300">Add budget</h2>

          <div className="space-y-4">
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />
            <input value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Allocated amount" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />
            <input value={form.projectCode} onChange={(e) => setForm({ ...form, projectCode: e.target.value })} placeholder="Project code" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />
            <input value={form.spent} onChange={(e) => setForm({ ...form, spent: e.target.value })} placeholder="Spent amount" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />

            <button type="submit" className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
              Save budget
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
