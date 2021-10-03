import 'dotenv/config';

import { connectDB } from './db.js';
import app from './server.js';

app.listen(process.env.SERVER_PORT, async () => {
  await connectDB();
  console.log(`Server is listening on Port 8080`);
});
