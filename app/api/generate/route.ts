import { supabaseService } from "@/lib/supabase";
import { buildReportHtml } from "@/lib/htmlTemplate";

async function callOpenAI(prompt: string) {
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!r.ok) {
    const t = await r.text();
    throw new Error(`OpenAI error: ${t}`);
  }

  const j = await r.json();
  return j.choices?.[0]?.message?.content ?? "";
}

async function callGemini(prompt: string) {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
    process.env.GEMINI_API_KEY;

  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2 },
    }),
  });

  if (!r.ok) {
    const t = await r.text();
    throw new Error(`Gemini error: ${t}`);
  }

  const j = await r.json();
  return j.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

export async function POST(req: Request) {
  const body = await req.json();

  const studentName = (body.studentName ?? "").trim();
  const className = (body.className ?? "").trim();
  const homeworkLabel = (body.homeworkLabel ?? "").trim();
  const transcript = (body.transcript ?? "").trim();

  if (!studentName || !className || !homeworkLabel || !transcript) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  // STEP 1: Correction (replace this with your house prompt)
  const corrected = await callOpenAI(
    `You are an IELTS Speaking corrector.
Return ONLY the corrected transcript, keep the student's meaning, improve grammar/vocab/naturalness.
Transcript:
${transcript}`
  );

  // STEP 2: Explanation (replace this with your house prompt)
  const explanations = await callOpenAI(
    `Explain why you corrected parts of the transcript.
Be clear and practical, focus on grammar/vocab/naturalness.
Show examples using quotes.
Original:
${transcript}

Corrected:
${corrected}`
  );

  // STEP 3: (Optional) Gemini polish for explanations (replace with your Gemini prompt)
  const polishedExplanations = await callGemini(
    `Rewrite the explanation to be concise, structured in short paragraphs, and teacher-friendly.
Keep quoted examples.
Explanation:
${explanations}`
  );

  const createdAtISO = new Date().toISOString();

  // STEP 4: Build HTML with a fixed template
  const html = buildReportHtml({
    studentName,
    className,
    homeworkLabel,
    createdAtISO,
    original: transcript,
    corrected,
    explanations: polishedExplanations || explanations,
  });

  const supabase = supabaseService();
  const safeName = studentName
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  const filename = `${Date.now()}-${safeName || "student"}.html`;

  // STEP 5: upload HTML
  const { error: upErr } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET!)
    .upload(filename, html, { contentType: "text/html", upsert: false });

  if (upErr) throw new Error(`Upload error: ${upErr.message}`);

  const rawHtmlUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_BUCKET}/${filename}`;

  // STEP 6: insert history record
  const { data: row, error: dbErr } = await supabase
    .from("speaking_reports")
    .insert({
      student_name: studentName,
      class_name: className,
      homework_label: homeworkLabel,
      original_transcript: transcript,
      corrected_transcript: corrected,
      explanations: polishedExplanations || explanations,
      html_path: filename,
      public_url: rawHtmlUrl,
    })
    .select("id")
    .single();

  if (dbErr) throw new Error(`DB error: ${dbErr.message}`);

  // Pretty link via Vercel route
  const origin = new URL(req.url).origin;
  return Response.json({
    id: row.id,
    url: `${origin}/s/${row.id}`,
    rawHtmlUrl,
  });
}
