import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VideoEmbed from "@/components/VideoEmbed";
import { POSTS } from "@/data/interviews";
import { ARTISTS } from "@/data/artists";

export function generateStaticParams() {
  return POSTS.map((post) => ({ id: post.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const post = POSTS.find((p) => p.id === params.id);
  if (!post) return { title: "Not Found — Sub Signal" };
  return {
    title: post.title,
    openGraph: {
      title: `${post.title} — Sub Signal`,
      description: post.summary,
      type: "article",
    },
    twitter: {
      card: "summary_large_image" as const,
      title: `${post.title} — Sub Signal`,
      description: post.summary,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PostPage({ params }: { params: { id: string } }) {
  const post = POSTS.find((p) => p.id === params.id);
  if (!post) notFound();

  const artist = post.artistSlug
    ? ARTISTS.find((a) => a.slug === post.artistSlug)
    : null;

  const isInterview = post.type === "interview";

  return (
    <>
      <Header />

      <article
        style={{
          padding: "6rem 2rem 4rem",
          maxWidth: "720px",
          margin: "0 auto",
        }}
      >
        {/* Header treatment differs by type */}
        {isInterview ? (
          /* ── INTERVIEW HEADER ── */
          <>
            {/* Artist photo */}
            {post.imageUrl && (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxHeight: "400px",
                  overflow: "hidden",
                  marginBottom: "2rem",
                  borderRadius: "4px",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.imageUrl}
                  alt={artist?.name ?? post.title}
                  style={{
                    width: "100%",
                    height: "400px",
                    objectFit: "cover",
                    display: "block",
                    filter: "grayscale(30%) contrast(1.1)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 50%)",
                  }}
                />
                {artist && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "1.5rem",
                      left: "1.5rem",
                    }}
                  >
                    <Link
                      href={`/artists/${artist.slug}`}
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.6rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "#39ff5a",
                        textDecoration: "none",
                        borderBottom: "1px solid #1e4a28",
                        paddingBottom: "0.15rem",
                      }}
                    >
                      {artist.name}
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Interview badge + date */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1rem",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.55rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#39ff5a",
                  border: "1px solid #1e4a28",
                  padding: "0.2rem 0.5rem",
                }}
              >
                Interview
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#9a9a9a",
                }}
              >
                {formatDate(post.date)}
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
                textTransform: "uppercase",
                color: "#f0f0f0",
                lineHeight: 0.95,
                margin: "0 0 2rem",
              }}
            >
              {post.title}
            </h1>

            {/* Intro */}
            {post.intro && (
              <div
                style={{
                  borderLeft: "3px solid #39ff5a",
                  paddingLeft: "1.5rem",
                  marginBottom: "3rem",
                  background:
                    "linear-gradient(90deg, rgba(57,255,90,0.03) 0%, transparent 60%)",
                  padding: "1.25rem 1.5rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontStyle: "italic",
                    fontSize: "0.95rem",
                    color: "#999",
                    lineHeight: 1.8,
                    margin: 0,
                  }}
                >
                  {post.intro}
                </p>
              </div>
            )}

            {/* Video embed */}
            {post.videoUrl && (
              <div style={{ marginBottom: "3rem" }}>
                <VideoEmbed url={post.videoUrl} title={post.title} />
              </div>
            )}

            {/* Q&A Transcript */}
            {post.transcript && post.transcript.length > 0 && (
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "#9a9a9a",
                    borderBottom: "1px solid #1a1a1a",
                    paddingBottom: "1rem",
                    marginBottom: "2.5rem",
                  }}
                >
                  Transcript
                </div>

                {post.transcript.map((qa, i) => (
                  <div key={i} style={{ marginBottom: "2.5rem" }}>
                    {/* Question */}
                    <div
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: "0.6rem",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color: "#39ff5a",
                          flexShrink: 0,
                          paddingTop: "0.15rem",
                        }}
                      >
                        Q
                      </span>
                      <p
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          color: "#e8e8e8",
                          lineHeight: 1.5,
                          margin: 0,
                        }}
                      >
                        {qa.question}
                      </p>
                    </div>

                    {/* Answer */}
                    <div
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: "0.6rem",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color: "#9a9a9a",
                          flexShrink: 0,
                          paddingTop: "0.15rem",
                        }}
                      >
                        A
                      </span>
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontWeight: 300,
                          fontSize: "0.9rem",
                          color: "#b8b8b8",
                          lineHeight: 1.75,
                          margin: 0,
                        }}
                      >
                        {qa.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* ── ARTICLE HEADER ── */
          <>
            {/* Article badge + date */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1rem",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.55rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#b0b0b0",
                  border: "1px solid #222",
                  padding: "0.2rem 0.5rem",
                }}
              >
                Article
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#9a9a9a",
                }}
              >
                {formatDate(post.date)}
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
                textTransform: "uppercase",
                color: "#f0f0f0",
                lineHeight: 0.95,
                margin: "0 0 2rem",
              }}
            >
              {post.title}
            </h1>

            {/* Body */}
            {post.body && (
              <div>
                {post.body.split("\n\n").map((paragraph, i) => (
                  <p
                    key={i}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 300,
                      fontSize: "0.95rem",
                      color: "#b8b8b8",
                      lineHeight: 1.8,
                      marginBottom: "1.5rem",
                    }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </>
        )}

        {/* Back link */}
        <div
          style={{
            borderTop: "1px solid #1a1a1a",
            paddingTop: "2rem",
            marginTop: "2rem",
          }}
        >
          <Link
            href="/read"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#39ff5a",
              textDecoration: "none",
              borderBottom: "1px solid #1e4a28",
              paddingBottom: "0.25rem",
            }}
          >
            &larr; All Posts
          </Link>
        </div>
      </article>

      <Footer />
    </>
  );
}
