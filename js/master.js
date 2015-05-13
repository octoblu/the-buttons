$(document).ready(function(){
  var conn = meshblu.createConnection({});
  conn.on('ready', function(data){
    console.log('Ready', data);
    data.type = 'octoblu:buttons';
    data.discoverWhitelist = [data.uuid];
    conn.update(data);
    var url = 'https://buttons.octoblu.com/buttons.html#!' + data.uuid + '/' + data.token;
    $('.save-url').html('<a href='+url+'>'+url+'</a>');
    conn.on('error', console.log);
  });
})
