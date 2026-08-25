const cors = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json = (data,status=200) => new Response(JSON.stringify(data),{status,headers:{...cors,"Content-Type":"application/json"}});
export default {async fetch(request, env) {
  if (request.method === "OPTIONS") return new Response(null,{headers:cors});
  if (request.method !== "POST") return json({error:"POST only"},405);
  if (!env.SILICONFLOW_API_KEY) return json({error:"Trial service is not configured"},503);
  const body = await request.json().catch(()=>null); if (!body) return json({error:"Invalid JSON"},400);
  const type = body.type || "summary";
  if (type === "summary" || type === "followup") {
    const messages = body.messages || [{role:"user",content:body.content||""}];
    const response = await fetch("https://api.siliconflow.cn/v1/chat/completions",{method:"POST",headers:{"Authorization":`Bearer ${env.SILICONFLOW_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({model:env.SILICONFLOW_MODEL||"Qwen/Qwen3.5-4B",temperature:.3,max_tokens:1200,messages})});
    return new Response(await response.text(),{status:response.status,headers:{...cors,"Content-Type":"application/json"}});
  }
  return json({error:"Unsupported request type"},400);
}}
