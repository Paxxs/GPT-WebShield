(function(){"use strict";(()=>{const f=["closeai."],m=window.fetch,u=window.XMLHttpRequest,w=()=>{const e="#toast-container{position:fixed;top:20px;right:20px;display:flex;flex-direction:column-reverse;gap:10px;z-index:50;}.toast{background-color:rgba(0,0,0,.75);font-size:1rem;color:#fff;padding:5px;border-radius:5px;animation:4s forwards fadeOut}@keyframes fadeOut{from{opacity:1}to{opacity:0}}",t=document.createElement("style");t.textContent=e,document.head.appendChild(t)},r=(()=>{const e=document.createElement("div");return e.id="toast-container",document.body.appendChild(e),w(),e})(),i=(e,t,o=!1)=>{const n=document.createElement("div");n.className="toast",n.textContent=(o?"🪬隐私防护 ":"🫥外部请求 ")+t+" "+e.replace(/^https?:\/\//,""),r.appendChild(n),setTimeout(()=>{r.removeChild(n)},4e3)},d=e=>f.some(t=>e.includes(t)),s=(e,t,o="normal")=>{o==="external"?i(t,e):o==="intercepted"&&i(t,e,!0),console.log(o,e,t)},g=e=>(e&&console.log("SpyRBody:",e),new Response(JSON.stringify({m:":)"}),{status:200,headers:{"Content-Type":"application/json"}}));window.fetch=async(e,t)=>{const o=typeof e=="string"?e:e instanceof URL?e.href:e.url,n=(t==null?void 0:t.method)||"GET",c=new URL(o,window.location.origin).hostname,a=window.location.hostname;return d(c)?(s(n,o,"intercepted"),Promise.resolve(g(t==null?void 0:t.body))):(c!==a?s(n,o,"external"):s(n,o,"normal"),m(e,t))};class x extends u{open(t,o,n=!0,l,c){const a=new URL(o,window.location.origin),h=a.hostname!==window.location.hostname;if(d(a.hostname)){s(t,o,"intercepted"),this.send=p=>{p&&console.log("SpyXBody:",p)};return}h?s(t,o,"external"):s(t,o),super.open(t,o,n,l,c)}}window.XMLHttpRequest=x})()})();
