/*!

 * Zalki Hover Img
 * Author: Zalki-Lab
 * Version: 0.2


 */

;(function($, window, document) {

    $.fn.ZalkiHoverspan = function(options) {

        var setting = $.extend({ // this settings for our plugin

                parentDivSize : true, // on or off auto-size parent div(true or false)

            

                // TWO HORIZONTAL SETTING

                // left element

                socialpopLeftHorizontalSpeedIn: 700,
                socialpopLeftHorizontalSpeedOut: 300,
                socialpopLeftEasing: 'linear',

                // right element

                socialpopRightHorizontalSpeedIn: 700,
                socialpopRightHorizontalSpeedOut: 300,
                socialpopRightEasing: 'linear',

              


        }, options); //extend end



$('.hoversocials').css('opacity', 1);  
  
// when hover over the selected image change the opacity to 1  
$('.djhover').hover(  
   function(){  
      jQuery(this).find('.hoversocials').stop().fadeTo('slow', 0.1);  
   },  
   function(){  
      $(this).find('.hoversocials').stop().fadeTo('slow', 1);  
   });  



return this.each(function() { // return this each start

        var himself = $(this),
            socialpop = $('.socialpop'),
            socialpop2 = $('.socialpop2'),

            overlayPop = $("<div class='overlayPop'></div>"),
            overlayText = $("<div class='overlayText'></div>"),
            overlayRubTop = $("<div class='overlayRubTop'></div>"),
            overlayRubBottom = $("<div class='overlayRubBottom'></div>"),

            textBox = $('.textBox'),
            textTitle = $('.textTitle');

            if(setting.parentDivSize == true){

            var thisHeight =  himself.children('.hoversocials').height(),
                thisWidth =  himself.children('.hoversocials').width();

            } else {

            var thisHeight =  himself.height(),
                thisWidth =  himself.width();

            };

            var socialpopHeight = himself.find(socialpop).height(),
                socialpopWidth = himself.find(socialpop).width(),
                socialpop2Height = himself.find(socialpop2).height(),
                socialpop2Width = himself.find(socialpop2).width(),

                textBoxHeight = himself.children(textBox).outerHeight(true),
                textBoxWidth = himself.children(textBox).outerWidth(true),
                textTitleHeight = himself.children(textTitle).outerHeight(true),
                textTitleWidth = himself.children(textTitle).outerWidth(true),


                calPopupLeft = thisWidth / 2 - socialpopWidth / 2,
                calPopupTop = thisHeight / 2 - socialpopHeight / 2,
                calPopupTop2 = thisHeight / 2 - socialpop2Height / 2,

                calPopup2Left = thisWidth / 2 - socialpop2Width / 2 + socialpopWidth / 2 + 10, 
                calPopup2Right = thisWidth / 2 - socialpop2Width / 2 - socialpopWidth / 2 - 10,  
                calPopupLeft2 = thisWidth / 2 - socialpopWidth / 2 - socialpop2Width / 2 - 10;  
     

            var coordinateOneDown = {top : calPopupTop},
                coordinateTwoDown = {top : calPopupTop2},
                coordinateOneLeft = {left: calPopupLeft},
                coordinateOneLeftBack = {left: - socialpopWidth * 2},

                coordinateOneTwoLeft = {left: calPopupLeft2},
                coordinateOneTwoRight = {right: calPopup2Right},
                coordinateOneTwoLeftBack = {left: - socialpopWidth * 2},
                coordinateOneTwoRightBack = {right: - socialpop2Width * 2},

                coordinateTwoUp = {top : - socialpop2Height * 2},
                coordinateOneUp = {top : - socialpopHeight * 2},
                coordinateOneBottom = {top : thisHeight * 2},

                coordinateTitleVertical = {top: 0},
                coordinateBoxVertical = {bottom: 0},
                coordinateTitleVerticalBck = {top: - textTitleHeight * 2},
                coordinateBoxVerticalBck = {bottom: - textBoxHeight * 2},
                coordinateTitleHorizontal = {left: 0},
                coordinateBoxHorizontal = {right: 0},
                coordinateTitleHorizontalBck = {left: - textTitleWidth * 2},
                coordinateBoxHorizontalBck = {right: - textBoxWidth * 2};




    himself.css({'width': thisWidth, 'height': thisHeight});

    if(himself.attr('data-hipop') == 'two-horizontal'){
    
    himself.prepend(overlayPop);

    
    };

    himself.find(overlayPop).css({'width': thisWidth, 'height': thisHeight});
    himself.find(overlayText).css({'width': thisWidth, 'height': thisHeight});
    himself.find(overlayRubTop).css({'width': thisWidth, 'height': 0});
    himself.find(overlayRubBottom).css({'width': thisWidth, 'height': 0});



  


    function twoPopup(el1, calPopup, calPopup2, speed, speed2, easing, easing2){

        el1.find(socialpop).stop(true,true).animate(calPopup, speed, easing);
        el1.find(socialpop2).stop(true,true).animate(calPopup2, speed2, easing2);

    };

 


  

   if(himself.attr('data-hipop') == 'two-horizontal'){

         himself.find(socialpop).css({'top': calPopupTop, 'left': - socialpopWidth * 2, 'display': 'block'});
         himself.find(socialpop2).css({'top': calPopupTop2, 'right': - socialpop2Width * 2, 'display': 'block'});

   


    };


    himself.on({ // on event maps open

            mouseenter: function (){

               if(himself.attr('data-hipop') == 'two-horizontal'){

                    twoPopup(himself, coordinateOneTwoLeft, coordinateOneTwoRight, setting.socialpopLeftHorizontalSpeedIn, setting.socialpopRightHorizontalSpeedIn, setting.socialpopLeftEasing, setting.socialpopRightEasing);

                

                };


                // OVERLAY IF ELSE

    

               

                
               
                }, // mouseenter close

            mouseleave: function() {

               if (himself.attr('data-hipop') == 'two-horizontal'){

                    twoPopup(himself, coordinateOneTwoLeftBack, coordinateOneTwoRightBack, setting.socialpopLeftHorizontalSpeedOut, setting.socialpopRightHorizontalSpeedOut, setting.socialpopLeftEasing, setting.socialpopRightEasing);


                };
 

             

                } // mouseleave close

    }); // on event maps close






}); // return this each end

};// function end

}) (jQuery, window, document);


jQuery(window).load(function(){

jQuery('.djhover').ZalkiHoverspan(


);

});


 