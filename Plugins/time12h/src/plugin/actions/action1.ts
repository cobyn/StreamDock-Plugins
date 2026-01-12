export default function (name: string) {
  const ActionID = `${window.argv[3].plugin.uuid}.${name}`;

  type Settings = {
    showSeconds: boolean;
    showDate: boolean;
  }

  const plugin = usePluginStore();

  useWatchEvent('action', {
    ActionID,

    // Called when action appears on device
    willAppear({ context }) {
      const action = plugin.getAction(context);
      // Ensure default settings exist
      if (!('showSeconds' in action.settings)) {
        action.settings.showSeconds = true;
      }
      if (!('showDate' in action.settings)) {
        action.settings.showDate = false;
      }
      action.setSettings(action.settings);
      updateTimer(context);
    },

    // Called when settings change
    didReceiveSettings({ context }) {
      updateTimer(context);
    },

    // Called when action is removed
    willDisappear({ context }) {
      plugin.Unterval(context);
    }
  });

  const updateTimer = (context: string) => {
    const date = new Date();
    const action = plugin.getAction(context);
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
