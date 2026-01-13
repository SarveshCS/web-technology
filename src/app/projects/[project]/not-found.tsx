import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-6xl mb-4">🔍</p>
        <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
          Project not found
        </h1>
        <p className="text-neutral-500 mb-8">
          This project doesn't exist or may have been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
        >
          ← Back to Projects
        </Link>
      </div>
    </main>
  );
}
