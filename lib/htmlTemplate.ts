function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function buildReportHtml(params: {
  studentName: string;
  className: string;
  homeworkLabel: string;
  createdAtISO: string;
  original: string;
  corrected: string;
  explanations: string;
}) {
  const {
    studentName,
    className,
    homeworkLabel,
    createdAtISO,
    original,
    corrected,
    explanations,
  } = params;

  const createdAt = new Date(createdAtISO).toLocaleString("vi-VN", {
    hour12: false,
  });

  const o = escapeHtml(original);
  const c = escapeHtml(corrected);
  const e = escapeHtml(explanations);

  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Speaking Feedback — ${escapeHtml(studentName)}</title>
  <style>
    :root{
      --bg:#0b1220;
      --card:#0f1a33;
      --card2:#101f3d;
      --text:#eaf0ff;
      --muted:#b7c4e6;
      --line:rgba(255,255,255,.10);
      --accent:#7aa7ff;
      --radius:18px;
    }
    *{box-sizing:border-box}
    body{
      margin:0;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
      background: radial-gradient(1200px 600px at 20% 0%, rgba(122,167,255,.20), transparent 60%),
                  radial-gradient(900px 500px at 80% 10%, rgba(112,225,181,.16), transparent 55%),
                  var(--bg);
      color:var(--text);
      line-height:1.55;
    }
    .wrap{max-width:1100px; margin:0 auto; padding:28px 18px 54px}
    .top{
      display:flex; gap:14px; align-items:flex-start; justify-content:space-between;
      padding:18px 18px; border:1px solid var(--line);
      background: linear-gradient(180deg, rgba(15,26,51,.85), rgba(15,26,51,.55));
      border-radius: var(--radius);
      backdrop-filter: blur(10px);
      box-shadow: 0 10px 30px rgba(0,0,0,.30);
    }
    .title{font-size:18px; font-weight:700; letter-spacing:.2px; margin:0 0 4px}
    .meta{color:var(--muted); font-size:13px}
    .pillRow{display:flex; gap:10px; flex-wrap:wrap; margin-top:10px}
    .pill{
      display:inline-flex; gap:8px; align-items:center;
      border:1px solid var(--line);
      background: rgba(255,255,255,.05);
      padding:8px 10px; border-radius: 999px;
      color: var(--muted); font-size:13px;
    }
    .pill b{color:var(--text); font-weight:650}
    .grid{display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-top:16px}
    @media (max-width: 980px){ .grid{grid-template-columns:1fr} }
    .card{
      border:1px solid var(--line);
      background: linear-gradient(180deg, rgba(16,31,61,.78), rgba(16,31,61,.45));
      border-radius: var(--radius);
      overflow:hidden;
      box-shadow: 0 12px 28px rgba(0,0,0,.26);
    }
    .cardHead{
      display:flex; justify-content:space-between; align-items:center;
      padding:14px 16px; border-bottom:1px solid var(--line);
    }
    .cardHead h2{margin:0; font-size:15px; letter-spacing:.2px}
    .tag{
      font-size:12px; color: var(--muted);
      padding:6px 10px; border-radius:999px;
      border:1px solid var(--line);
      background: rgba(255,255,255,.04);
    }
    pre{
      margin:0; padding:16px;
      white-space:pre-wrap;
      word-wrap:break-word;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      font-size:13px;
      color: rgba(234,240,255,.95);
    }
    .full{margin-top:16px}
    .footer{
      margin-top:22px; color: rgba(183,196,230,.82);
      font-size:12px; text-align:center;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="top">
      <div>
        <p class="title">Speaking Feedback</p>
        <div class="meta">Generated at ${escapeHtml(createdAt)}</div>
        <div class="pillRow">
          <span class="pill"><b>Học viên</b> ${escapeHtml(studentName)}</span>
          <span class="pill"><b>Lớp</b> ${escapeHtml(className)}</span>
          <span class="pill"><b>BTVN</b> ${escapeHtml(homeworkLabel)}</span>
        </div>
      </div>
      <div class="meta">Link này dùng để xem online, có thể gửi thẳng cho học viên.</div>
    </div>

    <div class="grid">
      <div class="card">
        <div class="cardHead">
          <h2>Original transcript</h2>
          <span class="tag">Bản gốc</span>
        </div>
        <pre>${o}</pre>
      </div>

      <div class="card">
        <div class="cardHead">
          <h2>Corrected version</h2>
          <span class="tag">Bản sửa</span>
        </div>
        <pre>${c}</pre>
      </div>
    </div>

    <div class="card full">
      <div class="cardHead">
        <h2>Why these changes</h2>
        <span class="tag">Giải thích</span>
      </div>
      <pre>${e}</pre>
    </div>

    <div class="footer">© Speaking Center — Internal feedback page</div>
  </div>
</body>
</html>`;
}
