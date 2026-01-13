import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectViewer from "@/app/components/ProjectViewer";

// Force dynamic rendering
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ project: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const { project } = await params;
  const projectPath = path.join(process.cwd(), "public", "projects", project);

  // Check if project folder exists
  if (!fs.existsSync(projectPath)) {
    notFound();
  }

  // Check if index.html exists in the project folder
  const indexPath = path.join(projectPath, "index.html");
  if (fs.existsSync(indexPath)) {
    // Render in the ProjectViewer with device mockup options
    return (
      <ProjectViewer
        projectName={project}
        projectUrl={`/projects/${project}/index.html`}
      />
    );
  }

  // If no index.html, show project contents
  const files = fs.readdirSync(projectPath);

  return (
    <main className="min-h-screen py-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-800 transition-colors mb-8"
        >
          ← Back
        </Link>

        {/* Header */}
        <header className="mb-10">
          <h1 className="text-2xl font-semibold text-neutral-900 capitalize">
            {project.replace(/-/g, " ")}
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            /projects/{project}
          </p>
        </header>

        {/* Files */}
        <section className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-neutral-100 bg-neutral-50">
            <h2 className="text-sm font-medium text-neutral-600">
              Files ({files.length})
            </h2>
          </div>

          {files.length === 0 ? (
            <div className="p-6 text-center text-neutral-400">
              No files yet
            </div>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {files.map((file) => (
                <li key={file}>
                  <a
                    href={`/projects/${project}/${file}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors"
                  >
                    <span className="text-neutral-300">📄</span>
                    <span className="text-neutral-700">{file}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Tip */}
        <p className="mt-6 text-neutral-400 text-sm">
          Tip: Add an <code className="font-mono bg-neutral-100 px-1 rounded">index.html</code> to auto-redirect
        </p>
      </div>
    </main>
  );
}
