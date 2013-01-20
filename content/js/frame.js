(function(){
	"user strict";

	function Frame(position, options){
		var key;
		this.options = {
			onMove:function(){}
		};
		if(options){
			for(key in options){
				if(options.hasOwnProperty(key)){
					this.options[key] = options[key];
				}
			}
		}
		this.options = options;
		this.onMove = this.options.onMove;
		this.init(position);
//		this.setRotateFlag(true);
	}

	Frame.prototype.init = function(position){
		var that = this;
		this.framePoint = new FramePoint({
			left: position.x,
			top: position.y,
			strokeWidth: 4,
			fill: "#fff",
			stroke: this.options.color,
			onMove: this.onMove
		});

//		this.angle = ko.observable(0.0);
		this.css = ko.observable("");
	};


	Frame.prototype.link = function(prev, next){
		this.prev = prev;
		this.next = next;
		this.framePoint.link(prev && prev.framePoint, next && next.framePoint);
	};

	Frame.prototype.remove = function(){
		this.link(null, null);
		this.framePoint.remove();
	};

	Frame.prototype.setFixedChain = function(value){
		this.framePoint.setFixedChain(value);
	};

	Frame.prototype.setRotateFlag = function(value){
		this.framePoint.setRotateFlag(value);
	};

	Frame.prototype.setSelectFlag = function(value){
		this.framePoint.setSelectFlag(value);
	};

	Frame.prototype.getPosition = function(){
		return this.framePoint.getPosition();
	};

	Frame.prototype.setAngle = function(value){
		this.framePoint.setAngle(value);
	};

	Frame.prototype.getAngle = function(){
		return this.framePoint.getAngle();
	};

	window.Frame = Frame;
})();