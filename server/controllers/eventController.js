import Event from "../models/Event.js";
import Registration from "../models/Registration.js";

const isOwner = (event, user) =>
  event.createdBy.toString() === user._id.toString() || user.role === "admin";
export const getEvents = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 6, 24);
    const filter = {};
    const { category } = req.query;
    if (category && category !== "All") filter.category = category;
    // keep only letters, numbers and spaces so search text can never act as a regex
    const search = (req.query.search || "")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim();
    if (search) filter.title = { $regex: search, $options: "i" };
    const total = await Event.countDocuments(filter);
    const events = await Event.find(filter)
      .sort({ date: 1, time: 1 })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({ events, page, pages: Math.ceil(total / limit) || 1, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user._id }).sort({
      date: 1,
      time: 1,
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      category,
      capacity,
      image,
    } = req.body;
    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      category,
      capacity,
      image,
      createdBy: req.user._id,
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (!isOwner(event, req.user)) {
      return res
        .status(403)
        .json({ message: "You can only edit your own events" });
    }
    const {
      title,
      description,
      date,
      time,
      location,
      category,
      capacity,
      image,
    } = req.body;
    if (capacity < event.registered) {
      return res.status(400).json({
        message: `Capacity cannot be lower than the ${event.registered} 
people already registered`,
      });
    }
    Object.assign(event, {
      title,
      description: description ?? "",
      date,
      time,
      location,
      category,
      capacity,
      image,
    });
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (!isOwner(event, req.user)) {
      return res
        .status(403)
        .json({ message: "You can only delete your own events" });
    }
    await Registration.deleteMany({ event: event._id });
    await event.deleteOne();
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
