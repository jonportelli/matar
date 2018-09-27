

/**********************************************************************************
 ***************************** frontimage /mediagallerie ***************************************
 **********************************************************************************/
 
function FrontImage(options) {
	this.container = undefined;
	this.images = [];
	this.view_port1 = undefined;
	this.view_port2 = undefined;
	this.slides = undefined;
	this.image1 = undefined;
	this.image2 = undefined;
	this.active_slide = 0;
	this.options = undefined;
	this.onResize = undefined;
	this.proxiedOnResize = undefined;
	this.text_view_delay =  undefined;
	this.text_fadein_speed = undefined;
	this.image_fadein_speed = undefined;
	this.variable_height = undefined;
	
	this.init(options);
}

FrontImage.prototype = {
	
	init: function (options) {
		this.options = options;
		this.container = options.container;
		this.onResize = options.onResize || $.noop; 
		this.text_view_delay = options.text_view_delay || 400; 
		this.text_fadein_speed = options.text_fadein_speed || "normal"; 
		this.image_fadein_speed = options.image_fadein_speed || "normal"; 
		this.variable_height = false || options.variable_height;
		
		
		this.view_port1 = $("<div class='viewport loading'>").prependTo(this.container);
		this.view_port2 = $("<div class='viewport'>").prependTo(this.container).hide();
		$("<div>").appendTo($("<div class='text'>").appendTo(this.view_port1)).hide().append($("<div>"));
		$("<div>").appendTo($("<div class='text'>").appendTo(this.view_port2)).hide().append($("<div>"));
		
		this.proxiedOnResize = $.proxy(this.onResize, this); 	

		$(window).resize(this.proxiedOnResize).resize();

		var max_img_height = 0;
		
		this.slides = $(">ul.bg-image>li", this.container);
		// preload the first slide
		this.slides.each($.proxy(function (i, slide) {
			var img = $("<img>"); 
			img.bind("load error", $.proxy(function (event) {
				this.images[i] = img;
				var width = img.prop("width"), height = img.prop("height");
				var ratio = width ? (height / width) : 0;
				var data_div;
				var p = $(">p", slide);
				img.data({
					w: width,
					h: height,
					r: ratio,
					is_dark_text: p.hasClass("dark"),
					html: p.html(),
				});
				
				// adjust container height
				if (this.variable_height) {
					img.css("margin-top", - height / 2 + "px"); // image vertical mid-alignment
					if (height > max_img_height) {
						max_img_height = height;
						this.container.stop().animate({height: height + "px"}, "fast");
					}
				}
				if (i == 0) {
					// show the first slide
					this.image1 = img;
					this.view_port1.prepend(img).removeClass("loading");
					if (img.data("is_dark_text")) {
						this.view_port1.addClass("dark");
					} else {
						this.view_port1.removeClass("dark");
					}
					data_div = $(">.text>div", this.view_port1).delay(this.text_view_delay).fadeIn(this.text_fadein_speed).find(">div").html(img.data("html"));
					
					this.onResize("noreset");
					img.hide().fadeIn(options.image_fadein_speed);
					options.onReady && options.onReady();
				} else {
					// check which view port is waiting for the uploaded image
					var vp;
					if (this.view_port1.data("wait_for_image_id") === i) {
						vp = this.view_port1;
					} else if (this.view_port2.data("wait_for_image_id") === i) {
						vp = this.view_port2;
					}
					if (vp) {
						vp.prepend(img).removeClass("loading");
						if (img.data("is_dark_text")) {
							vp.addClass("dark");
						} else {
							vp.removeClass("dark");
						}
						data_div = $(">.text>div", vp).fadeIn(this.text_fadein_speed).find(">div").html(img.data("html"));
					
						this.onResize("noreset");
						img.hide().fadeIn(options.image_fadein_speed);
					}
				}
			}, this)).attr("src", $(">img", slide).attr("src"));
		}, this));
		
		// no slides - run the ready handler
		if (!this.slides.length) {
			options.onReady && options.onReady();
		}
	},
	
	
	destroy: function () {
		this.container.unbind("mousemove mouseleave");
		this.container = undefined;
		this.slides = undefined;
		this.images = [];
		this.view_port1.remove();
		this.view_port2.remove();
		this.view_port1 = undefined;
		this.view_port2 = undefined;
		this.image1 = undefined;
		this.image2 = undefined;
	
	
		this.active_slide = 0;
		this.options = undefined;
		$(window).unbind("resize", this.proxiedOnResize);		
		this.onResize = undefined;
		this.proxiedOnResize = undefined;
		this.text_view_delay =  undefined;
		this.text_fadein_speed = undefined;
		this.image_fadein_speed = undefined;
		this.variable_height = undefined;
	},
	
};

/**********************************************************************************
 ******************************* Hyte ****************************************
 **********************************************************************************/
