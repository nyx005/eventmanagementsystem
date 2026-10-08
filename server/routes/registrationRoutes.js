import { Router } from "express";
import { getMyRegistrations } from "../controllers/registrationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/mine", protect, getMyRegistrations);

export default router;
