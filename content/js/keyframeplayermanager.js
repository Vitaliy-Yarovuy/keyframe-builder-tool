(function(){
	"user strict";

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
			})[0],lastPlayer;
			lastPlayer = that.selectedPlayer();
			lastPlayer && lastPlayer.unSelect();
			that.selectedPlayer(player);
			player.select();
		});
		this.keyframes.subscribe(_.debounce(this.fillFramePlayers.bind(this),500));
		this.togglePlayer = this.togglePlayer.bind(this);
		this.nextFrame = this.nextFrame.bind(this);
		this.prevFrame = this.prevFrame.bind(this);
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

	FramePlayerManager.prototype.nextFrame = function(){
		var player = this.selectedPlayer();
		if(player){
			player.nextFrame();
		}
	};

	FramePlayerManager.prototype.prevFrame = function(){
		var player = this.selectedPlayer();
		if(player){
			player.prevFrame();
		}
	};

	window.FramePlayerManager = FramePlayerManager;
})();