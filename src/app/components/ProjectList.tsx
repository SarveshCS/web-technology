"use client";

import { useState } from "react";
import Link from "next/link";

const PROJECTS_PER_PAGE = 10;

interface ProjectListProps {
  projects: string[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = projects.filter((p) =>
    p.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PROJECTS_PER_PAGE);
  const startIndex = (page - 1) * PROJECTS_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + PROJECTS_PER_PAGE);

  // Reset to page 1 when search changes
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <>
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white placeholder-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors"
        />
      </div>

      {/* Count & Page Info */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-neutral-400">
          {filtered.length} project{filtered.length !== 1 ? "s" : ""}
          {search && ` matching "${search}"`}
        </p>
        {totalPages > 1 && (
          <p className="text-xs text-neutral-400">
            Page {page} of {totalPages}
          </p>
        )}
      </div>

      {/* List */}
      {paginated.length === 0 ? (
        <div className="border border-dashed border-neutral-200 rounded-lg py-8 text-center">
          <p className="text-neutral-400 text-sm">
            {projects.length === 0 ? "No projects yet" : "No matches found"}
          </p>
        </div>
      ) : (
        <ul className="space-y-1">
          {paginated.map((project) => (
            <li key={project}>
              <Link
                href={`/projects/${project}`}
                className="flex items-center justify-between px-3 py-2.5 bg-white border border-neutral-200 rounded-lg hover:border-neutral-400 transition-colors group"
              >
                <span className="text-sm font-medium text-neutral-700 capitalize">
                  {project.replace(/-/g, " ")}
                </span>
                <span className="text-neutral-300 group-hover:text-neutral-500 transition-colors text-sm">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-xs border border-neutral-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:border-neutral-400 transition-colors"
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 text-xs rounded-lg transition-colors ${
                p === page
                  ? "bg-neutral-900 text-white"
                  : "border border-neutral-200 hover:border-neutral-400"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-xs border border-neutral-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:border-neutral-400 transition-colors"
          >
            →
          </button>
        </div>
      )}
    </>
  );
}
