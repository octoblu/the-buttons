'use strict';
var buttonsStart = function(uuid, token){
  var connection = meshblu.createConnection({
    uuid: uuid,
    token: token
  });

  connection.on('ready', function(data){
    console.log('ready');
    connection.whoami({}, function(device){
      console.log('whoami', whoami);
      if(device.error){
        return console.error('errro getting device', device.error);
      }
      var name = device.name;

      device.buttons.forEach(function(button){
        var href = button.href, topic = button.topic;
        if(!href || !topic){
          return;
        }
        if(href){
          template = $('#link-template').html();
          template.attr('href', href);
        }else{
          template = $('#button-template').html();
          template.attr('topic', topic);
        }
        button.element = $('#buttons-container').html(template);
        button.element.click(function(event){
          event.preventDefault();
          var element = $(this);
          if(element.is('a')){
            window.location= element.attr('href');
          }else{
            connection.message({
              devices: '*',
              topic: element.attr('topic')
            })
          }
        });
      });

    });
  });
};

$(function(){
  var interval;
  var checkForCreds = function(){
    var uuid = location.hash.substring(2).split('/')[0];
    var token = location.hash.substring(2).split('/')[1];
    if(uuid && token){
      clearInterval(interval);
      buttonsStart(uuid, token);
    }
  };
  interval = setInterval(checkForCreds, 1000);
  checkForCreds();
});
