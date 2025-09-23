import app from './app.js';
import connectDB from './config/db.js';
import env from './config/env.js';
import logger from './config/logger.js';

connectDB();

const port = env.PORT;

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
