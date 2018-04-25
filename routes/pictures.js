var express = require('express');
var router = express.Router();
var PictureController = require('../controller/picture');
let pictureController = new PictureController();

router.get('/', pictureController.getAll);
router.get('/:id', pictureController.get);
router.post('/',pictureController.addPicture);
router.put('/:id',pictureController.update);
router.delete('/:id',pictureController.remove);




module.exports = router;
