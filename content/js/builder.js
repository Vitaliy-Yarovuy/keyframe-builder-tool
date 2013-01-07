(function(){
	"user strict";

	function BuilderModel(el){
		var that = this;
		this.el = el;
		this.init();
		ko.applyBindings(this,this.el);
	}

	BuilderModel.prototype.init = function(){
		this.initModel();
		this.initSelector();
		this.initDrawer();
	};

	BuilderModel.prototype.initModel = function(){
		var that = this;
		this.isSeletAreaMode = ko.observable(false);
		this.seletedArea = ko.observable(null);
		this.keyFrames =  ko.observableArray([]);
		this.selectedKeyFrame =  ko.observable(null);
		this.isDraw =  ko.observable(true);
		this.isChain =  ko.computed({
			read:function(){
				var arr = this.keyFrames();
				return arr.length ? arr[0].isChain() : false ;
			},
			write: function(value){
				return this.keyFrames().forEach(function(keyFrame){
					keyFrame.isChain(value);
				});
			},
			owner:this
		});
		this.selectKeyFrame = function(){
			that.selectedKeyFrame(this);
		}
	};


	BuilderModel.prototype.initSelector = function(){
		var that = this;
		this.mouseSelector = new MouseSelector(this.el,{
			onSelect: this.onSelectArea.bind(this)
		});
		this.targetArea = this.mouseSelector.targetArea;
		this.isSeletAreaMode.subscribe(function(value){
			that.mouseSelector[value?"start":"stop"]();
		});
		this.seletedArea.subscribe(function(value){
			that.targetArea.classList[value?"add":"remove"]("active");
		});
	};


	BuilderModel.prototype.initDrawer= function(){
		var that = this;
		this.mouseDraw = new MouseDraw(this.targetArea,{
			getColor:function(){
				var keyframe = that.selectedKeyFrame()
				return keyframe ?  keyframe.color():"red" ;
			},
			onDraw:function(points){
				var keyFrame = that.selectedKeyFrame();
				if(keyFrame){
					keyFrame.setPoints(points);
					that.mouseDraw.clear();
				}
			}
		});
		this.canvas = this.mouseDraw.canvas;
		this.isDraw.subscribe(function(value){
			that.mouseDraw[value?"start":"stop"]();
		});
		this.mouseDraw.start();
	};


	BuilderModel.prototype.toggleSelectAreaMode = function(){
		this.isSeletAreaMode(!this.isSeletAreaMode());
	};

	BuilderModel.prototype.onSelectArea = function(elArea){
		this.seletedArea(elArea);
		this.mouseDraw.setup();
		this.mouseSelector.stop();
		this.isSeletAreaMode(false);
		this.fillKeyFrames();
	};

	BuilderModel.prototype.fillKeyFrames = function(){
		var isChain = this.isChain(),
			children = this.seletedArea().children;
		this.keyFrames.removeAll();
		_.forEach(children,function(item){
			this.keyFrames.push(new KeyFrames(item));
		},this);
		this.isChain(isChain);
	};




	window.BuilderModel = BuilderModel;
})();