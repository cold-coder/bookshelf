var mongoose	= require('mongoose');
var Schema		= mongoose.Schema;

mongoose.connect('mongodb://localhost/ccplib'); // connect to our database

var BookSchema = new Schema({
	info:{
		name:String,
		author:String,
		isbn:String,
		price:String,
		desc:String,
		rate:Number
	},
	owner:{
		name:String,
		email:String
	},
	available:Boolean,
	active:Boolean,
	borrowedBy:String,
	borrowedEmail:String,
	borrowedDate:Date,
	dueDate:Date,
	userLike:Boolean,
	likesCount:Number,
	likeList:[String],
	imagePath:String,
	borrowHistory:[{
		who:String,
		email:String,
		borrowDate:Date,
		returnDate:Date
	}],
	book_id:Schema.Types.ObjectId
});

// BookSchema.statics.findByName = function(name, offset, pageSize, cb){
// 	this.find({name: new RegExp(name, 'i')}, null, {skip:offset, limit:pageSize}, cb);
// };

// BookSchema.statics.countByName = function(name, cb){
// 	this.count({name: new RegExp(name, 'i')}, cb);
// };



module.exports = mongoose.model('Book', BookSchema);