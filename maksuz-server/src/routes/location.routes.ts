import { Router } from "express";
import { locationController } from "../controllers/location.controller";
import { authenticate, requireAdmin } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.get("/public", locationController.getActive);

// Admin routes (protected)
router.get("/", authenticate, requireAdmin, locationController.getAll);
router.get("/:id", authenticate, requireAdmin, locationController.getById);
router.post("/", authenticate, requireAdmin, locationController.create);
router.put("/:id", authenticate, requireAdmin, locationController.update);
router.delete("/:id", authenticate, requireAdmin, locationController.delete);
router.post("/reorder", authenticate, requireAdmin, locationController.reorder);
router.patch("/:id/toggle-active", authenticate, requireAdmin, locationController.toggleActive);
router.patch("/:id/toggle-highlight", authenticate, requireAdmin, locationController.toggleHighlight);

export default router;
