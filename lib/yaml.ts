export function toFrontmatter(doc: {
  yaml: {
    date: string | null;
    location: string | null;
    tags: string[];
    tasks: { done: string[]; todo: string[] };
    keystone_pattern: string | null;
    productivity_score: "low" | "med" | "high" | null;
  };
}): string {
  const y = doc.yaml;
  const fmt = (v: string | null): string =>
    v !== null ? JSON.stringify(v) : "null"; // comment: use JSON.stringify to escape strings
  const arr = (a: string[]): string =>
    a.length ? `[${a.map((s) => JSON.stringify(s)).join(", ")}]` : "[]"; // comment: serialize arrays safely

  const lines = [
    "---",
    `date: ${fmt(y.date)}`,
    `location: ${fmt(y.location)}`,
    `tags: ${arr(y.tags)}`,
    "tasks:",
    `  done: ${arr(y.tasks.done)}`,
    `  todo: ${arr(y.tasks.todo)}`,
    `keystone_pattern: ${fmt(y.keystone_pattern)}`,
    `productivity_score: ${fmt(y.productivity_score)}`,
    "---",
  ];
  return lines.join("\n");
}
