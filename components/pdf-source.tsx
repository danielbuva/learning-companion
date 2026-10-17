"use client";
import React,{useEffect,useRef,useState} from "react";
import {pdfWorkerGzip} from "../lib/pdf-worker-source";
import type {PDFDocumentProxy,PDFDocumentLoadingTask,RenderTask} from "pdfjs-dist";
type J=Record<string,any>;
export function PdfSource({media,source,onSelect,onExtract}:{media:string;source:J;onSelect:(s:J)=>void;onExtract:(data:J)=>Promise<void>}){
  const [document,setDocument]=useState<PDFDocumentProxy|null>(null),[page,setPage]=useState(1),[zoom,setZoom]=useState(1),[spans,setSpans]=useState<string[]>([]),[status,setStatus]=useState("Reading original PDF…"),[extracting,setExtracting]=useState(false);
  const canvas=useRef<HTMLCanvasElement|null>(null);
  useEffect(()=>{
    let disposed=false,worker:Worker|undefined,url:string|undefined,task:PDFDocumentLoadingTask|undefined;
    (async()=>{
      const pdfjs=await import("pdfjs-dist");
      const compressed=Uint8Array.from(atob(pdfWorkerGzip),c=>c.charCodeAt(0));
      const script=await new Response(new Blob([compressed]).stream().pipeThrough(new DecompressionStream("gzip"))).text();
      if(disposed)return;
      url=URL.createObjectURL(new Blob([script],{type:"text/javascript"}));worker=new Worker(url,{type:"module"});
      const pdfWorker=pdfjs.PDFWorker.create({port:worker});
      const bytes=media.startsWith("data:")?Uint8Array.from(atob(media.slice(media.indexOf(",")+1)),c=>c.charCodeAt(0)):new Uint8Array(await (await fetch(media)).arrayBuffer());
      task=pdfjs.getDocument({data:bytes,worker:pdfWorker,enableXfa:false,useWasm:false,useWorkerFetch:false,disableFontFace:true,useSystemFonts:true,maxImageSize:10_000_000,canvasMaxAreaInBytes:32_000_000});
      const doc=await task.promise;if(disposed){await task.destroy();return;}setDocument(doc);setStatus(`Original PDF · ${doc.numPages} pages. Embedded text is selectable; scanned text requires OCR.`);
    })().catch(e=>{if(!disposed)setStatus(`PDF could not be rendered: ${e.message}. The original remains stored; no content was inferred.`);});
    return()=>{disposed=true;task?.destroy();worker?.terminate();if(url)URL.revokeObjectURL(url);};
  },[media]);
  useEffect(()=>{
    if(!document)return;let canceled=false,render:RenderTask|undefined;
    (async()=>{
      const pdfPage=await document.getPage(page),content=await pdfPage.getTextContent();
      if(canceled||!canvas.current)return;
      setSpans(content.items.flatMap(item=>"str" in item&&item.str.trim()?[item.str]:[]));
      const viewport=pdfPage.getViewport({scale:Math.min(2,zoom*680/pdfPage.getViewport({scale:1}).width)});
      const target=canvas.current;target.width=Math.ceil(viewport.width);target.height=Math.ceil(viewport.height);
      render=pdfPage.render({canvas:target,viewport});await render.promise;
    })().catch(e=>{if(!canceled)setStatus(`Page rendering failed: ${e.message}. Embedded text may still be available.`);});
    return()=>{canceled=true;render?.cancel();};
  },[document,page,zoom]);
  async function extract(){
    if(!document)return;setExtracting(true);try{
      const count=Math.min(document.numPages,50),parts:string[]=[];let chars=0,processed=0;
      for(let i=1;i<=count;i++){
        const p=await document.getPage(i),text=await p.getTextContent();
        const body=text.items.map(item=>"str" in item?item.str+(item.hasEOL?"\n":" "):"").join("");
        if(chars+body.length>200_000)break;parts.push(`## Page ${i}\n${body.trim()}`);chars+=body.length;processed=i;
      }
      if(!parts.some(p=>p.replace(/## Page \d+/g,"").trim()))throw new Error("No embedded text was found. Scanned pages need OCR; no transcription was invented.");
      await onExtract({extractedText:parts.join("\n\n"),extraction:{parser:"Mozilla PDF.js 6.4.299",pages:processed,totalPages:document.numPages,at:new Date().toISOString(),limitations:processed<document.numPages?"Bounded extraction: up to 50 pages and 200,000 characters. Remaining pages were not extracted.":"Embedded text only; layout order and equations require comparison with the original. No OCR."}});
      setStatus(`Saved embedded study text from ${processed} of ${document.numPages} pages. Original PDF bytes are unchanged.`);
    }catch(e){setStatus((e as Error).message);}finally{setExtracting(false);}
  }
  return <section className="pdf-reader" aria-label="PDF page viewer"><p role="status">{status}</p>{document&&<><div className="button-row"><button disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Previous page</button><label>PDF page<input type="number" min={1} max={document.numPages} value={page} onChange={e=>setPage(Math.max(1,Math.min(document.numPages,Number(e.target.value)||1)))}/></label><button disabled={page>=document.numPages} onClick={()=>setPage(p=>p+1)}>Next page</button><label>Page scale<select value={zoom} onChange={e=>setZoom(Number(e.target.value))}><option value={1}>Fit</option><option value={1.5}>Larger</option></select></label></div><canvas ref={canvas} aria-label={`Original PDF page ${page}`} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();onSelect({sourceId:source.id,version:source.version,page,x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height,type:"pdf_region"});}}/><details open><summary>Selectable embedded text · page {page}</summary>{spans.length?spans.map((text,index)=><button className="pdf-span" key={index} onClick={()=>onSelect({sourceId:source.id,version:source.version,page,span:index,text,type:"pdf_text"})}>{text}</button>):<p>No embedded text on this page. No OCR is inferred.</p>}</details><button disabled={extracting} onClick={extract}>{extracting?"Extracting…":"Save embedded text for study preparation"}</button></>}</section>;
}
