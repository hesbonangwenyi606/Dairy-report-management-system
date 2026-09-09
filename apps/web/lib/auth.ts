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

const DEFAULT_SUPERVISOR_USER: StoredUser = {
  id: 'supervisor-default',
  name: 'Supervisor User',
  email: 'supervisor@site.com',
  password: 'supervisor123',
  role: 'Supervisor',
  createdAt: new Date().toISOString(),
};

export function getUsers(): StoredUser[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(USERS_KEY);

    if (!raw) {
      const seededUsers = [DEFAULT_ADMIN_USER, DEFAULT_SUPERVISOR_USER];
      window.localStorage.setItem(USERS_KEY, JSON.stringify(seededUsers));
      return seededUsers;
    }

    const users = JSON.parse(raw) as StoredUser[];
    const hasDefaultAdmin = users.some((user) => user.email.toLowerCase() === DEFAULT_ADMIN_USER.email.toLowerCase());
    const hasDefaultSupervisor = users.some(
      (user) => user.email.toLowerCase() === DEFAULT_SUPERVISOR_USER.email.toLowerCase(),
    );

    const mergedUsers = [...users];

    if (!hasDefaultAdmin) {
      mergedUsers.unshift(DEFAULT_ADMIN_USER);
    }

    if (!hasDefaultSupervisor) {
      mergedUsers.unshift(DEFAULT_SUPERVISOR_USER);
    }

    if (!hasDefaultAdmin || !hasDefaultSupervisor) {
      window.localStorage.setItem(USERS_KEY, JSON.stringify(mergedUsers));
    }

    return mergedUsers;
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
