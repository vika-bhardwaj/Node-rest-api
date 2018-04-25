var PictureModel = require('../model/picture').PictureModel;
const BasicResponse ={
    "success" : false,
    "message" : "",
    "data" : {}
};

class PictureController {
    constructor(){
       
    }
    static get USER_VALIDATION_SCHEME(){
        return {
            'pictureOrgName':{
                isEmpty:false,
                errorMessage: 'Invalid picture original name'
            },
            'pictureName':{
                isEmpty:false,
                errorMessage: 'Invalid picture name'

            },
            'picturePath':{
                isEmpty:false,
                errorMessage: 'Invalid picture path'
            },
            'pictureSize':{
                isEmpty:false,
                isNumeric: true,
                errorMessage: 'Invalid size provided'
            },
            'addedByUserId':{
                isEmpty:false,
                errorMessage: 'Invalid user id'
            }
        };
    }
    /* Get picture by ID */
    get(req, res, next) {
        req.checkParams( 'id', 'Invalid picture ID provided').isMongoId();
        req.getValidationResult()
            .then( (result) =>{
                if( !result.isEmpty() ){
                    let errorMessages = result.array().map(function (elem){
                        return elem.msg;
                    });
                    PictureController.respondWithError(res, 500, 'There are validation errors: ' + errorMessages.join(' && '));
                }
                let picId = req.params.id;
                return new Promise(function (resolve, reject) {
                    PictureModel.findById(picId, function (err, pic) {
                        if (pic === null) {
                            PictureController.respondWithError(res, 500, "User not found against Provided id "+ picId);
                        } else {
                            resolve(pic);
                        }
                    });
                });
            })
            .then((pic) => {
                PictureController.respondWithSuccess(res, 200, pic,"Successfully created");
            })
            .catch( (error) => {
                PictureController.respondWithError(res,error.status || 500, error);
            })
    }
    /* Get all users */
    getAll(req, res, next) {
        req.getValidationResult()
        .then( (result) =>{
            if( !result.isEmpty() ){
                let errorMessages = result.array().map(function (elem){
                    return elem.msg;
                });
                PictureController.respondWithError(res, 500, 'There are validation errors: ' + errorMessages.join(' && '));
            }
            return new Promise(function (resolve, reject) {
                PictureModel.find({}, function (err, pics) {
                    if (pics === null) {
                        PictureController.respondWithError(res, 500, 'No user found');
                    } else {
                        resolve(pics);
                    }
                });
            });
        })
        .then((pics) => {
            PictureController.respondWithSuccess(res, 200, pics);
        })
        .catch( (error) => {
            PictureController.respondWithError(res,error.status || 500, error);
        })
    }
    /* Create new user */
    addPicture(req, res, next) {
        let data = req.body;
        req.checkBody(PictureController.USER_VALIDATION_SCHEME);
        req.getValidationResult()
            .then( function (result){
                if ( !result.isEmpty() ){
                    let errorMessages = result.array().map(function(elem){
                        return elem.msg;
                    });
                    PictureController.respondWithError(res, 500, 'There are validation errors: ' + errorMessages.join(' && '));
                }
                return new PictureModel({
                    pictureOrgName: data.pictureOrgName,
                    pictureName: data.pictureName,
                    picturePath: data.picturePath,
                    pictureSize: data.pictureSize,
                    rating: data.rating,
                    caption: data.caption,
                    comment: data.comment,
                    addedByUserId: data.addedByUserId
                });
                
            })
            .then( (pic) =>{
                return new Promise(function (resolve, reject) {
                    PictureModel.create(data, function (err, pic) {
                        if (err) {
                            reject("Error during adding Picture");
                        } else {
                            resolve(pic);
                        }
                    });
                });
            })
            .then( (saved) => {
                PictureController.respondWithSuccess(res, 200, saved,"Successfully created");
            })
            .catch( (error) =>{
                PictureController.respondWithError(res,error.status || 500, error);
            })
    }
    /** Update user info */
    update(req, res){
        let data = req.body;
        let picId = req.params.id
        req.checkParams( 'id', 'Invalid pic ID provided').isMongoId();   
        req.checkBody(PictureController.USER_VALIDATION_SCHEME);
        req.getValidationResult()
            .then( function (result){
                if ( !result.isEmpty() ){
                    let errorMessages = result.array().map(function(elem){
                        return elem.msg;
                    });
                    PictureController.respondWithError(res, 500, 'There are validation errors: ' + errorMessages.join(' && '));
                }
                return new PictureModel({
                    pictureOrgName: data.pictureOrgName,
                    pictureName: data.pictureName,
                    picturePath: data.picturePath,
                    pictureSize: data.pictureSize,
                    rating: data.rating,
                    caption: data.caption,
                    comment: data.comment,
                    addedByUserId: data.addedByUserId
                });
            })
            .then( (pic) =>{
                return new Promise(function (resolve, reject) {
                    PictureModel.findByIdAndUpdate(picId, data, function (err, pic) {
                        if (pic === null) {
                            PictureController.respondWithError(res, 500, 'No pic found for this id '+picId);
                        } else {
                            resolve(pic);
                        }
                    });
                });
            })
            .then( (pic) => {
                PictureController.respondWithSuccess(res, 200, {},"User updated successfully");
            })
            .catch( (error) =>{
                PictureController.respondWithError(res,error.status || 500, error);
            })
    }
    /** Remove user info */
    remove (req, res){
        req.checkParams( 'id', 'Invalid User ID provided').isMongoId();
        req.getValidationResult()
            .then( (result) =>{
                if( !result.isEmpty() ){
                    let errorMessages = result.array().map(function (elem){
                        return elem.msg;
                    });
                    PictureController.respondWithError(res, 500, 'There are validation errors: ' + errorMessages.join(' && '));
                }
                let picId = req.params.id;
                return new Promise(function (resolve, reject) {
                    PictureModel.findByIdAndRemove({"_id":picId}, function (err, pic) {
                        if (err) {
                            PictureController.respondWithError(res, 500, err);
                        } else {
                            resolve(pic);
                        }
                    });
                });
            })
            .then((pic) => {
                PictureController.respondWithSuccess(res, 200, pic,"Successfully deleted");
            })
            .catch( (error) => {
                PictureController.respondWithError(res,error.status || 500, error);
            })
    }

    static respondWithSuccess ( res, code, data, message="" ){
        console.log('Pic ResponseManager respondWithSuccess');
        let response = Object.assign({}, BasicResponse);
        response.success = true;
        response.message = message;
        response.data = data;
        res.status(code).json(response);
    }
    
    static respondWithError (res, errorCode, message="") {
        console.log('Pic ResponseManager respondWithError');
        let response = Object.assign({}, BasicResponse);
        response.success = false;
        response.message = message;
        res.status(errorCode).json(response);
    }
}
module.exports = PictureController;