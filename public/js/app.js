var fluid_1_5 = fluid_1_5 || {};
(function ($, fluid) {
    FC.init = function(){
      var that = this;
      $(".resizable").resizable({
        autoHide: true,
        handles: 'e',
        resize: function(e, ui) 
        {
            var parent = ui.element.parent();
            var remainingSpace = parent.width() - ui.element.outerWidth(),
                divTwo = ui.element.next(),
                divTwoWidth = (remainingSpace - (divTwo.outerWidth() - divTwo.width()))/parent.width()*100+"%";
                divTwo.width(divTwoWidth);
        },
        stop: function(e, ui) 
        {
            var parent = ui.element.parent();
            ui.element.css(
            {
                width: ui.element.width()/parent.width()*100+"%",
            });
        }
      });
      
      $('select').change(function(){
        var optionSelected = $("option:selected", this).val();
        that.changeLayout(optionSelected);
      });

      $('.settings').click(function(){
        $('.settings-panel').slideToggle();
        return false;
      });
      console.log(fluid);

      fluid.webrtc('.module-video', {
        signalingServer: FC.signalingServer(),
        room: 'foo',
        listeners: {
            onConnect: function(room) {
                console.log('Connected to ', room);
            },
            onVideoAdded: function(id) {
                console.log('Video Added ID - ', id);
            },
            onVideoRemoved: function(id) {
                console.log('Video Removed ID - ', id);
            },
            onVideoClick: function(el){
                console.log('Video - ', el);
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
      return (window.location.protocol + '/' + window.location.host +'/');
    }

})(jQuery, fluid_1_5);