(function(){
	"user strict";

	function Frame(position, options){
		this.position = position;
		this.options = options;
		this.init();
		this.setup();
		this.setRotateFlag(true);
	}

	Frame.prototype.init = function(){
		var that = this;
		this.angle = ko.observable(0.0);
		this.css = ko.observable("");
	};

	Frame.prototype.setup = function(){
		this.el = new fabric.Circle({
			left: this.position.x,
			top: this.position.y,
			strokeWidth: 4,
			radius: 8,
			fill: "#fff",
			stroke: this.options.color
		});
		this.el.hasControls = false;
		this.el.hasBorders = false;
	};

	Frame.prototype.link = function(prev, next){
		this.prev = prev;
		this.next = next;
		if(this.next){
			this.line = new fabric.Line([ this.position.x, this.position.y,this.next.position.x, this.next.position.y],{
				strokeWidth: 3,
				fill: this.options.color,
				selectable: false
			});
			this.getLineLength(true);
			app.canvas.add(this.line);
		}
		app.canvas.add(this.el);
	};

	Frame.prototype.remove = function(){
		app.canvas.remove(this.el);
		this.line && app.canvas.remove(this.line);
		this.prev = null;
		this.next = null;
	};

	Frame.prototype.update = function(){
		var position = new fabric.Point(this.el.left, this.el.top);
		this.setPosition(position,true);
		this.getLineLength(true);
		this.prev && this.prev.setLineEndPosition(position);
	};

	Frame.prototype.getLineLength = function(isReCalc){
		var dx, dy;
		if(!this.line){
			return 0;
		}
		if(!this.lineLength || isReCalc ){
			dx = this.line.x2 - this.line.x1;
			dy = this.line.y2 - this.line.y1;
			this.lineLength = Math.sqrt(dx * dx + dy * dy);
		}
		return this.lineLength;
	};

	Frame.prototype.setPosition = function(position,isOnlyLine){
		this.position = position;
		!isOnlyLine && this.el.set({
			left:this.position.x,
			top:this.position.y
		});
		this.line && this.line.set({
			x1:this.position.x,
			y1:this.position.y
		});
	};

	Frame.prototype.setLineEndPosition = function(position){
		this.line && this.line.set({
			x2: position.x,
			y2: position.y
		});
		this.getLineLength(true);
	};

	Frame.prototype.updateChain = function(){
		var point;
		this.position = new fabric.Point(this.el.left,this.el.top);
		this.setPosition(this.position, true);
		if(this.line){
			point = mathPoint.getPointOnLine(this.position, this.next.position ,this.getLineLength());
			this.setLineEndPosition(point);
			this.next.updateChainNext(point);
		}
		this.prev && this.prev.updateChainPrev(this.position);
	};

	Frame.prototype.updateChainNext = function(position){
		var point;
		this.setPosition(position);
		if(this.line){
			point = mathPoint.getPointOnLine(this.position, this.next.position ,this.getLineLength());
			this.setLineEndPosition(point);
			this.next && this.next.updateChainNext(point);
		}
	};

	Frame.prototype.updateChainPrev = function(position){
		var point;
		if(this.line){
			point = mathPoint.getPointOnLine(position, this.position ,this.getLineLength());
			this.setPosition(point);
			this.setLineEndPosition(position);
			this.prev && this.prev.updateChainPrev(point);
		}
	};

	Frame.prototype.setRotateFlag = function(isRotate){
		if(isRotate){
			this.el.set({
				sel
			})
		}
	};

	window.Frame = Frame;
})();