// import app from "./app.js";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";

// dotenv.config();

// const PORT = process.env.PORT || 8080;

// // Connect DB
// connectDB();

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
});
