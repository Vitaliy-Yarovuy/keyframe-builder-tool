(function(){
	"user strict";
	var helperListener,
		piBy2   = Math.PI * 2;

	helperListener = {
		init:function () {
			var that = this;
			this.isInit = true;
			this.frames = [];
			app.canvas.on('mouse:down', function (e) {
				var index = that.frames.indexOf(e.target);
				if (index !== -1) {
					that.frame = that.frames[index];
					that.frame._down(e);
				}
			});
			app.canvas.on('mouse:move', function (e) {
				if (that.frame) {
					that.frame._move(e);
				}
			});
			app.canvas.on('mouse:up', function (e) {
				if (that.frame) {
					that.frame._up(e);
					that.frame = null;
				}
			});
		},
		add:function (frame) {
			if (!this.isInit) {
				this.init();
			}
			this.frames.push(frame);
		},
		remove:function (frame) {
			var index = this.frames.indexOf(frame);
			if (index !== -1) {
				this.frames.splice(index, 1);
			}
		}
	};

	function getAngle(point,e){
		return mathPoint.getAngle(point, new fabric.Point(e.e.offsetX, e.e.offsetY));
	}



var FramePointRotateTool = fabric.util.createClass(fabric.Object, fabric.Observable, {
		RADIUS: 6,
		initialize: function(framePoint, options) {
			this.callSuper('initialize', options);
			this.set({
				'width': this.RADIUS*2,
				'height': this.RADIUS*2
			});
			this.framePoint = framePoint;
			this.__updatePosition = this._updatePosition.bind(this);
			this.framePoint.on("moving",this.__updatePosition);

			this.lockMovementX = true;
			this.lockMovementY = true;
			this.hasControls = false;
			this.hasBorders = false;
			helperListener.add(this);
			this._updatePosition();
			app.canvas.add(this);

		},

		_updatePosition:function(){
			console.log("on move position");
			var framePoint = this.framePoint.getPosition(),
				point = mathPoint.getPointFromPolarSystem(this.angle,this.RADIUS*4,framePoint);
			this.set({
				top: point.y,
				left: point.x
			});
		},

		_render: function(ctx) {
			var anglePoint;
			anglePoint = mathPoint.getPointFromPolarSystem(this.angle,this.RADIUS*4);

			ctx.beginPath();
			ctx.moveTo(-anglePoint.x, -anglePoint.y);
			ctx.lineTo(0,0);
			ctx.closePath();
			ctx.stroke();
			/***********/
			ctx.beginPath();
			ctx.arc(0, 0, this.RADIUS, 0, piBy2, false);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		},

		remove:function(){
			this.framePoint.off("moving",this.__updatePosition);
			this.framePoint = null;
			helperListener.remove(this);
			app.canvas.remove(this);
		},

		_down:function(e){
			this.startAngle = getAngle(this.framePoint.getPosition(),e);
		},
		_move:function(e){
			var angle = getAngle(this.framePoint.getPosition(),e);
			var diffAngle = angle - this.startAngle;
			this.setAngle(this.angle + diffAngle);
			this.startAngle = angle;
		},
		_up:function(e){
		},

		setAngle: function(value){
			this.set({
				angle:value
			});
			this._updatePosition();
		}

	});



	var FramePoint = fabric.util.createClass(fabric.Object, fabric.Observable, {
		RADIUS: 7,
		initialize: function( options) {
			this.callSuper('initialize', options);
			this.set({
				'width': this.RADIUS*2,
				'height': this.RADIUS*2
			});
			this.isFixedChain = false;
			this.isRotate = false;

			this.angle = 0;
			this.chainLength = 0;

			this.hasControls = false;
			this.hasBorders = false;
			this.on("moving",this._move.bind(this));
			this.onMove = options.onMove;
			app.canvas.add(this);
		},
		link:function(prev,next){
			this.prev = prev;
			this.next = next;
		},

		_render: function(ctx) {
			var anglePoint;
			ctx.lineWidth = this.strokeWidth;
			if(this.next){
				ctx.beginPath();
				ctx.moveTo(0,0);
				ctx.lineTo(this.next.left - this.left,this.next.top - this.top);
				ctx.closePath();
				ctx.stroke();
			}
			ctx.beginPath();
			ctx.arc(0, 0, this.RADIUS, 0, piBy2, false);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		},

		setFixedChain:function(isFix){
			var dx,dy;
			this.isFixedChain = isFix;
			if(isFix && this.next){
				this.chainLength = mathPoint.getLength(this.getPosition(),this.next.getPosition());
			}
		},

		setRotateFlag: function(isRotate){
			if(this.isRotate !== isRotate){
				this.isRotate = isRotate;
				if(this.isRotate){
					this.rotateTool = new FramePointRotateTool(this,{
						fill: this.stroke,
						stroke: "#fff",
						strokeWidth: 3
					});
				}else{
					this.rotateTool.remove();
					this.rotateTool = null;
				}
			}
		},

		getPosition: function(){
			return new fabric.Point(this.left,this.top);
		},

		setPosition: function(point){
			this.set({
				left: point.x,
				top: point.y
			})
			this.rotateTool && this.rotateTool._updatePosition();
		},

		_move:function(){
			if(this.isFixedChain){
				this._updateChain(null,true,true);
			}
			this.onMove();
		},

		_updateChain:function(position,isNext,isPrev){
			var nextPosition,prevPosition;
			if(!position){
				position = this.getPosition();
			}else{
				this.setPosition(position);
			}
			if(isNext && this.next){
				nextPosition = mathPoint.getPointOnLine(position, this.next.getPosition() ,this.chainLength);
				this.next._updateChain(nextPosition,true,false);
			}
			if(isPrev && this.prev){
				prevPosition = mathPoint.getPointOnLine(position, this.prev.getPosition() ,this.prev.chainLength);
				this.prev._updateChain(prevPosition,false,true);
			}
		},

		remove:function(){
			this.setRotateFlag(false);
			app.canvas.remove(this);
		},

		setAngle:function(value){
			this.rotateTool && this.rotateTool.setAngle(value);
		}

	});


	window.FramePoint = FramePoint;
})();