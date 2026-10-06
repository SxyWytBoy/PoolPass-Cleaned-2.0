/**
 * In-browser stand-in for Supabase.
 *
 * When VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set, the app talks to this
 * module instead. It implements the subset of the supabase-js API the app uses
 * (auth, query builder, storage) on top of localStorage, so every feature works
 * end to end in a single browser without any server.
 */
import { seedPools, seedProfiles, seedReviews, DEMO_GUEST_EMAIL, DEMO_HOST_EMAIL, DEMO_PASSWORD } from './seed-data';

type Row = Record<string, unknown>;
type Tables = Record<string, Row[]>;
type LocalError = { message: string; code?: string };
type Result<T = unknown> = { data: T; error: LocalError | null; count?: number | null };

const DB_KEY = 'poolpass:db:v3';
const USERS_KEY = 'poolpass:users:v1';
const SESSION_KEY = 'poolpass:session:v1';
const FILES_KEY = 'poolpass:files:v1';

// ---------------------------------------------------------------------------
// Storage helpers (localStorage can be missing or throw in private windows)
// ---------------------------------------------------------------------------

const memoryStore = new Map<string, string>();

const store = {
  get(key: string): string | null {
    try {
      const value = window.localStorage.getItem(key);
      if (value !== null) return value;
    } catch {
      // fall through to memory
    }
    return memoryStore.get(key) ?? null;
  },
  set(key: string, value: string): boolean {
    memoryStore.set(key, value);
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },
  remove(key: string) {
    memoryStore.delete(key);
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};

const readJson = <T,>(key: string, fallback: T): T => {
  const raw = store.get(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const uuid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------

const seedTables = (): Tables => ({
  pools: clone(seedPools) as unknown as Row[],
  profiles: clone(seedProfiles) as unknown as Row[],
  reviews: clone(seedReviews) as unknown as Row[],
  bookings: [],
  waitlist: [],
  host_applications: [],
  contact_messages: [],
});

let tables: Tables | null = null;

const db = (): Tables => {
  if (!tables) {
    tables = readJson<Tables | null>(DB_KEY, null) ?? seedTables();
    const seeded = seedTables();
    for (const name of Object.keys(seeded)) {
      if (!tables[name]) tables[name] = seeded[name];
    }
    persist();
  }
  return tables;
};

const persist = () => {
  if (tables) store.set(DB_KEY, JSON.stringify(tables));
};

const UNIQUE: Record<string, string[]> = {
  waitlist: ['email'],
  profiles: ['id'],
};

// Recalculate a pool's rating when a review is added.
const afterInsert: Record<string, (row: Row) => void> = {
  reviews: (row) => {
    const pool = db().pools.find((p) => p.id === row.pool_id);
    if (!pool) return;
    const count = Number(pool.reviews) || 0;
    const rating = Number(pool.rating) || 0;
    const next = (rating * count + Number(row.rating)) / (count + 1);
    pool.reviews = count + 1;
    pool.rating = Math.round(next * 10) / 10;
  },
};

// ---------------------------------------------------------------------------
// Query builder
// ---------------------------------------------------------------------------

type Filter = (row: Row) => boolean;
type Join = { alias: string; table: string; fk: string; columns: string[] };

const parseSelect = (select: string) => {
  const joins: Join[] = [];
  // e.g. "*, pools:pool_id (name, location, images)"
  const joinPattern = /(\w+):(\w+)\s*\(([^)]*)\)/g;
  let match: RegExpExecArray | null;
  while ((match = joinPattern.exec(select))) {
    joins.push({
      alias: match[1],
      table: match[1],
      fk: match[2],
      columns: match[3].split(',').map((c) => c.trim()).filter(Boolean),
    });
  }
  const rest = select.replace(joinPattern, '').split(',').map((c) => c.trim()).filter(Boolean);
  const columns = rest.length === 0 || rest.includes('*') ? null : rest;
  return { columns, joins };
};

const pick = (row: Row, columns: string[] | null) => {
  if (!columns || columns.includes('*')) return { ...row };
  const out: Row = {};
  for (const c of columns) out[c] = row[c];
  return out;
};

class LocalQuery implements PromiseLike<Result> {
  private op: 'select' | 'insert' | 'update' | 'delete' = 'select';
  private selectStr = '*';
  private returning = false;
  private payload: Row[] | Row | null = null;
  private filters: Filter[] = [];
  private orderBy: { column: string; ascending: boolean }[] = [];
  private limitN: number | null = null;
  private singleMode: 'single' | 'maybe' | null = null;

  constructor(private table: string) {}

  select(columns = '*') {
    if (this.op === 'select') this.selectStr = columns;
    else {
      this.returning = true;
      this.selectStr = columns;
    }
    return this;
  }
  insert(values: Row | Row[]) {
    this.op = 'insert';
    this.payload = values;
    return this;
  }
  update(values: Row) {
    this.op = 'update';
    this.payload = values;
    return this;
  }
  delete() {
    this.op = 'delete';
    return this;
  }
  eq(column: string, value: unknown) {
    this.filters.push((r) => r[column] === value);
    return this;
  }
  neq(column: string, value: unknown) {
    this.filters.push((r) => r[column] !== value);
    return this;
  }
  gt(column: string, value: unknown) {
    this.filters.push((r) => (r[column] as number) > (value as number));
    return this;
  }
  gte(column: string, value: unknown) {
    this.filters.push((r) => (r[column] as number) >= (value as number));
    return this;
  }
  lt(column: string, value: unknown) {
    this.filters.push((r) => (r[column] as number) < (value as number));
    return this;
  }
  lte(column: string, value: unknown) {
    this.filters.push((r) => (r[column] as number) <= (value as number));
    return this;
  }
  in(column: string, values: unknown[]) {
    this.filters.push((r) => values.includes(r[column]));
    return this;
  }
  ilike(column: string, pattern: string) {
    const re = new RegExp(
      '^' + pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/%/g, '.*').replace(/_/g, '.') + '$',
      'i'
    );
    this.filters.push((r) => re.test(String(r[column] ?? '')));
    return this;
  }
  order(column: string, options: { ascending?: boolean } = {}) {
    this.orderBy.push({ column, ascending: options.ascending !== false });
    return this;
  }
  limit(n: number) {
    this.limitN = n;
    return this;
  }
  single() {
    this.singleMode = 'single';
    return this;
  }
  maybeSingle() {
    this.singleMode = 'maybe';
    return this;
  }

  then<TResult1 = Result, TResult2 = never>(
    onfulfilled?: ((value: Result) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2> {
    // A short delay keeps loading states realistic and avoids synchronous re-renders.
    return new Promise<Result>((resolve) => setTimeout(() => resolve(this.execute()), 60)).then(onfulfilled, onrejected);
  }

  private execute(): Result {
    const all = db();
    if (!all[this.table]) all[this.table] = [];
    const rows = all[this.table];

    try {
      let affected: Row[] = [];

      if (this.op === 'insert') {
        const items = Array.isArray(this.payload) ? this.payload : [this.payload ?? {}];
        const now = new Date().toISOString();
        const created = items.map((item) => ({ id: uuid(), created_at: now, ...item }));
        for (const unique of UNIQUE[this.table] ?? []) {
          for (const row of created) {
            const value = String(row[unique] ?? '').toLowerCase();
            if (rows.some((r) => String(r[unique] ?? '').toLowerCase() === value)) {
              return { data: null, error: { message: `duplicate key value violates unique constraint "${this.table}_${unique}_key"`, code: '23505' } };
            }
          }
        }
        rows.push(...created);
        created.forEach((row) => afterInsert[this.table]?.(row));
        affected = created;
        persist();
        if (!this.returning) return { data: null, error: null };
      } else if (this.op === 'update') {
        affected = rows.filter((r) => this.filters.every((f) => f(r)));
        affected.forEach((r) => Object.assign(r, this.payload));
        persist();
        if (!this.returning) return { data: null, error: null };
      } else if (this.op === 'delete') {
        affected = rows.filter((r) => this.filters.every((f) => f(r)));
        all[this.table] = rows.filter((r) => !affected.includes(r));
        persist();
        if (!this.returning) return { data: null, error: null };
      } else {
        affected = rows.filter((r) => this.filters.every((f) => f(r)));
      }

      let result = [...affected];
      for (const { column, ascending } of [...this.orderBy].reverse()) {
        result.sort((a, b) => {
          const av = a[column] as string | number;
          const bv = b[column] as string | number;
          if (av === bv) return 0;
          return (av > bv ? 1 : -1) * (ascending ? 1 : -1);
        });
      }
      if (this.limitN !== null) result = result.slice(0, this.limitN);

      const { columns, joins } = parseSelect(this.selectStr);
      const shaped = result.map((row) => {
        const out = pick(row, columns);
        for (const join of joins) {
          const target = (all[join.table] ?? []).find((t) => t.id === row[join.fk]);
          out[join.alias] = target ? pick(target, join.columns) : null;
        }
        return clone(out);
      });

      if (this.singleMode) {
        if (shaped.length === 1) return { data: shaped[0], error: null };
        if (shaped.length === 0 && this.singleMode === 'maybe') return { data: null, error: null };
        return {
          data: null,
          error: { message: shaped.length === 0 ? 'No rows found' : 'Multiple rows returned', code: 'PGRST116' },
        };
      }
      return { data: shaped, error: null, count: shaped.length };
    } catch (err) {
      return { data: null, error: { message: err instanceof Error ? err.message : 'Unknown error' } };
    }
  }
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

interface StoredUser {
  id: string;
  email: string;
  password_hash: string;
  user_metadata: Record<string, unknown>;
  created_at: string;
}

interface LocalUser {
  id: string;
  email: string;
  user_metadata: Record<string, unknown>;
  app_metadata: Record<string, unknown>;
  aud: string;
  created_at: string;
}

interface LocalSession {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  user: LocalUser;
}

type AuthListener = (event: string, session: LocalSession | null) => void;

const hashPassword = async (password: string) => {
  try {
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`poolpass:${password}`));
    return Array.from(new Uint8Array(bytes)).map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    let h = 0;
    for (const ch of `poolpass:${password}`) h = (Math.imul(31, h) + ch.charCodeAt(0)) | 0;
    return `weak-${h}`;
  }
};

let users: StoredUser[] | null = null;

const getUsers = async (): Promise<StoredUser[]> => {
  if (!users) {
    users = readJson<StoredUser[] | null>(USERS_KEY, null);
    if (!users) {
      const hash = await hashPassword(DEMO_PASSWORD);
      users = [
        { id: 'guest-demo', email: DEMO_GUEST_EMAIL, password_hash: hash, user_metadata: { user_type: 'guest' }, created_at: '2024-05-12T10:00:00Z' },
        { id: 'host-emma', email: DEMO_HOST_EMAIL, password_hash: hash, user_metadata: { user_type: 'host' }, created_at: '2022-03-02T10:00:00Z' },
      ];
      store.set(USERS_KEY, JSON.stringify(users));
    }
  }
  return users;
};

const toUser = (u: StoredUser): LocalUser => ({
  id: u.id,
  email: u.email,
  user_metadata: u.user_metadata,
  app_metadata: { provider: 'email' },
  aud: 'authenticated',
  created_at: u.created_at,
});

const makeSession = (u: StoredUser): LocalSession => ({
  access_token: uuid(),
  refresh_token: uuid(),
  token_type: 'bearer',
  expires_in: 60 * 60 * 24 * 30,
  expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
  user: toUser(u),
});

const listeners = new Set<AuthListener>();
const emit = (event: string, session: LocalSession | null) => listeners.forEach((l) => l(event, session));

const currentSession = (): LocalSession | null => readJson<LocalSession | null>(SESSION_KEY, null);

const auth = {
  async getSession() {
    await getUsers();
    return { data: { session: currentSession() }, error: null };
  },
  async getUser() {
    return { data: { user: currentSession()?.user ?? null }, error: null };
  },
  onAuthStateChange(callback: AuthListener) {
    listeners.add(callback);
    return { data: { subscription: { unsubscribe: () => listeners.delete(callback) } } };
  },
  async signUp({ email, password, options }: { email: string; password: string; options?: { data?: Record<string, unknown> } }) {
    const list = await getUsers();
    const normalised = email.trim().toLowerCase();
    if (list.some((u) => u.email === normalised)) {
      return { data: { user: null, session: null }, error: { message: 'An account with this email already exists. Try signing in instead.' } };
    }
    const user: StoredUser = {
      id: uuid(),
      email: normalised,
      password_hash: await hashPassword(password),
      user_metadata: options?.data ?? {},
      created_at: new Date().toISOString(),
    };
    list.push(user);
    store.set(USERS_KEY, JSON.stringify(list));
    const session = makeSession(user);
    store.set(SESSION_KEY, JSON.stringify(session));
    emit('SIGNED_IN', session);
    return { data: { user: session.user, session }, error: null };
  },
  async signInWithPassword({ email, password }: { email: string; password: string }) {
    const list = await getUsers();
    const user = list.find((u) => u.email === email.trim().toLowerCase());
    if (!user || user.password_hash !== (await hashPassword(password))) {
      return { data: { user: null, session: null }, error: { message: 'Invalid login credentials' } };
    }
    const session = makeSession(user);
    store.set(SESSION_KEY, JSON.stringify(session));
    emit('SIGNED_IN', session);
    return { data: { user: session.user, session }, error: null };
  },
  async updateUser({ data }: { data?: Record<string, unknown> }) {
    const session = currentSession();
    if (!session) return { data: { user: null }, error: { message: 'Not signed in' } };
    const list = await getUsers();
    const user = list.find((u) => u.id === session.user.id);
    if (user && data) {
      user.user_metadata = { ...user.user_metadata, ...data };
      store.set(USERS_KEY, JSON.stringify(list));
      const next = { ...session, user: toUser(user) };
      store.set(SESSION_KEY, JSON.stringify(next));
      emit('USER_UPDATED', next);
      return { data: { user: next.user }, error: null };
    }
    return { data: { user: session.user }, error: null };
  },
  async signOut() {
    store.remove(SESSION_KEY);
    emit('SIGNED_OUT', null);
    return { error: null };
  },
};

// ---------------------------------------------------------------------------
// Storage (images are downscaled and kept as data URLs)
// ---------------------------------------------------------------------------

const fileToDataUrl = (file: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const shrinkImage = async (file: Blob, maxSize = 1200): Promise<string> => {
  const dataUrl = await fileToDataUrl(file);
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') return dataUrl;
  try {
    const image = new Image();
    image.src = dataUrl;
    await image.decode();
    const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);
    canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.8);
  } catch {
    return dataUrl;
  }
};

const storage = {
  from(bucket: string) {
    const key = (path: string) => `${bucket}/${path}`;
    return {
      async upload(path: string, file: Blob) {
        try {
          const files = readJson<Record<string, string>>(FILES_KEY, {});
          files[key(path)] = await shrinkImage(file);
          // If the browser's storage quota is full the image is kept in memory for this visit.
          store.set(FILES_KEY, JSON.stringify(files));
          return { data: { path }, error: null };
        } catch (err) {
          return { data: null, error: { message: err instanceof Error ? err.message : 'Upload failed' } };
        }
      },
      getPublicUrl(path: string) {
        const files = readJson<Record<string, string>>(FILES_KEY, {});
        return { data: { publicUrl: files[key(path)] ?? '' } };
      },
    };
  },
};

export const resetLocalBackend = () => {
  [DB_KEY, USERS_KEY, SESSION_KEY, FILES_KEY].forEach((k) => store.remove(k));
  tables = null;
  users = null;
};

export const createLocalClient = () => ({
  auth,
  storage,
  from: (table: string) => new LocalQuery(table),
});
