(function(){
	"user strict";

	function KeyFrames(el){
		this.el = el;
		this.init();
	}

	KeyFrames.prototype.init = function(){
		var that = this;

		this.name = ko.observable(utils.generateName("animation"));
		this.step = ko.observable(10);
		this.offset = new Point(0,0);
		this.startAngle = ko.observable(0.0);
		this.color = ko.observable(utils.generateColor());
		this.isInherited = ko.observable(false);
		this.isText = ko.observable(true);
		this.isRotate = ko.observable(true);
		this.angleK = ko.observable(0.0);


		this.frames = ko.observableArray([]);


	}

	window.KeyFrames = KeyFrames;
})();