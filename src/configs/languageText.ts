import {getTranslations} from "next-intl/server";

export const getIndexLanguageText = async () => {
  const tIndex = await getTranslations('IndexPage');
  return {
    title: tIndex('title'),
    description: tIndex('description'),
    keywords: tIndex('keywords'),
    loadingText: tIndex('loadingText'),
    generateText: tIndex('generateText'),
    buttonText: tIndex('buttonText'),
    placeholderText: tIndex('placeholderText'),
    h1Text: tIndex('h1Text'),
    pDescription: tIndex('pDescription'),
    soraVideoExample: tIndex('soraVideoExample'),
    prompt: tIndex('prompt'),
    moreExample: tIndex('moreExample'),
    soraResultTitle: tIndex('soraResultTitle'),
    fakeSoraTip: tIndex('fakeSoraTip'),
    soraTip: tIndex('soraTip'),
  };
}

export const getTextCleanText = async () => {
  const textClean = await getTranslations('textClean');
  return {
    h1: textClean('h1'),
    h1_desc: textClean('h1_desc'),
    wrap_lines: textClean('wrap_lines'),
    default_text: textClean('default_text'),
    show_char: textClean('show_char'),
    show_word: textClean('show_word'),
    common_remove_extra_sapces: textClean('common_remove_extra_sapces'),
    common_remove_empty_lines: textClean('common_remove_empty_lines'),
    common_remove_line_breaks: textClean('common_remove_line_breaks'),
    common_uppercase_all: textClean('common_uppercase_all'),
    common_lowercase_all: textClean('common_lowercase_all'),
    common_capitalize_sentences: textClean('common_capitalize_sentences'),
    common_capitalize_words: textClean('common_capitalize_words'),
    common_remove_duplicate_lines: textClean('common_remove_duplicate_lines'),
    common_copy: textClean('common_copy'),
    common_clear: textClean('common_clear'),
    select_all: textClean('select_all'),
    select_none: textClean('select_none'),
    select_default: textClean('select_default'),
    char_setting: textClean('char_setting'),
    char_remove_puctuation_marks: textClean('char_remove_puctuation_marks'),
    char_strip_all_emojis: textClean('char_strip_all_emojis'),
    char_remove_non_ascii_characters: textClean('char_remove_non_ascii_characters'),
    char_remove_non_alphanumeric_characters: textClean('char_remove_non_alphanumeric_characters'),
    char_remove_all_emails: textClean('char_remove_all_emails'),
    multiple_line_setting: textClean('multiple_line_setting'),
    line_add: textClean('line_add'),
    line_remove: textClean('line_remove'),
    line_to_left: textClean('line_to_left'),
    line_to_right: textClean('line_to_right'),
    line_from_left: textClean('line_from_left'),
    line_from_right: textClean('line_from_right'),
    html_setting: textClean('html_setting'),
    html_unexcape_html_tags: textClean('html_unexcape_html_tags'),
    html_remove_all_html_tags: textClean('html_remove_all_html_tags'),
    html_remove_all_ids: textClean('html_remove_all_ids'),
    html_remove_all_classes: textClean('html_remove_all_classes'),
    html_decode_html_character_entities: textClean('html_decode_html_character_entities'),
    html_decode_url_encoded_characters: textClean('html_decode_url_encoded_characters'),
    find_replace_setting: textClean('find_replace_setting'),
    find_find: textClean('find_find'),
    find_replace: textClean('find_replace'),
    find_replace_text: textClean('find_replace_text'),
    find_replace_with_tab: textClean('find_replace_with_tab'),
    find_replace_with_space: textClean('find_replace_with_space'),
    find_replace_space: textClean('find_replace_space'),
    text_clean_apply: textClean('text_clean_apply'),
    h2_1: textClean('h2_1'),
    h2_1_p: textClean('h2_1_p'),
    h2_2: textClean('h2_2'),
    h2_2_p: textClean('h2_2_p'),
    h2_2_h3_1: textClean('h2_2_h3_1'),
    h2_2_h3_1_p: textClean('h2_2_h3_1_p'),
    h2_2_h3_2: textClean('h2_2_h3_2'),
    h2_2_h3_2_p: textClean('h2_2_h3_2_p'),
    h2_2_h3_2_h4_1: textClean('h2_2_h3_2_h4_1'),
    h2_2_h3_2_h4_1_p: textClean('h2_2_h3_2_h4_1_p'),
    h2_2_h3_2_h4_2: textClean('h2_2_h3_2_h4_2'),
    h2_2_h3_2_h4_2_p: textClean('h2_2_h3_2_h4_2_p'),
    h2_2_h3_2_h4_3: textClean('h2_2_h3_2_h4_3'),
    h2_2_h3_2_h4_3_p: textClean('h2_2_h3_2_h4_3_p'),
    h2_2_h3_2_h4_4: textClean('h2_2_h3_2_h4_4'),
    h2_2_h3_2_h4_4_p: textClean('h2_2_h3_2_h4_4_p'),
    h2_2_h3_3: textClean('h2_2_h3_3'),
    h2_2_h3_3_p: textClean('h2_2_h3_3_p'),
    h2_2_h3_4: textClean('h2_2_h3_4'),
    h2_2_h3_4_p: textClean('h2_2_h3_4_p'),
    h2_3: textClean('h2_3'),
    h2_3_p_1: textClean('h2_3_p_1'),
    h2_3_h3_1: textClean('h2_3_h3_1'),
    h2_3_h3_1_h4_1: textClean('h2_3_h3_1_h4_1'),
    h2_3_h3_1_h4_1_p: textClean('h2_3_h3_1_h4_1_p'),
    h2_3_h3_1_h4_2: textClean('h2_3_h3_1_h4_2'),
    h2_3_h3_1_h4_2_p: textClean('h2_3_h3_1_h4_2_p'),
    h2_3_h3_1_h4_3: textClean('h2_3_h3_1_h4_3'),
    h2_3_h3_1_h4_3_p: textClean('h2_3_h3_1_h4_3_p'),
    h2_3_h3_1_h4_4: textClean('h2_3_h3_1_h4_4'),
    h2_3_h3_1_h4_4_p: textClean('h2_3_h3_1_h4_4_p'),
    h2_3_h3_1_h4_5: textClean('h2_3_h3_1_h4_5'),
    h2_3_h3_1_h4_5_p: textClean('h2_3_h3_1_h4_5_p'),
    h2_3_h3_2: textClean('h2_3_h3_2'),
    h2_3_h3_2_h4_1: textClean('h2_3_h3_2_h4_1'),
    h2_3_h3_2_h4_1_p: textClean('h2_3_h3_2_h4_1_p'),
    h2_3_h3_2_h4_2: textClean('h2_3_h3_2_h4_2'),
    h2_3_h3_2_h4_2_p: textClean('h2_3_h3_2_h4_2_p'),
    h2_3_h3_2_h4_3: textClean('h2_3_h3_2_h4_3'),
    h2_3_h3_2_h4_3_p: textClean('h2_3_h3_2_h4_3_p'),
    h2_3_h3_2_h4_4: textClean('h2_3_h3_2_h4_4'),
    h2_3_h3_2_h4_4_p: textClean('h2_3_h3_2_h4_4_p'),
    h2_3_h3_2_h4_5: textClean('h2_3_h3_2_h4_5'),
    h2_3_h3_2_h4_5_p: textClean('h2_3_h3_2_h4_5_p'),
    h2_3_h3_2_h4_6: textClean('h2_3_h3_2_h4_6'),
    h2_3_h3_2_h4_6_p: textClean('h2_3_h3_2_h4_6_p'),
    h2_3_h3_3: textClean('h2_3_h3_3'),
    h2_3_h3_3_h4_1: textClean('h2_3_h3_3_h4_1'),
    h2_3_h3_3_h4_1_p: textClean('h2_3_h3_3_h4_1_p'),
    h2_3_h3_3_h4_2: textClean('h2_3_h3_3_h4_2'),
    h2_3_h3_3_h4_2_p: textClean('h2_3_h3_3_h4_2_p'),
    h2_3_h3_3_h4_3: textClean('h2_3_h3_3_h4_3'),
    h2_3_h3_3_h4_3_p: textClean('h2_3_h3_3_h4_3_p'),
    h2_3_h3_3_h4_4: textClean('h2_3_h3_3_h4_4'),
    h2_3_h3_3_h4_4_p: textClean('h2_3_h3_3_h4_4_p'),
    h2_3_h3_4: textClean('h2_3_h3_4'),
    h2_3_h3_4_h4_1: textClean('h2_3_h3_4_h4_1'),
    h2_3_h3_4_h4_1_p: textClean('h2_3_h3_4_h4_1_p'),
    h2_3_h3_4_h4_2: textClean('h2_3_h3_4_h4_2'),
    h2_3_h3_4_h4_2_p: textClean('h2_3_h3_4_h4_2_p'),
    h2_3_h3_4_h4_3: textClean('h2_3_h3_4_h4_3'),
    h2_3_h3_4_h4_3_p: textClean('h2_3_h3_4_h4_3_p'),
    h2_3_h3_5: textClean('h2_3_h3_5'),
    h2_3_h3_5_h4_1: textClean('h2_3_h3_5_h4_1'),
    h2_3_h3_5_h4_1_p: textClean('h2_3_h3_5_h4_1_p'),
    h2_3_h3_5_h4_2: textClean('h2_3_h3_5_h4_2'),
    h2_3_h3_5_h4_2_p: textClean('h2_3_h3_5_h4_2_p'),
    h2_3_h3_5_h4_3: textClean('h2_3_h3_5_h4_3'),
    h2_3_h3_5_h4_3_p: textClean('h2_3_h3_5_h4_3_p'),
    h2_3_h3_5_h4_4: textClean('h2_3_h3_5_h4_4'),
    h2_3_h3_5_h4_4_p: textClean('h2_3_h3_5_h4_4_p'),
    h2_3_h3_5_h4_5: textClean('h2_3_h3_5_h4_5'),
    h2_3_h3_5_h4_5_p: textClean('h2_3_h3_5_h4_5_p'),
    h2_3_h3_5_h4_6: textClean('h2_3_h3_5_h4_6'),
    h2_3_h3_5_h4_6_p: textClean('h2_3_h3_5_h4_6_p'),
    h2_3_h3_5_h4_7: textClean('h2_3_h3_5_h4_7'),
    h2_3_h3_5_h4_7_p: textClean('h2_3_h3_5_h4_7_p'),
    h2_3_h3_5_h4_8: textClean('h2_3_h3_5_h4_8'),
    h2_3_h3_5_h4_8_p: textClean('h2_3_h3_5_h4_8_p'),
    h2_3_h3_5_h4_9: textClean('h2_3_h3_5_h4_9'),
    h2_3_h3_5_h4_9_p: textClean('h2_3_h3_5_h4_9_p'),
    h2_3_h3_5_h4_10: textClean('h2_3_h3_5_h4_10'),
    h2_3_h3_5_h4_10_p: textClean('h2_3_h3_5_h4_10_p'),
    h2_3_p_2: textClean('h2_3_p_2')
  };
}

