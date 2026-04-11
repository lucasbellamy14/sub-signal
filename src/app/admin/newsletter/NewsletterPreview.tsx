"use client";

import { useState } from "react";
import type { Artist } from "@/lib/artists";

interface NewsletterPreviewProps {
  artists: Artist[];
}

/**
 * Generates an HTML email template for a selected artist.
 *
 * The email is styled inline (no external CSS) because most email
 * clients don't support <style> tags or external stylesheets.
 * Everything uses inline styles for maximum compatibility.
 */
function generateEmailHTML(artist: Artist): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sub Signal — ${artist.name}</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0f;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:0 0 30px 0;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#00e5a0;font-size:18px;font-weight:bold;letter-spacing:-0.5px;">
                    ▊▊▊▊ Sub Signal
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- New Signal Badge -->
          <tr>
            <td style="padding:0 0 16px 0;">
              <span style="font-size:10px;color:#00e5a0;text-transform:uppercase;letter-spacing:3px;">
                ● New Signal — ${artist.week}
              </span>
            </td>
          </tr>

          <!-- Artist Name -->
          <tr>
            <td style="padding:0 0 8px 0;">
              <h1 style="margin:0;font-size:42px;font-weight:800;color:#e0e0e0;line-height:1;">
                ${artist.name}
              </h1>
            </td>
          </tr>

          <!-- Role -->
          <tr>
            <td style="padding:0 0 24px 0;">
              <p style="margin:0;font-size:13px;color:#8888a0;text-transform:uppercase;letter-spacing:3px;">
                ${artist.role}
              </p>
            </td>
          </tr>

          <!-- Stats -->
          <tr>
            <td style="padding:0 0 30px 0;">
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="background-color:#12121a;border:1px solid #1e1e2e;border-radius:8px;padding:16px;width:48%;">
                    <p style="margin:0 0 4px 0;font-size:10px;color:#8888a0;text-transform:uppercase;letter-spacing:2px;">Monthly Listeners</p>
                    <p style="margin:0;font-size:24px;font-weight:700;color:#00e5a0;">${artist.monthlyListeners}</p>
                  </td>
                  <td style="width:4%;"></td>
                  <td style="background-color:#12121a;border:1px solid #1e1e2e;border-radius:8px;padding:16px;width:48%;">
                    <p style="margin:0 0 4px 0;font-size:10px;color:#8888a0;text-transform:uppercase;letter-spacing:2px;">IG Followers</p>
                    <p style="margin:0;font-size:24px;font-weight:700;color:#e0e0e0;">${artist.igFollowers}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Notable -->
          <tr>
            <td style="padding:0 0 30px 0;">
              <p style="margin:0;font-size:16px;color:#a0a0b8;line-height:1.6;">
                ${artist.notable}
              </p>
            </td>
          </tr>

          <!-- Origin Hook -->
          <tr>
            <td style="padding:0 0 30px 0;">
              <div style="border-left:3px solid #00e5a0;padding-left:20px;">
                <p style="margin:0;font-size:15px;color:#a0a0b8;line-height:1.7;font-style:italic;">
                  "${artist.originHook}"
                </p>
              </div>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding:0 0 40px 0;">
              <a href="https://subsignal.com/artist/${artist.slug}" style="display:inline-block;background-color:#00e5a0;color:#0a0a0f;font-weight:700;font-size:14px;text-decoration:none;padding:14px 32px;border-radius:8px;">
                Read Their Full Story →
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 0 24px 0;">
              <div style="height:1px;background-color:#1e1e2e;"></div>
            </td>
          </tr>

          <!-- Genre Tags -->
          <tr>
            <td style="padding:0 0 30px 0;">
              ${artist.genre.map(g => `<span style="display:inline-block;font-size:11px;color:#00e5a0;border:1px solid #00e5a040;border-radius:20px;padding:4px 12px;margin-right:6px;margin-bottom:6px;">${g}</span>`).join("")}
              ${artist.mood.map(m => `<span style="display:inline-block;font-size:11px;color:#8888a0;border:1px solid #1e1e2e;border-radius:20px;padding:4px 12px;margin-right:6px;margin-bottom:6px;">${m}</span>`).join("")}
            </td>
          </tr>

          <!-- Social Links -->
          <tr>
            <td style="padding:0 0 30px 0;">
              <p style="margin:0 0 12px 0;font-size:10px;color:#8888a0;text-transform:uppercase;letter-spacing:2px;">Connect</p>
              ${artist.social.spotify ? `<a href="${artist.social.spotify}" style="color:#00e5a0;font-size:13px;text-decoration:none;margin-right:20px;">Spotify</a>` : ""}
              ${artist.social.instagram ? `<a href="${artist.social.instagram}" style="color:#00e5a0;font-size:13px;text-decoration:none;margin-right:20px;">Instagram</a>` : ""}
              ${artist.social.tiktok ? `<a href="${artist.social.tiktok}" style="color:#00e5a0;font-size:13px;text-decoration:none;">TikTok</a>` : ""}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 0 0 0;border-top:1px solid #1e1e2e;">
              <p style="margin:0;font-size:11px;color:#8888a060;">
                Sub Signal — Spotlighting artists before they break through
              </p>
              <p style="margin:8px 0 0 0;font-size:10px;color:#8888a040;">
                You're receiving this because you subscribed at subsignal.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default function NewsletterPreview({ artists }: NewsletterPreviewProps) {
  const [selectedSlug, setSelectedSlug] = useState(
    artists.find((a) => a.featured)?.slug || artists[0]?.slug || ""
  );
  const [copied, setCopied] = useState(false);

  const artist = artists.find((a) => a.slug === selectedSlug);
  const emailHTML = artist ? generateEmailHTML(artist) : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(emailHTML);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              {a.name} {a.featured ? "(Featured)" : ""}
            </option>
          ))}
        </select>

        <button
          onClick={handleCopy}
          className="bg-accent text-bg font-heading font-700 px-6 py-3 rounded-lg hover:shadow-[0_0_20px_#00e5a040] hover:scale-105 transition-all duration-300 whitespace-nowrap"
        >
          {copied ? "Copied!" : "Copy HTML to Clipboard"}
        </button>
      </div>

      {/* Email preview */}
      <div className="border border-border rounded-xl overflow-hidden">
        <p className="font-mono text-[10px] uppercase tracking-wider text-text-secondary px-4 py-2 border-b border-border bg-card/50">
          Email Preview
        </p>
        <div className="bg-[#0a0a0f]">
          {artist && (
            <div
              dangerouslySetInnerHTML={{ __html: emailHTML }}
              className="max-w-[600px] mx-auto"
            />
          )}
        </div>
      </div>

      {/* Raw HTML (collapsed) */}
      <details className="mt-6">
        <summary className="font-mono text-xs text-text-secondary cursor-pointer hover:text-accent transition-colors">
          View raw HTML
        </summary>
        <pre className="mt-4 bg-card border border-border rounded-lg p-4 overflow-auto text-xs text-text-secondary font-mono max-h-96">
          {emailHTML}
        </pre>
      </details>
    </div>
  );
}
