$.ajax({
  url: 'http://user-domain/hoge.php',
  type: 'POST',
  data: {
    id: 1,
    mode: 'hoge'
  },
  dataType: 'html'
}).done(function( data, textStatus, jqXHR ) {
  //success
}).fail(function( jqXHR, textStatus, errorThrown) {
  //fail
}).always(function( jqXHR, textStatus) {
  //always
});