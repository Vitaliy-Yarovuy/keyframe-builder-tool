(function(){
	"user strict";

	function FramePlayer(keyFrame){
		this.keyFrame = keyFrame;
		this.init();
	}


	FramePlayer.prototype.init = function(){
		this.isPlay = ko.observable(false);
	};

	FramePlayer.prototype.remove = function(){
		this.keyFrame = null;
	};

	FramePlayer.prototype.nextFrame = function(){
		alert("next frame");
	};

	FramePlayer.prototype.prevFrame = function(){
		alert("prev frame");
	};



	function FramePlayerManager(keyframes,selectedKeyFrame){
		this.framePlayers = [];
		this.keyframes = keyframes;
		this.selectedKeyFrame = selectedKeyFrame;
		this.init();
	};

	FramePlayerManager.prototype.init = function(){
		var that = this;
		this.selectedPlayer = ko.observable(null);
		this.selectedKeyFrame.subscribe(function(keyframe){
			var player = that.framePlayers.filter(function(player){
				return player.keyFrame === keyframe;
			})[0];
			that.selectedPlayer(player);
		});
		this.keyframes.subscribe(_.debounce(this.fillFramePlayers.bind(this),500));
		this.togglePlayer = this.togglePlayer.bind(this);
	};


	FramePlayerManager.prototype.fillFramePlayers = function(){
		this.framePlayers.forEach(function(player){
			player.remove();
		});
		this.framePlayers = this.keyframes().map(function(keyframe){
			return new FramePlayer(keyframe);
		});
	};


	FramePlayerManager.prototype.togglePlayer = function(){
		var player = this.selectedPlayer();
		if(player){
			player.isPlay(!player.isPlay());
		}
	};

	window.FramePlayer = FramePlayer;
	window.FramePlayerManager = FramePlayerManager;
})();