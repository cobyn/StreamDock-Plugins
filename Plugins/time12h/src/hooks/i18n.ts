export const useI18nStore = () => {
  const language = window.argv[3].application.language;
  const localString = {
    en: {
      Format: 'Format',
      ShowSeconds: 'Show Seconds',
      ShowDate: 'Show Date',
      Yes: 'Yes',
      No: 'No'
    },
    zh_CN: {
      Format: '格式',
      ShowSeconds: '显示秒数',
      ShowDate: '显示日期',
      Yes: '是',
      No: '否'
    }
  };
  return localString[language] || localString['en'];
};
