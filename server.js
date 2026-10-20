import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import feedbackRoutes from "./routes/feedbackRoutes.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(express.static("public"));

app.use("/api/feedback", feedbackRoutes);


mongoose.connect(process.env.MONGODB_URI) 
    .then(() => {
        console.log("MongoDB is connected sucessfully");

        app.listen(PORT, () => {
            console.log(`server is running on http://localhost:${PORT}`);
        });
    })

    .catch ((error) => {
        console.log("MongoDB failed:", error);
    });

    app.get("/api/test", (req, res) => {
        res.json({
            message: "student Feedback manager API is working"
        });
    });

