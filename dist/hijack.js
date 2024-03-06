(() => {
  const m = ["closeai.biz"], f = window.fetch, u = window.XMLHttpRequest, w = () => {
    const o = "#toast-container{position:fixed;top:20px;right:20px;display:flex;flex-direction:column-reverse;gap:10px}.toast{background-color:rgba(0,0,0,.75);font-size:1rem;color:#fff;padding:5px;border-radius:5px;animation:4s forwards fadeOut}@keyframes fadeOut{from{opacity:1}to{opacity:0}}", e = document.createElement("style");
    e.textContent = o, document.head.appendChild(e);
  }, r = (() => {
    const o = document.createElement("div");
    return o.id = "toast-container", document.body.appendChild(o), w(), o;
  })(), i = (o) => {
    const e = document.createElement("div");
    e.className = "toast", e.textContent = o, r.appendChild(e), setTimeout(() => {
      r.removeChild(e);
    }, 4e3);
  }, l = (o) => m.some((e) => o.includes(e)), n = (o, e, t = "normal") => {
    t === "external" ? i(`🫥 外部${o}-${e.replace(/^https?:\/\//, "")}`) : t === "intercepted" && i(`🛡️ 隐私保护${o}-${e.replace(/^https?:\/\//, "")}`), console.log(`${t} ${o} ${e}`);
  }, g = (o) => (o && console.log(`SpyRBody:${o}`), new Response(JSON.stringify({ message: ":)" }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  }));
  window.fetch = async (o, e) => {
    const t = typeof o == "string" ? o : o instanceof URL ? o.href : o.url, s = (e == null ? void 0 : e.method) || "GET", a = new URL(t, window.location.origin).hostname, c = window.location.hostname;
    return l(a) ? (n(s, t, "intercepted"), Promise.resolve(g(e == null ? void 0 : e.body))) : (a !== c ? n(s, t, "external") : n(s, t, "normal"), f(o, e));
  };
  class h extends u {
    open(e, t, s = !0, d, a) {
      const c = new URL(t, window.location.origin), R = c.hostname !== window.location.hostname;
      if (l(c.hostname)) {
        n(e, t, "intercepted"), this.send = (p) => {
          p && console.log(`SpyRBody:${p}`);
        };
        return;
      }
      R ? n(e, t, "external") : n(e, t), super.open(e, t, s, d, a);
    }
  }
  window.XMLHttpRequest = h;
})();
