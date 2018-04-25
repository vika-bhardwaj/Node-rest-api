var express = require('express');
var router = express.Router();
var UserController = require('../controller/user');
let userController = new UserController();

router.get('/', userController.getAll);
router.get('/:id', userController.get);
router.post('/',userController.create);
router.put('/:id',userController.update);
router.delete('/:id',userController.remove);


module.exports = router;
