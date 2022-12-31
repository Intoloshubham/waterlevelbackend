import express from "express";
import { DeviceController } from "../controllers/device/index.js";
const router = express.Router();

import {
    WaterLevelController,
    WaterSettingController,
    UserController,
    ProductController,
} from '../controllers/index.js';

// user
router.post('/user-register', UserController.userRegister);
router.post('/login-user', UserController.loginUser);
router.delete('/logout-user',UserController.logoutUser);

///water level
router.get('/led-status/:unique_id', WaterLevelController.getLedStatus);
router.put('/led-status/:unique_id', WaterLevelController.updateLedStatus);

router.get('/sump-status/:unique_id', WaterLevelController.getSumpStatus);
router.put('/sump-status/:unique_id', WaterLevelController.updateSumpStatus);

router.get('/water-level/:unique_id', WaterLevelController.getWaterLevel);
router.get('/prev-water-level/:unique_id', WaterLevelController.prevWaterLevel);
router.put('/water-level/:unique_id', WaterLevelController.updateWaterLevel);

router.get('/water-level-image/:unique_id', WaterLevelController.getWaterLevelImage);
router.post('/water-level-image/:unique_id', WaterLevelController.saveWaterLevelImage);

router.get('/water-level-setting/:unique_id', WaterSettingController.getWaterSetting);
router.put('/water-level-setting/:unique_id', WaterSettingController.setWaterSetting);

// router.get('/pump-notification-setting/:unique_id', WaterSettingController.getWaterSetting);
router.put('/motor-notification-setting/:unique_id', WaterSettingController.setMotorNotificationSetting);

//product list
router.post('/add-product',ProductController.store);
router.get('/get-product/:id',ProductController.index);
router.put('/product/:id',ProductController.update);
router.put('/primary/:id',ProductController.primaryStatus);

router.post('/device-key-generate',DeviceController.store);
router.put('/device-key/:id',DeviceController.update);

router.put('/tank-height-setting/:unique_id', WaterSettingController.tankHeightSetting);
router.put('/water-source-setting/:unique_id', WaterSettingController.waterSourceSetting);


export default router;