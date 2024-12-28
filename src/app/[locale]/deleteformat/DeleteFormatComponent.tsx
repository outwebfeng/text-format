"use client";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import { useState } from "react";
import HeadInfo from "~/components/HeadInfo";
import confetti from 'canvas-confetti';

const DeleteFormatComponent = ({
  locale = "",
  indexLanguageText,
  deleteFormatText,
}) => {
  const [textStr, setTextStr] = useState("");
  
  // 删除格式相关的状态
  const [removeSpaces, setRemoveSpaces] = useState(false);
  const [removeNewlines, setRemoveNewlines] = useState(false);
  const [removeFormatting, setRemoveFormatting] = useState(false);
  const [removeIndentation, setRemoveIndentation] = useState(false);

  const handleInputChange = (e) => {
    const { name, checked } = e.target;
    switch (name) {
      case "remove_spaces":
        setRemoveSpaces(checked);
        break;
      case "remove_newlines":
        setRemoveNewlines(checked);
        break;
      case "remove_formatting":
        setRemoveFormatting(checked);
        break;
      case "remove_indentation":
        setRemoveIndentation(checked);
        break;
      default:
        break;
    }
  };

  const applySettings = () => {
    let modifiedText = textStr;

    if (removeSpaces) {
      modifiedText = modifiedText.replace(/\s+/g, ' ').trim();
    }
    if (removeNewlines) {
      modifiedText = modifiedText.replace(/[\r\n]+/g, ' ');
    }
    if (removeFormatting) {
      modifiedText = modifiedText.replace(/[\t\f\v]/g, '');
    }
    if (removeIndentation) {
      modifiedText = modifiedText.replace(/^[\s\t]+/gm, '');
    }

    setTextStr(modifiedText);
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
    { name: deleteFormatText.copy, action: copyText },
    { name: deleteFormatText.clear, action: clearText },
  ];

  return (
    <>
      <HeadInfo
        title={deleteFormatText.title}
        description={deleteFormatText.description}
        keywords={deleteFormatText.keywords}
        locale={locale}
        page={"/deleteformat"}
      />
      <Header
        locale={locale}
        page={"deleteformat"}
        indexLanguageText={indexLanguageText}
      />
      <div className="p-4 space-y-4">
        <div className="block overflow-hidden bg-[#020d24] bg-cover bg-center text-white">
          <div className="mx-auto w-full max-w-7xl px-5 mb-5">
            <div className="mx-auto flex max-w-4xl flex-col items-center text-center py-1">
              <h1 className="mb-4 text-4xl font-bold md:text-6xl">
                {deleteFormatText.h1}
              </h1>
              <p className="text-[#7c8aaa] text-lg text-left">
                {deleteFormatText.h1_desc}
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
                      placeholder={deleteFormatText.default_text}
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
                      {deleteFormatText.format_settings}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="remove_spaces"
                          checked={removeSpaces}
                          onChange={handleInputChange}
                        />
                        <span>{deleteFormatText.remove_spaces}</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="remove_newlines"
                          checked={removeNewlines}
                          onChange={handleInputChange}
                        />
                        <span>{deleteFormatText.remove_newlines}</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="remove_formatting"
                          checked={removeFormatting}
                          onChange={handleInputChange}
                        />
                        <span>{deleteFormatText.remove_formatting}</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="remove_indentation"
                          checked={removeIndentation}
                          onChange={handleInputChange}
                        />
                        <span>{deleteFormatText.remove_indentation}</span>
                      </label>
                    </div>

                    <button
                      type="button"
                      className="mt-4 p-2 bg-blue-500 text-white rounded m-2"
                      onClick={applySettings}
                    >
                      {deleteFormatText.apply}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* 功能说明区域 */}
            <div className="w-[95%] mx-auto h-full my-8 text-white w-full max-w-5xl mx-auto">
              <h2 className="text-2xl mb-4">{deleteFormatText.about_title}</h2>
              <p className="text-[#7c8aaa]">{deleteFormatText.about_desc}</p>

              <h2 className="text-2xl mb-4 mt-8">{deleteFormatText.features_title}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl mb-2">{deleteFormatText.feature_1_title}</h3>
                  <p className="text-[#7c8aaa]">{deleteFormatText.feature_1_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{deleteFormatText.feature_2_title}</h3>
                  <p className="text-[#7c8aaa]">{deleteFormatText.feature_2_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{deleteFormatText.feature_3_title}</h3>
                  <p className="text-[#7c8aaa]">{deleteFormatText.feature_3_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{deleteFormatText.feature_4_title}</h3>
                  <p className="text-[#7c8aaa]">{deleteFormatText.feature_4_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{deleteFormatText.feature_5_title}</h3>
                  <p className="text-[#7c8aaa]">{deleteFormatText.feature_5_desc}</p>
                </div>
                <div>
                  <h3 className="text-xl mb-2">{deleteFormatText.feature_6_title}</h3>
                  <p className="text-[#7c8aaa]">{deleteFormatText.feature_6_desc}</p>
                </div>
              </div>

              {/* FAQ Section */}
              <h2 className="text-2xl mb-4 mt-8">{deleteFormatText.faq_title}</h2>
              <div className="space-y-6">
                <div className="border-b border-[#7c8aaa] pb-4">
                  <h3 className="text-xl mb-2 font-semibold">{deleteFormatText.faq_1_title}</h3>
                  <p className="text-[#7c8aaa]">{deleteFormatText.faq_1_desc}</p>
                </div>
                <div className="border-b border-[#7c8aaa] pb-4">
                  <h3 className="text-xl mb-2 font-semibold">{deleteFormatText.faq_2_title}</h3>
                  <p className="text-[#7c8aaa]">{deleteFormatText.faq_2_desc}</p>
                </div>
                <div className="border-b border-[#7c8aaa] pb-4">
                  <h3 className="text-xl mb-2 font-semibold">{deleteFormatText.faq_3_title}</h3>
                  <p className="text-[#7c8aaa]">{deleteFormatText.faq_3_desc}</p>
                </div>
                <div className="border-b border-[#7c8aaa] pb-4">
                  <h3 className="text-xl mb-2 font-semibold">{deleteFormatText.faq_4_title}</h3>
                  <p className="text-[#7c8aaa]">{deleteFormatText.faq_4_desc}</p>
                </div>
                <div className="border-b border-[#7c8aaa] pb-4">
                  <h3 className="text-xl mb-2 font-semibold">{deleteFormatText.faq_5_title}</h3>
                  <p className="text-[#7c8aaa]">{deleteFormatText.faq_5_desc}</p>
                </div>
                <div className="border-b border-[#7c8aaa] pb-4">
                  <h3 className="text-xl mb-2 font-semibold">{deleteFormatText.faq_6_title}</h3>
                  <p className="text-[#7c8aaa]">{deleteFormatText.faq_6_desc}</p>
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

export default DeleteFormatComponent; 