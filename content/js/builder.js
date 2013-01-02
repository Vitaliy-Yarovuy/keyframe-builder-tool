(function(){
	"user strict";

	function BuilderModel(el){
		var that = this;
		this.el = el;
		this.init();
		ko.applyBindings(this,this.el);

		this.selectKeyFrame = function(){
			that.selectedKeyFrame(this);
		}
	}

	BuilderModel.prototype.init = function(){
		var that = this;
		this.isSeletAreaMode = ko.observable(false);
		this.seletedArea = ko.observable(null);
		this.keyFrames =  ko.observableArray();
		this.selectedKeyFrame =  ko.observable(null);
		this.isDraw =  ko.observable(false);

		this.mouseSelector = new MouseSelector(this.el,{
			onSelect: this.onSelectArea.bind(this)
		});
		this.targetArea = this.mouseSelector.targetArea;
		this.isSeletAreaMode.subscribe(function(value){
			that.mouseSelector[value?"start":"stop"]();
		});

		this.seletedArea.subscribe(function(value){
			that.targetArea.classList[value?"add":"remove"]("active");
		})

	};

	BuilderModel.prototype.toggleSelectAreaMode = function(){
		this.isSeletAreaMode(!this.isSeletAreaMode());
	};

	BuilderModel.prototype.onSelectArea = function(elArea){
		this.seletedArea(elArea);
		this.mouseSelector.stop();
		this.isSeletAreaMode(false);
		this.fillKeyFrames();
	};

	BuilderModel.prototype.fillKeyFrames = function(){
		var children = this.seletedArea().children;
		this.keyFrames.removeAll();
		_.forEach(children,function(item){
			this.keyFrames.push(new KeyFrames(item));
		},this);
	};




	window.BuilderModel = BuilderModel;
})();