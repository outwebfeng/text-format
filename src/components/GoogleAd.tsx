import { useEffect, useRef } from "react";

const GoogleAd = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (typeof window === "undefined") {
        console.log("GoogleAd: SSR 阶段，不执行广告逻辑");
        return;
      }

      // 检查脚本是否已加载
      const scriptId = "adsbygoogle-js";
      let script: HTMLScriptElement | null = null;
      if (!document.getElementById(scriptId)) {
        console.log("GoogleAd: 注入 adsbygoogle.js 脚本");
        script = document.createElement("script");
        script.id = scriptId;
        script.async = true;
        script.src =
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7741547389250990";
        script.crossOrigin = "anonymous";
        document.body.appendChild(script);
      } else {
        console.log("GoogleAd: adsbygoogle.js 脚本已存在");
        script = document.getElementById(scriptId) as HTMLScriptElement;
      }

      // 清空旧广告
      if (adRef.current) {
        adRef.current.innerHTML = "";
        // 创建 <ins> 标签
        const ins = document.createElement("ins");
        ins.className = "adsbygoogle";
        ins.style.display = "block";
        ins.setAttribute("data-ad-client", "ca-pub-7741547389250990");
        ins.setAttribute("data-ad-slot", "7321261240");
        ins.setAttribute("data-ad-format", "auto");
        ins.setAttribute("data-full-width-responsive", "true");
        adRef.current.appendChild(ins);
        console.log("GoogleAd: 已插入 <ins class='adsbygoogle'> 标签");

        // 初始化广告
        const pushAd = () => {
          try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            console.log("GoogleAd: 已 push adsbygoogle");
          } catch (e) {
            console.log("GoogleAd: push adsbygoogle 失败", e);
          }
        };

        // 等待脚本加载完成后再 push
        if (!(window as any).adsbygoogle) {
          // 监听脚本加载
          const onScriptLoad = () => {
            console.log("GoogleAd: adsbygoogle.js 脚本已加载，开始 push");
            pushAd();
            if (script) {
              script.removeEventListener("load", onScriptLoad);
            }
          };
          if (script) {
            script.addEventListener("load", onScriptLoad);
          }
        } else {
          console.log("GoogleAd: adsbygoogle 已存在，直接 push");
          pushAd();
        }
      } else {
        console.log("GoogleAd: adRef.current 为空，未插入广告标签");
      }
    } catch (err) {
      console.error("GoogleAd: useEffect 执行出错", err);
    }
  }, []);

  return <div ref={adRef} />;
};

export default GoogleAd; 