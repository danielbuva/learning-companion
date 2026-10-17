// Exact changed region, not a claim about semantic or pedagogical implications.
export function changedRegion(before:string,after:string){
  const a=before.replaceAll("\r\n","\n").split("\n"),b=after.replaceAll("\r\n","\n").split("\n");
  let prefix=0,suffix=0;while(prefix<a.length&&prefix<b.length&&a[prefix]===b[prefix])prefix++;
  while(suffix<a.length-prefix&&suffix<b.length-prefix&&a[a.length-1-suffix]===b[b.length-1-suffix])suffix++;
  const old=a.slice(prefix,a.length-suffix),current=b.slice(prefix,b.length-suffix);
  return {changed:before!==after,commonPrefixLines:prefix,commonSuffixLines:suffix,before:{startLine:prefix+1,lines:old.slice(0,200),totalRegionLines:old.length},after:{startLine:prefix+1,lines:current.slice(0,200),totalRegionLines:current.length},truncated:old.length>200||current.length>200,interpretation:"Exact changed region; unchanged lines inside the region may be included. Inspect full versions for omitted content. No learner work or semantic conclusion is inferred."};
}
