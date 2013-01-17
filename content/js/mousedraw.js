(function(){

	function MouseDraw(el,options){
		this.el = el;
		this.options = options;
		this.options = {
			getColor:function(){ return "red";},
			strokeWidth: 3
		};
		if(options){
			for(key in options){
				if(options.hasOwnProperty(key)){
					this.options[key] = options[key];
				}
			}
		}
		this.onDraw = _.debounce(this.options.onDraw||function(){},1000);
		this.init();
	}

	MouseDraw.prototype.init = function(){
		this._down = this.down.bind(this);
		this._move = this.move.bind(this);
		this._up = this.up.bind(this);
		this.createCanvas();
		this.setup();
	};

	MouseDraw.prototype.createCanvas = function(){
		var canvas = document.createElement("canvas");
		this.el.appendChild(canvas);
		this.canvas = new fabric.Canvas(canvas,{
			selection: false,
			HOVER_CURSOR: 'pointer'
		});
	};

	MouseDraw.prototype.getSize = function(){
		return {
			width: parseInt(this.el.style.width),
			height: parseInt(this.el.style.height)
		};
	};

	MouseDraw.prototype.setup = function(){
		var size = this.getSize();
		this.canvas.setWidth(size.width).setHeight(size.height);
		this.canvas.renderAll();
	};


	MouseDraw.prototype.start = function(options){
		var key;
		if(!this.isStart){
			this.canvas.on("mouse:down",this._down);
			this.canvas.on("mouse:move",this._move);
			this.canvas.on("mouse:up",this._up);
			this.isStart = true;
			this.points = [];
			this.lines = [];
		}
	};

	MouseDraw.prototype.stop = function(){
		if(this.isStart){
			this.canvas.off("mouse:down",this._down);
			this.canvas.off("mouse:move",this._move);
			this.canvas.off("mouse:up",this._up);
			this.isStart = false;
		}
	};

	MouseDraw.prototype.addPoint = function(point){
		var start,line;
		if(this.points.length){
			start = this.points[this.points.length-1];
			line = new fabric.Line([start.x,start.y,point.x,point.y],this.lineOptions);
			this.lines.push(line);
			this.canvas.add(line);
		}
		this.points.push(point);
	};

	MouseDraw.prototype.updateLineOptions = function(point){
		this.lineOptions = {
			strokeWidth: this.options.strokeWidth,
			fill: this.options.getColor()
		};
	};

	MouseDraw.prototype.down = function(options){
		this.isDrawing = true;
		this.clear();
		this.points = [new fabric.Point(options.e.offsetX,options.e.offsetY)];
		this.canvas.renderAll();
		this.updateLineOptions();
	};

	MouseDraw.prototype.clear = function(){
		this.lines.forEach(function(line){
			this.canvas.remove(line);
		},this);
		delete this.lines;
		this.lines = [];
		this.points = [];
	};

	MouseDraw.prototype.move = function(options){
		if(this.isDrawing){
			this.addPoint(new fabric.Point(options.e.offsetX,options.e.offsetY));
			this.canvas.renderAll();
		}
	};

	MouseDraw.prototype.up = function(options){
		this.isDrawing = false;
		this.addPoint(new fabric.Point(options.e.offsetX,options.e.offsetY));
		this.canvas.renderAll();
		this.onDraw(this.points);
	};



	window.MouseDraw = MouseDraw;
})();