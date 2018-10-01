jQuery(document).ready(function(){ 
jQuery('.contact-imprint-footer, .social-icons-footer').delay( 200 ).fadeIn(300, function(){
        jQuery('.contact-imprint-footer').animate({"left" : "30px",}, 600);
		jQuery('.social-icons-footer').animate({"right" : "30px",}, 600);
		jQuery('.menu-primary-menu-container').animate({"top" : "0px",}, 600);
    });
	
});
