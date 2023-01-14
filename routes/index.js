import express from "express";
import { DeviceController } from "../controllers/device/index.js";
const router = express.Router();

import {
    WaterLevelController,
    WaterSettingController,
    UserController,
    ProductController,
    ForgetPasswordController
} from '../controllers/index.js';

// user
router.post('/user-register', UserController.userRegister);
router.post('/login-user', UserController.loginUser);
<<<<<<< HEAD
router.delete('/logout-user', UserController.logoutUser);
router.get('/check-token-exist', UserController.checkTokenExist);
=======
router.delete('/logout-user',UserController.logoutUser);
router.get('/check-token-exist',UserController.checkTokenExist);
>>>>>>> 56b33e07c8f4c09ff877beaa662aa4698987d3d6

///water level
router.get('/led-status/:unique_id', WaterLevelController.getLedStatus);
router.put('/led-status/:unique_id', WaterLevelController.updateLedStatus);

router.get('/sump-status/:unique_id', WaterLevelController.getSumpStatus);
router.put('/sump-status/:unique_id', WaterLevelController.updateSumpStatus);
router.put('/sump-level/:unique_id', WaterLevelController.updateSumpLevel);
 
router.get('/bore-status/:unique_id', WaterLevelController.getBoreStatus);
router.put('/bore-status/:unique_id', WaterLevelController.updateBoreStatus);

router.put('/update-motor-status/:unique_id', WaterLevelController.updateMotorStatus);


router.get('/water-level/:unique_id', WaterLevelController.getWaterLevel);
router.get('/prev-water-level/:unique_id', WaterLevelController.prevWaterLevel);
router.put('/water-level/:unique_id', WaterLevelController.updateWaterLevel);

router.get('/water-level-image/:unique_id', WaterLevelController.getWaterLevelImage);
router.post('/water-level-image/:unique_id', WaterLevelController.saveWaterLevelImage);

// water setting

router.get('/water-level-setting/:unique_id', WaterSettingController.getWaterSetting);
router.put('/update-water-level-setting/:unique_id', WaterSettingController.setWaterSetting);

// router.get('/pump-notification-setting/:unique_id', WaterSettingController.getWaterSetting);
// router.put('/motor-notification-setting/:unique_id', WaterSettingController.setMotorNotificationSetting);

router.put('/notification-setting/:unique_id', WaterSettingController.notificationSetting);

//product list
<<<<<<< HEAD
router.post('/add-product', ProductController.store);
router.get('/get-product/:id', ProductController.index);
router.put('/product/:id', ProductController.update);
router.put('/primary/:id', ProductController.productKeyActivate);
=======
router.post('/add-product',ProductController.store);
router.get('/get-product/:id',ProductController.index);
router.put('/product/:id',ProductController.update);
router.put('/primary/:id',ProductController.productKeyActivate);
>>>>>>> 56b33e07c8f4c09ff877beaa662aa4698987d3d6

router.post('/device-key-generate',DeviceController.store);
router.put('/device-key/:id',DeviceController.update);

router.put('/tank-height-setting/:unique_id', WaterSettingController.tankHeightSetting);
router.put('/water-source-setting/:unique_id', WaterSettingController.waterSourceSetting);

//forgetPassword
router.post('/forget-password',ForgetPasswordController.forgetPassword);
router.put('/verify-otp/:user_id',ForgetPasswordController.verifyOtp);
router.put('/reset-password/:user_id',ForgetPasswordController.resetPassword);


export default router;