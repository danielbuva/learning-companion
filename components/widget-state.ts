export function readWidgetState():Record<string,any>{return typeof window==="undefined"?{}:(window as any).openai?.widgetState?.privateContent??{};}
export function rememberWidgetState(patch:Record<string,any>){
  const openai=typeof window==="undefined"?undefined:(window as any).openai;
  if(openai?.setWidgetState){const previous=openai.widgetState??{};openai.setWidgetState({...previous,privateContent:{...previous.privateContent,...patch}});}
}
