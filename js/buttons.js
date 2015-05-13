'use strict';

var connection = meshblu.createConnection({
  uuid: location.hash.substring(2).split('/')[0],
  token: location.hash.substring(2).split('/')[1]
});

connection.on('ready', function(data){
  console.log('ready');
  buttons = {};
  connection.on('message', function(message){
    var href = message.href, topic = message.topic;
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
    buttons[href || topic] = $('#buttons-container').html(template);
    buttons[href || topic].click(function(event){
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
