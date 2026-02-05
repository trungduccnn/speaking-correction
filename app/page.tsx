"use client";

import { useState } from "react";

export default function Home() {
  const [studentName, setStudentName] = useState("");
  const [className, setClassName] = useState("");
  const [homeworkLabel, setHomeworkLabel] = useState("");
  const [transcript, setTranscript] = useState("");

  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [rawHtmlUrl, setRawHtmlUrl] = useState("");

  async function generate() {
    setLoading(true);
    setUrl("");
    setRawHtmlUrl("");
    setError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName,
          className,
          homeworkLabel,
          transcript,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Generate failed");

      setUrl(data.url);
      setRawHtmlUrl(data.rawHtmlUrl);
    } catch (e: any) {
      setError(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: 24 }}>
      <div
        style={{
          border: "1px solid rgba(0,0,0,.08)",
          borderRadius: 14,
          padding: 18,
          boxShadow: "0 10px 20px rgba(0,0,0,.06)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 22 }}>Speaking Report Generator</h1>
        <p style={{ marginTop: 8, color: "rgba(0,0,0,.65)" }}>
          Dán bài học viên, bấm Generate, lấy link gửi học sinh.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 10,
          }}
        >
          <input
            placeholder="Tên học viên"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            style={{
              padding: 10,
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,.12)",
            }}
          />
          <input
            placeholder="Lớp"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            style={{
              padding: 10,
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,.12)",
            }}
          />
          <input
            placeholder="BTVN buổi nào (vd: Buổi 12 - Part 2)"
            value={homeworkLabel}
            onChange={(e) => setHomeworkLabel(e.target.value)}
            style={{
              padding: 10,
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,.12)",
            }}
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <textarea
            placeholder="Paste transcript Speaking của học viên ở đây"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            style={{
              width: "100%",
              height: 260,
              padding: 12,
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,.12)",
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
              fontSize: 13,
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 12,
            alignItems: "center",
          }}
        >
          <button
            onClick={generate}
            disabled={loading}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "none",
              background: "black",
              color: "white",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Generating..." : "Generate link"}
          </button>

          <a
            href="/history"
            style={{ color: "black", textDecoration: "underline" }}
          >
            View history
          </a>
        </div>

        {error && <p style={{ marginTop: 12, color: "crimson" }}>{error}</p>}

        {url && (
          <div style={{ marginTop: 12 }}>
            <div style={{ color: "rgba(0,0,0,.65)", fontSize: 13 }}>
              Link gửi học viên:
            </div>
            <a href={url} target="_blank" style={{ fontWeight: 700 }}>
              {url}
            </a>

            {rawHtmlUrl && (
              <div style={{ marginTop: 8, fontSize: 13 }}>
                <span style={{ color: "rgba(0,0,0,.65)" }}>
                  (Link HTML gốc)
                </span>{" "}
                <a href={rawHtmlUrl} target="_blank" style={{ textDecoration: "underline" }}>
                  mở trực tiếp
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
