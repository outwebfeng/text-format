"use client";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import { useState, useEffect, useCallback, useMemo } from "react";
import HeadInfo from "~/components/HeadInfo";
import confetti from 'canvas-confetti';
import GoogleAdFixed from "~/components/GoogleAdFixed";


interface FontRemoverComponentProps {
  locale?: string;
  indexLanguageText: any;
  fontRemoverText: any;
}

const FontRemoverComponent: React.FC<FontRemoverComponentProps> = ({
  locale = "",
  indexLanguageText,
  fontRemoverText,
}) => {
  const [inputText, setInputText] = useState("");
  const [preserveSymbols, setPreserveSymbols] = useState("");

  // 完整的Unicode字符映射表
  const fontMappings = useMemo(() => {
    const mappings = new Map();
    
    // 数学字母数字符号 - 粗体 (Mathematical Alphanumeric Symbols - Bold)
    const boldStart = 0x1D400;
    for (let i = 0; i < 26; i++) {
      mappings.set(String.fromCodePoint(boldStart + i), String.fromCharCode(65 + i)); // A-Z
      mappings.set(String.fromCodePoint(boldStart + 26 + i), String.fromCharCode(97 + i)); // a-z
    }
    
    // 数学字母数字符号 - 斜体 (Mathematical Alphanumeric Symbols - Italic)
    const italicStart = 0x1D434;
    for (let i = 0; i < 26; i++) {
      mappings.set(String.fromCodePoint(italicStart + i), String.fromCharCode(65 + i)); // A-Z
      mappings.set(String.fromCodePoint(italicStart + 26 + i), String.fromCharCode(97 + i)); // a-z
    }
    
    // 数学字母数字符号 - 粗斜体 (Mathematical Alphanumeric Symbols - Bold Italic)
    const boldItalicStart = 0x1D468;
    for (let i = 0; i < 26; i++) {
      mappings.set(String.fromCodePoint(boldItalicStart + i), String.fromCharCode(65 + i)); // A-Z
      mappings.set(String.fromCodePoint(boldItalicStart + 26 + i), String.fromCharCode(97 + i)); // a-z
    }
    
    // 数学字母数字符号 - 手写体/脚本体 (Mathematical Alphanumeric Symbols - Script)
    const scriptStart = 0x1D49C;
    for (let i = 0; i < 26; i++) {
      mappings.set(String.fromCodePoint(scriptStart + i), String.fromCharCode(65 + i)); // A-Z
      mappings.set(String.fromCodePoint(scriptStart + 26 + i), String.fromCharCode(97 + i)); // a-z
    }
    
    // 数学字母数字符号 - 粗手写体 (Mathematical Alphanumeric Symbols - Bold Script)
    const boldScriptStart = 0x1D4D0;
    for (let i = 0; i < 26; i++) {
      mappings.set(String.fromCodePoint(boldScriptStart + i), String.fromCharCode(65 + i)); // A-Z
      mappings.set(String.fromCodePoint(boldScriptStart + 26 + i), String.fromCharCode(97 + i)); // a-z
    }
    
    // 数学字母数字符号 - 哥特体/Fraktur (Mathematical Alphanumeric Symbols - Fraktur)
    const frakturStart = 0x1D504;
    for (let i = 0; i < 26; i++) {
      mappings.set(String.fromCodePoint(frakturStart + i), String.fromCharCode(65 + i)); // A-Z
      mappings.set(String.fromCodePoint(frakturStart + 26 + i), String.fromCharCode(97 + i)); // a-z
    }
    
    // 数学字母数字符号 - 粗哥特体 (Mathematical Alphanumeric Symbols - Bold Fraktur)
    const boldFrakturStart = 0x1D56C;
    for (let i = 0; i < 26; i++) {
      mappings.set(String.fromCodePoint(boldFrakturStart + i), String.fromCharCode(65 + i)); // A-Z
      mappings.set(String.fromCodePoint(boldFrakturStart + 26 + i), String.fromCharCode(97 + i)); // a-z
    }
    
    // 数学字母数字符号 - 双线体 (Mathematical Alphanumeric Symbols - Double-struck)
    const doubleStruckStart = 0x1D538;
    for (let i = 0; i < 26; i++) {
      mappings.set(String.fromCodePoint(doubleStruckStart + i), String.fromCharCode(65 + i)); // A-Z
      mappings.set(String.fromCodePoint(doubleStruckStart + 26 + i), String.fromCharCode(97 + i)); // a-z
    }
    
    // 数学字母数字符号 - 无衬线体 (Mathematical Alphanumeric Symbols - Sans-serif)
    const sansSerifStart = 0x1D5A0;
    for (let i = 0; i < 26; i++) {
      mappings.set(String.fromCodePoint(sansSerifStart + i), String.fromCharCode(65 + i)); // A-Z
      mappings.set(String.fromCodePoint(sansSerifStart + 26 + i), String.fromCharCode(97 + i)); // a-z
    }
    
    // 数学字母数字符号 - 粗无衬线体 (Mathematical Alphanumeric Symbols - Sans-serif Bold)
    const boldSansSerifStart = 0x1D5D4;
    for (let i = 0; i < 26; i++) {
      mappings.set(String.fromCodePoint(boldSansSerifStart + i), String.fromCharCode(65 + i)); // A-Z
      mappings.set(String.fromCodePoint(boldSansSerifStart + 26 + i), String.fromCharCode(97 + i)); // a-z
    }
    
    // 数学字母数字符号 - 斜无衬线体 (Mathematical Alphanumeric Symbols - Sans-serif Italic)
    const italicSansSerifStart = 0x1D608;
    for (let i = 0; i < 26; i++) {
      mappings.set(String.fromCodePoint(italicSansSerifStart + i), String.fromCharCode(65 + i)); // A-Z
      mappings.set(String.fromCodePoint(italicSansSerifStart + 26 + i), String.fromCharCode(97 + i)); // a-z
    }
    
    // 数学字母数字符号 - 粗斜无衬线体 (Mathematical Alphanumeric Symbols - Sans-serif Bold Italic)
    const boldItalicSansSerifStart = 0x1D63C;
    for (let i = 0; i < 26; i++) {
      mappings.set(String.fromCodePoint(boldItalicSansSerifStart + i), String.fromCharCode(65 + i)); // A-Z
      mappings.set(String.fromCodePoint(boldItalicSansSerifStart + 26 + i), String.fromCharCode(97 + i)); // a-z
    }
    
    // 数学字母数字符号 - 等宽体 (Mathematical Alphanumeric Symbols - Monospace)
    const monospaceStart = 0x1D670;
    for (let i = 0; i < 26; i++) {
      mappings.set(String.fromCodePoint(monospaceStart + i), String.fromCharCode(65 + i)); // A-Z
      mappings.set(String.fromCodePoint(monospaceStart + 26 + i), String.fromCharCode(97 + i)); // a-z
    }
    
    // 数学字母数字符号 - 数字
    const boldDigitsStart = 0x1D7CE;
    const doubleStruckDigitsStart = 0x1D7D8;
    const sansSerifDigitsStart = 0x1D7E2;
    const boldSansSerifDigitsStart = 0x1D7EC;
    const monospaceDigitsStart = 0x1D7F6;
    
    for (let i = 0; i < 10; i++) {
      mappings.set(String.fromCodePoint(boldDigitsStart + i), String.fromCharCode(48 + i)); // 0-9
      mappings.set(String.fromCodePoint(doubleStruckDigitsStart + i), String.fromCharCode(48 + i)); // 0-9
      mappings.set(String.fromCodePoint(sansSerifDigitsStart + i), String.fromCharCode(48 + i)); // 0-9
      mappings.set(String.fromCodePoint(boldSansSerifDigitsStart + i), String.fromCharCode(48 + i)); // 0-9
      mappings.set(String.fromCodePoint(monospaceDigitsStart + i), String.fromCharCode(48 + i)); // 0-9
    }
    
    // 圆圈字母和数字 (Enclosed Alphanumerics)
    const circledLatinStart = 0x24B6;
    for (let i = 0; i < 26; i++) {
      mappings.set(String.fromCodePoint(circledLatinStart + i), String.fromCharCode(65 + i)); // Ⓐ-Ⓩ
    }
    
    const circledLatinLowerStart = 0x24D0;
    for (let i = 0; i < 26; i++) {
      mappings.set(String.fromCodePoint(circledLatinLowerStart + i), String.fromCharCode(97 + i)); // ⓐ-ⓩ
    }
    
    const circledDigitsStart = 0x2460;
    for (let i = 0; i < 20; i++) {
      if (i < 9) {
        mappings.set(String.fromCodePoint(circledDigitsStart + i), String.fromCharCode(49 + i)); // ①-⑨
      } else if (i === 9) {
        mappings.set(String.fromCodePoint(circledDigitsStart + i), '10'); // ⑩
      } else {
        mappings.set(String.fromCodePoint(circledDigitsStart + i), String(i + 1)); // ⑪-⑳
      }
    }
    
    // 带括号的字母和数字 (Enclosed Alphanumerics)
    const parenthesizedLatinStart = 0x249C;
    for (let i = 0; i < 26; i++) {
      mappings.set(String.fromCodePoint(parenthesizedLatinStart + i), String.fromCharCode(97 + i)); // ⒜-⒵
    }
    
    // 罗马数字 (Number Forms)
    const romanNumerals = {
      'Ⅰ': '1', 'Ⅱ': '2', 'Ⅲ': '3', 'Ⅳ': '4', 'Ⅴ': '5', 'Ⅵ': '6', 'Ⅶ': '7', 'Ⅷ': '8', 'Ⅸ': '9', 'Ⅹ': '10',
      'Ⅺ': '11', 'Ⅻ': '12', 'Ⅼ': '50', 'Ⅽ': '100', 'Ⅾ': '500', 'Ⅿ': '1000',
      'ⅰ': '1', 'ⅱ': '2', 'ⅲ': '3', 'ⅳ': '4', 'ⅴ': '5', 'ⅵ': '6', 'ⅶ': '7', 'ⅷ': '8', 'ⅸ': '9', 'ⅹ': '10',
      'ⅺ': '11', 'ⅻ': '12', 'ⅼ': '50', 'ⅽ': '100', 'ⅾ': '500', 'ⅿ': '1000'
    };
    
    Object.entries(romanNumerals).forEach(([roman, arabic]) => {
      mappings.set(roman, arabic);
    });
    
    // 全角字符 (Fullwidth Forms)
    const fullwidthLatinStart = 0xFF21;
    for (let i = 0; i < 26; i++) {
      mappings.set(String.fromCodePoint(fullwidthLatinStart + i), String.fromCharCode(65 + i)); // Ａ-Ｚ
      mappings.set(String.fromCodePoint(fullwidthLatinStart + 32 + i), String.fromCharCode(97 + i)); // ａ-ｚ
    }
    
    const fullwidthDigitsStart = 0xFF10;
    for (let i = 0; i < 10; i++) {
      mappings.set(String.fromCodePoint(fullwidthDigitsStart + i), String.fromCharCode(48 + i)); // ０-９
    }
    
    // 上标和下标 (Superscripts and Subscripts)
    const superscripts = {
      '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
      'ᵃ': 'a', 'ᵇ': 'b', 'ᶜ': 'c', 'ᵈ': 'd', 'ᵉ': 'e', 'ᶠ': 'f', 'ᵍ': 'g', 'ʰ': 'h', 'ⁱ': 'i', 'ʲ': 'j',
      'ᵏ': 'k', 'ˡ': 'l', 'ᵐ': 'm', 'ⁿ': 'n', 'ᵒ': 'o', 'ᵖ': 'p', 'ʳ': 'r', 'ˢ': 's', 'ᵗ': 't', 'ᵘ': 'u',
      'ᵛ': 'v', 'ʷ': 'w', 'ˣ': 'x', 'ʸ': 'y', 'ᶻ': 'z'
    };
    
    const subscripts = {
      '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
      'ₐ': 'a', 'ₑ': 'e', 'ₕ': 'h', 'ᵢ': 'i', 'ⱼ': 'j', 'ₖ': 'k', 'ₗ': 'l', 'ₘ': 'm', 'ₙ': 'n', 'ₒ': 'o',
      'ₚ': 'p', 'ᵣ': 'r', 'ₛ': 's', 'ₜ': 't', 'ᵤ': 'u', 'ᵥ': 'v', 'ₓ': 'x'
    };
    
    Object.entries(superscripts).forEach(([sup, normal]) => {
      mappings.set(sup, normal);
    });
    
    Object.entries(subscripts).forEach(([sub, normal]) => {
      mappings.set(sub, normal);
    });
    
    // 其他装饰字符
    const otherMappings = {
      // 反转字符
      'ɐ': 'a', 'ɯ': 'm', 'ǝ': 'e', 'ɹ': 'r', 'ʇ': 't', 'ʎ': 'y', 'ʌ': 'v',
      // 特殊符号
      '🅐': 'A', '🅑': 'B', '🅒': 'C', '🅓': 'D', '🅔': 'E', '🅕': 'F', '🅖': 'G', '🅗': 'H', '🅘': 'I', '🅙': 'J',
      '🅚': 'K', '🅛': 'L', '🅜': 'M', '🅝': 'N', '🅞': 'O', '🅟': 'P', '🅠': 'Q', '🅡': 'R', '🅢': 'S', '🅣': 'T',
      '🅤': 'U', '🅥': 'V', '🅦': 'W', '🅧': 'X', '🅨': 'Y', '🅩': 'Z'
    };
    
    Object.entries(otherMappings).forEach(([decorated, normal]) => {
      mappings.set(decorated, normal);
    });
    
    return mappings;
  }, []);

  const removeFonts = useCallback((text: string) => {
    if (!text) return '';
    
    const preserveChars = new Set(preserveSymbols.split(''));
    let result = '';
    
    for (const char of text) {
      // 如果字符在保留列表中，直接保留
      if (preserveChars.has(char)) {
        result += char;
        continue;
      }
      
      // 查找映射
      const mapped = fontMappings.get(char);
      if (mapped) {
        result += mapped;
      } else {
        // 如果没有映射，保留原字符
        result += char;
      }
    }
    
    return result;
  }, [preserveSymbols, fontMappings]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inputText);
      confetti({ particleCount: 300, spread: 200, origin: { y: 0.6 } });
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert("Failed to copy text: " + err);
    }
  };

  const handleClear = () => {
    setInputText('');
  };

  const handleApply = () => {
    if (!inputText.trim()) return;
    const result = removeFonts(inputText);
    setInputText(result);
  };

  const buttons = [
    { name: fontRemoverText.copy, action: handleCopy },
    { name: fontRemoverText.clear, action: handleClear },
  ];

  return (
    <>
      <HeadInfo
        title={fontRemoverText.title}
        description={fontRemoverText.description}
        keywords={fontRemoverText.keywords}
        locale={locale}
        page={"/fontremover"}
      />
      <Header
        locale={locale}
        page={"fontremover"}
        indexLanguageText={indexLanguageText}
      />
      <div className="p-4 space-y-4">
        <div className="block overflow-hidden bg-[#020d24] bg-cover bg-center text-white">
          <div className="mx-auto w-full max-w-7xl px-5 mb-5">
            <div className="mx-auto flex max-w-4xl flex-col items-center text-center py-1">
              <h1 className="mb-4 text-4xl font-bold md:text-6xl">
                {fontRemoverText.h1}
              </h1>
              <p className="text-[#7c8aaa] text-lg text-left">
                {fontRemoverText.h1_desc}
              </p>
            </div>

            {/* 固定广告 */}
            <GoogleAdFixed />

            {/* 主要功能区域 */}
            <div>
              <div className="w-[90%] mx-auto rounded-tl-[30px] rounded-tr-[30px] border-[12px] border-[#ffffff1f]">
                <form className="relative shadow-lg">
                  <div className="overflow-hidden focus-within:ring-1 focus-within:ring-indigo-500 rounded-tl-[20px] rounded-tr-[20px]">
                    <textarea
                      rows={10}
                      name="contentText"
                      id="contentText"
                      className="block w-full resize-none border border-[#7c8aaa] text-gray-900 placeholder:text-gray-400 focus:ring-0 text-lg pt-4 pl-4"
                      placeholder={fontRemoverText.default_text}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 px-2 py-2 bg-white text-black">
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

                  <div className="p-4 bg-white text-[#7c8aaa]">
                    <h2 className="text-2xl mb-4">
                      {fontRemoverText.font_settings}
                    </h2>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {fontRemoverText.preserve_symbols}
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded text-black"
                          placeholder={fontRemoverText.preserve_symbols_placeholder}
                          value={preserveSymbols}
                          onChange={(e) => setPreserveSymbols(e.target.value)}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          {fontRemoverText.preserve_symbols_desc}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      className="mt-4 p-2 bg-blue-500 text-white rounded m-2"
                      onClick={handleApply}
                    >
                      {fontRemoverText.apply}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* 功能说明区域 */}
            <div className="w-[95%] mx-auto h-full my-8 text-white w-full max-w-5xl mx-auto">
              <h2 className="text-2xl mb-4">{fontRemoverText.about_title}</h2>
              <p className="text-[#7c8aaa] mb-6">{fontRemoverText.about_desc}</p>

              <h2 className="text-2xl mb-4 mt-8">{fontRemoverText.features_title}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl mb-2">{fontRemoverText.feature_1_title}</h3>
                  <p className="text-[#7c8aaa]">{fontRemoverText.feature_1_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{fontRemoverText.feature_2_title}</h3>
                  <p className="text-[#7c8aaa]">{fontRemoverText.feature_2_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{fontRemoverText.feature_3_title}</h3>
                  <p className="text-[#7c8aaa]">{fontRemoverText.feature_3_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{fontRemoverText.feature_4_title}</h3>
                  <p className="text-[#7c8aaa]">{fontRemoverText.feature_4_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{fontRemoverText.feature_5_title}</h3>
                  <p className="text-[#7c8aaa]">{fontRemoverText.feature_5_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{fontRemoverText.feature_6_title}</h3>
                  <p className="text-[#7c8aaa]">{fontRemoverText.feature_6_desc}</p>
                </div>
              </div>

              {/* FAQ Section */}
              <h2 className="text-2xl mb-4 mt-8">{fontRemoverText.faq_title}</h2>
              <div className="space-y-6">
                <div className="border-b border-[#7c8aaa] pb-4">
                  <h3 className="text-xl mb-2 font-semibold">{fontRemoverText.faq_1_title}</h3>
                  <p className="text-[#7c8aaa]">{fontRemoverText.faq_1_desc}</p>
                </div>
                <div className="border-b border-[#7c8aaa] pb-4">
                  <h3 className="text-xl mb-2 font-semibold">{fontRemoverText.faq_2_title}</h3>
                  <p className="text-[#7c8aaa]">{fontRemoverText.faq_2_desc}</p>
                </div>
                <div className="border-b border-[#7c8aaa] pb-4">
                  <h3 className="text-xl mb-2 font-semibold">{fontRemoverText.faq_3_title}</h3>
                  <p className="text-[#7c8aaa]">{fontRemoverText.faq_3_desc}</p>
                </div>
                <div className="border-b border-[#7c8aaa] pb-4">
                  <h3 className="text-xl mb-2 font-semibold">{fontRemoverText.faq_4_title}</h3>
                  <p className="text-[#7c8aaa]">{fontRemoverText.faq_4_desc}</p>
                </div>
                <div className="border-b border-[#7c8aaa] pb-4">
                  <h3 className="text-xl mb-2 font-semibold">{fontRemoverText.faq_5_title}</h3>
                  <p className="text-[#7c8aaa]">{fontRemoverText.faq_5_desc}</p>
                </div>
                <div className="border-b border-[#7c8aaa] pb-4">
                  <h3 className="text-xl mb-2 font-semibold">{fontRemoverText.faq_6_title}</h3>
                  <p className="text-[#7c8aaa]">{fontRemoverText.faq_6_desc}</p>
                </div>
              </div>

              {/* 使用说明 */}
              <h2 className="text-2xl mb-4 mt-8">{fontRemoverText.how_to_use_title}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl mb-2">{fontRemoverText.step_1_title}</h3>
                  <p className="text-[#7c8aaa]">{fontRemoverText.step_1_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{fontRemoverText.step_2_title}</h3>
                  <p className="text-[#7c8aaa]">{fontRemoverText.step_2_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{fontRemoverText.step_3_title}</h3>
                  <p className="text-[#7c8aaa]">{fontRemoverText.step_3_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{fontRemoverText.step_4_title}</h3>
                  <p className="text-[#7c8aaa]">{fontRemoverText.step_4_desc}</p>
                </div>
              </div>

              {/* 使用场景 */}
              <h2 className="text-2xl mb-4 mt-8">{fontRemoverText.use_cases_title}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl mb-2">{fontRemoverText.use_case_1_title}</h3>
                  <p className="text-[#7c8aaa]">{fontRemoverText.use_case_1_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{fontRemoverText.use_case_2_title}</h3>
                  <p className="text-[#7c8aaa]">{fontRemoverText.use_case_2_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{fontRemoverText.use_case_3_title}</h3>
                  <p className="text-[#7c8aaa]">{fontRemoverText.use_case_3_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{fontRemoverText.use_case_4_title}</h3>
                  <p className="text-[#7c8aaa]">{fontRemoverText.use_case_4_desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FontRemoverComponent; 