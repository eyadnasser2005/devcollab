const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const projectController = require("../controllers/projectController");
const authRoutes = require("./authRoutes");
const profileRoutes = require("./profileRoutes");
const projectRoutes = require("./projectRoutes");
const taskRoutes = require("./taskRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);

router.get("/dashboard", authMiddleware, projectController.getDashboard);

module.exports = router;
