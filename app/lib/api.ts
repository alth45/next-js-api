const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
if (!BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
}
export const api = {
    get: async <T>(endpoint: string): Promise<T> => {
        const res = await fetch(`${BASE_URL}${endpoint}`);
        if (!res.ok) {
            throw new Error(`Gagal fetch ${endpoint}. Status: ${res.status}`)
        }
        return res.json();
    },
    post: async <T>(endpoint: string, data: any): Promise<T> => {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            throw new Error(`Gagal fetch ${endpoint}. Status: ${res.status}`)
        }
        return res.json();
    }
}