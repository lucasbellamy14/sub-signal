/**
 * Form submission, shared by the newsletter, Submit and Contact forms.
 *
 * Posts to a Formspree form (https://formspree.io — free tier, no backend needed).
 * Set this in Vercel (Project → Settings → Environment Variables) and in .env.local:
 *
 *   NEXT_PUBLIC_FORM_URL=https://formspree.io/f/yourFormId
 *
 * Until that's set, forms say they aren't connected rather than pretending to
 * work. Every submission carries a `form` field ("newsletter" | "submit" |
 * "contact") so one Formspree form can serve all three.
 */
export const FORM_URL = process.env.NEXT_PUBLIC_FORM_URL || "";

export const formsConfigured = FORM_URL.length > 0;

export type FormKind = "newsletter" | "submit" | "contact";

export async function postForm(
  kind: FormKind,
  fields: Record<string, string>,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!formsConfigured) return { ok: false, error: "not-configured" };
  try {
    const res = await fetch(FORM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ form: kind, _subject: `Sub Signal — ${kind}`, ...fields }),
    });
    if (res.ok) return { ok: true };
    const data = await res.json().catch(() => ({}));
    const msg = Array.isArray(data?.errors) ? data.errors.map((e: { message: string }) => e.message).join(", ") : "";
    return { ok: false, error: msg || "Something went wrong. Please try again." };
  } catch {
    return { ok: false, error: "Could not connect. Check your connection and try again." };
  }
}

/** Shown in place of a form when NEXT_PUBLIC_FORM_URL isn't set. */
export const NOT_CONNECTED_MESSAGE = "This form isn't switched on yet — please check back soon.";
