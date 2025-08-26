import { NextRequest, NextResponse } from "next/server";

type Doc = {
  yaml: {
    date: string | null;
    location: string | null;
    tags: string[];
    tasks: { done: string[]; todo: string[] };
    keystone_pattern: string | null;
    productivity_score: "low" | "med" | "high" | null;
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
  aligned_goals?: string[];
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<Doc> | null;

    if (!body || typeof body !== "object" || !("yaml" in body) || !("analysis" in body) || !("saved" in body)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const hasKey = Boolean(process.env.OPENAI_API_KEY);

    // Dummy behavior: if no key, return the doc unchanged but ensure `nudge` has a helpful placeholder.
    const doc: Doc = {
      ...(body as Doc),
      nudge:
        (body as Doc).nudge && (body as Doc).nudge.trim().length > 0
          ? (body as Doc).nudge
          : hasKey
          ? "" // later folds will fill this when LLM enabled
          : "Add your OpenAI key to enable nudges.",
    };

    return NextResponse.json(doc);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

