var fluid_1_5 = fluid_1_5 || {};
(function ($, fluid) {
    if(typeof localStorage['userdata'] !== 'undefined' && localStorage['userdata'] !== null){
      try{
        FC.settings = JSON.parse(localStorage['userdata']);
      }catch(e){
        console.error(e);
      }
    }else{
        FC.settings = {};
    }
    
$('select').on('change', function(){
      var optionSelected = $("option:selected", this).val();
      FC.changeLayout(optionSelected);
    });

    $('.settings').on('click', function(){
      $('.settings-panel').slideToggle();
      return false;
    });

    FC.init = function(){
      /* Redirect Condition */
      if(typeof FC.settings.name === 'undefined' || typeof FC.settings.email === 'undefined'){
        console.log('You should be redirected!');
        window.open('/#' + window.location.pathname.substring(1), "_self");
      }else{
        FC.initRTC();
      }
    };
    FC.initRTC = function(){
      fluid.webrtc('.module-video', {
        signalingServer: FC.signalingServer(),
        room: FC.room,
        listeners: {
            onConnect: function(room) {
                $('.video-focus .focus-container').empty().append($('.video-tiles video').first().clone());
            },
            onVideoAdded: function(id) {
                console.log('Video Added ID - ', id);
            },
            onVideoRemoved: function(id) {
                console.log('Video Removed ID - ', id);
            },
            onVideoClick: function(el){
                $('.video-focus .focus-container').empty().append($(el).clone());
            }
        },
        resources: {
            template: {
                forceCache: true,
                url: "/js/fluid-webrtc/html/video-controls.html"
            }
        }
      });
    };

    FC.setWidth = function($el, width){
      if(width === '0%'){
        $el.hide();
      }else{
        $el.show();
      }
      $el.css('width', width);
    };
    
    FC.changeLayout = function(widths){
      var $mchat = $('.module-chat'),
          $mnotes = $('.module-notes'),
          $mvideo = $('.module-video');

      
      var mwidths = widths.split(',');
      // console.log(mwidths);
      FC.setWidth($mchat, mwidths[0]*100 + '%');
      FC.setWidth($mvideo, mwidths[1]*100 + '%');
      FC.setWidth($mnotes, mwidths[2]*100 + '%');
    };


    FC.signalingServer = function(){
      return (window.location.protocol + '//' + window.location.host +'/');
    };

    FC.saveDetails = function(name, email, room){
      FC.settings['name'] = name;
      FC.settings['email'] = email;
      FC.settings['room'] = room;

      this.updateDetails();
    };

    FC.updateDetails = function(){
      localStorage['userdata'] = JSON.stringify(this.settings);
    };

    var socket = io.connect(FC.signalingServer());

    // on connection to server, ask for user's name with an anonymous callback
    socket.on('connect', function(){
      // call the server-side function 'adduser' and send one parameter (value of prompt)
      socket.emit('adduser', FC.settings);
    });

    // listener, whenever the server emits 'updatechat', this updates the chat body
    socket.on('updatechat', function (user, message) {
      if(typeof user === 'object'){
        $('.list-view').append('<li><b>'+ user.name + ':</b> ' + message + '</li>');
      }else{
        $('.list-view').append('<li class="info">' + message + '</li>');
      }
    });

    // socket.on('updateusers', function(data) {
    //   $('#users').empty();
    //   $.each(data, function(key, value) {
    //     $('#users').append('<div>' + key + '</div>');
    //   });
    // });

   // when the client hits ENTER on their keyboard
    $('#chat_msg').keypress(function(e) {
      if(e.which == 13) {
        var message = $(this).val();
        $(this).val('');
        if(message.length){
          socket.emit('sendchat', message);
        }
        return false;
      }
    });

})(jQuery, fluid_1_5);