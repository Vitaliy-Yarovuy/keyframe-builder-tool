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
		this.angleK = ko.observable(1.0);
		this.isChain = ko.observable(false);

		this.frames = [];
		this.lines = [];

		this.onMove = _.debounce(this._onMove.bind(this),50);

		this.step.subscribe(_.debounce(function(){
			that.fillFrames();
		},400));
		this.angleK.subscribe(this.onMove);
		this.isChain.subscribe(function(value){
			that.frames.forEach(function(frame){
				frame.setFixedChain(value);
			});
		});
		this.isRotate.subscribe(function(value){
			that.frames.forEach(function(frame){
				frame.setRotateFlag(value);

			});
			if(value){
				that.fillFrameAngles();
			}
		});
	};


	KeyFrames.prototype.setPoints = function(points){
		this.originPoints = points;
		this.fillFrames();
		this.fillFrameAngles();
	};

	KeyFrames.prototype.clearFrames = function(){
		this.frames.forEach(function(frame){
			frame.remove();
		});
		this.frames = [];
	};

	KeyFrames.prototype.fillFrames = function(){
		var points, i, isRotate = this.isRotate();
		this.clearFrames();
		points = mathPoint.approximateLineByPercent(this.originPoints,this.step()/100);
		this.frames = points.map(function(point){
			var frame = new Frame(point,{
				color: this.color(),
				onMove: this.onMove
			});
			frame.setRotateFlag(isRotate);
			return frame;
		},this);
		for(i = 0; i < this.frames.length; i++){
			this.frames[i].link(this.frames[i - 1],this.frames[i + 1]);
		}
		app.canvas.renderAll();
	};

	KeyFrames.prototype.fillFrameAngles = function(){
		var i,angle,lastAngle,diffAngle,calcAngle,angleK,baseAngle;

		if(!this.isRotate()){
			return ;
		}
		angleK = this.angleK();
		for(i = 0; i < this.frames.length - 1; i++){
			angle = mathPoint.getAngle(this.frames[i].getPosition(),this.frames[i+1].getPosition());
			if(i === 0){
				calcAngle = angle;
				baseAngle = angle;
			}else{
				diffAngle = mathPoint.getAngleDiff(angle, lastAngle);
				calcAngle = baseAngle - diffAngle * angleK/2 ;
				baseAngle = baseAngle - diffAngle * angleK ;
			}
			console.log("angle",mathPoint.toDegree(angle),mathPoint.toDegree(diffAngle));
			lastAngle = angle;
			this.frames[i].setAngle(mathPoint.normalizeAngle(calcAngle + Math.PI/2));
		}
		calcAngle = baseAngle - diffAngle * angleK / 2;
		this.frames[i].setAngle(mathPoint.normalizeAngle(calcAngle + Math.PI/2));
		app.canvas.renderAll();
	};

	KeyFrames.prototype._onMove = function(){
		if(this.isRotate()){
			this.fillFrameAngles();
		}
	};


/******************************//*

	for(;i<points.length-1;i++){
		var calcAngle;
		angle=PointMath.getAngle(points[i],points[i+1]);
		var dAngle=angle-lastAngle;
		if(PointMath.getSign(angle)==PointMath.getSign(lastAngle) || Math.abs(angle-lastAngle)< Math.PI ){
			calcAngle=(2*baseAngle+dAngle*angleK-Math.PI)/2;
		}
		else{
			if(Math.abs(dAngle)>Math.PI){
				dAngle-=PointMath.getSign(angle)*Math.PI*2;
			}
			var sign=PointMath.getSignOfMaxAbs(angle,lastAngle);
			calcAngle=(2*baseAngle+dAngle*angleK-Math.PI)/2;
		};
		this.items.add(new LineItem({point:points[i],text:(i%5==0?i.toString():""),angle:calcAngle}),{silent:true});
		baseAngle=baseAngle+dAngle*angleK;
		lastAngle=angle;
	}

	/****************************/





		window.KeyFrames = KeyFrames;
})();