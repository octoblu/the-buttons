'use strict';
var loadButtonsInterval = null;
function loadButtons(meshbluHttp){
  meshbluHttp.whoami(function(error, device){
    if(error) {
      return console.error('whoami error', error)
    }
    $('#page-title').text(device.name);
    $('#buttons-container').html("");
    if (!device.buttons || !device.buttons.length) {
      $('#no-buttons').show();
      device.buttons = []
    } else {
      $('#no-buttons').hide()
    }
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
    $('button').off('click')
    $('button').on('click', function(event){
      event.preventDefault();
      var element = $(this);
      if(element.is('a')){
        window.location= element.attr('href');
      }else{
        var message = JSON.parse(element.attr('data'));
        message.devices = '*';
        meshbluHttp.message(message, function(error) {
          if(error) {
            return console.error('message error', error)
          }
        });
      }
    });
  });
};

function loadButtonsOnInterval(uuid, token) {
  clearInterval(loadButtonsInterval)
  var meshbluHttp = new MeshbluHttp({
    uuid: uuid,
    token: token,
  })
  $('#loading-spinner').hide()
  loadButtons(meshbluHttp)
  loadButtonsInterval = setInterval(function() {
    loadButtons(meshbluHttp)
  }, 1000 * 2)
}

$(function(){
  var lastUuid, lastToken;
  var interval;
  var checkForCreds = function(){
    var hashItems = location.hash.substring(2).split('/')
    var uuid = hashItems[0];
    var token = hashItems[1];
    if(uuid && token && uuid !== lastUuid && token !== lastToken){
      lastUuid = uuid;
      lastToken = token;
      loadButtonsOnInterval(uuid, token);
    }
  };
  interval = setInterval(checkForCreds, 1000);
  checkForCreds();
});
