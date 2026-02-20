'use client'

import useFetch from "../hook/useFetch";

type Album = {
    id: number;
    title: string;
    userId: number;
}
export default function AlbumsPage() {
    const { data: albums, loading, error, refetch } = useFetch<Album[]>('/albums');
    if (loading) {
        return (
            <main className="p-8">
                <div className="grid gap-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="border p-4 rounded-lg animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                        </div>
                    ))}
                </div>
            </main>
        )
    }

    if (error) {
        return (
            <main className="p-8 text-center">
                <p className="text-red-500 font-semibold mb-2">⚠ {error}</p>
                <button
                    onClick={refetch}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Coba Lagi
                </button>
            </main>
        )
    }

    return (
        <main className="p-8">
            <a href="/" className="text-blue-500 hover:underline text-sm">← Kembali</a>
            <h1 className="text-2xl font-bold mt-4 mb-6">Daftar Albums</h1>

            <div className="grid gap-3 md:grid-cols-2">
                {albums?.map((album) => (
                    <div key={album.id} className="border p-4 rounded-lg shadow hover:bg-gray-50 transition">
                        <p className="text-sm text-gray-400">Album #{album.id}</p>
                        <p className="font-semibold capitalize">{album.title}</p>
                        <p className="text-xs text-gray-400 mt-1">User ID: {album.userId}</p>
                    </div>
                ))}
            </div>
        </main>
    )
}