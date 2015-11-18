$(document).ready(function(){
	$.get('/list')
	.done(function(data){
		handleBook(data);
	}).fail(function(error){
		console.log("error happened");
	});

	function handleBook(data){
		// var template = $('#bookTmpl').html();
		var template = $('#bookCover').html();
		var compiled = _.template(template);
		var html = compiled({"books" : data});

		$('.container').html(html);
		hookEvent();
	};

	function hookEvent(){
		
		$('.btn-like').on('click', function(e){
			var bookId = $(this).attr('data-bookid');
			var url;
			//click btn-liked means unlike a book
			if($(this).hasClass('btn-liked') == true){
				$(this).removeClass('btn-liked').addClass('btn-unliked');
				url = '/unlike/'+bookId;
			}else if($(this).hasClass('btn-unliked') == true){
				$(this).removeClass('btn-unliked').addClass('btn-liked');
				url = '/like/'+bookId;
			};

				$.get(url)
				.done(function(book){
					$('#'+bookId+'-likes').text(book.likesCount);
					
				}).fail(function(error){
					console.log(error);
				});

		});


		//like section toggle
		$('.book-title').on('click', function(e){
			var $detail = $(this).next('.book-detail');
			$(this).next('.book-like-detail').toggle(400);
		});

		//detail view
		//cache the content when mouseover the cover by insert it to DOM

		$('.cover').on('mouseenter', function(e){
			var bookId = $(this).attr('data-bookid');
			if($('#book-detail-'+bookId).get(0)){
				return;
			}else{
				$.get('/detail/'+bookId)
					.done(function(book){
						//display book detail in lightbox
						var template = $('#bookInfo').html();
						var compiled = _.template(template);
						var html = compiled({"book" : book});
						$('body').append(html);
					}).fail(function(error){
						console.log("error happened");
					});				
			}
		})
		$('.cover').on('click', function(e){
			var bookId = $(this).attr('data-bookid');
			$('#book-detail-'+bookId).lightbox_me({
						centered: true
					}); 
		});
	}
});

