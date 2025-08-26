import { NextResponse } from 'next/server';
import { harvestTags, parseTasks, detectSaved } from '../../../lib/parser';

type ProductivityScore = 'low' | 'med' | 'high';

interface ExtractResponse {
  yaml: {
    date: string | null;
    location: string | null;
    tags: string[];
    tasks: { done: string[]; todo: string[] };
    keystone_pattern: string | null;
    productivity_score: ProductivityScore | null;
  };
  analysis: {
    meta: string[];
    mindset: string[];
    body: string[];
    action: { shipped: string[]; planned: string[] };
  };
  nudge: string;
  saved: {
    songs: string[];
    story_ideas: string[];
    product_ideas: string[];
    quotes: string[];
  };
}

export async function POST(req: Request): Promise<Response> {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Missing journal' }, { status: 400 });
  }

  if (!payload || typeof (payload as { journal?: unknown }).journal !== 'string') {
    // comment: guard against missing or non-string journal
    return NextResponse.json({ error: 'Missing journal' }, { status: 400 });
  }

  const journal = (payload as { journal: string }).journal;

  const tags = harvestTags(journal);
  const tasks = parseTasks(journal);
  const saved = detectSaved(journal);

  const data: ExtractResponse = {
    yaml: {
      date: null,
      location: null,
      tags,
      tasks,
      keystone_pattern: null,
      productivity_score: null,
    },
    analysis: {
      meta: [],
      mindset: [],
      body: [],
      action: { shipped: [], planned: [] },
    },
    nudge: '',
    saved,
  };

  return NextResponse.json(data);
}
