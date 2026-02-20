import Link from 'next/link'
import { api } from '@/lib/api'

type Post = {
    id: number
    userId: number
    title: string
    body: string
}

export default async function PostsPage() {
    const posts = await api.get<Post[]>('/posts')

    return (
        <main className="p-8 max-w-3xl mx-auto">
            <a href="/" className="text-blue-500 hover:underline text-sm">← Kembali</a>
            <h1 className="text-2xl font-bold mt-4 mb-6">Daftar Posts</h1>

            <div className="grid gap-4">
                {posts.map((post: Post) => (
                    <Link href={`/posts/${post.id}`} key={post.id}>
                        <div className="border p-4 rounded-lg shadow hover:bg-gray-50 transition cursor-pointer">
                            <p className="text-sm text-gray-400">Post #{post.id}</p>
                            <h2 className="text-lg font-semibold capitalize">{post.title}</h2>
                            <p className="text-gray-500 mt-1 text-sm line-clamp-2">{post.body}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    )
}