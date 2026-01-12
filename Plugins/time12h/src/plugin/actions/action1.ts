import { usePluginStore, useWatchEvent } from '@/hooks/plugin';

export default function (name: string) {
  const ActionID = `${window.argv[3].plugin.uuid}.${name}`;

  type Settings = {
    showSeconds: boolean;
    showDate: boolean;
    command: string;
  }

  const plugin = usePluginStore();

  useWatchEvent('action', {
    ActionID,

    // Called when action appears on device
    willAppear({ context }) {
      const action = plugin.getAction(context);
      if (!action) return;

      const settings = action.settings as any;
      // Ensure default settings exist
      if (settings.showSeconds === undefined) {
        settings.showSeconds = true;
      }
      if (settings.showDate === undefined) {
        settings.showDate = false;
      }
      action.setSettings(settings);

      // Set black background
      setBlackBackground(context);

      updateTimer(context);
    },

    // Called when settings change
    didReceiveSettings({ context }) {
      updateTimer(context);
    },

    // Called when action is removed
    willDisappear({ context }) {
      plugin.Unterval(context);
    },

    // Called when button is pressed
    keyUp({ context }) {
      const action = plugin.getAction(context);
      if (!action) return;

      const settings = action.settings as Settings;
      if (settings.command && settings.command.trim()) {
        // Execute the terminal command via openUrl for file:// or http:// protocols
        // For terminal commands, user can use: file:///C:/path/to/script.bat or similar
        if (settings.command.startsWith('http://') ||
            settings.command.startsWith('https://') ||
            settings.command.startsWith('file://')) {
          action.openUrl(settings.command);
        } else {
          // For non-URL commands, log to console
          // In a production environment, this would need proper command execution support from the host app
          console.log('Execute command:', settings.command);

          // Try to execute using a batch file URL on Windows
          // User would need to create a .bat file with their commands
          // Example command input: "file:///C:/scripts/mycommand.bat"
        }
      }
    }
  });

  const setBlackBackground = (context: string) => {
    const action = plugin.getAction(context);
    if (!action) return;

    // Create a black canvas image
    const canvas = document.createElement('canvas');
    canvas.width = 144;
    canvas.height = 144;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Convert canvas to data URL and set as image
      const imageData = canvas.toDataURL('image/png');
      action.setImage(imageData);
    }
  };

  const updateTimer = (context: string) => {
    const date = new Date();
    const action = plugin.getAction(context);
    if (!action) return;

    const settings = action.settings as Settings;

    action.setTitle(formatTime12h(date, settings));

    // Update every 1000ms (1 second)
    plugin.Interval(context, 1000, () => updateTimer(context));
  };

  const formatTime12h = (date: Date, settings: Settings) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Determine AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Hour '0' should be '12'

    // Format with leading zeros
    const hoursStr = hours.toString();
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');

    // Build time string
    let timeStr = `${hoursStr}:${minutesStr}`;
    if (settings.showSeconds) {
      timeStr += `:${secondsStr}`;
    }
    timeStr += ` ${ampm}`;

    // Add date if requested
    if (settings.showDate) {
      const dateStr = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      return `${dateStr}\n${timeStr}`;
    }

    return timeStr;
  };
}
