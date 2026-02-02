const path = require('path');
const fs = require('fs-extra');

const manifest = {};
const { PUUID, Actions, i18n, CategoryIcon, Version } = require('../src/manifest.cjs');
console.log('Starting automated build...');

// Development environment handling
if (process.argv[2] === 'dev') {
  fs.removeSync('./dist') || fs.mkdirSync('./dist') || fs.copySync('./public', './dist');
  fs.copyFileSync('./script/_.html', './dist/_.html');
}

// Generate based on user configuration
manifest.Actions = Actions.map((item) => {
  item.Name = item.i18n['en'].Name;
  item.Tooltip = item.i18n['en'].Tooltip;
  item.UUID = `com.mirabox.streamdock.${PUUID}.` + item.UUID;
  item.PropertyInspectorPath = process.argv[2] === 'dev' ? '_.html' : 'index.html';
  return item;
});
manifest.Version = Version;
manifest.Name = i18n['en'].Name;
manifest.Icon = CategoryIcon;
manifest.CategoryIcon = CategoryIcon;
manifest.Category = i18n['en'].Name;
manifest.Description = i18n['en'].Description;
manifest.CodePath = process.argv[2] === 'dev' ? '_.html' : 'index.html';

// Fixed version generation
manifest.SDKVersion = 1;
manifest.Author = 'StreamDock Community';
manifest.URL = 'https://github.com/mirabox-coder/StreamDock-Plugins';
manifest.OS = [
  {
    Platform: 'mac',
    MinimumVersion: '10.11'
  },
  {
    Platform: 'windows',
    MinimumVersion: '7'
  }
];

// Language file generation
Object.keys(i18n).forEach((item) => {
  const obj = {};
  obj.Name = i18n[item].Name;
  obj.Category = i18n[item].Name;
  obj.Description = i18n[item].Description;
  manifest.Actions.forEach((action) => {
    obj[action.UUID] = {
      Name: action.i18n[item].Name,
      Tooltip: action.i18n[item].Tooltip
    };
  });
  obj.Localization = {};
  fs.writeJSONSync(`./dist/${item}.json`, obj);
});

// Generate manifest file
manifest.Actions = manifest.Actions.map((item) => {
  delete item.i18n;
  return item;
});
fs.writeJSONSync('./dist/manifest.json', manifest, { spaces: 2, EOL: '\r\n' });

// Copy to plugin folder
const PluginName = `com.mirabox.streamdock.${PUUID}.sdPlugin`;
if (process.env.APPDATA) {
  const PluginPath = path.join(process.env.APPDATA, 'HotSpot/StreamDock/plugins', PluginName);
  fs.removeSync(PluginPath) || fs.mkdirSync(PluginPath) || fs.copySync('./dist', PluginPath);
  console.log(`Plugin copied to: ${PluginPath}`);
} else {
  console.log('Non-Windows system, skipping automatic copy to plugin directory. Please manually copy the dist folder to the StreamDock plugin directory.');
}
