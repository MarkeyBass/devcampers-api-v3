const path = require('path');
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileupload = require('express-fileupload');
const errorHandler = require('./middleware/error');
const connectDB = require("./config/db");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to db
connectDB();

// Routes
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");

const app = express();

// Body parser
app.use(express.json());

// Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File uploading middleware
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Mount routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () =>
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port ${PORT}...`
      .yellow.bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red, {input: err.input});
  // Close server an exit process
  server.close(() => process.exit(1));
});
