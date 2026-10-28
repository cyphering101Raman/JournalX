import { Router } from "express";
import { BackdateController } from "./backdate.controller";

const router = Router();

router.post("/", BackdateController.save);

export default router;
