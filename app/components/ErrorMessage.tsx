type Props = {
    message: string;
    onRetry: () => void;
}

export default function ErrorMessage({ message, onRetry }: Props) {
    return (
        <div className="text-center py-12">
            <p className="text-4xl mb-4">⚠️</p>
            <p className="text-red-500 font-semibold text-lg mb-2">Terjadi Error</p>
            <p className="text-gray-500 text-sm mb-6">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Coba Lagi
                </button>
            )}
        </div>
    )
}