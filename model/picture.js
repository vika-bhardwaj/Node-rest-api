let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let PictureSchema = new Schema({
    pictureOrgName:String,
    pictureName:String,
    picturePath:String,
    pictureSize:Number,
    rating:String,
    caption:String,
    comment:String,
    addedByUserId:String,
    dateCreated: {type: Date, default: Date.now},
});

module.exports.PictureModel = mongoose.model('Picture', PictureSchema);
