(function(){

	function MouseDraw(el,options){
		this.el = el;
		this.options = options;
		this.init();
	}



/*

	MouseDraw.prototype.init = function(){
		this.isStart = false;
		this._move = this.move.bind(this);
		this._down = this.down.bind(this);
		this.unacceptableSelector = '#' + this.el.id + ',#'+this.el.id + ' *';
		this.pretendant = null;
		this.target = null;
		this.pretendantArea = utils.createElement("div",{"className":"keyb-pretendant"});
		this.targetArea = utils.createElement("div",{"className":"keyb-target"});
		document.body.appendChild(this.pretendantArea);
		document.body.appendChild(this.targetArea);
	};

	MouseDraw.prototype.start = function(){
		if(!this.isStart){
			document.addEventListener('mousemove',this._move,false);
			document.addEventListener('mousedown',this._down,false);
			this.isStart = true;
		}
	};

	MouseDraw.prototype.stop = function(){
		if(this.isStart){
			document.removeEventListener('mousemove',this._move);
			document.removeEventListener('mousedown',this._down);
			this.selectElement(null,this.pretendantArea);
			this.isStart = false;
		}
	};

	MouseDraw.prototype.move = function(e){
		var pretendant = e.target;
		if(pretendant.webkitMatchesSelector(this.unacceptableSelector)){
			pretendant = null;
		}
		if(this.pretendant !== pretendant){
			this.pretendant = pretendant;
			this.selectElement(this.pretendant,this.pretendantArea);
		}

	};

	MouseDraw.prototype.down = function(e){
		var target = e.target;
		if(target.webkitMatchesSelector(this.unacceptableSelector)){
			return ;
		}
		if(this.target !== target){
			this.target = target;
			this.selectElement(this.target,this.targetArea);
			this.onSelect(this.target);
		}
	};


	MouseDraw.prototype.selectElement = function(el,elArea){
		var rect;
		if(el){
			rect = utils.getRectangle(el);
			utils.setRectangle(elArea,rect);
		}else{
			elArea.style.cssText = "";
		}
	};

*/

	window.MouseDraw = MouseDraw;
})();