import { Router } from "express";
import { slideController } from "../controllers/slide.controller";
import { authenticate, requireAdmin } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.get("/public/:location", slideController.getActiveByLocation);

// Admin routes (protected)
router.get("/", authenticate, requireAdmin, slideController.getAll);
router.get("/:id", authenticate, requireAdmin, slideController.getById);
router.post("/", authenticate, requireAdmin, slideController.create);
router.put("/:id", authenticate, requireAdmin, slideController.update);
router.delete("/:id", authenticate, requireAdmin, slideController.delete);
router.post("/reorder", authenticate, requireAdmin, slideController.reorder);
router.patch("/:id/toggle-active", authenticate, requireAdmin, slideController.toggleActive);

export default router;

