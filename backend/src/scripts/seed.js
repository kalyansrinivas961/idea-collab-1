require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Idea = require("../models/Idea");
const Comment = require("../models/Comment");

const users = [
  {
    name: "John Developer",
    email: "john@example.com",
    password: "password123",
    role: "Developer",
    headline: "Full Stack Wizard",
    skills: ["React", "Node.js", "MongoDB"],
  },
  {
    name: "Jane Designer",
    email: "jane@example.com",
    password: "password123",
    role: "Designer",
    headline: "UI/UX Specialist",
    skills: ["Figma", "CSS", "User Research"],
  },
];

const ideas = [
  {
    title: "Idea Collab App",
    description: "A platform for cross-functional teams to collaborate on ideas.",
    category: "Productivity",
    tags: ["Collaboration", "Web App"],
  },
  {
    title: "Eco Tracker",
    description: "Track your carbon footprint and get tips to reduce it.",
    category: "Environment",
    tags: ["Mobile App", "Green"],
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await User.deleteMany({});
    await Idea.deleteMany({});
    await Comment.deleteMany({});

    const createdUsers = await User.create(users);
    console.log("Users created");

    const sampleIdeas = ideas.map((idea, index) => {
      return { ...idea, owner: createdUsers[index % createdUsers.length]._id };
    });

    await Idea.create(sampleIdeas);
    console.log("Ideas created");

    console.log("Data seeded!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
