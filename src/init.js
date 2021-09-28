import { connectDB } from './db.js';
import app from './server.js';

app.listen(8080, async () => {
  await connectDB();
  console.log(`Server is listening on Port 8080`);
});
