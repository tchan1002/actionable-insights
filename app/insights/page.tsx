import { useState } from "react";

const tabs = ["YAML", "Nudge", "Saved", "JSON"] as const;
type Tab = (typeof tabs)[number];

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("YAML");

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 md:p-8">
      <div className="flex flex-1 flex-col gap-4">
        <textarea
          className="w-full h-96 p-2 border rounded"
          placeholder="Paste Obsidian markdown here..."
        />
        <button
          type="button"
          className="self-start px-4 py-2 bg-blue-600 text-white rounded"
        >
          Generate
        </button>
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
          {activeTab} content goes here.
        </div>
      </div>
    </div>
  );
}

