const express = require("express");
const upload = require("../middlewares/upload.middleware");
const controller = require("../controllers/manuscript.controller");
const { protect, adminProtect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/submit",
  protect,
  upload.single("manuscript"),
  controller.submitManuscript,
);
router.get("/admin/list", adminProtect, controller.getAllManuscripts);
router.get("/archive", controller.getApprovedManuscripts);
router.put("/:id/approve", adminProtect, controller.approveManuscript);
router.put("/:id/reject", adminProtect, controller.rejectManuscript);
router.delete("/:id", adminProtect, controller.deleteManuscript);

module.exports = router;
