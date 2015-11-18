var express = require('express');
var app = express();
var bodyParser 	= require('body-parser');
var bookSvc = require('./core/svc.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static('public'));

var port = process.env.PORT || 8080; //set our port

var router = express.Router();  

router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});

router.get('/list', function(req, res){
	var ipAddress = req.connection.remoteAddress;
	bookSvc.listAllBooks(ipAddress, function(books){
		res.json(books);
	});
});

router.get('/detail/:id', function(req, res){
	bookSvc.bookDetail(req.params.id, function(book){
		res.json(book);
	});
});

router.get('/listavailable', function(req, res){
	bookSvc.listAvailableBooks(function(books){
		res.json(books);
	});
});

router.get('/listunavailable', function(req, res){
	bookSvc.listUnavailableBooks(function(books){
		res.json(books);
	});
});

router.get('/like/:id', function(req, res){
	var ipAddress = req.connection.remoteAddress;
	bookSvc.likeBook(req.params.id, ipAddress, function(books){
		res.json(books);
	});
});

router.get('/unlike/:id', function(req, res){
	var ipAddress = req.connection.remoteAddress;
	bookSvc.unLikeBook(req.params.id, ipAddress, function(books){
		res.json(books);
	});
});

router.post('/borrow', function(req, res){
	var bookId = req.body.bookId;
	var borrower = {};
	borrower.name = req.body.name;
	borrower.email = req.body.email;
	bookSvc.borrowBook(bookId, borrower, function(book){
		res.json(book);
	});
});

router.get('/return/:id', function(req, res){
	bookSvc.returnBook(req.params.id, function(book){
		res.json(book);
	});
});


app.use('/', router);

var routerAPI = express.Router(); 



app.use('/api', routerAPI);

app.listen(port);
console.log('Magic happens on port ' + port);