const express = require("express");
const WahidController = require("../controllers/WahidController/Wahid");
const router = express.Router();

router.post("/", WahidController.saveWahid);
router.get("/", WahidController.getAllWahid);
router.put("/:id", WahidController.updateWahidById);
router.delete("/:id", WahidController.deleteWahidById);
router.get("/:id", WahidController.WahidGetById);

module.exports = router