import { Router } from "express";
import {
  getActors,
  getActorSchema,
  runActor,
} from "../controllers/actorController.js";

const router = Router();

router.get("/actors", getActors);

router.get("/actors/:id/schema", getActorSchema);

router.post("/actors/:id/run", runActor);

export default router;
