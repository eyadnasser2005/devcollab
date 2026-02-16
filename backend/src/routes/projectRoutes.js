const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const projectController = require("../controllers/projectController");

const router = express.Router();

router.use(authMiddleware);

router.post("/start", projectController.startProject);

module.exports = router;
