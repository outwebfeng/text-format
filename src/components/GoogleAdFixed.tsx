"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const GoogleAdFixed = () => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const adInitializedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // 防止重复初始化
    if (adInitializedRef.current) return;
    
    const loadAd = () => {
      try {
        // 检查容器是否存在且为空
        if (!adContainerRef.current || adContainerRef.current.children.length > 0) {
          return;
        }

        // 创建广告元素
        const adElement = document.createElement("ins");
        adElement.className = "adsbygoogle";
        adElement.style.display = "inline-block";
        adElement.style.width = "728px";
        adElement.style.height = "90px";
        adElement.setAttribute("data-ad-client", "ca-pub-7741547389250990");
        adElement.setAttribute("data-ad-slot", "9909889778");
        
        // 添加到容器
        adContainerRef.current.appendChild(adElement);
        
        // 推送广告
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          adInitializedRef.current = true;
          console.log("GoogleAdFixed: 广告已成功初始化");
        } catch (e) {
          console.error("GoogleAdFixed: 推送广告失败", e);
        }
      } catch (err) {
        console.error("GoogleAdFixed: 加载广告出错", err);
      }
    };

    // 确保 AdSense 脚本已加载
    const scriptId = "adsbygoogle-js";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7741547389250990";
      script.crossOrigin = "anonymous";
      script.onload = () => {
        // 脚本加载完成后初始化广告
        setTimeout(loadAd, 100);
      };
      document.head.appendChild(script);
    } else {
      // 脚本已存在，直接加载广告
      if (window.adsbygoogle) {
        setTimeout(loadAd, 100);
      } else {
        // 等待 adsbygoogle 可用
        const checkInterval = setInterval(() => {
          if (window.adsbygoogle) {
            clearInterval(checkInterval);
            loadAd();
          }
        }, 100);
        
        // 5秒后停止检查
        setTimeout(() => clearInterval(checkInterval), 5000);
      }
    }

    // 清理函数
    return () => {
      // 不要清理广告内容，保持广告显示
    };
  }, []); // 空依赖数组，只在挂载时运行一次

  return (
    <div className="flex justify-center my-4">
      <div 
        ref={adContainerRef}
        style={{ 
          minHeight: "90px",
          width: "728px",
          maxWidth: "100%",
          overflow: "hidden"
        }}
      />
    </div>
  );
};

export default GoogleAdFixed;