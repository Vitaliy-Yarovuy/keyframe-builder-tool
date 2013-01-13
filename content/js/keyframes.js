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
		this.offset = {
			x : ko.observable(0),
			y : ko.observable(0)
		};
		this.startAngle = ko.observable(0.0);
		this.color = ko.observable(utils.generateColor());
		this.isInherited = ko.observable(false);
		this.isText = ko.observable(true);
		this.isRotate = ko.observable(false);
		this.angleK = ko.observable(0.0);
		this.isChain = ko.observable(false);

		this.frames = [];
		this.lines = [];

		this.step.subscribe(_.debounce(function(){
			that.fillFrames();
		},400));
		this.isChain.subscribe(function(value){
			that.frames.forEach(function(frame){
				frame.setFixedChain(value);
			});
		});
		this.isRotate.subscribe(function(value){
			that.frames.forEach(function(frame){
				frame.setRotateFlag(value);
			});
		});
	};


	KeyFrames.prototype.setPoints = function(points){
		this.originPoints = points;
		this.fillFrames();
	};

	KeyFrames.prototype.clearFrames = function(){
		this.frames.forEach(function(frame){
			frame.remove();
		});
		this.frames = [];
	};

	KeyFrames.prototype.fillFrames = function(){
		var points,i;
		this.clearFrames();
		points = mathPoint.approximateLineByPercent(this.originPoints,this.step()/100);
		this.frames = points.map(function(point){
			return new Frame(point,{
				color: this.color()
			});
		},this);
		for(i = 0; i < this.frames.length; i++){
			this.frames[i].link(this.frames[i - 1],this.frames[i + 1]);
		}
		app.canvas.renderAll();
	};








		window.KeyFrames = KeyFrames;
})();