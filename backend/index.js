require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const multer = require("multer");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5012;
app.use(bodyParser.json());

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate OpenAI response
async function getCompletion(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching completion:", error);
    return null;
  }
}

// Root API endpoint
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Node.js Backend with OpenAI and CORS!" });
});

// OpenAI API endpoint
app.post("/generate", async (req, res) => {
  const { text } = req.body; // Get text from request body

  if (!text) {
    return res.status(400).json({ error: "Text input is required" });
  }

  const prompt = `Want to create a WhatsApp bulk message content for ${text} with 250 chars. Include stickers also. Provide me message only.`;

  const response = await getCompletion(prompt);

  if (response) {
    res.json({ message: response });
  } else {
    res.status(500).json({ error: "Failed to generate content" });
  }
});

app.post("/addNewJobManual", (req, res) => {
  const jobData = req.body;

  if (
    !jobData.jobTitle ||
    !jobData.location ||
    !jobData.company ||
    !jobData.aboutUs ||
    !jobData.jobOverview ||
    !jobData.responsibilities ||
    !jobData.requirements ||
    !jobData.howToApply ||
    !jobData.categories ||
    jobData.categories.length === 0
  ) {
    return res.status(400).json({
      error: "All fields are required, including at least one category.",
    });
  }

  jobData.responsibilities = jobData.responsibilities.split(",");
  jobData.requirements = jobData.requirements.split(",");

  const jobsFilePath = path.resolve(__dirname, "jobs.json");
  fs.readFile(jobsFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read jobs data" });
    }

    let jobs = [];
    try {
      jobs = JSON.parse(data);
    } catch (e) {
      return res.status(500).json({ error: "Failed to parse jobs data" });
    }

    const nextId = generateNextJobId(jobs);

    const newJob = { id: nextId, ...jobData };
    jobs.push(newJob);

    fs.writeFile(jobsFilePath, JSON.stringify(jobs, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to save job data" });
      }
      res.status(201).json({ message: "Job added successfully!" });
    });
  });
});

// Helper function to generate the next job ID
function generateNextJobId(jobs) {
  // Get the highest existing job ID and increment it
  const maxId = jobs.reduce((max, job) => Math.max(max, parseInt(job.id)), 0);
  const nextId = maxId + 1;
  return nextId.toString().padStart(6, "0"); // Ensure 6 digits (e.g., 000001)
}

app.get("/getJobDetails", (req, res) => {
  // Path to the jobs.json file
  const jobsFilePath = path.resolve(__dirname, "jobs.json");

  // Read the jobs file
  fs.readFile(jobsFilePath, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading jobs data:", err);
      return res.status(500).json({ error: "Failed to read jobs data" });
    }

    try {
      const jobs = JSON.parse(data);
      res.json(jobs); // Send back the jobs array
    } catch (e) {
      console.error("Error parsing jobs data:", e);
      return res.status(500).json({ error: "Failed to parse jobs data" });
    }
  });
});

// In your Express.js backend
app.get("/getAllJobs", (req, res) => {
  // Read all jobs from jobs.json
  const jobsFilePath = path.join(__dirname, "jobs.json");
  fs.readFile(jobsFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read jobs data" });
    }

    let jobs = [];
    try {
      jobs = JSON.parse(data);
    } catch (e) {
      console.error("Error parsing jobs data:", e);
    }

    // Send the jobs data as a response
    res.status(200).json(jobs);
  });
});

app.get("/getJobDetails/:id", (req, res) => {
  const { id } = req.params; // Get the job ID from the URL
  const jobsFilePath = path.join(__dirname, "jobs.json");

  fs.readFile(jobsFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read jobs data" });
    }

    let jobs = [];
    try {
      jobs = JSON.parse(data);
    } catch (e) {
      console.error("Error parsing jobs data:", e);
    }

    // Find the job with the matching ID
    const job = jobs.find((job) => job.id === id);
    if (job) {
      res.status(200).json(job);
    } else {
      res.status(404).json({ error: "Job not found" });
    }
  });
});

const USERS_FILE = "users.json";

// Read users from file
const readUsers = () => {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data);
};

// Write users to file
const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Generate a 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// SMTP Transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ds.perera.test@gmail.com", // Replace with your email
    pass: "ycfdgqfhinumrzjx", // Replace with your app password
  },
});

// API to register user and send OTP
app.post("/api/users", (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res
      .status(400)
      .json({ message: "Username and Email are required!" });
  }

  const users = readUsers();
  const existingUser = users.find((user) => user.email === email);

  if (existingUser && existingUser.isVerified) {
    return res.status(400).json({ message: "Email already verified!" });
  }

  const otp = generateOTP();
  const newUser = { username, email, otp, isVerified: false };

  if (existingUser) {
    existingUser.otp = otp;
    existingUser.isVerified = false;
  } else {
    users.push(newUser);
  }

  writeUsers(users);

  // Send OTP email
  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      return res.status(500).json({ message: "Error sending OTP" });
    }
    res.json({ success: true, message: "OTP sent to email!" });
  });
});

// Verify OTP
app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  let users = readUsers();
  const userIndex = users.findIndex((user) => user.email === email);

  if (userIndex === -1) {
    return res.status(400).json({ message: "Email not found!" });
  }

  if (users[userIndex].otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  users[userIndex].isVerified = true;
  users[userIndex].otp = null; // Remove OTP after verification
  writeUsers(users);

  res.json({ success: true, message: "OTP verified successfully!" });
});

// Set Password
app.post("/api/set-password", async (req, res) => {
  const { email, password } = req.body;
  let users = readUsers();
  const userIndex = users.findIndex((user) => user.email === email);

  if (userIndex === -1)
    return res.status(400).json({ message: "Email not found!" });

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);
  users[userIndex].password = hashedPassword;
  writeUsers(users);

  res.json({ success: true, message: "Password set successfully!" });
});

// Login User
app.post("/api/login", async (req, res) => {
  const { identifier, password } = req.body;
  let users = readUsers();

  // Find user by email or username
  const user = users.find(
    (u) => u.email === identifier || u.username === identifier
  );

  if (!user) {
    return res.status(400).json({ message: "User not found!" });
  }

  // Verify password
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "Invalid password!" });
  }

  res.json({
    success: true,
    message: "Login successful!",
    user: {
      username: user.username,
      email: user.email,
      categories: user.categories,
      cv: user.cv,
    },
  });
});

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "cvUploads/"); // Save files inside cvUploads
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

app.post("/api/updateUserCategories", upload.single("cv"), (req, res) => {
  const { username, email, categories } = req.body;
  const cvFileName = req.file ? req.file.filename : null;

  if (!categories || categories.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  fs.readFile("users.json", (err, data) => {
    let users = [];
    if (!err) {
      users = JSON.parse(data);
    }

    // Find existing user or add a new one
    const userIndex = users.findIndex((user) => user.email === email);
    if (userIndex !== -1) {
      users[userIndex].categories = JSON.parse(categories);
      if (cvFileName) {
        users[userIndex].cv = cvFileName;
      }
    } else {
      users.push({
        username,
        email,
        categories: JSON.parse(categories),
        cv: cvFileName,
      });
    }

    // Save updated user data
    fs.writeFile("users.json", JSON.stringify(users, null, 2), (writeErr) => {
      if (writeErr) {
        return res
          .status(500)
          .json({ success: false, message: "Failed to update user data." });
      }
      res.json({ success: true, message: "Data updated successfully." });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
