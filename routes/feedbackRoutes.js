import express from "express";
import Feedback from "../models/Feedback.js";

const router = express.Router();

// POST: Submit new feedback
router.post("/", async (req, res) => {
    try {
        const { name, rating, comments } = req.body;

        const newFeedback = new Feedback({
            name,
            rating,
            comments
        });

        const savedFeedback = await newFeedback.save();

        res.status(201).json({
            message: "Feedback submitted sucessfully",
            feedback: savedFeedback
        });
    } catch (error) {
        console.error("Error saving Feedback: ", error);

        res.status(500).json({
            message: "Failed to save feedback",
            error: error.message
        });
    }
});

// GET: Fetch all feedback
router.get("/", async (req, res) => {
    try {
        const feedback = await Feedback.find();

        res.status(200).json(feedback);
    } catch (error) {
        console.error("Error fetching feedback:", error);

        res.status(500).json({
            message: "Failed to fetch feedback",
            error: error.message
        });
    }
});

// DELETE: Delete feedback by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedFeedback = await Feedback.findByIdAndDelete(
            req.params.id
        );

        if (!deletedFeedback) {
            return res.status(404).json({
                message: "Feedback not found"
            });
        }

        res.status(200).json({
            message: "Feedback deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting feedback:", error);

        res.status(500).json({
            message: "Failed to delete feedback",
            error: error.message
        });
    }
});

export default router;



