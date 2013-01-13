(function(){
	"user strict";
	var frames,
		piBy2   = Math.PI * 2;

	function addMoveListener(frame){
		var index;
		if(!frames){
			frames = [];
			app.canvas.on('object:moving',function(e){
				index = frames.indexOf(e.target);
				if(index !== -1){
					frames[index]._onMove();
				}
			});
		}
		frames.push(frame);
	}


	var setActive = _.debounce(function(obj){
		app.canvas.setActiveObject(obj);
	},500);

	var FramePoint = fabric.util.createClass(fabric.Object, fabric.Observable, {
		RADIUS: 7,
		initialize: function( options) {
			this.callSuper('initialize', options);
			this.set({
				'width': this.RADIUS*2,
				'height': this.RADIUS*2
			})
			this.isFixedChain = false;
			this.isRotate = false;

			this.angle = 0;
			this.chainLength = 0;

			this.hasControls = false;
			this.hasBorders = false;
			addMoveListener(this);
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
			if(this.isRotate){
				anglePoint = mathPoint.getPointFromPolarSystem(this.angle,this.RADIUS*2);
				ctx.beginPath();
				ctx.moveTo(0,0);
				ctx.lineTo(anglePoint.x, anglePoint.y);
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
			this.isRotate = isRotate;
		},

		getPosition: function(){
			return new fabric.Point(this.left,this.top);
		},

		setPosition: function(point){
			this.set({
				left: point.x,
				top: point.y
			})
		},

		_onMove:function(){
			if(this.isFixedChain){
				this._updateChain(null,true,true);
			}
			if(true){
				setActive(this);
			}
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
		}


	});


	window.FramePoint = FramePoint;
})();