import { createApp } from './app.js';
import { loadSettings } from './config/settings.js';

const settings = loadSettings();
const app = createApp(settings);

app.listen(settings.port, () => {
	console.info(`Roadside Assistant backend listening on port ${settings.port}`);
});
