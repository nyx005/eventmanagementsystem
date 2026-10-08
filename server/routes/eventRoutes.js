import { Router } from "express";
import { body } from "express-validator";
import {
  getEvents,
  getMyEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import {
  registerForEvent,
  cancelRegistration,
  getEventRegistrations,
} from "../controllers/registrationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
const router = Router();
const eventRules = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("date")
    .matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)
    .withMessage("Date must be YYYY-MM-DD"),
  body("time")
    .matches(/^[0-9]{2}:[0-9]{2}$/)
    .withMessage("Time must be HH:MM"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("capacity").isInt({ min: 1 }).withMessage("Capacity must be at least 1"),
  body("image").notEmpty().withMessage("Image is required"),
];
router.get("/mine", protect, getMyEvents);
router
  .route("/")
  .get(getEvents)
  .post(protect, eventRules, validate, createEvent);
router
  .route("/:id")
  .get(getEvent)
  .put(protect, eventRules, validate, updateEvent)
  .delete(protect, deleteEvent);
router
  .route("/:id/registrations")
  .get(protect, getEventRegistrations)
  .post(protect, registerForEvent)
  .delete(protect, cancelRegistration);
  
export default router;
