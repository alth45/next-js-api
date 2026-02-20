# Belajar REST API — Next.js + TypeScript

> Stack: **Next.js** (App Router) + **TypeScript** + **Tailwind CSS** + **JSONPlaceholder API**

---

## Struktur Project Final

```
belajar-api/
├── app/
│   ├── page.tsx                ← navigasi utama
│   ├── posts/
│   │   ├── page.tsx            ← list posts (Server Component)
│   │   └── [id]/page.tsx       ← detail post (dynamic route)
│   ├── search/page.tsx         ← search + filter (Client Component)
│   ├── users/page.tsx          ← error handling
│   ├── albums/page.tsx         ← custom hook
│   └── create/page.tsx         ← POST request
├── components/
│   ├── LoadingSpinner.tsx
│   └── ErrorMessage.tsx
├── hooks/
│   └── useFetch.ts
├── lib/
│   └── api.ts
└── .env.local
```

---

## Step 1 — Setup Project

```bash
npx create-next-app@latest belajar-api
cd belajar-api
npm run dev
```

Pilihan saat setup:
- TypeScript → **Yes**
- ESLint → **Yes**
- Tailwind CSS → **Yes**
- `src/` directory → **No**
- App Router → **Yes**
- Customize import alias → **No**

API yang dipakai: [https://jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com)

---

## Step 2 — Fetch Data di Server Component

Fetch terjadi di server, tidak perlu `useEffect`. Cocok untuk halaman yang butuh SEO.

```tsx
// app/posts/page.tsx
export default async function PostsPage() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  const posts = await res.json()

  return (
    <main>
      {posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </main>
  )
}
```

---

## Step 3 — Dynamic Routing

Buat folder `[id]` untuk URL dinamis seperti `/posts/1`, `/posts/2`, dst.

```
app/posts/[id]/page.tsx → route: /posts/:id
```

```tsx
// app/posts/[id]/page.tsx
// PENTING: di Next.js 15, params harus di-await
export default async function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
  const post = await res.json()

  return <div>{post.title}</div>
}
```

> **Catatan Next.js 15:** Type `params` harus `Promise<{ id: string }>` dan wajib di-`await`.

---

## Step 4 — Client Component: useEffect + useState + Search

Gunakan `'use client'` untuk komponen yang butuh interaksi user (input, button, dll).

```tsx
'use client'

import { useEffect, useState } from 'react'

export default function SearchPage() {
  const [posts, setPosts] = useState([])
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {       // async di dalam useEffect
      const res = await fetch('...')
      const data = await res.json()
      setPosts(data)
      setLoading(false)
    }
    fetchData()
  }, []) // [] = hanya fetch sekali saat komponen mount

  const filtered = posts.filter((post) =>
    post.title.toLowerCase().includes(keyword.toLowerCase())
  )

  return (
    <input
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
    />
  )
}
```

> **Perbedaan Server vs Client Component:**
> | Server Component | Client Component |
> |---|---|
> | Fetch langsung (async/await) | Fetch di dalam `useEffect` |
> | Tidak ada interaksi | Bisa handle input, click, dll |
> | SEO friendly | Lebih fleksibel untuk UI dinamis |
> | Tidak perlu `'use client'` | Wajib tulis `'use client'` di atas |
> | Tidak bisa async di Next.js 15 client | — |

---

## Step 5 — POST Request

Kirim data ke API menggunakan `method: 'POST'`.

```tsx
const handleSubmit = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // wajib kasih tau API kita kirim JSON
    },
    body: JSON.stringify({ title, body, userId: 1 }), // object → JSON string
  })

  const data = await res.json()
}
```

> **GET vs POST:**
> | GET | POST |
> |---|---|
> | Ambil data | Kirim data |
> | Tidak ada body | Ada body (payload) |
> | `fetch(url)` | `fetch(url, { method, headers, body })` |

---

## Step 6 — Error Handling yang Proper

Gunakan `try/catch/finally` untuk handle semua kondisi.

```tsx
const fetchData = async () => {
  try {
    setLoading(true)
    setError(null)

    const res = await fetch(url)

    if (!res.ok) {
      throw new Error(`Gagal fetch. Status: ${res.status}`)
    }

    const data = await res.json()
    setData(data)
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message)
    } else {
      setError('Terjadi kesalahan yang tidak diketahui')
    }
  } finally {
    setLoading(false) // selalu jalan, sukses atau gagal
  }
}
```

> **4 kondisi yang harus di-handle:**
> 1. `loading` → data masih di-fetch
> 2. `error` → fetch gagal / API down
> 3. `empty` → data kosong
> 4. `success` → data berhasil dimuat

---

## Step 7 — Custom Hook: `useFetch`

Rapiin logika fetch yang berulang ke dalam satu hook yang bisa dipakai ulang.

```ts
// hooks/useFetch.ts
import { useEffect, useState } from 'react'

type FetchState<T> = {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useFetch<T>(endpoint: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [trigger, setTrigger] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(endpoint)
        if (!res.ok) throw new Error(`Status: ${res.status}`)
        const result: T = await res.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [endpoint, trigger])

  const refetch = () => setTrigger((prev) => prev + 1)

  return { data, loading, error, refetch }
}
```

Cara pakai:

```tsx
// Sebelum: ~50 baris logika fetch
// Sesudah: 1 baris
const { data: users, loading, error, refetch } = useFetch<User[]>('/users')
```

> **TypeScript Generics `<T>`** memungkinkan hook yang sama dipakai untuk tipe data berbeda:
> ```ts
> useFetch<Post[]>('/posts')   // data bertipe Post[]
> useFetch<User[]>('/users')   // data bertipe User[]
> useFetch<Album[]>('/albums') // data bertipe Album[]
> ```

---

## Step 8 — Environment Variable

Simpan base URL API di satu tempat, tidak hardcode di tiap file.

**`.env.local`**
```
NEXT_PUBLIC_API_URL=https://jsonplaceholder.typicode.com
```

**`lib/api.ts`**
```ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL

if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL belum diset di .env.local')
}

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    const res = await fetch(`${BASE_URL}${endpoint}`)
    if (!res.ok) throw new Error(`Gagal fetch ${endpoint}. Status: ${res.status}`)
    return res.json()
  },

  post: async <T>(endpoint: string, body: unknown): Promise<T> => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`Gagal post ${endpoint}. Status: ${res.status}`)
    return res.json()
  },
}
```

Cara pakai:
```ts
const posts = await api.get<Post[]>('/posts')
const newPost = await api.post<Post>('/posts', { title, body, userId: 1 })
```

> **Dua jenis env variable di Next.js:**
> | Prefix | Bisa diakses di |
> |---|---|
> | `NEXT_PUBLIC_xxx` | Browser (client) + Server |
> | Tanpa prefix | Server only |
>
> Karena kita pakai di Client Component → wajib `NEXT_PUBLIC_`.
>
> **Wajib restart dev server** setiap kali ubah `.env.local`:
> ```bash
> npm run dev
> ```

---

## Step 9 — Reusable Components

Pisahkan UI yang berulang ke dalam komponen tersendiri.

**`components/LoadingSpinner.tsx`**
```tsx
export default function LoadingSpinner({ count = 5 }: { count?: number }) {
  return (
    <div className="grid gap-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="border p-4 rounded-lg animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-2/3" />
        </div>
      ))}
    </div>
  )
}
```

**`components/ErrorMessage.tsx`**
```tsx
type Props = {
  message: string
  onRetry?: () => void
}

export default function ErrorMessage({ message, onRetry }: Props) {
  return (
    <div className="text-center py-12">
      <p className="text-red-500 font-semibold mb-2">⚠ Terjadi Error</p>
      <p className="text-gray-500 text-sm mb-6">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="bg-blue-500 text-white px-6 py-2 rounded-lg">
          Coba Lagi
        </button>
      )}
    </div>
  )
}
```

Cara pakai:
```tsx
if (loading) return <LoadingSpinner count={6} />
if (error) return <ErrorMessage message={error} onRetry={refetch} />
```

---

## Step 10 — Wrap Up

Semua halaman tersambung lewat navigasi di `app/page.tsx`. Struktur final sudah rapi dengan pemisahan tanggung jawab yang jelas:

| File/Folder | Tanggung Jawab |
|---|---|
| `.env.local` | Konfigurasi URL API |
| `lib/api.ts` | Semua logika HTTP request |
| `hooks/useFetch.ts` | State management untuk fetching |
| `components/` | UI reusable (loading, error) |
| `app/` | Halaman & routing, fokus ke UI |

---

