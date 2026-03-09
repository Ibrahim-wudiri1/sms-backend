// // server.ts

// server.ts
import "dotenv/config";  // ← this is the modern one-liner way (no need to import dotenv separately)

import app from "./src/app";
import { PORT } from "./src/config/index";

console.log("Loaded PORT from env:", process.env.PORT);  // ← debug line - add this temporarily
console.log("Final PORT value:", PORT);                 // ← debug

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
// import app from "./src/app";
// import { PORT } from "./src/config/index";

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });