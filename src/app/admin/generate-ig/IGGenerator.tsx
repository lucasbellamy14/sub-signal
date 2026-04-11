"use client";

import { useState, useRef } from "react";
import type { Artist } from "@/lib/artists";
import html2canvas from "html2canvas";

interface IGGeneratorProps {
  artists: Artist[];
}

/**
 * The interactive part of the IG generator.
 *
 * How it works:
 * 1. You pick an artist from the dropdown
 * 2. A live preview shows what the IG post will look like (1080x1080)
 * 3. Click "Download" — html2canvas takes a screenshot of the preview
 *    div and turns it into a PNG image file that downloads to your computer
 */
export default function IGGenerator({ artists }: IGGeneratorProps) {
  const [selectedSlug, setSelectedSlug] = useState(artists[0]?.slug || "");
  const [downloading, setDownloading] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const artist = artists.find((a) => a.slug === selectedSlug);

  const handleDownload = async () => {
    if (!canvasRef.current || !artist) return;
    setDownloading(true);

    try {
      const canvas = await html2canvas(canvasRef.current, {
        width: 1080,
        height: 1080,
        scale: 1,
        backgroundColor: "#0a0a0f",
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = `sub-signal-${artist.slug}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
      alert("Error generating image. Try again.");
    }

    setDownloading(false);
  };

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <select
          value={selectedSlug}
          onChange={(e) => setSelectedSlug(e.target.value)}
          className="bg-card border border-border rounded-lg px-4 py-3 font-mono text-sm text-text-primary focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
        >
          {artists.map((a) => (
            <option key={a.slug} value={a.slug}>
              {a.name} — {a.role}
            </option>
          ))}
        </select>

        <button
          onClick={handleDownload}
          disabled={downloading || !artist}
          className="bg-accent text-bg font-heading font-700 px-6 py-3 rounded-lg hover:shadow-[0_0_20px_#00e5a040] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {downloading ? "Generating..." : "Download PNG"}
        </button>
      </div>

      {/* Live preview — scaled down to fit screen, but renders at 1080x1080 */}
      <div className="border border-border rounded-xl overflow-hidden">
        <p className="font-mono text-[10px] uppercase tracking-wider text-text-secondary px-4 py-2 border-b border-border bg-card/50">
          Preview (1080 × 1080)
        </p>
        <div className="overflow-auto bg-card/30 p-4">
          <div
            style={{
              width: "1080px",
              height: "1080px",
              transform: "scale(0.5)",
              transformOrigin: "top left",
              marginBottom: "-540px",
              marginRight: "-540px",
            }}
          >
            <div
              ref={canvasRef}
              style={{
                width: "1080px",
                height: "1080px",
                background: "linear-gradient(160deg, #12121a 0%, #0a0a0f 40%, #0a0e0d 100%)",
                position: "relative",
                overflow: "hidden",
                fontFamily: "'Syne', sans-serif",
              }}
            >
              {artist && (
                <>
                  {/* Subtle grid pattern */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: 0.03,
                      backgroundImage:
                        "linear-gradient(#00e5a0 1px, transparent 1px), linear-gradient(90deg, #00e5a0 1px, transparent 1px)",
                      backgroundSize: "60px 60px",
                    }}
                  />

                  {/* Accent glow top-right */}
                  <div
                    style={{
                      position: "absolute",
                      top: "-200px",
                      right: "-200px",
                      width: "600px",
                      height: "600px",
                      borderRadius: "50%",
                      background: "radial-gradient(circle, #00e5a008 0%, transparent 70%)",
                    }}
                  />

                  {/* Sub Signal logo + signal bars */}
                  <div
                    style={{
                      position: "absolute",
                      top: "60px",
                      left: "80px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "24px" }}>
                      <div style={{ width: "4px", height: "8px", background: "#00e5a0", borderRadius: "2px" }} />
                      <div style={{ width: "4px", height: "13px", background: "#00e5a0", borderRadius: "2px" }} />
                      <div style={{ width: "4px", height: "18px", background: "#00e5a0", borderRadius: "2px" }} />
                      <div style={{ width: "4px", height: "24px", background: "#00e5a0", borderRadius: "2px" }} />
                    </div>
                    <span
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 800,
                        fontSize: "22px",
                        color: "#e0e0e0",
                        letterSpacing: "-0.5px",
                      }}
                    >
                      Sub Signal
                    </span>
                  </div>

                  {/* "NEW SIGNAL" tag */}
                  <div
                    style={{
                      position: "absolute",
                      top: "64px",
                      right: "80px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#00e5a0",
                        boxShadow: "0 0 12px #00e5a060",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "11px",
                        color: "#00e5a0",
                        textTransform: "uppercase",
                        letterSpacing: "3px",
                      }}
                    >
                      New Signal
                    </span>
                  </div>

                  {/* Main content — centered */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "80px",
                      right: "80px",
                      transform: "translateY(-50%)",
                    }}
                  >
                    {/* Genre tags */}
                    <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
                      {artist.genre.slice(0, 3).map((g) => (
                        <span
                          key={g}
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "11px",
                            color: "#00e5a0",
                            border: "1px solid #00e5a040",
                            borderRadius: "20px",
                            padding: "4px 14px",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                          }}
                        >
                          {g}
                        </span>
                      ))}
                    </div>

                    {/* Artist name */}
                    <h1
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 800,
                        fontSize: "82px",
                        color: "#e0e0e0",
                        lineHeight: 0.95,
                        marginBottom: "16px",
                        letterSpacing: "-2px",
                      }}
                    >
                      {artist.name}
                    </h1>

                    {/* Role */}
                    <p
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "16px",
                        color: "#8888a0",
                        textTransform: "uppercase",
                        letterSpacing: "4px",
                        marginBottom: "40px",
                      }}
                    >
                      {artist.role}
                    </p>

                    {/* Divider */}
                    <div
                      style={{
                        width: "60px",
                        height: "3px",
                        background: "#00e5a0",
                        marginBottom: "32px",
                        borderRadius: "2px",
                      }}
                    />

                    {/* Origin hook */}
                    <p
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "17px",
                        color: "#a0a0b8",
                        lineHeight: 1.7,
                        fontStyle: "italic",
                        maxWidth: "700px",
                      }}
                    >
                      &ldquo;{artist.originHook}&rdquo;
                    </p>
                  </div>

                  {/* Bottom stats bar */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "60px",
                      left: "80px",
                      right: "80px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", gap: "40px" }}>
                      <div>
                        <p
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "10px",
                            color: "#8888a0",
                            textTransform: "uppercase",
                            letterSpacing: "2px",
                            marginBottom: "4px",
                          }}
                        >
                          Monthly Listeners
                        </p>
                        <p
                          style={{
                            fontFamily: "'Syne', sans-serif",
                            fontWeight: 700,
                            fontSize: "28px",
                            color: "#00e5a0",
                          }}
                        >
                          {artist.monthlyListeners}
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "10px",
                            color: "#8888a0",
                            textTransform: "uppercase",
                            letterSpacing: "2px",
                            marginBottom: "4px",
                          }}
                        >
                          IG Followers
                        </p>
                        <p
                          style={{
                            fontFamily: "'Syne', sans-serif",
                            fontWeight: 700,
                            fontSize: "28px",
                            color: "#e0e0e0",
                          }}
                        >
                          {artist.igFollowers}
                        </p>
                      </div>
                    </div>

                    <p
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "11px",
                        color: "#8888a060",
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                      }}
                    >
                      subsignal.com
                    </p>
                  </div>

                  {/* Green accent line at bottom */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: "linear-gradient(90deg, #00e5a0, #00e5a040, transparent)",
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
