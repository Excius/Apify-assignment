import { Router } from "express";
import { validateKey } from "../controllers/authController.js";

const router = Router();

router.get("/validate-key", validateKey);

export default router;
