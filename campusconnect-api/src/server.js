import app from './app.js';
import connectDB from './config/db.js';
import env from './config/env.js';

connectDB();

const port = env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
