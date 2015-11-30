var bookSvc = require('./svc.js');

// var book1 = new Book(
// 	{info:{name: '沙僧日记', author: '列夫托尔斯泰', isbn: '21232344434343', price: '20', desc:'', rate: 7}, 
// 	owner: {name:'yaocheng', email:'yaocheng@ncsi.com.cn'},
// 	available:false, 
// 	borrowedBy: 'JinWen', 
// 	borrowedEmail:'jinwenhe@ncsi.com.cn', 
// 	borrowedDate: new Date(2015, 9, 25), 
// 	dueDate: new Date(2015, 11, 25), 
// 	likes: 0, 
// 	imagePath:'', 
// 	borrowHistory:[]}
// 	);

// book1.save(function (err) {
//   if (err) throw err;
//   // saved!
// })

// bookSvc.likeBook('563c0f3b20db0dbdf4b4678a','1.2.3.4', function(book){
// 	console.log(book);
// })

// bookSvc.unLikeBook('563c0f3b20db0dbdf4b4678a','1.2.3.4', function(book){
// 	console.log(book);
// })

// bookSvc.listAllBooks(function(books){
// 	console.log(books);
// })

// bookSvc.searchBook('西游记', function(book){
// 	book.available=false;
// 	console.log(book);
// })

// bookSvc.borrowBook('563c0f3b20db0dbdf4b4678a', {name:'Zou Huan', email:'zouhuan@ncsi.com.cn'}, function(book){
// 	console.log(book);
// })

// bookSvc.returnBook('563c0f3b20db0dbdf4b4678a', function(book){
// 	console.log(book);
// });

// bookSvc.listAvailableBooks(function(books){
// 	console.log(books);
// });

// bookSvc.listUnavailableBooks(function(books){
// 	console.log(books);
// });

// bookSvc.bookDetail('56402c613fb935b2ee569ba7', function(book){
// 	console.log(book);
// });

// bookSvc.deleteBook('511180b408979ab50801eb1', function(book){
// 	console.log(book);
// });

// var book = {};
// 	book['name'] = "some name";
// 	book['author'] = "Allen";
// 	book['isbn'] = "123456789";
// 	book['price'] = "99.9";
// 	book['desc'] = "long desc";
// 	book['rate'] = "7.4";
// 	book['ownername'] = "";
// 	book['owneremail'] = "";
// 	book['imagePath'] = "img/somepath";
	
// bookSvc.addBook(book, function(booked){
// 	console.log(booked);
// });

bookSvc.addDoubanBook('9787508654904', function(err, book){
	if(err) throw err;
	console.log(book);
})









