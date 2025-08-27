import app from './app.js';
import { config } from './config/config';

const PORT = config.port || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
