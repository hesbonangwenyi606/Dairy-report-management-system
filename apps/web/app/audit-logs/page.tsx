'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      setLoading(true);
      try {
        const res = await fetch(`${apiBase}/api/audit-logs`);
        const data = await res.json();
        setLogs(data);
      } catch {
        setLogs([]);
      } finally {
        setLoading(false);
      }
    }

    loadLogs();
  }, []);

  return (
    <DashboardLayout title="Audit Logs">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 text-xl font-semibold text-cyan-300">System activity</h2>

        {loading ? (
          <p className="text-slate-300">Loading...</p>
        ) : logs.length ? (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
                <p className="font-semibold text-cyan-200">{log.action}</p>
                <p className="mt-1 text-sm text-slate-300">{log.details}</p>
                <p className="mt-2 text-xs text-slate-400">{new Date(log.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-300">No audit logs yet.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
