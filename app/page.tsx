"use client";

import { useState } from "react";
import ColorSwatch from "@/components/ColorSwatch";

type DesignResult = {
  theme: string;
  palette: string[];
  suggestions: string[];
  layout_tips: string[];
  image_prompt: string;
  budget_notes: string;
};

export default function Home() {
  const [roomType, setRoomType] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [vibe, setVibe] = useState("");
  const [colors, setColors] = useState("");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DesignResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/design", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ roomType, dimensions, vibe, colors, budget, notes })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Something went wrong");
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(String(err?.message || err));
    } finally {
      setLoading(false);
    }
  }

  function copyJSON() {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
  }

  return (
    <div className="grid gap-6">
      <section className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Describe Your Space</h2>
        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Room Type</label>
            <input className="input" placeholder="Living room, bedroom..." value={roomType} onChange={e => setRoomType(e.target.value)} />
          </div>
          <div>
            <label className="label">Dimensions</label>
            <input className="input" placeholder="12' x 15', 10ft ceiling..." value={dimensions} onChange={e => setDimensions(e.target.value)} />
          </div>
          <div>
            <label className="label">Desired Vibe</label>
            <input className="input" placeholder="Coastal, Japandi, Boho, Minimal..." value={vibe} onChange={e => setVibe(e.target.value)} />
          </div>
          <div>
            <label className="label">Color Preferences</label>
            <input className="input" placeholder="Whites, soft blues, natural wood..." value={colors} onChange={e => setColors(e.target.value)} />
          </div>
          <div>
            <label className="label">Budget</label>
            <input className="input" placeholder="$1,500" value={budget} onChange={e => setBudget(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Notes</label>
            <textarea className="textarea" rows={4} placeholder="Windows on south wall, keep existing sofa, pet-friendly materials..." value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

          <div className="md:col-span-2 flex items-center gap-3">
            <button className="button" disabled={loading}>
              {loading ? "Thinking..." : "Generate Design Plan"}
            </button>
            {error && <span className="text-sm text-red-600">{error}</span>}
          </div>
        </form>
      </section>

      {result && (
        <section className="card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">{result.theme}</h3>
              <p className="text-sm text-slate-600 mt-1">{result.budget_notes}</p>
            </div>
            <button className="button" onClick={copyJSON}>Copy JSON</button>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Palette</h4>
              <div className="grid grid-cols-2 gap-3">
                {result.palette.map((c) => (
                  <ColorSwatch key={c} color={c} />
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Layout Tips</h4>
              <ul className="list-disc pl-5 space-y-1">
                {result.layout_tips.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Suggestions</h4>
              <ul className="list-disc pl-5 space-y-1">
                {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Image Prompt</h4>
              <textarea className="textarea" rows={6} value={result.image_prompt} readOnly />
              <p className="text-xs text-slate-500 mt-2">Paste into your preferred image tool.</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
