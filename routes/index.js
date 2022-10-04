import express from "express";
const router = express.Router();

import {
    WaterLevelController,
} from '../controllers/index.js';

//water level
// router.get('/water-level/:led_status', WaterLevelController.waterLevel);
// router.get('/', WaterLevelController.indexFile);

router.get('/led-status/:unique_id', WaterLevelController.getLedStatus);
router.put('/led-status/:unique_id', WaterLevelController.updateLedStatus);

router.get('/water-level/:unique_id', WaterLevelController.getWaterLevel);
router.put('/water-level/:unique_id', WaterLevelController.updateWaterLevel);

router.get('/water-level-image/:unique_id', WaterLevelController.getWaterLevelImage);
router.post('/water-level-image/:unique_id', WaterLevelController.saveWaterLevelImage);


export default router;