'use client'

import { useEffect, useState } from "react";

type Post = {
    id: number;
    userId: number;
    title: string;
    body: string;
}
export default function SearchPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [keyword, setKeyword] = useState(' ');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts');
            const data = await response.json();
            setPosts(data);
            setLoading(false);
        }
        fetchData();
    }, []);

    const filtered = posts.filter(post => post.title.toLowerCase().includes(keyword.toLowerCase()));

    return (
        <main className="p-8">
            <a href="/" className="text-blue-500 hover:underline text-sm">← Kembali</a>

            <h1 className="text-2xl font-bold mt-4 mb-6">Search Posts</h1>

            <input
                type="text"
                placeholder="Cari judul post..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full border p-3 rounded-lg mb-6 outline-none focus:ring-2 focus:ring-blue-400"
            />

            {loading && <p className="text-gray-400">Loading...</p>}

            <p className="text-sm text-gray-400 mb-4">
                Menampilkan {filtered.length} post
            </p>

            <div className="grid gap-4">
                {filtered.map((post) => (
                    <a href={`/posts/${post.id}`} key={post.id}>
                        <div className="border p-4 rounded-lg shadow hover:bg-gray-50 transition cursor-pointer">
                            <p className="text-sm text-gray-400">Post #{post.id}</p>
                            <h2 className="text-lg font-semibold capitalize">{post.title}</h2>
                            <p className="text-gray-600 mt-1">{post.body}</p>
                        </div>
                    </a>
                ))}
            </div>
        </main>

    )



}