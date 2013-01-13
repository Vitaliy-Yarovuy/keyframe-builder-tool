(function(){
	"user strict";

	function Frame(position, options){
		this.options = options;
		this.init(position);
		this.setRotateFlag(true);
	}

	Frame.prototype.init = function(position){
		var that = this;
		this.framePoint = new FramePoint({
			left: position.x,
			top: position.y,
			strokeWidth: 4,
			fill: "#fff",
			stroke: this.options.color
		});
		app.canvas.add(this.framePoint);

		this.angle = ko.observable(0.0);
		this.css = ko.observable("");
	};


	Frame.prototype.link = function(prev, next){
		this.prev = prev;
		this.next = next;

		this.framePoint.link(prev && prev.framePoint, next && next.framePoint);
	};

	Frame.prototype.remove = function(){
		this.link(null, null);
		app.canvas.remove(this.framePoint);
	};

	Frame.prototype.setFixedChain = function(value){
		this.framePoint.setFixedChain(value);
	};

	Frame.prototype.setRotateFlag = function(value){
		this.framePoint.setRotateFlag(value);
	};

	window.Frame = Frame;
})();