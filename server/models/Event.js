import mongoose from "mongoose";
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    description: { type: String, default: "", trim: true },
    date: {
      type: String,
      required: [true, "Date is required"],
      match: [/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, "Date must be YYYY-MM-DD"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
      match: [/^[0-9]{2}:[0-9]{2}$/, "Time must be HH:MM"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["Conference", "Workshop", "Concert", "Sports", "Social", "Other"],
      default: "Other",
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },
    registered: { type: Number, default: 0, min: 0 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: { type: String, required: [true, "Image is required"] },
  },
  { timestamps: true },
);
export default mongoose.model("Event", eventSchema);
