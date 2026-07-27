const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      // Ensures the string actually looks like an email address
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

// Prevents "OverwriteModelError" during hot reloads
module.exports = mongoose.models.Subscriber || mongoose.model("Subscriber", subscriberSchema);