import { Router } from "express";
import { AuthController } from "../controllers";
import { authenticate } from "../middleware/auth.middleware";

export const authRouter = Router();

authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);
authRouter.get("/profile", authenticate, AuthController.getProfile);
authRouter.put("/profile", authenticate, AuthController.updateProfile);
