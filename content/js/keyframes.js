(function(){
	"user strict";


	function KeyFrames(el){
		this.el = el;
		this.init();
		this.setup();
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
		this.isRotate = ko.observable(true);
		this.angleK = ko.observable(0.0);
		this.isChain = ko.observable(false);

		this.frames = [];
		this.lines = [];
		this.frameEls = [];

		this.step.subscribe(_.debounce(function(){
			that.fillFrames();
		},400));
	};

	KeyFrames.prototype.setup = function(){
		app.canvas.on('object:moving',this.move.bind(this));
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
		this.frameEls = this.frames.map(function(frame){
			return frame.el;
		});
	};


	KeyFrames.prototype.move = function(e){
		var frame,
			index = this.frameEls.indexOf(e.target);
		if(index !== -1){
			frame = this.frames[index];
			frame[this.isChain()?"updateChain":"update"]();
			app.canvas.renderAll();
		}
	};







		window.KeyFrames = KeyFrames;
})();