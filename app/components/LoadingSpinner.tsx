type Props = {
    count?: number;
}


export default function LoadingSpinner({ count = 5 }: Props) {
    return (
        <div className="grid gap-4">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="border p-4 rounded-lg shadow animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-2/3 mb-1" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
            ))}
        </div>
    )
}