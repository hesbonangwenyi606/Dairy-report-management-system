'use client';

import { FormEvent, useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    projectCode: 'NRR-01',
    condition: 'Operational',
    operator: '',
    lastMaintenance: new Date().toISOString().slice(0, 10),
  });

  async function loadEquipment() {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/equipment`);
      const data = await res.json();
      setEquipment(data);
    } catch {
      setEquipment([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEquipment();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    await fetch(`${apiBase}/api/equipment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    setForm({ name: '', projectCode: 'NRR-01', condition: 'Operational', operator: '', lastMaintenance: new Date().toISOString().slice(0, 10) });
    loadEquipment();
  }

  return (
    <DashboardLayout title="Equipment">
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-cyan-300">Equipment inventory</h2>

          {loading ? (
            <p className="text-slate-300">Loading...</p>
          ) : equipment.length ? (
            <div className="space-y-3">
              {equipment.map((item) => (
                <div key={item.id} className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="text-sm text-slate-300">{item.projectCode} • {item.operator}</p>
                    </div>
                    <span className="rounded-full bg-cyan-500/20 px-2 py-1 text-xs text-cyan-200">{item.condition}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">Last maintenance: {item.lastMaintenance}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-300">No equipment tracked yet.</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-cyan-300">Add equipment</h2>

          <div className="space-y-4">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Equipment name" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />
            <input value={form.projectCode} onChange={(e) => setForm({ ...form, projectCode: e.target.value })} placeholder="Project code" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />
            <input value={form.operator} onChange={(e) => setForm({ ...form, operator: e.target.value })} placeholder="Operator" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />
            <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none">
              <option>Operational</option>
              <option>Maintenance</option>
              <option>Out of Service</option>
            </select>
            <input type="date" value={form.lastMaintenance} onChange={(e) => setForm({ ...form, lastMaintenance: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />

            <button type="submit" className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
              Save equipment
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
