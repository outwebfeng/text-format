"use client";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import { useState } from "react";
import HeadInfo from "~/components/HeadInfo";
import confetti from 'canvas-confetti';

const FormatHtmlComponent = ({
  locale = "",
  indexLanguageText,
  formatHtmlText,
}) => {
  const [htmlStr, setHtmlStr] = useState("");

  const formatHtml = () => {
    try {
      let formatted = htmlStr;
      
      // 移除多余的空白字符
      formatted = formatted.trim();
      
      // 在标签之间添加换行
      formatted = formatted.replace(/>\s*</g, '>\n<');
      
      // 处理注释
      formatted = formatted.replace(/<!--(.*?)-->/g, '\n<!--$1-->\n');
      
      // 分割成行
      const lines = formatted.split('\n');
      const indentSize = 2;
      const tagStack = [];
      
      // 处理每一行
      formatted = lines.map(line => {
        line = line.trim();
        if (!line) return '';
        
        // 提取标签名
        const getTagName = (tag) => {
          const match = tag.match(/<\/?([^\s>\/]+)/);
          return match ? match[1].toLowerCase() : '';
        };
        
        // 检查是否是自闭合标签
        const isSelfClosing = (tag) => {
          return /\/>$/.test(tag) || /^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)([>\s]|$)/i.test(tag);
        };
        
        // 检查是否是结束标签
        const isClosingTag = (tag) => {
          return /^<\//.test(tag);
        };
        
        // 检查是否是开始标签
        const isOpeningTag = (tag) => {
          return /^<[^\/]/.test(tag) && !isSelfClosing(tag);
        };
        
        let indent = tagStack.length;
        
        if (isClosingTag(line)) {
          const tagName = getTagName(line);
          // 查找匹配的开始标签
          let found = false;
          for (let i = tagStack.length - 1; i >= 0; i--) {
            if (tagStack[i] === tagName) {
              tagStack.splice(i);
              found = true;
              indent = i;
              break;
            }
          }
          // 如果没找到匹配的开始标签，保持当前缩进级别
          if (!found) {
            indent = Math.max(0, tagStack.length - 1);
          }
        } else if (isOpeningTag(line)) {
          const tagName = getTagName(line);
          tagStack.push(tagName);
        }
        
        // 对于自闭合标签，使用当前缩进级别
        if (isSelfClosing(line)) {
          indent = tagStack.length;
        }
        
        // 处理注释，使用当前缩进级别
        if (line.startsWith('<!--')) {
          indent = tagStack.length;
        }
        
        return ' '.repeat(Math.max(0, indent) * indentSize) + line;
      }).join('\n');
      
      setHtmlStr(formatted);
    } catch (error) {
      console.error('Error formatting HTML:', error);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(htmlStr).then(
      () => {
        confetti({ particleCount: 300, spread: 200, origin: { y: 0.6 } });
      },
      (err) => {
        alert("Failed to copy text: " + err);
      }
    );
  };

  const clearText = () => {
    setHtmlStr("");
  };

  const buttons = [
    { name: formatHtmlText.copy, action: copyText },
    { name: formatHtmlText.clear, action: clearText },
  ];

  return (
    <>
      <HeadInfo
        title={formatHtmlText.title}
        description={formatHtmlText.description}
        keywords={formatHtmlText.keywords}
        locale={locale}
        page={"/formathtmlonline"}
      />
      <Header
        locale={locale}
        page={"formathtmlonline"}
        indexLanguageText={indexLanguageText}
      />
      <div className="p-4 space-y-4">
        <div className="block overflow-hidden bg-[#020d24] bg-cover bg-center text-white">
          <div className="mx-auto w-full max-w-7xl px-5 mb-5">
            <div className="mx-auto flex max-w-4xl flex-col items-center text-center py-1">
              <h1 className="mb-4 text-4xl font-bold md:text-6xl">
                {formatHtmlText.h1}
              </h1>
              <p className="text-[#7c8aaa] text-lg text-left">
                {formatHtmlText.h1_desc}
              </p>
            </div>

            {/* 主要功能区域 */}
            <div>
              <div className="w-[90%] mx-auto rounded-tl-[30px] rounded-tr-[30px] border-[12px] border-[#ffffff1f]">
                <form className="relative shadow-lg">
                  <div className="overflow-hidden focus-within:ring-1 focus-within:ring-indigo-500 rounded-tl-[20px] rounded-tr-[20px]">
                    <textarea
                      rows={10}
                      name="htmlInput"
                      id="htmlInput"
                      className="block w-full resize-none border border-[#7c8aaa] text-gray-900 placeholder:text-gray-400 focus:ring-0 text-lg pt-4 pl-4 font-mono"
                      placeholder={formatHtmlText.default_text}
                      value={htmlStr}
                      onChange={(e) => setHtmlStr(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 px-2 py-2 bg-white text-black">
                    <button
                      type="button"
                      className="cursor-pointer p-2 rounded-lg border border-gray-200 text-sm bg-blue-500 text-white"
                      onClick={formatHtml}
                    >
                      {formatHtmlText.format}
                    </button>
                    {buttons.map((button, index) => (
                      <button
                        key={index}
                        type="button"
                        className="cursor-pointer p-2 rounded-lg border border-gray-200 text-sm"
                        onClick={button.action}
                      >
                        {button.name}
                      </button>
                    ))}
                  </div>
                </form>
              </div>
            </div>

            {/* 功能说明区域 */}
            <div className="w-[95%] mx-auto h-full my-8 text-white w-full max-w-5xl mx-auto">
              <h2 className="text-2xl mb-4">{formatHtmlText.about_title}</h2>
              <p className="text-[#7c8aaa]">{formatHtmlText.about_desc}</p>

              <h2 className="text-2xl mb-4 mt-8">{formatHtmlText.features_title}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl mb-2">{formatHtmlText.feature_1_title}</h3>
                  <p className="text-[#7c8aaa]">{formatHtmlText.feature_1_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{formatHtmlText.feature_2_title}</h3>
                  <p className="text-[#7c8aaa]">{formatHtmlText.feature_2_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{formatHtmlText.feature_3_title}</h3>
                  <p className="text-[#7c8aaa]">{formatHtmlText.feature_3_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{formatHtmlText.feature_4_title}</h3>
                  <p className="text-[#7c8aaa]">{formatHtmlText.feature_4_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{formatHtmlText.feature_5_title}</h3>
                  <p className="text-[#7c8aaa]">{formatHtmlText.feature_5_desc}</p>
                </div>
              </div>

              {/* FAQ Section */}
              <h2 className="text-2xl mb-4 mt-8">{formatHtmlText.faq_title}</h2>
              <div className="space-y-6">
                <div className="border-b border-[#7c8aaa] pb-4">
                  <h3 className="text-xl mb-2 font-semibold">{formatHtmlText.faq_1_title}</h3>
                  <p className="text-[#7c8aaa]">{formatHtmlText.faq_1_desc}</p>
                </div>
                <div className="border-b border-[#7c8aaa] pb-4">
                  <h3 className="text-xl mb-2 font-semibold">{formatHtmlText.faq_2_title}</h3>
                  <p className="text-[#7c8aaa]">{formatHtmlText.faq_2_desc}</p>
                </div>
                <div className="border-b border-[#7c8aaa] pb-4">
                  <h3 className="text-xl mb-2 font-semibold">{formatHtmlText.faq_3_title}</h3>
                  <p className="text-[#7c8aaa]">{formatHtmlText.faq_3_desc}</p>
                </div>
                <div className="border-b border-[#7c8aaa] pb-4">
                  <h3 className="text-xl mb-2 font-semibold">{formatHtmlText.faq_4_title}</h3>
                  <p className="text-[#7c8aaa]">{formatHtmlText.faq_4_desc}</p>
                </div>
                <div className="border-b border-[#7c8aaa] pb-4">
                  <h3 className="text-xl mb-2 font-semibold">{formatHtmlText.faq_5_title}</h3>
                  <p className="text-[#7c8aaa]">{formatHtmlText.faq_5_desc}</p>
                </div>
                <div className="border-b border-[#7c8aaa] pb-4">
                  <h3 className="text-xl mb-2 font-semibold">{formatHtmlText.faq_6_title}</h3>
                  <p className="text-[#7c8aaa]">{formatHtmlText.faq_6_desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer locale={locale} description={indexLanguageText.description} />
    </>
  );
};

export default FormatHtmlComponent; 