(function() {
	$('#method-return-types').on('click', 'li a', function(){
		console.log('Clicked!');
      $('#method-return-types button').html($(this).text() + ' <span class="caret"></span>');
      $('#method-return-types button').val($(this).text());
   });
})();
