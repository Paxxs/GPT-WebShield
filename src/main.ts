(() => {
  const blockedDomain: string[] = ["closeai."];

  // save original function?
  const originalFetch: typeof fetch = window.fetch;
  const originalXMLRequest: typeof XMLHttpRequest = window.XMLHttpRequest;

  // 动态插入样式到 head
  const injectStyles = (): void => {
    const css: string =
      "#toast-container{position:fixed;top:20px;right:20px;display:flex;flex-direction:column-reverse;gap:10px;z-index:50;}.toast{background-color:rgba(0,0,0,.75);font-size:1rem;color:#fff;padding:5px;border-radius:5px;animation:4s forwards fadeOut}@keyframes fadeOut{from{opacity:1}to{opacity:0}}";
    const style: HTMLStyleElement = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  };
  // 创建并返回一个 toast 容器
  const createToastContainer = (): HTMLDivElement => {
    const container: HTMLDivElement = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
    injectStyles();
    return container;
  };

  const container: HTMLDivElement = createToastContainer();

  // toast
  const toast = (
    url: string,
    method?: string,
    guard: boolean = false
  ): void => {
    const toast: HTMLDivElement = document.createElement("div");
    toast.className = "toast";
    toast.textContent =
      (guard ? "🪬隐私防护 " : "🫥 ") +
      (method || "") +
      " " +
      url.replace(/^https?:\/\//, "");
    container.appendChild(toast);

    // 在动画完成后移除 toast
    setTimeout(() => {
      container.removeChild(toast);
    }, 4000); // 动画持续时间与 CSS 中的保持一致
  };

  const isBlockedDomain = (domain: string) =>
    blockedDomain.some((b) => domain.includes(b));

  // 日志输出
  const logRequest = (
    method: string,
    url: string,
    type: "external" | "intercepted" | "normal" = "normal"
  ): void => {
    if (type === "external") toast(url, method);
    else if (type === "intercepted") toast(url, method, true);

    console.log(type, method, url);
  };

  const fakeResponse = (body?: any): Response => {
    if (body) {
      console.log("SpyRBody:", body);
    }
    return new Response(JSON.stringify({ m: ":)" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  window.fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {
    const urlString: string =
      typeof input === "string"
        ? input
        : input instanceof URL
        ? input.href
        : input.url;
    const method: string = init?.method || "GET";
    const requestURL: URL = new URL(urlString, window.location.origin);
    const requestDomain: string = requestURL.hostname;
    const currentPageDomain: string = window.location.hostname;

    if (isBlockedDomain(requestDomain)) {
      logRequest(method, urlString, "intercepted");
      return Promise.resolve(fakeResponse(init?.body));
    }

    if (requestDomain !== currentPageDomain) {
      logRequest(method, urlString, "external");
    } else {
      logRequest(method, urlString, "normal");
    }

    return originalFetch(input, init);
  };

  class XMLHttpRequestMock extends originalXMLRequest {
    open(
      method: string,
      url: string,
      async: boolean = true,
      user?: string,
      password?: string
    ): void {
      const requestURL = new URL(url, window.location.origin);
      const isExternalRequest =
        requestURL.hostname !== window.location.hostname;

      if (isBlockedDomain(requestURL.hostname)) {
        logRequest(method, url, "intercepted");
        this.send = (data?: any): void => {
          data && console.log("SpyXBody:", data);
        };
        return;
      }

      if (isExternalRequest) {
        logRequest(method, url, "external");
      } else {
        logRequest(method, url);
      }
      super.open(method, url, async, user, password);
    }
  }

  window.XMLHttpRequest = XMLHttpRequestMock as any;
  toast("隐私防御已启动");
})();

// (() => {
//   const originalFetch: typeof fetch = window.fetch;

//   window.fetch = async (
//     input: RequestInfo | URL,
//     init?: RequestInit
//   ): Promise<Response> => {
//     // 将输入转换为字符串URL
//     const urlString: string =
//       typeof input === "string"
//         ? input
//         : input instanceof URL
//         ? input.href
//         : input.url;
//     const method: string = init?.method || "GET";

//     // 解析当前页面的域名和请求的域名
//     const currentPageDomain: string = window.location.hostname;
//     const requestURL: URL = new URL(urlString, window.location.origin);
//     const requestDomain: string = requestURL.hostname;

//     // 检查是否为外部请求
//     if (requestDomain !== currentPageDomain) {
//       console.log(`[外部] ${method} ${urlString}`);
//     } else {
//       console.log(`[${method}] ${urlString}`);
//     }

//     // cspell:words closeai
//     if (requestDomain.includes("closeai.biz")) {
//       console.log(`老大哥: ${method} ${urlString}`);

//       const fakeResponse = new Response(JSON.stringify({ message: ":)" }), {
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//       });
//       if (init && init.body) {
//         console.log(`SpyRBody: ${init.body}`);
//       }
//       // :)
//       return Promise.resolve(fakeResponse);
//     }
//     return originalFetch(input, init);
//   };

//   // 保存原始 XMLHttpRequest 构造函数
//   const originalXMLHttpRequest: typeof XMLHttpRequest = window.XMLHttpRequest;

//   // 定义一个继承自原始 XMLHttpRequest 的类
//   class XMLHttpRequestMock extends originalXMLHttpRequest {
//     constructor() {
//       super();

//       // 拦截 open 方法
//       const originalOpen = this.open;
//       this.open = (
//         method: string,
//         url: string,
//         async: boolean = true,
//         user?: string,
//         password?: string
//       ): void => {
//         // 判断是否为外部请求
//         const requestURL = new URL(url, window.location.origin);
//         const isExternalRequest =
//           requestURL.hostname !== window.location.hostname;
//         if (isExternalRequest) {
//           console.log(`[外部请求] ${method} ${url}`);
//         } else {
//           console.log(`[${method}] ${url}`);
//         }

//         // 检查是否需要拦截并假装返回成功
//         if (requestURL.hostname.includes("github.com")) {
//           console.log(`拦截请求: ${method} ${url}`);
//           // 重写 send 方法来模拟响应
//           this.send = (data?: any): void => {
//             console.log(`请求内容: ${data}`);
//           };
//           return; // 阻止调用原始 open 方法
//         }

//         // 对于其他请求，正常执行原始 open 方法
//         originalOpen.call(this, method, url, async, user, password);
//       };
//     }
//   }

//   // 覆盖全局的 XMLHttpRequest 函数
//   window.XMLHttpRequest = XMLHttpRequestMock as any;
// })();
