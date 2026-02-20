'use client'

import { useState } from "react";
import { api } from "../lib/api";

type NewPost = {
    title: string;
    body: string;
    userId: number;
}

type CreatedPost = NewPost & { id: number };

export default function CreatePage() {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [result, setResult] = useState<CreatedPost | null>(null);
    const [loading, setLoading] = useState(false);


    const handleSubmit = async () => {
        if (!title || !body) return alert("Title dan body wajib di isi");

        setLoading(true);
        const payLoad: NewPost = {
            title,
            body,
            userId: 1
        }
        const res = await fetch('/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payLoad)
        })
        const data: CreatedPost = await res.json();
        setResult(data);
        setLoading(false);


    }

    return (
        <main className="p-8 max-w-xl mx-auto">
            <a href="/" className="text-blue-500 hover:underline text-sm">← Kembali</a>

            <h1 className="text-2xl font-bold mt-4 mb-6">Buat Post Baru</h1>

            <div className="grid gap-4">
                <div>
                    <label className="text-sm text-gray-500 block mb-1">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Judul post..."
                        className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-500 block mb-1">Body</label>
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Isi post..."
                        rows={4}
                        className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                >
                    {loading ? 'Mengirim...' : 'Kirim Post'}
                </button>
            </div>

            {/* Tampilkan response dari API */}
            {result && (
                <div className="mt-8 border p-4 rounded-lg bg-green-50">
                    <p className="text-green-600 font-semibold mb-2">✓ Post berhasil dibuat!</p>
                    <p className="text-sm text-gray-500">ID yang diterima: <span className="font-bold">{result.id}</span></p>
                    <p className="text-sm text-gray-500">Title: {result.title}</p>
                    <p className="text-sm text-gray-500">Body: {result.body}</p>
                </div>
            )}
        </main>
    )


}