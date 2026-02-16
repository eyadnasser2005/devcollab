const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const taskController = require("../controllers/taskController");

const router = express.Router();

router.use(authMiddleware);

router.post("/:taskId/upload", taskController.uploadTaskFile);

module.exports = router;
