import { cypherRecipes } from "@/data/placeholder";
import { Terminal } from "lucide-react";

const categoryColors: Record<string, string> = {
  orientation: "bg-blue-500/10 text-blue-400",
  code: "bg-purple-500/10 text-purple-400",
  "blast-radius": "bg-red-500/10 text-red-400",
  sql: "bg-orange-500/10 text-orange-400",
  dependencies: "bg-cyan-500/10 text-cyan-400",
};

export default function QueriesPage() {
  const categories = [...new Set(cypherRecipes.map((r) => r.category))];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Query Playground</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Ready-to-use Cypher queries for your Neo4j knowledge graph.
          Replace the <code className="text-xs bg-[var(--bg-card)] px-1 py-0.5 rounded">{"{{PLACEHOLDERS}}"}</code> with your actual values.
        </p>
      </div>

      {categories.map((cat) => (
        <div key={cat}>
          <h2 className="text-lg font-semibold capitalize mb-4">
            {cat.replace("-", " ")}
          </h2>
          <div className="space-y-4">
            {cypherRecipes
              .filter((r) => r.category === cat)
              .map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden"
                >
                  <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Terminal className="w-4 h-4 text-[var(--accent)]" />
                      <span className="font-medium text-sm">{recipe.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ${categoryColors[recipe.category] || ""}`}>
                        {recipe.category}
                      </span>
                    </div>
                  </div>

                  <p className="px-5 py-3 text-xs text-[var(--text-muted)] border-b border-[var(--border)]/50">
                    {recipe.description}
                  </p>

                  {/* Query */}
                  <pre className="px-5 py-4 text-xs font-mono overflow-x-auto text-[var(--accent)] bg-[var(--bg)] leading-relaxed">
                    {recipe.query}
                  </pre>

                  {/* Placeholders */}
                  {recipe.placeholders.length > 0 && (
                    <div className="px-5 py-3 border-t border-[var(--border)]/50">
                      <div className="text-xs text-[var(--text-muted)] mb-2">
                        Placeholders — replace these with your values:
                      </div>
                      <div className="space-y-1.5">
                        {recipe.placeholders.map((p) => (
                          <div key={p.key} className="flex items-center gap-3 text-xs">
                            <code className="text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded">
                              {`{{${p.key}}}`}
                            </code>
                            <span className="text-[var(--text-muted)]">{p.description}</span>
                            <span className="text-[var(--text-muted)]">→</span>
                            <code className="text-green-400 bg-green-500/10 px-2 py-0.5 rounded">
                              {p.example}
                            </code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
