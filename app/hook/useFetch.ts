import { useEffect, useState } from "react";
import { api } from "../lib/api";

type FetchState<T> = {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export default function useFetch<T>(endpoint: string): FetchState<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [trigger, setTrigger] = useState<number>(0);

    useEffect(() => {
        const fetcData = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await api.get<T>(endpoint);
                setData(res);
                // setLoading(false);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
                setLoading(false);
            } finally {
                setLoading(false);
            }
        }
        fetcData();
    }, [endpoint, trigger])

    const refetch = () => {
        setTrigger((prev) => prev + 1);
    }

    return { data, loading, error, refetch };
}