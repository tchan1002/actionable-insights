"use client";
import { useState } from "react";
import { toFrontmatter } from "@/lib/yaml";

const tabs = ["YAML", "Nudge", "Saved", "JSON"] as const;
type Tab = (typeof tabs)[number];

type ExtractResult = {
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
};

export default function InsightsPage() {
  const [md, setMd] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("YAML");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExtractResult | null>(null);

  const yaml = result ? toFrontmatter(result) : "";

  async function handleGenerate(): Promise<void> {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ journal: md }),
      });
      if (!res.ok) throw new Error("request failed");
      const json = (await res.json()) as ExtractResult;
      setResult(json);
    } catch {
      setError("Failed to generate insights");
    } finally {
      setLoading(false);
    }
  }

  const copyYaml = (): void => {
    if (yaml) navigator.clipboard.writeText(yaml); // comment: use clipboard API to copy
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 md:p-8">
      <div className="flex flex-1 flex-col gap-4">
        <textarea
          className="w-full h-96 p-2 border rounded"
          placeholder="Paste Obsidian markdown here..."
          value={md}
          onChange={(e) => setMd(e.target.value)}
        />
        <button
          type="button"
          className="self-start px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          onClick={handleGenerate}
          disabled={loading || !md}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-3 py-2 text-sm ${
                activeTab === tab
                  ? "border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="p-4 text-sm text-gray-500">
          {activeTab === "YAML" && (
            <div className="flex flex-col gap-2">
              <pre className="whitespace-pre-wrap">{yaml}</pre>
              <button
                type="button"
                className="self-start px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                onClick={copyYaml}
                disabled={!yaml}
              >
                Copy YAML
              </button>
            </div>
          )}
          {activeTab === "Nudge" && (
            <pre className="whitespace-pre-wrap">{result?.nudge ?? ""}</pre>
          )}
          {activeTab === "Saved" && (
            <pre className="whitespace-pre-wrap">
              {result ? JSON.stringify(result.saved, null, 2) : ""}
            </pre>
          )}
          {activeTab === "JSON" && (
            <pre className="whitespace-pre-wrap">
              {result ? JSON.stringify(result, null, 2) : ""}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

