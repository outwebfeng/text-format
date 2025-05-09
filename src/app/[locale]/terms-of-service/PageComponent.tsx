import Header from '~/components/Header';
import Footer from '~/components/Footer';
import HeadInfo from "~/components/HeadInfo";

const PageComponent = ({
                         locale = '',
                         termsOfServiceLanguageText,
                         indexLanguageText
                       }) => {

  return (
    <>
      <HeadInfo
        title={termsOfServiceLanguageText.title}
        description={termsOfServiceLanguageText.description}
        keywords={indexLanguageText.keywords}
        locale={locale}
        page={"/terms-of-service"}
      />
      <Header
        locale={locale}
        page={'terms-of-service'}
        indexLanguageText={indexLanguageText}
      />
      <div className="mt-6 my-auto">
        <main className="w-[95%] md:w-[65%] lg:w-[55%] 2xl:w-[45%] mx-auto h-full my-8">
          <div className="p-6 prose mx-auto text-gray-300">
            <h1 className="text-4xl font-extrabold pb-6 text-white">
              {termsOfServiceLanguageText.h1}
            </h1>
            <p className="text-lg">{termsOfServiceLanguageText.date}</p>
            <p className="text-lg">{termsOfServiceLanguageText.desc}</p>
            <h4 className="text-2xl text-white font-bold mt-4">{termsOfServiceLanguageText.h4_1}</h4>
            <p className="text-lg">{termsOfServiceLanguageText.h4_1_p}</p>
            <h4 className="text-2xl text-white font-bold mt-4">{termsOfServiceLanguageText.h4_2}</h4>
            <p className="text-lg">{termsOfServiceLanguageText.h4_2_p}</p>
            <h4 className="text-2xl text-white font-bold mt-4">{termsOfServiceLanguageText.h4_3}</h4>
            <p className="text-lg">{termsOfServiceLanguageText.h4_3_p}</p>
            <h4 className="text-2xl text-white font-bold mt-4">{termsOfServiceLanguageText.h4_4}</h4>
            <p className="text-lg">{termsOfServiceLanguageText.h4_4_p}</p>
            <h4 className="text-2xl text-white font-bold mt-4">{termsOfServiceLanguageText.h4_5}</h4>
            <p className="text-lg">{termsOfServiceLanguageText.h4_5_p}</p>
            <h4 className="text-2xl text-white font-bold mt-4">{termsOfServiceLanguageText.h4_6}</h4>
            <p className="text-lg">
              {termsOfServiceLanguageText.h4_6_p}{" "}<a href="mailto:support@text-format.com" className="text-blue-400 underline">support@text-format.com</a>.
            </p>
          </div>
        </main>
      </div>
      <Footer
        locale={locale}
        description={indexLanguageText.description}
      />
    </>
  )
}

export default PageComponent
