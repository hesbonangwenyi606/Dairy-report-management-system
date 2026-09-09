'use client';

import { FormEvent, useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function ProcurementPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    item: '',
    vendor: '',
    quantity: '',
    status: 'Pending',
  });

  async function loadItems() {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/procurement`);
      const data = await res.json();
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    await fetch(`${apiBase}/api/procurement`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    setForm({ item: '', vendor: '', quantity: '', status: 'Pending' });
    loadItems();
  }

  return (
    <DashboardLayout title="Procurement">
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-cyan-300">Procurement pipeline</h2>

          {loading ? (
            <p className="text-slate-300">Loading...</p>
          ) : items.length ? (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-white">{item.item}</p>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-200">{item.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">Vendor: {item.vendor}</p>
                  <p className="mt-2 text-sm text-slate-300">Quantity: {item.quantity}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-300">No procurement requests yet.</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-cyan-300">New request</h2>

          <div className="space-y-4">
            <input value={form.item} onChange={(e) => setForm({ ...form, item: e.target.value })} placeholder="Item" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />
            <input value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} placeholder="Vendor" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />
            <input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="Quantity" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none">
              <option>Pending</option>
              <option>Approved</option>
              <option>Delivered</option>
            </select>

            <button type="submit" className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
              Save request
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
