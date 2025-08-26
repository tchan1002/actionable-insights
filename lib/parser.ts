/**
 * Tiny helper to deduplicate strings. Optionally skips dedupe for long items.
 */
function uniq(items: string[], maxLen = Infinity): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of items) {
    const item = raw.trim();
    if (!item) continue;
    if (item.length > maxLen || !seen.has(item)) {
      if (item.length <= maxLen) seen.add(item);
      out.push(item);
    }
  }
  return out;
}

/**
 * Extract [[wikilinks]] from markdown.
 * Preserves case, trims spaces and removes duplicates.
 */
export function harvestTags(md: string): string[] {
  const tags: string[] = [];
  const re = /\[\[([^\[\]]+)\]\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md))) {
    tags.push(m[1].trim());
  }
  return uniq(tags);
}

/**
 * Parse task checklists from markdown into done/todo arrays.
 */
export function parseTasks(md: string): { done: string[]; todo: string[] } {
  const done: string[] = [];
  const todo: string[] = [];
  for (const line of md.split(/\r?\n/)) {
    const d = line.match(/^\s*-\s*\[(x|X)\]\s+(.*)$/);
    if (d) {
      done.push(d[2].trim());
      continue;
    }
    const t = line.match(/^\s*-\s*\[\s?\]\s+(.*)$/);
    if (t) todo.push(t[1].trim());
  }
  return { done, todo };
}

/**
 * Detect saved items like songs, stories, ideas and quotes.
 */
export function detectSaved(md: string): {
  songs: string[];
  story_ideas: string[];
  product_ideas: string[];
  quotes: string[];
} {
  const songs: string[] = [];
  const story: string[] = [];
  const product: string[] = [];
  const quotes: string[] = [];
  const lines = md.split(/\r?\n/);
  const qre = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;

  for (const raw of lines) {
    const line = raw.trim();
    if (/^song:/i.test(line)) songs.push(line.replace(/^song:/i, "").trim());
    if (/^story:/i.test(line)) story.push(line.replace(/^story:/i, "").trim());
    if (/^(idea|product):/i.test(line))
      product.push(line.replace(/^(idea|product):/i, "").trim());
    if (/^quote:/i.test(line)) quotes.push(line.replace(/^quote:/i, "").trim());
    let m: RegExpExecArray | null;
    while ((m = qre.exec(line))) {
      quotes.push(m[1].trim());
    }
  }

  return {
    songs: uniq(songs, 100),
    story_ideas: uniq(story, 100),
    product_ideas: uniq(product, 100),
    quotes: uniq(quotes, 200),
  };
}
