"use client";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import { useState } from "react";
import HeadInfo from "~/components/HeadInfo";
import confetti from 'canvas-confetti';

const RemoveDuplicatesComponent = ({
  locale = "",
  indexLanguageText,
  removeDuplicatesText,
}) => {
  const [textStr, setTextStr] = useState("");
  
  // 去除重复行相关的状态
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [sortAscending, setSortAscending] = useState(false);
  const [sortDescending, setSortDescending] = useState(false);

  const handleInputChange = (e) => {
    const { name, checked } = e.target;
    switch (name) {
      case "ignore_case":
        setIgnoreCase(checked);
        break;
      case "sort_ascending":
        setSortAscending(checked);
        if (checked) setSortDescending(false); // 只能选择一种排序方式
        break;
      case "sort_descending":
        setSortDescending(checked);
        if (checked) setSortAscending(false); // 只能选择一种排序方式
        break;
      default:
        break;
    }
  };

  const applySettings = () => {
    if (!textStr.trim()) return;

    // 将文本按行分割
    let lines = textStr.split(/\r?\n/);
    
    // 去除重复行的逻辑
    const seen = new Set();
    const uniqueLines = [];
    
    for (const line of lines) {
      const compareStr = ignoreCase ? line.toLowerCase() : line;
      if (!seen.has(compareStr)) {
        seen.add(compareStr);
        uniqueLines.push(line);
      }
    }
    
    // 排序处理
    let resultLines = uniqueLines;
    if (sortAscending) {
      resultLines = uniqueLines.sort((a, b) => {
        const aStr = ignoreCase ? a.toLowerCase() : a;
        const bStr = ignoreCase ? b.toLowerCase() : b;
        return aStr.localeCompare(bStr);
      });
    } else if (sortDescending) {
      resultLines = uniqueLines.sort((a, b) => {
        const aStr = ignoreCase ? a.toLowerCase() : a;
        const bStr = ignoreCase ? b.toLowerCase() : b;
        return bStr.localeCompare(aStr);
      });
    }

    setTextStr(resultLines.join('\n'));
  };

  const copyText = () => {
    navigator.clipboard.writeText(textStr).then(
      () => {
        confetti({ particleCount: 300, spread: 200, origin: { y: 0.6 } });
      },
      (err) => {
        alert("Failed to copy text: " + err);
      }
    );
  };

  const clearText = () => {
    setTextStr("");
  };

  const buttons = [
    { name: removeDuplicatesText.copy, action: copyText },
    { name: removeDuplicatesText.clear, action: clearText },
  ];

  return (
    <>
      <HeadInfo
        title={removeDuplicatesText.title}
        description={removeDuplicatesText.description}
        keywords={removeDuplicatesText.keywords}
        locale={locale}
        page={"/removeduplicates"}
      />
      <Header
        locale={locale}
        page={"removeduplicates"}
        indexLanguageText={indexLanguageText}
      />
      <div className="p-4 space-y-4">
        <div className="block overflow-hidden bg-[#020d24] bg-cover bg-center text-white">
          <div className="mx-auto w-full max-w-7xl px-5 mb-5">
            <div className="mx-auto flex max-w-4xl flex-col items-center text-center py-1">
              <h1 className="mb-4 text-4xl font-bold md:text-6xl">
                {removeDuplicatesText.h1}
              </h1>
              <p className="text-[#7c8aaa] text-lg text-left">
                {removeDuplicatesText.h1_desc}
              </p>
            </div>

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
                      placeholder={removeDuplicatesText.default_text}
                      value={textStr}
                      onChange={(e) => setTextStr(e.target.value)}
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
                      {removeDuplicatesText.duplicate_settings}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="ignore_case"
                          checked={ignoreCase}
                          onChange={handleInputChange}
                        />
                        <span>{removeDuplicatesText.ignore_case}</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="sort_ascending"
                          checked={sortAscending}
                          onChange={handleInputChange}
                        />
                        <span>{removeDuplicatesText.sort_ascending}</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="sort_descending"
                          checked={sortDescending}
                          onChange={handleInputChange}
                        />
                        <span>{removeDuplicatesText.sort_descending}</span>
                      </label>
                    </div>

                    <button
                      type="button"
                      className="mt-4 p-2 bg-blue-500 text-white rounded m-2"
                      onClick={applySettings}
                    >
                      {removeDuplicatesText.apply}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* 功能说明区域 */}
            <div className="w-[95%] mx-auto h-full my-8 text-white w-full max-w-5xl mx-auto">
              <h2 className="text-2xl mb-4">{removeDuplicatesText.about_title}</h2>
              <p className="text-[#7c8aaa]">{removeDuplicatesText.about_desc}</p>

              <h2 className="text-2xl mb-4 mt-8">{removeDuplicatesText.features_title}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl mb-2">{removeDuplicatesText.feature_1_title}</h3>
                  <p className="text-[#7c8aaa]">{removeDuplicatesText.feature_1_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{removeDuplicatesText.feature_2_title}</h3>
                  <p className="text-[#7c8aaa]">{removeDuplicatesText.feature_2_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{removeDuplicatesText.feature_3_title}</h3>
                  <p className="text-[#7c8aaa]">{removeDuplicatesText.feature_3_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{removeDuplicatesText.feature_4_title}</h3>
                  <p className="text-[#7c8aaa]">{removeDuplicatesText.feature_4_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{removeDuplicatesText.feature_5_title}</h3>
                  <p className="text-[#7c8aaa]">{removeDuplicatesText.feature_5_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{removeDuplicatesText.feature_6_title}</h3>
                  <p className="text-[#7c8aaa]">{removeDuplicatesText.feature_6_desc}</p>
                </div>
              </div>

              {/* FAQ Section */}
              <h2 className="text-2xl mb-4 mt-8">{removeDuplicatesText.faq_title}</h2>
              <div className="space-y-6">
                <div className="border-b border-[#7c8aaa] pb-4">
                  <h3 className="text-xl mb-2 font-semibold">{removeDuplicatesText.faq_1_title}</h3>
                  <p className="text-[#7c8aaa]">{removeDuplicatesText.faq_1_desc}</p>
                </div>
                <div className="border-b border-[#7c8aaa] pb-4">
                  <h3 className="text-xl mb-2 font-semibold">{removeDuplicatesText.faq_2_title}</h3>
                  <p className="text-[#7c8aaa]">{removeDuplicatesText.faq_2_desc}</p>
                </div>
                <div className="border-b border-[#7c8aaa] pb-4">
                  <h3 className="text-xl mb-2 font-semibold">{removeDuplicatesText.faq_3_title}</h3>
                  <p className="text-[#7c8aaa]">{removeDuplicatesText.faq_3_desc}</p>
                </div>
                <div className="border-b border-[#7c8aaa] pb-4">
                  <h3 className="text-xl mb-2 font-semibold">{removeDuplicatesText.faq_4_title}</h3>
                  <p className="text-[#7c8aaa]">{removeDuplicatesText.faq_4_desc}</p>
                </div>
                <div className="border-b border-[#7c8aaa] pb-4">
                  <h3 className="text-xl mb-2 font-semibold">{removeDuplicatesText.faq_5_title}</h3>
                  <p className="text-[#7c8aaa]">{removeDuplicatesText.faq_5_desc}</p>
                </div>
                <div className="border-b border-[#7c8aaa] pb-4">
                  <h3 className="text-xl mb-2 font-semibold">{removeDuplicatesText.faq_6_title}</h3>
                  <p className="text-[#7c8aaa]">{removeDuplicatesText.faq_6_desc}</p>
                </div>
              </div>

              {/* 使用说明 */}
              <h2 className="text-2xl mb-4 mt-8">{removeDuplicatesText.how_to_use_title}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl mb-2">{removeDuplicatesText.step_1_title}</h3>
                  <p className="text-[#7c8aaa]">{removeDuplicatesText.step_1_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{removeDuplicatesText.step_2_title}</h3>
                  <p className="text-[#7c8aaa]">{removeDuplicatesText.step_2_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{removeDuplicatesText.step_3_title}</h3>
                  <p className="text-[#7c8aaa]">{removeDuplicatesText.step_3_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{removeDuplicatesText.step_4_title}</h3>
                  <p className="text-[#7c8aaa]">{removeDuplicatesText.step_4_desc}</p>
                </div>
              </div>

              {/* 使用场景 */}
              <h2 className="text-2xl mb-4 mt-8">{removeDuplicatesText.use_cases_title}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl mb-2">{removeDuplicatesText.use_case_1_title}</h3>
                  <p className="text-[#7c8aaa]">{removeDuplicatesText.use_case_1_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{removeDuplicatesText.use_case_2_title}</h3>
                  <p className="text-[#7c8aaa]">{removeDuplicatesText.use_case_2_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{removeDuplicatesText.use_case_3_title}</h3>
                  <p className="text-[#7c8aaa]">{removeDuplicatesText.use_case_3_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{removeDuplicatesText.use_case_4_title}</h3>
                  <p className="text-[#7c8aaa]">{removeDuplicatesText.use_case_4_desc}</p>
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

export default RemoveDuplicatesComponent; 