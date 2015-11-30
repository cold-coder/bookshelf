var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var dns = require('dns');

var dbook = function(isbn, cb){
	dns.resolve('book.douban.com', function(err) {
	  	if (err){
	  		cb(new Error("cannot access Douban Book!"));
	  	}else{
	 		request('http://book.douban.com/subject_search?search_text=' + isbn, function(error, response, body){
				if(!error && response.statusCode == 200){
					$ = cheerio.load(body);
					var target_book_url = $('.subject-list>li.subject-item>div.pic>a.nbg').attr('href');
					request(target_book_url, function(error, response, body){
						if(!error && response.statusCode == 200){
							$$ = cheerio.load(body);
							var name = $$('h1>span').text();
							// var author = $$('div#info>span>a').text();
							var infoText = $$('div#info').text().replace(/(\r\n|\n|\r)/gm,"");
								var priceRegexp = /定价:(.+)\s+装帧/g;
								var authorRegexp = /作者:(.+)\s+出版社/g;
								var ISBNRegexp = /ISBN:(.+)$/g;
								var authorMatch = authorRegexp.exec(infoText);
								var priceMatch = priceRegexp.exec(infoText);
								var ISBNMatch = ISBNRegexp.exec(infoText);
								var author = authorMatch[1].trim();
								var price = priceMatch[1].trim();
								var isbn = ISBNMatch[1].trim();
							var rate = $$('strong.rating_num').text();
							var desc = $$('div.intro').text();
							var coverPath = $$('#mainpic>a>img').attr('src');
							var book = {};
							book['name'] = name;
							book['author'] = author;
							book['price'] = price;
							book['isbn'] = isbn;
							book['rate'] = rate;
							book['desc'] = desc;
							book['coverPath'] = coverPath;

							cb(null, book);

							// console.log("Book name: " + name + " Author: " + author + " Price: " + price + " ISBN: " + isbn + " Rate: " + rate);
							// console.log("Description: " + desc);
							// console.log("Cover Image Path: " + coverPath);
						}
					})
					//.pipe(fs.createWriteStream('bookDetail.html'));
				}else{
					cb(new Error("cannot access Douban Book!"));
				}
			})
			//.pipe(fs.createWriteStream('bookList.html')); 		
	  	}

	}
)}

module.exports = dbook;