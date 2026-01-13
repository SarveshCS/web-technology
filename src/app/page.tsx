import fs from "fs";
import path from "path";
import ProjectList from "./components/ProjectList";

// Force dynamic rendering so new folders are picked up immediately
export const dynamic = "force-dynamic";

// Get all project folders from /public/projects
function getProjects(): string[] {
  const projectsDir = path.join(process.cwd(), "public", "projects");

  if (!fs.existsSync(projectsDir)) {
    fs.mkdirSync(projectsDir, { recursive: true });
    return [];
  }

  const items = fs.readdirSync(projectsDir, { withFileTypes: true });
  return items
    .filter((item) => item.isDirectory())
    .map((item) => item.name)
    .sort();
}

export default function Home() {
  const projects = getProjects();

  return (
    <main className="min-h-screen py-10 px-5">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-xl font-semibold text-neutral-900">
            Web Technology
          </h1>
          <p className="text-neutral-400 text-sm">
            SEM 4 · HTML, CSS & JS
          </p>
        </header>

        {/* Projects */}
        <ProjectList projects={projects} />

        {/* Footer */}
        <footer className="mt-10 pt-4 border-t border-neutral-100">
          <a
            href="https://sarveshmishra.me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-neutral-600 transition-colors text-xs"
          >
            sarveshmishra.me
          </a>
        </footer>
      </div>
    </main>
  );
}
