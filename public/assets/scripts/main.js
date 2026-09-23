jQuery(function(e){if(
	e('[data-toggle="tooltip"]').tooltip(),
	/*e(".panel-entry.has-scroll").niceScroll({cursorcolor:"#003d7a",cursorwidth:5,cursoropacitymin:.4,cursorborder:"none",cursorborderradius:4,autohidemode:!0}),*/
	e(".profile-side").niceScroll({cursorcolor:"#003d7a",cursorwidth:5,cursoropacitymin:0,cursorborder:"none",cursorborderradius:4,autohidemode:!0}),
	e("#sideMenu").on("click",function(){
		e(".dashboard").toggleClass("expmenu-on"),
		e("body").toggleClass("ovHide"),
		e(this).toggleClass("sidebar-on"),
		e('[data-toggle="tooltip"]').tooltip("disable")}),
		e(".top-menu-item.has-shortcut, .btn-shortcut-close").on("click",function(){
			e(".right-side").toggleClass("on")}),
			e(".nav-link.dropdown-toggle").on("click",function(o){
				e(".dashboard").toggleClass("has-overlay")}),
				e(".dropdown-menu a.dropdown-toggle").on("click",function(o){
					var t=e(this),l=e(this).offsetParent(".dropdown-menu");
					e(this).next().hasClass("show")||e(this).parents(".dropdown-menu").first().find(".show").removeClass("show");
					var s=e(this).next(".dropdown-menu");
					return s.toggleClass("show"),
					e(this).parent("li").toggleClass("show"),
					e(this).parents("li.nav-item.dropdown.show").on("hidden.bs.dropdown",function(o){
						e(".dropdown-menu .show").removeClass("show")}),l.parent().hasClass("navbar-nav")||t.next().css({top:t[0].offsetTop,left:l.outerWidth()-4}),!1}),
						/*e(".form-control.has-date").datepicker(),
						e(".has-date").datepicker({format:"mm/dd/yyyy",startDate:"-3d",autoclose:!0}),*/
						e(".userFirst").click(function(){e("html, body").animate({scrollTop:e("#firstBox").offset().top},1e3)}),
						e(".userSecond").click(function(){e("html, body").animate({scrollTop:e("#secondBox").offset().top},1e3)}),
						e(".userThird").click(function(){e("html, body").animate({scrollTop:e("#thirdBox").offset().top},1e3)}),
						e(".toggleOption").on("click",function(){e(this).parent(".control-box").toggleClass("controlActive").siblings().removeClass("controlActive")}),
						e("#topDetail").on("hidden.bs.collapse",function(){e(".top-section").removeClass("actived")}),
						e("#topDetail").on("show.bs.collapse",function(){e(".top-section").addClass("actived")}),
						/*e(".top-section").stick_in_parent(),*/
						e(".left-entry").stick_in_parent(),
						e(".side-toggle").on("click",function(){e(this).hide(),e(".full-section").toggleClass("noAside"),e(".toggle-option").show()}),
						e(".toggle-option").on("click",function(){e(this).hide(),e(".side-toggle").show(),e(".full-section").toggleClass("noAside")}),
						e(".btn-card-count").on("click",function(){e(".user-profile").hide(),e(".extra-card").toggleClass("show")}),
						e(".close-card").on("click",function(){e(".extra-card").removeClass("show"),e(".user-profile").show()}),
						/*e(".ct-select").select2({width:"resolve"}),
						e(".ct-normal").select2({width:"resolve",minimumResultsForSearch:1/0}),
						e(".ct-placehold").select2({placeholder:"Select a member",allowClear:!0}),
						e(".ct-gmt").select2({placeholder:"Select timezone",allowClear:!1}),
						e(".status").select2({placeholder:"Select status",allowClear:!1}),*/
						e("#profileSubpanel").on("click",function(o){o.preventDefault(),e(this).tab("show")}),
						e(".form-control").on("focus","input[readonly]",function(){this.blur()}),
						/*e(".ct-select").select2({width:"resolve"}),
						e(".ct-normal").select2({width:"resolve",minimumResultsForSearch:1/0}),
						e(".ct-country").select2({placeholder:"Choose country",allowClear:!1,width:"resolve"}),
						e(".ct-state").select2({placeholder:"Choose state or province",allowClear:!1,width:"resolve"}),
						e(".ct-city").select2({placeholder:"Choose city",allowClear:!1,width:"resolve"}),
						e(".ct-phone").select2({placeholder:"Choose phone country code",allowClear:!1,width:"resolve"}),
						e(".ct-tier").select2({placeholder:"Select member type",allowClear:!1,width:"resolve"}),
						e(".ct-awards").select2({placeholder:"Select award type",allowClear:!1,width:"100%"}),
						e(".ct-filter").select2({width:"15%"}),
						e(".ct-member").select2({placeholder:"Select member type",allowClear:!1}),
						e(".ct-full").select2({width:"100%"}),*/
						e(".go-postbox").on("click",function(){e(".message-wrap").toggleClass("hidden"),e(".message-detail").toggleClass("show")}),
						e(".back-postbox").on("click",function(){e(".message-wrap").removeClass("hidden"),e(".message-detail").removeClass("show")}),
						e(".btn-cobrand").on("click",function(){e(this).hide(),e(".cobrand-entry").toggleClass("hidden"),e(".enroll-cobrand").toggleClass("start")}),
						e(".cancel-enrol").on("click",function(){e(".btn-cobrand").show(),e(".cobrand-entry").removeClass("hidden"),e(".enroll-cobrand").removeClass("start")}),
						e(".order-mailing").on("click",function(){e(".order-content").toggleClass("hidden"),e(".order-detail").toggleClass("active")}),
						e(".cancel-order").on("click",function(){e(".order-content").removeClass("hidden"),e(".order-detail").removeClass("active")}),
						e("#top-circle").length){var o=650,t=function(){var t=e(window).scrollTop();t>o?e("#top-circle").addClass("on"):e("#top-circle").removeClass("on")};t(),e(window).on("scroll",function(){t()}),e("#top-circle").on("click",function(o){o.preventDefault(),e("html,body").animate({scrollTop:0},700)})}e("a[class^=show_]").click(function(o){e(".extra_"+e(this).attr("class").substr(5)).slideToggle("slow"),o.preventDefault()}),
						e(".exp-table").on("click",function(){e(".exp-panel").toggleClass("on-sidebar")}),
						/*e(".ct-select").select2({dropdownParent:e("#manageState")}),*/
						e(".btn-expand").on("click",function(){e(".expanded-section").toggleClass("in")})
						/*e("select:not(:hidden)").select2(),
						e('a[data-toggle="tab"]').on("shown.bs.tab",function(o){
							e(".ct-country").select2({placeholder:"Choose country",allowClear:!1,width:"resolve"}),
							e(".ct-state").select2({placeholder:"Choose state or province",allowClear:!1,width:"resolve"}),
							e(".ct-city").select2({placeholder:"Choose city",allowClear:!1,width:"resolve"}),
							e(".ct-phone").select2({placeholder:"Choose phone country code",allowClear:!1,width:"resolve"}),
							e(".ct-tier").select2({placeholder:"Select member type",allowClear:!1,width:"resolve"}),
							e(".ct-awards").select2({placeholder:"Select award type",allowClear:!1,width:"100%"}),
							e(".ct-filter").select2({width:"15%"}),
							e(".ct-member").select2({placeholder:"Select member type",allowClear:!1}),
							e(".ct-full").select2({width:"100%"}),
							e("select:not(.select2-hidden-accessible,:hidden)").select2()
						}),*/
						// e(".forgot-password").on("click",function(){e(".next-password").toggleClass("active"),e(".user-login").toggleClass("next")})
});
//# sourceMappingURL=main.js.map
