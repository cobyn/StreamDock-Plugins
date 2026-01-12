export const useI18nStore = () => {
  const language = window.argv[3].application.language;
  const localString: any = {
    en: {
      Format: 'Format',
      ShowSeconds: 'Show Seconds',
      ShowDate: 'Show Date',
      Command: 'Terminal Command',
      Yes: 'Yes',
      No: 'No'
    },
    zh_CN: {
      Format: '格式',
      ShowSeconds: '显示秒数',
      ShowDate: '显示日期',
      Command: '终端命令',
      Yes: '是',
      No: '否'
    }
  };
  return localString[language] || localString['en'];
};
