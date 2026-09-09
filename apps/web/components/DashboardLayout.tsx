'use client';

import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { getCurrentUser, signOut, type StoredUser } from '../lib/auth';

const navItemsByRole = {
  Admin: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/admin', label: 'Admin' },
    { href: '/projects', label: 'Projects' },
    { href: '/workers', label: 'Workers' },
    { href: '/attendance', label: 'Attendance' },
    { href: '/daily-reports', label: 'Daily Reports' },
    { href: '/materials', label: 'Materials' },
    { href: '/equipment', label: 'Equipment' },
    { href: '/safety', label: 'Safety' },
    { href: '/budgets', label: 'Budgets' },
    { href: '/procurement', label: 'Procurement' },
    { href: '/audit-logs', label: 'Audit Logs' },
  ],
  Supervisor: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/projects', label: 'Projects' },
    { href: '/workers', label: 'Workers' },
    { href: '/attendance', label: 'Attendance' },
    { href: '/daily-reports', label: 'Daily Reports' },
    { href: '/materials', label: 'Materials' },
    { href: '/equipment', label: 'Equipment' },
    { href: '/safety', label: 'Safety' },
  ],
  Worker: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/attendance', label: 'Attendance' },
    { href: '/daily-reports', label: 'Daily Reports' },
    { href: '/materials', label: 'Materials' },
  ],
};

export function DashboardLayout({ title, children }: { title: string; children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const visibleNavItems = navItemsByRole[user?.role as keyof typeof navItemsByRole] ?? navItemsByRole.Admin;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-lg font-semibold text-cyan-300">
              Dairy Report
            </Link>
            <nav className="hidden items-center gap-4 md:flex">
              {visibleNavItems.map((item) => (
                <Link key={item.href} href={item.href} className="text-sm text-slate-300 transition hover:text-cyan-200">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-200 sm:inline-block">
                  {user.name} • {user.role}
                </span>
                <button
                  onClick={() => {
                    signOut();
                    setUser(null);
                    window.location.href = '/signin';
                  }}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/signin" className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10">
                  Sign in
                </Link>
                <Link href="/signup" className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-400">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">System dashboard</p>
          <h1 className="mt-2 text-3xl font-bold text-white">{title}</h1>
        </div>
        {children}
      </main>
    </div>
  );
}
