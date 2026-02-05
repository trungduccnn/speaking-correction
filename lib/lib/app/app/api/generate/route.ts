import { supabaseService } from "@/lib/supabase";
import { buildReportHtml } from "@/lib/htmlTemplate";

export async function POST(req:Request){

const body=await req.json();

const transcript=body.transcript;

const openai=await fetch(
"https://api.openai.com/v1/chat/completions",
{
method:"POST",
headers:{
Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,
"Content-Type":"application/json"
},
body:JSON.stringify({
model:"gpt-4o-mini",
messages:[
{
role:"user",
content:`Correct transcript:\n${transcript}`
}
]
})
});

const json=await openai.json();

const corrected=json.choices[0].message.content;

const explanations="Auto explanation";

const html=buildReportHtml({
studentName:body.studentName,
className:body.className,
homeworkLabel:body.homeworkLabel,
original:transcript,
corrected,
explanations
});

const supabase=supabaseService();

const filename=Date.now()+".html";

await supabase.storage
.from(process.env.SUPABASE_BUCKET!)
.upload(filename,html);

const url=
process.env.SUPABASE_URL+
"/storage/v1/object/public/"+
process.env.SUPABASE_BUCKET+
"/"+
filename;

return Response.json({url});

}
