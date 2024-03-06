(() => {
  const f = ["closeai."], m = window.fetch, u = window.XMLHttpRequest, w = () => {
    const e = "#toast-container{position:fixed;top:20px;right:20px;display:flex;flex-direction:column-reverse;gap:10px;z-index:50;}.toast{background-color:rgba(0,0,0,.75);font-size:1rem;color:#fff;padding:5px;border-radius:5px;animation:4s forwards fadeOut}@keyframes fadeOut{from{opacity:1}to{opacity:0}}", o = document.createElement("style");
    o.textContent = e, document.head.appendChild(o);
  }, i = (() => {
    const e = document.createElement("div");
    return e.id = "toast-container", document.body.appendChild(e), w(), e;
  })(), r = (e, o, t = !1) => {
    const n = document.createElement("div");
    n.className = "toast", n.textContent = (t ? "🪬隐私防护 " : "🫥 ") + (o || "") + " " + e.replace(/^https?:\/\//, ""), i.appendChild(n), setTimeout(() => {
      i.removeChild(n);
    }, 4e3);
  }, d = (e) => f.some((o) => e.includes(o)), s = (e, o, t = "normal") => {
    t === "external" ? r(o, e) : t === "intercepted" && r(o, e, !0), console.log(t, e, o);
  }, g = (e) => (e && console.log("SpyRBody:", e), new Response(JSON.stringify({ m: ":)" }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  }));
  window.fetch = async (e, o) => {
    const t = typeof e == "string" ? e : e instanceof URL ? e.href : e.url, n = (o == null ? void 0 : o.method) || "GET", a = new URL(t, window.location.origin).hostname, c = window.location.hostname;
    return d(a) ? (s(n, t, "intercepted"), Promise.resolve(g(o == null ? void 0 : o.body))) : (a !== c ? s(n, t, "external") : s(n, t, "normal"), m(e, o));
  };
  class x extends u {
    open(o, t, n = !0, l, a) {
      const c = new URL(t, window.location.origin), h = c.hostname !== window.location.hostname;
      if (d(c.hostname)) {
        s(o, t, "intercepted"), this.send = (p) => {
          p && console.log("SpyXBody:", p);
        };
        return;
      }
      h ? s(o, t, "external") : s(o, t), super.open(o, t, n, l, a);
    }
  }
  window.XMLHttpRequest = x, r("隐私防御已启动");
})();
