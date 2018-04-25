var UserModel = require('../model/user').UserModel;
const BasicResponse ={
    "success" : false,
    "message" : "",
    "data" : {}
};

class UserController {
    constructor(){
       
    }
    static get USER_VALIDATION_SCHEME(){
        return {
            'userName':{
                isEmpty:false,
                isLength:{
                    options:[{ min:2, max:15 }],
                    errorMessage: 'user Name must be between 2 and 15 chars long'
                },
                errorMessage: 'Invalid User Name'

            },
            'firstName':{
                isEmpty:false,
                isLength:{
                    options:[{ min:2, max:15 }],
                    errorMessage: 'First Name must be between 2 and 15 chars long'
                },
                errorMessage: 'Invalid first name'

            },
            'lastName':{
                isEmpty:false,
                isLength :{
                    options:[ { min:2, max:15 } ],
                    errorMessage: 'Last name must be between 2 and 15 chars long'
                },
                errorMessage: 'Invalid last name'
            },
            'email':{
                isEmail:{
                    errorMessage: 'Invalid email'
                },
                errorMessage: 'Invalid email provided'
            },
            'password':{
                isEmpty:false,
                isLength:{
                    options:[ { min:8, max:35 } ],
                    errorMessage: 'password must bebetween 6 and 35 chars long'
                },
                errorMessage: 'invalid Password format'
            }
        };
    }
    /* Get user by ID */
    get(req, res, next) {
        req.checkParams( 'id', 'Invalid User ID provided').isMongoId();
        req.getValidationResult()
            .then( (result) =>{
                if( !result.isEmpty() ){
                    let errorMessages = result.array().map(function (elem){
                        return elem.msg;
                    });
                    UserController.respondWithError(res, 500, 'There are validation errors: ' + errorMessages.join(' && '));
                }
                let userId = req.params.id;
                return new Promise(function (resolve, reject) {
                    UserModel.findById(userId, function (err, user) {
                        if (user === null) {
                            UserController.respondWithError(res, 500, "User not found against Provided id "+ userId);
                        } else {
                            resolve(user);
                        }
                    });
                });
            })
            .then((user) => {
                UserController.respondWithSuccess(res, 200, user,"Successfully created");
            })
            .catch( (error) => {
                UserController.respondWithError(res,error.status || 500, error);
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
                UserController.respondWithError(res, 500, 'There are validation errors: ' + errorMessages.join(' && '));
            }
            let userId = req.params.id;
            return new Promise(function (resolve, reject) {
                UserModel.find({}, function (err, users) {
                    if (users === null) {
                        UserController.respondWithError(res, 500, 'No user found');
                    } else {
                        resolve(users);
                    }
                });
            });
        })
        .then((users) => {
            UserController.respondWithSuccess(res, 200, users);
        })
        .catch( (error) => {
            UserController.respondWithError(res,error.status || 500, error);
        })
    }
    /* Create new user */
    create(req, res, next) {
        let data = req.body;
        req.checkBody(UserController.USER_VALIDATION_SCHEME);
        req.getValidationResult()
            .then( function (result){
                if ( !result.isEmpty() ){
                    let errorMessages = result.array().map(function(elem){
                        return elem.msg;
                    });
                    UserController.respondWithError(res, 500, 'There are validation errors: ' + errorMessages.join(' && '));
                }
                return new UserModel({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    password: data.password,
                    userName: data.userName
                });
            })
            .then( (user) =>{
                return new Promise(function (resolve, reject) {
                    UserModel.find({email: user.email}, function (err, docs) {
                        if (docs.length) {
                            reject("User already exists");
                        } else {
                            resolve(user);
                        }
                    });
                });
            })
            .then( (user) => {
                user.save();
                return user;
            })
            .then( (saved) => {
                UserController.respondWithSuccess(res, 200, saved,"Successfully created");
            })
            .catch( (error) =>{
                UserController.respondWithError(res,error.status || 500, error);
            })
    }
    /** Update user info */
    update(req, res){
        let data = req.body;
        let userId = req.params.id
        req.checkParams( 'id', 'Invalid User ID provided').isMongoId();   
        req.checkBody(UserController.USER_VALIDATION_SCHEME);
        req.getValidationResult()
            .then( function (result){
                if ( !result.isEmpty() ){
                    let errorMessages = result.array().map(function(elem){
                        return elem.msg;
                    });
                    UserController.respondWithError(res, 500, 'There are validation errors: ' + errorMessages.join(' && '));
                }
                return new UserModel({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    password: data.password,
                    userName: data.userName
                });
            })
            .then( (user) =>{
                return new Promise(function (resolve, reject) {
                    UserModel.findByIdAndUpdate(userId, data, function (err, user) {
                        if (user === null) {
                            UserController.respondWithError(res, 500, 'No user found');
                        } else {
                            resolve(user);
                        }
                    });
                });
            })
            .then( (user) => {
                UserController.respondWithSuccess(res, 200, {},"User updated successfully");
            })
            .catch( (error) =>{
                UserController.respondWithError(res,error.status || 500, error);
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
                    UserController.respondWithError(res, 500, 'There are validation errors: ' + errorMessages.join(' && '));
                }
                let userId = req.params.id;
                return new Promise(function (resolve, reject) {
                    UserModel.findByIdAndRemove({"_id":userId}, function (err, user) {
                        if (err) {
                            UserController.respondWithError(res, 500, err);
                        } else {
                            resolve(user);
                        }
                    });
                });
            })
            .then((user) => {
                UserController.respondWithSuccess(res, 200, user,"Successfully deleted");
            })
            .catch( (error) => {
                UserController.respondWithError(res,error.status || 500, error);
            })
    }

    static respondWithSuccess ( res, code, data, message="" ){
        console.log('ResponseManager respondWithSuccess');
        let response = Object.assign({}, BasicResponse);
        response.success = true;
        response.message = message;
        response.data = data;
        res.status(code).json(response);
    }
    
    static respondWithError (res, errorCode, message="") {
        console.log('ResponseManager respondWithError');
        let response = Object.assign({}, BasicResponse);
        response.success = false;
        response.message = message;
        res.status(errorCode).json(response);
    }
}
module.exports = UserController;