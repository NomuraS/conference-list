$.ajax({
  url: 'http://user-domain/hoge.php',
  type: 'POST',
  data: {
    id: 1,
    mode: 'hoge'
  },
  dataType: 'html'
}).done(function( data, textStatus, jqXHR ) {
  //成功
}).fail(function( jqXHR, textStatus, errorThrown) {
  //失敗
}).always(function( jqXHR, textStatus) {
  //通信完了
});