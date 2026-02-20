import Link from "next/link";

export default async function Home() {
  const data = await fetch('https://jsonplaceholder.typicode.com/posts');
  const result = await data.json();

  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Daftar Post</h1>

      <div className="flex flex-column-2 gap-4">
        <Link href="/search" className="text-white-500 hover:underline text-sm bg-blue-500 p-2 rounded-lg mb-3">Cari Post</Link>
        <Link href="/create" className="text-white-500 hover:underline text-sm bg-blue-500 p-2 rounded-lg mb-3">Buat Post</Link>
        <Link href="/users" className="text-white-500 hover:underline text-sm bg-blue-500 p-2 rounded-lg mb-3">Daftar Users</Link>
        <Link href="/albums" className="text-white-500 hover:underline text-sm bg-blue-500 p-2 rounded-lg mb-3">Daftar Albums</Link>
      </div>

      {/* Container Grid: Mengatur tampilan kolom */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {result.map((post: any) => (
          /* Card dimulai di sini */
          <div key={post.id} className="card bg-white shadow-xl border border-gray-200 rounded-lg p-6 flex flex-col justify-between">
            <div className="card-body">
              <h2 className="text-xl font-bold text-gray-800 capitalize mb-2">
                {post.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {post.body}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link href={`/post/${post.id}`} className="text-sm font-medium text-blue-600">Post ID: {post.id}</Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}