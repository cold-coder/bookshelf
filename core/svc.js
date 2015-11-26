var mongoose	= require('mongoose');
var Book	= require('./book');
var fs = require('fs');

var bookSvc = {};


bookSvc.likeBook = function(id, ipAddress, cb){
	Book.findOne({_id: id}, function(err, book){
		if(err) throw err;
		book.likeList.push(ipAddress);
		book.likesCount = book.likeList.length;
		book.save(function(err){
			if(err) throw err;
			cb(book);
		});
	});
}

bookSvc.unLikeBook = function(id, ipAddress, cb){
	Book.findOne({_id: id}, function(err, book){
		if(err) throw err;
		var idx = book.likeList.indexOf(ipAddress);
		book.likeList.splice(idx, 1);
		book.likesCount = book.likeList.length;
		book.save(function(err){
			if(err) throw err;
			cb(book);
		});
	});
}

bookSvc.listAllBooks = function(ipAddress, cb){
	Book.find({active : true}).select({_id:1, info: 1, available:1, borrowedBy:1,dueDate:1, imagePath:1, likeList:1, userLike:1, likesCount:1}).sort({available: -1, "info.name": 1}).exec(function(err, books){
		if (err) throw err;
		books.forEach(function(book){
			book.userLike = book.likeList.indexOf(ipAddress) > -1 ? true : false;
			book.likeList = null;
		});
		cb(books);
	})
}

bookSvc.bookDetail = function(bookId, cb){
	Book.findOne({_id: bookId}).select({_id:1, info: 1, owner: 1}).exec(function(err, book){
		if(err) throw err;
		cb(book);
	});
}

bookSvc.listAvailableBooks = function(cb){
	Book.find({available:true}).select({_id:1, info: 1, available:1, active:1}).sort({"info.name": 1}).exec(function(err, books){
		if (err) throw err;
		cb(books);
	});
}

bookSvc.listUnavailableBooks = function(cb){
	Book.find({available:false}).select({_id:1, info: 1, available:1, borrowedBy:1, borrowedEmail:1, borrowedDate:1, dueDate:1}).sort({"info.name": 1}).exec(function(err, books){
		if (err) throw err;
		cb(books);
	});
}

bookSvc.searchBook = function(bookName, cb){
	Book.find({},'info available userLike likeList',function(err, books){
		books.forEach(function(book){
			book.available = false;
		});
		cb(books);
	});
}

bookSvc.borrowBook = function(bookId, borrower, cb){
	Book.findOne({_id: bookId}, function(err, book){
		if(err) throw err;
		var now = new Date();
		book.borrowedBy = borrower.name;
		book.borrowedEmail = borrower.email;
		book.borrowedDate = now;
		//default borrow 1 month
		book.dueDate = now.setMonth(now.getMonth() + 1);
		book.available = false;
		book.save(function(err){
			if(err) throw err;
			cb(book);
		});
	});
}

bookSvc.returnBook = function(bookId, cb){
	Book.findOne({_id: bookId}, function(err, book){
		if(err) throw err;
		book.borrowHistory.push({
			who:book.borrowedBy,
			email:book.borrowedEmail,
			borrowDate:book.borrowedDate,
			returnDate:new Date()
		});
		book.available = true;
		book.borrowedBy = null;
		book.borrowedEmail = null;
		book.borrowedDate = null;
		book.dueDate = null;
		book.save(function(err){
			if(err) throw err;
				cb(book);
		});
	});
}

bookSvc.activeBook = function(bookId, cb){
	Book.findOne({_id: bookId}, function(err, book){
		if(err) throw err;
		book.active = true;

		book.save(function(err){
			if(err) throw err;
				cb(book);
		});
	});
}

bookSvc.deactiveBook = function(bookId, cb){
	Book.findOne({_id: bookId}, function(err, book){
		if(err) throw err;
		book.active = false;

		book.save(function(err){
			if(err) throw err;
				cb(book);
		});
	});
}



//Book  API

bookSvc.addBook = function(book, cb){
	var info = {};
	info.name = book.name;
	info.author = book.author;
	info.isbn = book.isbn;
	info.price = book.price;
	info.desc = book.desc.replace(/\r\n/g, "<br>&nbsp;&nbsp;&nbsp;&nbsp;");
	info.rate = book.rate;

	var owner = {};
	owner.name = !!book.ownername?book.ownername:"CCP";
	owner.email = !!book.ownername?book.owneremail:"CCP@ncsi.com.cn";

	var b = {};
	b.info = info;
	b.owner = owner;
	b.available = true;
	b.active = true;
	b.likesCount = 0;
	b.likeList = [];
	b.imagePath = './img/' + book.imagePath;

	Book.create(b, function(err, booked){
		if(err) cb(err);
		cb(null, booked);
	});
}

bookSvc.deleteBook = function(bookId, cb){
	Book.findOneAndRemove({_id: bookId}, function(err, doc){
		if(err) throw cb(err);
		//got the doc and remove the cover
		// console.log(doc.imagePath); //./img/
		fs.unlink('./public/'+doc.imagePath, function(err){
			if(err) cb(err);
			cb(null, {result:'success'});
		})
	});
}


  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = bookSvc;
    }
    exports.bookSvc = bookSvc;
  }
