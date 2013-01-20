(function(){
	"user strict";

	function FramePlayer(keyFrame){
		this.keyFrame = keyFrame;
		this.init();
	}


	FramePlayer.prototype.init = function(){
		this.isSelect = false;
		this.isPlay = ko.observable(false);
	};

	FramePlayer.prototype.select = function(){
		this.isSelect = true;
		this.keyFrame.selectFrame();
		this.applyTranslateToElement();
	};

	FramePlayer.prototype.unSelect = function(){
		this.isSelect = false;
		this.keyFrame.selectFrame(-1);
		this.resetElementTranslate();
	};

	FramePlayer.prototype.remove = function(){
		this.keyFrame = null;
		this.resetElementTranslate();
	};

	FramePlayer.prototype.nextFrame = function(){
		this.keyFrame.selectFrame(1, true);
		this.applyTranslateToElement();
	};

	FramePlayer.prototype.prevFrame = function(){
		this.keyFrame.selectFrame(- 1, true);
		this.applyTranslateToElement();
	};

	FramePlayer.prototype.applyTranslateToElement = function(time){
		var selectedFrame = this.keyFrame.getSelectedFrame(),
			framePosition,elPosition,angle,isRotate;
		if(!selectedFrame){
			return false;
		}
		framePosition = selectedFrame.getPosition();
		elPosition = framePosition.subtract(this.keyFrame.domOffset)
			.subtract(this.keyFrame.getUserOffset());
		isRotate = this.keyFrame.isRotate();
		if(isRotate){
			angle = selectedFrame.getAngle();
			angle = mathPoint.toDegree(angle);
		}
		utils.setTranslate(this.keyFrame.el,elPosition,angle,time);
	};

	FramePlayer.prototype.resetElementTranslate = function(time){
		utils.removeTranslate(this.keyFrame.el,time);
	};



	window.FramePlayer = FramePlayer;
})();