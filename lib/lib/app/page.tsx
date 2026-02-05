"use client";

import { useState } from "react";

export default function Home() {

const [student,setStudent]=useState("");
const [className,setClass]=useState("");
const [hw,setHW]=useState("");
const [text,setText]=useState("");
const [link,setLink]=useState("");

async function generate(){

const res=await fetch("/api/generate",{
method:"POST",
body:JSON.stringify({
studentName:student,
className,
homeworkLabel:hw,
transcript:text
})
});

const data=await res.json();
setLink(data.url);

}

return(

<div style={{padding:40}}>

<h1>Speaking Generator</h1>

<input placeholder="Student"
onChange={e=>setStudent(e.target.value)}/>

<input placeholder="Class"
onChange={e=>setClass(e.target.value)}/>

<input placeholder="Homework"
onChange={e=>setHW(e.target.value)}/>

<textarea style={{width:"100%",height:200}}
onChange={e=>setText(e.target.value)}/>

<br/>

<button onClick={generate}>
Generate
</button>

<br/>

<a href={link}>{link}</a>

</div>

);

}
