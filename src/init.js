import 'dotenv/config';
import regeneratorRuntime from 'regenerator-runtime';

import { connectDB } from './db.js';
import app from './server.js';

app.listen(process.env.PORT, async () => {
  await connectDB();
  console.log(`Server is listening on Port ${process.env.PORT}`);
});
