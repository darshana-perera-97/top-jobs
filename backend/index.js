require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

const app = express();
const PORT = 5012;

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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
