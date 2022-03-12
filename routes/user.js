const express = require("express");
const UserController = require("../controllers/UserController/User");
const router = express.Router();
const customAuth = require("../services/customAuth");

router.post("/", customAuth.customMiddleware, UserController.saveUser);
router.get("/", UserController.getAllUser);
router.put("/:id", UserController.updateUserById);
router.delete("/:id", UserController.deleteUserById);
router.get("/:id", UserController.userGetById);

module.exports = router