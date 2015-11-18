$(document).ready(function(){
	refreshRetrunSection();
	refreshBorrowSection();

	function validateEmail($email) {
	  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	  return emailReg.test( $email );
	}

	function hookEventBorrow(){
		$('.btn-borrow').on('click', function(){
			var bookId = $(this).attr('data-bookid');
			var borrowerName = $('#borrower-name-'+bookId).val();
			var borrowerEmail = $('#borrower-email-'+bookId).val();
			if(borrowerName == "" || borrowerEmail == "" || !validateEmail(borrowerEmail)) {
				alert('请填写正确的姓名和邮箱 ：）');
				return;
			}else{
				var borrower = {};
				borrower['bookId'] = bookId;
				borrower['name'] = borrowerName;
				borrower['email'] = borrowerEmail;
				if (confirm("确认借阅？") == true) {
					$.post('/borrow', borrower)
						.done(function(book){
							location.reload();
						}).fail(function(error){
							console.log(error);
						});
				} else {
					return;
				}

			}
		});
	}



	function hookEventReturn(){
		$('.btn_retrun').on('click', function(){
			if (confirm("确认还书？") == true) {
				var bookId = $(this).attr('data-bookid');
				$.get('/return/'+bookId)
					.done(function(book){
						location.reload();
					}).fail(function(error){
						console.log(error);
					});
			} else {
				return;
			}
		});
	}



	function refreshRetrunSection(){
		$.get('/listunavailable')
		.done(function(data){
			handleBookRetrun(data);
		}).fail(function(error){
			console.log("error happened");
		});

		function handleBookRetrun(data){
			var bookCount = data.length;
			$('#borrow_count').html(bookCount);

			var template = $('#tmpl_book_return').html();
			var compiled = _.template(template);
			var html = compiled({"books" : data});

			$('#book-return').html(html);
			hookEventReturn();
		};
	}

	function refreshBorrowSection(){
		$.get('/listavailable')
		.done(function(data){
			handleBookBorrow(data);
		}).fail(function(error){
			console.log("error happened");
		});

		function handleBookBorrow(data){
			var bookCount = data.length;
			$('#stock_count').html(bookCount);

			var template = $('#tmpl_book_borrow').html();
			var compiled = _.template(template);
			var html = compiled({"books" : data});

			$('#book-borrow').html(html);
			hookEventBorrow();
		};
	}

	function formatDate(d){
		console.log(typeof d);
	}

});