export const getQuestionLanguageText = async () => {
  const tIndexQuestion = await getTranslations('indexQuestion');
  return {
    h2_1: tIndexQuestion('h2_1'),
    h2_1_p1: tIndexQuestion('h2_1_p1'),
    h2_1_p2: tIndexQuestion('h2_1_p2'),
    h2_1_p3: tIndexQuestion('h2_1_p3'),
    h2_1_p4: tIndexQuestion('h2_1_p4'),
    h2_2: tIndexQuestion('h2_2'),
    h2_2_p1: tIndexQuestion('h2_2_p1'),
    h2_2_p2: tIndexQuestion('h2_2_p2'),
    h2_2_p3: tIndexQuestion('h2_2_p3'),
    h2_2_p4a: tIndexQuestion('h2_2_p4a'),
    h2_2_p4b: tIndexQuestion('h2_2_p4b'),
  }
}


export const getWorksPageLanguageText = async () => {
  const tWorks = await getTranslations('worksPage');
  return {
    title: tWorks('title'),
    description: tWorks('description'),
    h1Text: tWorks('h1Text'),
    pDescription: tWorks('pDescription'),
    generateNew: tWorks('generateNew'),
  }
}

export const getVideosPageLanguageText = async () => {
  const tVideosPage = await getTranslations('videosPage');
  return {
    title: tVideosPage('title'),
    description: tVideosPage('description'),
  }
}

