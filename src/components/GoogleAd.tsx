import { useEffect, useRef } from "react";

const GoogleAd = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 动态加载 Google Ads 脚本
    if (!(window as any).adsbygoogle) {
      const script = document.createElement("script");
      script.async = true;
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7741547389250990";
      script.crossOrigin = "anonymous";
      document.body.appendChild(script);
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

      // 初始化广告
      setTimeout(() => {
        try {
          (window as any).adsbygoogle = (window as any).adsbygoogle || [];
          (window as any).adsbygoogle.push({});
        } catch (e) {}
      }, 0);
    }
  }, []);

  return <div ref={adRef} />;
};

export default GoogleAd; 