export function buildReportHtml({
  studentName,
  className,
  homeworkLabel,
  original,
  corrected,
  explanations,
}: any) {

return `
<html>
<body style="font-family:Arial; padding:40px; background:#f4f6fb;">

<h1>Speaking Feedback</h1>

<p><b>Học viên:</b> ${studentName}</p>
<p><b>Lớp:</b> ${className}</p>
<p><b>BTVN:</b> ${homeworkLabel}</p>

<h2>Original</h2>
<pre>${original}</pre>

<h2>Corrected</h2>
<pre>${corrected}</pre>

<h2>Explanation</h2>
<pre>${explanations}</pre>

</body>
</html>
`;
}
