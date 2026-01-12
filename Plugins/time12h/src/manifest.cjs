const Plugin = {
  UUID: 'time12h',
  version: '1.0.0',
  Icon: 'images/cate.png',
  i18n: {
    en: {
      Name: '12-Hour Time',
      Description: 'Display current time in 12-hour format with AM/PM'
    },
    zh_CN: {
      Name: '12小时时间',
      Description: '以12小时制显示当前时间（带AM/PM）'
    }
  }
}

const Actions = [
  {
    UUID: 'action1',
    Icon: 'images/action.png',
    i18n: {
      en: {
        Name: '12-Hour Time',
        Tooltip: 'Shows current time in 12-hour format with AM/PM'
      },
      zh_CN: {
        Name: '12小时时间',
        Tooltip: '以12小时制显示当前时间（带AM/PM）'
      }
    },
    States: [
      {
        Image: 'images/key.png',
        TitleAlignment: 'middle',
        FontSize: '10',
        FontStyle: 'Bold'
      }
    ],
    Settings: {
      showSeconds: true,
      showDate: false
    },
    UserTitleEnabled: false,
    SupportedInMultiActions: false,
    Controllers: ['Keypad', 'Information']
  }
]

module.exports = { PUUID: Plugin.UUID, Version: Plugin.version, CategoryIcon: Plugin.Icon, i18n: Plugin.i18n, Actions }
