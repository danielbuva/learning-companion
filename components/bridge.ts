type Json=Record<string,any>;
export class HostBridge {
  pending=new Map<number,{resolve:(v:any)=>void;reject:(e:Error)=>void}>();nextId=1;context:Json={};hostCapabilities:Json={};ready=false;
  onResult:(r:Json)=>void=()=>{};onInput:(r:Json)=>void=()=>{};onContext:(r:Json)=>void=()=>{};
  constructor(){window.addEventListener("message",this.receive);}
  receive=(event:MessageEvent)=>{
    if(event.source!==window.parent||event.data?.jsonrpc!=="2.0")return;
    const m=event.data;
    if(m.id!==undefined&&this.pending.has(m.id)){const p=this.pending.get(m.id)!;this.pending.delete(m.id);m.error?p.reject(new Error(m.error.message)):p.resolve(m.result);return;}
    if(m.method==="ui/notifications/tool-result")this.onResult(m.params?.structuredContent??m.params??{});
    if(m.method==="ui/notifications/tool-input")this.onInput(m.params?.arguments??m.params??{});
    if(m.method==="ui/notifications/host-context-changed"){this.context={...this.context,...m.params};this.onContext(this.context);}
  };
  async request(method:string,params:Json={}){
    const id=this.nextId++;window.parent.postMessage({jsonrpc:"2.0",id,method,params},"*");
    return new Promise<any>((resolve,reject)=>{this.pending.set(id,{resolve,reject});setTimeout(()=>{if(this.pending.delete(id))reject(new Error(`Host did not acknowledge ${method}. Saved work remains available.`));},method==="tools/call"&&params.name==="learning_authorize"?15*60_000:15_000);});
  }
  async init(){
    const result=await this.request("ui/initialize",{protocolVersion:"2026-01-26",appInfo:{name:"Learning Companion",version:"1.0.0"},appCapabilities:{availableDisplayModes:["inline","fullscreen"],tools:{},updateModelContext:{},message:{text:{}}}});
    this.context=result.hostContext??{};this.hostCapabilities=result.hostCapabilities??{};this.ready=true;window.parent.postMessage({jsonrpc:"2.0",method:"ui/notifications/initialized"},"*");return result;
  }
  async command(command:Json){
    const read=["discover","snapshot","get","search","resume","explain","export","compare"].includes(command.action);
    const result=await this.request("tools/call",{name:read?"learning_read":"learning_write",arguments:command});
    if(result.isError)throw new Error(result.content?.find((c:any)=>c.type==="text")?.text??"Tool failed");
    return result.structuredContent??JSON.parse(result.content.find((c:any)=>c.type==="text").text);
  }
  async contextSelection(selection:Json|null){return this.request("ui/update-model-context",selection?{content:[{type:"text",text:JSON.stringify(selection),_meta:{"openai/title":"Selected learning context"}}],structuredContent:selection}:{content:[],structuredContent:{}});}
  async message(text:string,send=true){return this.request("ui/message",{role:"user",content:[{type:"text",text}],_meta:{"openai/message":{target:"active",send}}});}
  async sourceFile(sourceId:string){return this.request("tools/call",{name:"learning_source_file",arguments:{sourceId}});}
  destroy(){window.removeEventListener("message",this.receive);}
}
