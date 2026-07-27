const express = require("express");
const Subscriber = require("../models/Subscriber"); // Adjust path if needed

const router = express.Router();

// GET: Fetch all subscribers (Useful for testing in browser or Admin UI)
router.get("/", async (req, res) => {
  try {
    // Fetches all subscribers, newest first
    const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });

    res.status(200).json({
      success: true,
      count: subscribers.length,
      subscribers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Could not fetch subscribers.",
    });
  }
});

// POST: Add a new subscriber (Used by your frontend form)
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Normalize the email to match how Mongoose saves it
    const normalizedEmail = email.toLowerCase().trim();

    // Check if already subscribed
    const existingSubscriber = await Subscriber.findOne({ email: normalizedEmail });

    if (existingSubscriber) {
      return res.status(200).json({
        success: true,
        message: "You are already subscribed!",
      });
    }

    // Save new subscriber
    const subscriber = await Subscriber.create({ email: normalizedEmail });

    res.status(201).json({
      success: true,
      message: "Subscription successful!",
      subscriber,
    });

  } catch (error) {
    console.error(error);

    // Catch Mongoose validation errors (like invalid email format)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages[0], 
      });
    }

    // Fallback for real server errors
    res.status(500).json({
      success: false,
      message: "Something went wrong on our end.",
    });
  }
});

module.exports = router;