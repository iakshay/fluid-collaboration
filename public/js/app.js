(function ($, fluid) {
    FC.init = function(){   
      var containerHeight = $('.module-container').innerHeight();
      $('.full-height').innerHeight(containerHeight);
      $('.half-height').innerHeight(containerHeight*0.5);
      /*fluid.reorderLayout(".container", {
        selectors: {
          columns: ".column",
          modules: ".module",
          grabHandle: ".title-bar",
        },
        styles: {
          defaultStyle: "demo-layoutReorderer-movable-default",
          selected: "module-selected",
          dragging: "demo-layoutReorderer-movable-dragging",
          mouseDrag: "demo-layoutReorderer-movable-mousedrag",
          dropMarker: "dropMarker",
          avatar: "avatar"
        },
        disableWrap: true
      });
      
      $('.container').delegate('.module-selected', 'keypress', function(e){
        if(e.which == 120){
          $(this).find('.module-inner').slideToggle(300);
          $(this).find('.toggle-collapse').text('+');
        }
      })

      */
    };
})(jQuery, fluid);