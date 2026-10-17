import Companion from "../components/companion";
import { getChatGPTUser, chatGPTSignInPath } from "./chatgpt-auth";
export const dynamic="force-dynamic";
export default async function Home(){
  const user=await getChatGPTUser();
  if(!user)return <main className="welcome"><div className="wordmark">◈ Learning Companion</div><p className="eyebrow">A place to think, together</p><h1>Pick up exactly<br/>where you left off.</h1><p>Learn with ChatGPT. Keep your sources, working drafts, and honest evidence in one private record.</p><a className="button primary" href={chatGPTSignInPath("/")} target="_top">Sign in with ChatGPT →</a><p className="fine">No separate AI subscription or API key required. Your ChatGPT account’s feature availability applies. Records are private.</p></main>;
  return <Companion/>;
}
