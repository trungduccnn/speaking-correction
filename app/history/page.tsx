import { supabaseAnon } from "@/lib/supabase";

export default async function HistoryPage() {
  const supabase = supabaseAnon();

  const { data, error } = await supabase
    .from("speaking_reports")
    .select("id, created_at, student_name, class_name, homework_label")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return (
      <main style={{ maxWidth: 980, margin: "0 auto", padding: 24 }}>
        <h1>History</h1>
        <p>Lỗi load history.</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>History</h1>
      <p style={{ color: "rgba(0,0,0,.65)" }}>
        Danh sách bài đã generate, click để mở.
      </p>

      <div style={{ display: "grid", gap: 10 }}>
        {(data ?? []).map((x) => (
          <a
            key={x.id}
            href={`/s/${x.id}`}
            style={{
              border: "1px solid rgba(0,0,0,.10)",
              borderRadius: 14,
              padding: 14,
              textDecoration: "none",
              color: "black",
              boxShadow: "0 10px 20px rgba(0,0,0,.05)",
            }}
          >
            <div style={{ fontWeight: 800 }}>
              {x.student_name} — {x.class_name}
            </div>
            <div style={{ color: "rgba(0,0,0,.65)", marginTop: 4 }}>
              {x.homework_label}
            </div>
            <div style={{ color: "rgba(0,0,0,.55)", marginTop: 6, fontSize: 12 }}>
              {new Date(x.created_at).toLocaleString("vi-VN", { hour12: false })}
            </div>
          </a>
        ))}
      </div>

      <div style={{ marginTop: 18 }}>
        <a href="/" style={{ textDecoration: "underline", color: "black" }}>
          Back
        </a>
      </div>
    </main>
  );
}
