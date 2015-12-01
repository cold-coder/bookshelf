$(document).ready(function(){
	refreshBorrowSection();
	hookPageEvent();
	$('[id^=sec_book]').hide();
	$('#sec_book_borrow').show();

	//Active book borrow section
	$('#menu_book_borrow').on('click',function(e){
		refreshBorrowSection();
		$('#menu>ul>li').removeClass('pure-menu-selected');
		$(this).parent('li').addClass('pure-menu-selected');
		$('[id^=sec_book]').hide();
		$('#sec_book_borrow').show();
	});

	//Active book return section
	$('#menu_book_return').on('click',function(e){
		refreshReturnSection();
		$('#menu>ul>li').removeClass('pure-menu-selected');
		$(this).parent('li').addClass('pure-menu-selected');
		$('[id^=sec_book]').hide();
		$('#sec_book_return').show();
	});
	
	//Fast add book section
	$('#menu_book_fastadd').on('click',function(e){
		$('#menu>ul>li').removeClass('pure-menu-selected');
		$(this).parent('li').addClass('pure-menu-selected');
		$('[id^=sec_book]').hide();
		$('#sec_book_fastadd').show();
	});

	//Active book add section
	$('#menu_book_add').on('click',function(e){
		$('#menu>ul>li').removeClass('pure-menu-selected');
		$(this).parent('li').addClass('pure-menu-selected');
		$('[id^=sec_book]').hide();
		$('#sec_book_add').show();
	});
	
	

	function validateEmail($email) {
	  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	  return emailReg.test( $email );
	}

	function isValidISBN (isbn) {
		isbn = isbn.replace(/[^\dX]/gi, '');
		if(isbn.length == 10) {
		        var chars = isbn.split('');
		        if(chars[9].toUpperCase() == 'X') {
		                chars[9] = 10;
		        }
		        var sum = 0;
		        for(var i = 0; i < chars.length; i++) {
		                sum += ((10-i) * parseInt(chars[i]));
		        }
		        return (sum % 11 == 0);
		} else if(isbn.length == 13) {
		        var chars = isbn.split('');
		        var sum = 0;
		        for (var i = 0; i < chars.length; i++) {
		                if(i % 2 == 0) {
		                        sum += parseInt(chars[i]);
		                } else {
		                        sum += parseInt(chars[i]) * 3;
		                }
		        }
		        return (sum % 10 == 0);
		} else {
		        return false;
		}
	}

	function hookEventBorrow(){
		//borrow event
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
						.done(function(result){
							if(result.success == true){
								toastr.success(result.data.name, '借阅成功！');
								refreshBorrowSection();	
							}else{
								toastr.error('借阅失败！');
								console.log(result.data);
							}
						})
						.fail(function(error){
							toastr.error('借阅失败！');
							console.log(error);
						});
				} else {
					return;
				}

			}
		});

		//active/deactive event
		$('.toggle').change(function(){
			var bookId = $(this).attr('data-bookid');
			if($(this).is(':checked')){
				//active a book
				$.get('/active/'+bookId)
				.done(function(book){
					console.log(book)
				}).fail(function(error){
					console.log(error);
				});
			}else{
				//deactive a book
				$.get('/deactive/'+bookId)
				.done(function(book){
					console.log(book)
				}).fail(function(error){
					console.log(error);
				});
			}
		});

		//delete button event
		$('.btn-delete').on('click', function(){
			var bookId = $(this).attr('data-bookid');
			if (confirm("确认删除？") == true) {
				$.ajax({
					url:'/api/book/'+bookId,
					type: 'DELETE'
				})
				.done(function(result){
					if(result.success == true){
						toastr.success(result.data.name, '删除成功！');
						refreshBorrowSection();
					}else{
						toastr.error('删除失败！');
						console.log(result.data);
					}
				}).fail(function(error){
					toastr.error('删除失败！');
					console.log(error);
				});
			} else {
				return;
			}
		});

	}



	function hookEventReturn(){
		$('.btn_retrun').on('click', function(){
			if (confirm("确认还书？") == true) {
				var bookId = $(this).attr('data-bookid');
				$.get('/return/'+bookId)
					.done(function(result){
						if(result.success == true){
							toastr.success(result.data.name, '还书成功！');
							refreshReturnSection();							
						}else{
							toastr.error('还书失败！');
							console.log(result.data);
						}

					}).fail(function(error){
						toastr.error('还书失败！');
						console.log(error);
					});
			} else {
				return;
			}
		});
	}



	function refreshReturnSection(){
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
	
	//event on object need only be bind once if they are not refresh by ajax!
	function hookPageEvent(){
		var covers;

		$('#id_book_cover').on('change', prepareUpload);

		function prepareUpload(event){
			cover = event.target.files[0];
			if(!cover.type.match('image.*')) return;
			var reader = new FileReader();

			reader.onload = (function(theFile){
				return function(e){
					$('#cover_thumb').prop('src', e.target.result);
					$('#cover_thumb').prop('title', escape(theFile.name));
				}
			})(cover);

			reader.readAsDataURL(cover);
		}

		$('#id_submit').on('click', upload);

		function validator(){
			var book_name = $('#id_book_name').val().trim();
			var book_author = $('#id_book_author').val().trim();
			var book_price = $('#id_book_price').val().trim();
			var book_desc = $('#id_book_desc').val().trim();
			var book_rate = $('#id_book_rate').val().trim();
			var book_cover = $('#cover_thumb').prop('title');

			if(book_name === ""){
				toastr.error("Book Name cannot be empty!");
				$('#id_book_name').focus();
				return false;
			}else if(book_author ===""){
				toastr.error("Author cannot be empty!");
				$('#id_book_author').focus();
				return false;
			}else if(book_price ===""){
				toastr.error("Price cannot be empty!");
				$('#id_book_price').focus();
				return false;				
			}else if(book_desc ===""){
				toastr.error("Description cannot be empty!");
				$('#id_book_desc').focus();
				return false;				
			}else if(book_rate ===""){
				toastr.error("Rate cannot be empty!");
				$('#id_book_rate').focus();
				return false;				
			}else if(book_cover ===""){
				toastr.error("Please upload a book cover!");
				return false;				
			}else{
				return true;
			}
		}

		function upload(event){
			event.stopPropagation(); 
			event.preventDefault();

			if(validator()){
				var data = new FormData();
				data.append('book_cover', cover);
				data.append("book_name", $('#id_book_name').val().trim());
				data.append("book_author", $('#id_book_author').val().trim());
				data.append("book_isbn", $('#id_book_isbn').val().trim());
				data.append("book_price", $('#id_book_price').val().trim());
				data.append("book_desc", $('#id_book_desc').val().trim());
				data.append("book_rate", $('#id_book_rate').val().trim());
				data.append("book_ownername", $('#id_book_ownername').val().trim());
				data.append("book_owneremail", $('#id_book_owneremail').val().trim());

				$.ajax({
					url: 'api/book',
					type: 'POST',
					data: data,
					cache: false,
					dataType: 'json',
					processData: false,
					contentType: false
				})
				.done(function(result){
					if(result.success == true){
						toastr.success(result.data.name, '添加成功！');
						$('#form_add_book').get(0).reset();
						$('#cover_thumb').prop('title','');
						$('#cover_thumb').prop('src','');

						$('#menu_book_borrow').trigger("click");
					}else{
						toastr.error('添加失败！');
						console.log(result.data);
					}
				})
				.fail(function(error){
					toastr.error('添加失败！');
					console.log(error);
				})
			}
		}

		$('#btn_fastadd').on('click', function(){
			var isbn = $('#fastadd_isbn').val();
			if(isValidISBN(isbn)){
				$.get('/fastadd/' + isbn)
				.done(function(result){
							if(result.success == true){
								toastr.success(result.data.name, '成功入库！');
								$('#fastadd_isbn').val("");						
							}else{
								toastr.error('入库失败！');
								console.log(result.data);
							}
				}).fail(function(error){
					toastr.error('入库失败！');
					console.log(error);
				})
			}else{
				toastr.error("invalid ISBN!");
				return;
			}
		})
	}

});
