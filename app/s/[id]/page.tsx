import { supabaseAnon } from "@/lib/supabase";

export default async function ReportPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = supabaseAnon();

  const { data, error } = await supabase
    .from("speaking_reports")
    .select("public_url")
    .eq("id", params.id)
    .single();

  if (error || !data?.public_url) {
    return (
      <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
        <h1>Not found</h1>
        <p>Không tìm thấy report này.</p>
      </main>
    );
  }

  return (
    <main style={{ margin: 0, padding: 0 }}>
      <iframe
        src={data.public_url}
        style={{ width: "100vw", height: "100vh", border: "none" }}
        title="Speaking Report"
      />
    </main>
  );
}
