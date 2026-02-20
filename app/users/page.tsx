'use client'

import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { api } from "../lib/api";
import useFetch from "../hook/useFetch";


type Users = {
    id: number;
    name: string;
    email: string;
    phone: string;
    website: string;
    company: {
        name: string;
    }
    address: {
        city: string;
    }
}
export default function UsersPage() {
    const [users, setUsers] = useState<Users[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const fetchUser = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data: users, loading, error, refetch } = useFetch<Users[]>('/users')

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Terjadi kesalahan yang tidak dikeatahui');
            }
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchUser();
    }, []);

    // --- Render kondisi loading ---
    if (loading) {
        return (
            <main className="p-8">
                <LoadingSpinner />
            </main>
        )
    }

    // --- Render kondisi error ---
    if (error) {
        return (
            <main className="p-8 max-w-xl mx-auto text-center">
                <ErrorMessage message={error} onRetry={fetchUser} />
            </main >
        )
    }

    // --- Render kondisi error ---
    if (error) {
        return (
            <main className="p-8 max-w-xl mx-auto text-center">
                <p className="text-red-500 font-semibold text-lg mb-2">⚠ Terjadi Error</p>
                <p className="text-gray-500 text-sm mb-6">{error}</p>
                <button
                    onClick={fetchUser}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Coba Lagi
                </button>
            </main>
        )
    }

    // --- Render kondisi sukses ---
    return (
        <main className="p-8">
            <a href="/" className="text-blue-500 hover:underline text-sm">← Kembali</a>
            <h1 className="text-2xl font-bold mt-4 mb-6">Daftar Users</h1>

            <div className="grid gap-4 md:grid-cols-2">
                {users.map((user) => (
                    <div key={user.id} className="border p-4 rounded-lg shadow hover:bg-gray-50 transition">
                        <p className="font-bold text-lg">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-sm text-gray-500">{user.phone}</p>
                        <p className="text-sm text-gray-500">🏙 {user.address.city}</p>
                        <p className="text-sm text-gray-500 mt-2">🏢 {user.company.name}</p>
                    </div>
                ))}
            </div>
        </main>
    )


}