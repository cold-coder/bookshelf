var express = require('express');
var app = express();
var bodyParser 	= require('body-parser');
var bookSvc = require('./core/svc.js');
var multer = require('multer');
var basicAuth = require('basic-auth');
var path = require('path');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

var upload = multer({ storage: storage });

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

router.get('/active/:id', function(req, res){
	bookSvc.activeBook(req.params.id, function(book){
		res.json(book);
	});
});

router.get('/deactive/:id', function(req, res){
	bookSvc.deactiveBook(req.params.id, function(book){
		res.json(book);
	});
});


//admin
// https://davidbeath.com/posts/expressjs-40-basicauth.html
var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === 'foo' && user.pass === 'bar') {
    return next();
  } else {
    return unauthorized(res);
  };
};


app.get('/admin', auth, function(req,res){
  res.sendFile(path.join(__dirname+'/public/imadminpage.html'));
});

app.use('/', router);

var routerAPI = express.Router();

//http://lollyrock.com/articles/express4-file-upload/

routerAPI.post('/upload', upload.single('book_cover'),  function(req, res){
	console.log(req.body);
	console.log(req.file);
	res.json({});
});


app.use('/api', routerAPI);

app.listen(port);
console.log('Magic happens on port ' + port);