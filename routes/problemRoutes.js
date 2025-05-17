const express = require("express");
const router = express.Router();
const Problem = require("../Models/Problems");

//create a new problem
router.post("/create", async (req, res) => {
  try {
    const { title, description, difficulty } = req.body;

    if (!(title && description )) {
      return res.status(400).send("Please provide all required fields");
    }
    const newProblem = await Problem.create({
      title,
      description,
      difficulty,

    });
    res.status(201).json({ message: "Problem created successfully", problem: newProblem });
  }
  catch (error) {
    res.status(500).send(error.message);
  }

});
//get all problems
router.get("/", async (req, res) => {
  try {
    const problems = await Problem.find({});
    res.status(200).json(problems);
  }
  catch (error) {
    res.status(500).send(error.message);

  }
});
//get by id problems
router.get("/:id", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: "problem not found" });
    }
    res.status(200).json(problem);
  }
  catch (error) {
    console.error("Error fetching problem by ID:", error); // 🔍 log error
    res.status(500).json({ message: "Internal server error", error: error.message });
  }

});

module.exports = router;