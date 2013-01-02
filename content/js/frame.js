(function(){
	"user strict";

	function Frame(el){
		this.el = el;
		this.init();
	}

	Frame.prototype.init = function(){
		var that = this;

		this.position = new Point(0,0);
		this.angle = ko.observable(0.0);
		this.css = ko.observable("");

	}

	window.Frame = Frame;
})();