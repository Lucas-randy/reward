"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reward_controller_1 = require("../controllers/reward.controller");
const router = (0, express_1.Router)();
router.post('/', reward_controller_1.handleReward);
exports.default = router;