export const getPrivacyPolicyLanguageText = async () => {
  const tPrivacyPolicy = await getTranslations('privacyPolicy');
  return {
    title: tPrivacyPolicy('title'),
    description: tPrivacyPolicy('description'),
    h1: tPrivacyPolicy('h1'),
    date: tPrivacyPolicy('date'),
    desc: tPrivacyPolicy('desc'),
    h4_1: tPrivacyPolicy('h4_1'),
    h4_1_pa: tPrivacyPolicy('h4_1_pa'),
    h4_1_pb: tPrivacyPolicy('h4_1_pb'),
    h4_2: tPrivacyPolicy('h4_2'),
    h4_2_p: tPrivacyPolicy('h4_2_p'),
    h4_3: tPrivacyPolicy('h4_3'),
    h4_3_p: tPrivacyPolicy('h4_3_p'),
    h4_4: tPrivacyPolicy('h4_4'),
    h4_4_p: tPrivacyPolicy('h4_4_p'),
    h4_5: tPrivacyPolicy('h4_5'),
    h4_5_p: tPrivacyPolicy('h4_5_p'),
    h4_6: tPrivacyPolicy('h4_6'),
    h4_6_p: tPrivacyPolicy('h4_6_p'),
  }
}

export const getTermsOfServiceLanguageText = async () => {
  const tTermsOfService = await getTranslations('termsOfService');
  return {
    title: tTermsOfService('title'),
    description: tTermsOfService('description'),
    h1: tTermsOfService('h1'),
    date: tTermsOfService('date'),
    desc: tTermsOfService('desc'),
    h4_1: tTermsOfService('h4_1'),
    h4_1_p: tTermsOfService('h4_1_p'),
    h4_2: tTermsOfService('h4_2'),
    h4_2_p: tTermsOfService('h4_2_p'),
    h4_3: tTermsOfService('h4_3'),
    h4_3_p: tTermsOfService('h4_3_p'),
    h4_4: tTermsOfService('h4_4'),
    h4_4_p: tTermsOfService('h4_4_p'),
    h4_5: tTermsOfService('h4_5'),
    h4_5_p: tTermsOfService('h4_5_p'),
    h4_6: tTermsOfService('h4_6'),
    h4_6_p: tTermsOfService('h4_6_p'),
    h4_7: tTermsOfService('h4_7'),
    h4_7_p: tTermsOfService('h4_7_p'),
    h4_8: tTermsOfService('h4_8'),
    h4_8_p: tTermsOfService('h4_8_p'),
  }
}

export const getPlaygroundPageLanguageText = async () => {
  const tPlaygroundPage = await getTranslations('playgroundPage');
  return {
    title: tPlaygroundPage('title'),
    description: tPlaygroundPage('description'),
    h1Text: tPlaygroundPage('h1Text'),
    pDescription: tPlaygroundPage('pDescription'),
    moreWorks: tPlaygroundPage('moreWorks'),
  }
}
