const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5012;

// Enable CORS
app.use(cors());

// Root API endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Node.js Backend with CORS enabled on port 5012!",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
