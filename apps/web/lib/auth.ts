export type StoredUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
};

const USERS_KEY = 'construction-site-users';
const CURRENT_USER_KEY = 'construction-site-current-user';

const DEFAULT_ADMIN_USER: StoredUser = {
  id: 'admin-default',
  name: 'Admin User',
  email: 'hesbon@admin.com',
  password: 'hesbon321',
  role: 'Admin',
  createdAt: new Date().toISOString(),
};

export function getUsers(): StoredUser[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(USERS_KEY);

    if (!raw) {
      window.localStorage.setItem(USERS_KEY, JSON.stringify([DEFAULT_ADMIN_USER]));
      return [DEFAULT_ADMIN_USER];
    }

    const users = JSON.parse(raw) as StoredUser[];
    const hasDefaultAdmin = users.some((user) => user.email.toLowerCase() === DEFAULT_ADMIN_USER.email.toLowerCase());

    if (!hasDefaultAdmin) {
      const mergedUsers = [DEFAULT_ADMIN_USER, ...users];
      window.localStorage.setItem(USERS_KEY, JSON.stringify(mergedUsers));
      return mergedUsers;
    }

    return users;
  } catch {
    return [];
  }
}

export function saveUsers(users: StoredUser[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser(): StoredUser | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(CURRENT_USER_KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}

export function saveCurrentUser(user: StoredUser | null) {
  if (typeof window === 'undefined') return;

  if (!user) {
    window.localStorage.removeItem(CURRENT_USER_KEY);
    return;
  }

  window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function signOut() {
  saveCurrentUser(null);
}
