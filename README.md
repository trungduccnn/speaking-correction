# Speaking Correction App (Vercel + Supabase)

Dán transcript → bấm Generate → nhận link report đẹp (HTML), lưu History.

## 1) Create Supabase
- Create a project at Supabase
- Storage: create a **public bucket** named `html`
- SQL Editor: run this:

```sql
create table if not exists public.speaking_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  student_name text not null,
  class_name text not null,
  homework_label text not null,

  original_transcript text not null,
  corrected_transcript text not null,
  explanations text not null,

  html_path text not null,
  public_url text not null
);

create index if not exists speaking_reports_created_at_idx
on public.speaking_reports (created_at desc);

alter table public.speaking_reports enable row level security;

create policy "public read speaking reports"
on public.speaking_reports
for select
to anon
using (true);
```

## 2) Environment Variables (Vercel)
Set these in Vercel → Project → Settings → Environment Variables:

- OPENAI_API_KEY
- GEMINI_API_KEY
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- SUPABASE_BUCKET (default: html)

## 3) Run locally (optional)
```bash
cp .env.example .env
npm i
npm run dev
```

## Pages
- `/` Generate report
- `/history` View list
- `/s/{uuid}` Open report (iframe)

## Notes
- This template uses GPT model `gpt-4o-mini` and Gemini model `gemini-2.0-flash`.
- Replace prompts in `app/api/generate/route.ts` with your house prompts anytime.
