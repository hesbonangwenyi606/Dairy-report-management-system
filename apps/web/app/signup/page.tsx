'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { getUsers, saveCurrentUser, saveUsers, StoredUser } from '../../lib/auth';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const users = getUsers();
    const existing = users.find((user) => user.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      setMessage('An account with this email already exists.');
      return;
    }

    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      role: 'Admin',
      createdAt: new Date().toISOString(),
    };

    saveUsers([newUser, ...users]);
    saveCurrentUser(newUser);
    setMessage('Account created successfully. Redirecting...');

    setTimeout(() => router.push('/'), 500);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 px-6 py-10 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950/60 p-8 shadow-2xl backdrop-blur-md">
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-cyan-300">Construction Site Management</p>
        <h1 className="text-3xl font-bold">Create account</h1>
        <p className="mt-2 text-sm text-slate-300">Sign up to access the daily reporting system.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-200">Full name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none ring-0 placeholder:text-slate-400"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-200">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none ring-0 placeholder:text-slate-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-200">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none ring-0 placeholder:text-slate-400"
              placeholder="Create a password"
            />
          </div>

          {message ? <p className="text-sm text-cyan-300">{message}</p> : null}

          <button
            type="submit"
            className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Sign up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-300">
          Already have an account?{' '}
          <Link href="/signin" className="font-semibold text-cyan-300">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
