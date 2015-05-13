'use strict';
var buttonsStart = function(uuid, token){
  $('#loading-spinner').slideDown();
  var connection = meshblu.createConnection({
    uuid: uuid,
    token: token
  });

  connection.on('ready', function(data){
    console.log('ready');
    connection.whoami({}, function(device){
      $('#loading-spinner').slideUp();
      console.log('whoami', device);
      if(device.error){
        return console.error('error getting device', device.error);
      }
      $('#page-title').text(device.name);
      $('#buttons-container').html("");
      device.buttons.forEach(function(button){
        var template = "";
        if(!button.href && !button.topic){
          return;
        }
        var color = button.color || "teal";
        if(button.href){
          template = $($('#link-template').html());
          template.attr('href', button.href);
        }else{
          template = $($('#button-template').html());
          template.attr('data', JSON.stringify(button));
        }
        template.text(button.name);
        template.addClass(color);
        button.element = $('#buttons-container').append(template);

      });
      $('button').click(function(event){
        event.preventDefault();
        var element = $(this);
        if(element.is('a')){
          window.location= element.attr('href');
        }else{
          var message = JSON.parse(element.attr('data'));
          message.devices = '*';
          connection.message(message);
        }
      });
    });
  });
};

$(function(){
  var lastUuid, lastToken;
  var interval;
  var checkForCreds = function(){
    var uuid = location.hash.substring(2).split('/')[0];
    var token = location.hash.substring(2).split('/')[1];
    if(uuid && token && uuid !== lastUuid && token !== lastToken){
      lastUuid = uuid;
      lastToken = token;
      buttonsStart(uuid, token);
    }
  };
  interval = setInterval(checkForCreds, 1000);
  checkForCreds();
});
