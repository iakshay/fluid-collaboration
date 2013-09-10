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

})(jQuery, fluid);