var Hyte = {

	leave_url: undefined,

	tools: {
		makeRandomArray: function(count) {
			var result = new Array();
			var picked = {};
			for (var i = 0; i < count; i++) {
				var number;
				do {
					number = Math.round(Math.random() * (count - 1));
				} while (picked[number]);
				picked[number] = 1;
				result.push(number);
			}
			return result;
		},
				
		preloadImages: function(images, callback, pointer) {
			if (pointer === undefined) pointer = 0;
			if (images.length > pointer) {
				$('<img />').load(function() {
					Hyte.tools.preloadImages(images, callback, pointer + 1);
				}).attr('src', images[pointer]);
			} else {
				callback();
			}
		},
		
		preloadImagesList: function(list, itemCallback) {
			$('>li.loading', list).each(function (i, item) {
				$("<img>").load(function () {
					$(item).removeClass("loading");
					if (itemCallback) itemCallback(item);
				}).attr("src", $("img", item).attr("src"));
			});
		},
		
		parseQueryParameters: function (serialized_params) {
			var result = {};
			$.each(("" + serialized_params).split("&"), function (i, item) {
				var parts = item.split("=");
				if (parts.length < 2) parts[1] = "";
				result[decodeURI(parts[0])] = decodeURI(parts[1]);
			});
			return result;
		},		
		
	},	

	
	init: function () {
	
		var module = $('#container>div:eq(0)');
		switch (module.attr("id")) {
			case "frontpage":
				this.Frontpage.init(module);
				break;
			
			default:
				break;
		}
		
	},
		
	
};




Hyte.Frontpage = {
	container: undefined,
	the_box: undefined,
	leave_url: undefined,
	
	init: function (container) {
		this.container = container;
		this.the_box = new FrontImage({
			container: this.container,
			onReady: $.proxy(function () {
				this.showMenu();
			}, this),
			onResize: this.onWindowResize,
			text_view_delay: 2000, 
			text_fadein_speed: 1000, 
			image_fadein_speed: 3000 
		});
		
		
		
		// make all links that leave the page expand the menu before leaving
		$('a').live('click', $.proxy(this.onLeavePage, this));
	},
	
	
	showMenu: function () {
		$('#menu').delay(1000).slideDown(1000, $.proxy(function () { $('#pocp1').pullOutContentPanel({
                pocp_scrollbars : true,
                pocp_showonload: false,
                pocp_pg_overlay: false,
                pocp_clickout: true
            });}, this));

	},
	
	
	/**
	 * resizes the slides and images in them
	 * 
	 */
	onWindowResize: function (event) {
		var win_h = $(window).height();
		var win_w = $(window).width();
	
		if (event !== 'noreset') {
			// interrupt any active animation
			this.view_port1.stop(true, true);
			this.view_port2.stop(true, true);
		}
		
		// resize viewports
		this.view_port1.width(win_w).height(win_h);
		this.view_port2.width(win_w).height(win_h);
		
		if (!this.image1 && !this.image2) return;
		
		// resize images to cover the viewports
		var win_ratio = win_h / win_w;
		var img_ratio;
		var w, h;
		
		var images = [this.image1, this.image2];
		for (var i in images) {
			var image = images[i];
			if (image) {
				img_w = image.data("w");
				img_h = image.data("h");
				img_ratio = image.data("r");
				if (img_ratio) { // !0 if loaded ok
					if (img_ratio > win_ratio) { // image should be cropped on top and bottom
						w = win_w;
						h = w * img_ratio;
					} else { // image should be cropped on left and right
						h = win_h;
						w = h / img_ratio;
					}
					image.width(w + "px").height(h + "px").css("left", ((win_w - w) / 2) + "px");
				}
			}
		}
	},
	
	onLeavePage: function (event) {
		var a = $(event.currentTarget);
		if (a.hasClass("nolive")) return;
		var url = a.attr("href");

		if (url.substr(0, 1) == "#") return; // helper links
		if (url.substr(0, 7) == "mailto:") return; // mail links
		if (a.attr("target") == "_blank") return; // new page links
	
		event.preventDefault();
		
		// if the menu is already rolling up we'll just change the url we'll go 
		if (this.leave_url) {
			this.leave_url = url;
			return;
		} else {
			this.leave_url = url;
		}
		

		$('#menu').animate({'height': $(window).height() + "px"}, "slow", $.proxy(function (event) {
			// switch the positioning to fix the menu to the top of the window 
			$('#menu').css({top: -125, height: "auto"});
			// fade the top transparent line into white
			$('#menu, #toprow').fadeOut("slow", $.proxy(function (event) {
				// navigate away
				document.location.href = this.leave_url;
			}, this));
		}, this));
	}
};


$(function () {
	Hyte.init();
});
