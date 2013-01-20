(function(){

	function CssGenerator(el,options){
		this.el = el;
		this.options = options;
		this.init();
	}

	CssGenerator.prototype.init = function(){
		this.editor = CodeMirror.fromTextArea(this.el, {
			mode: "css",
			lineNumbers: true,
			mode:"text/css"
		});
	};

	CssGenerator.prototype.generate = function(){
		var that = this,
			keyFrames = app.keyFrames(),
			result = "";
		result += keyFrames.reduce(function(style, keyframe){
			if(keyframe.frames.length){
				style += that.generateCssForKeyFrame(keyframe);
			}
			return style;
		},"");
		this.editor.setValue(result);
	};

	CssGenerator.prototype.generateCssForKeyFrame = function(keyframe){
		var that = this,
			result = "",
			step = keyframe.step(),
			isRotate = keyframe.isRotate();
		result += "@-webkit-keyframes \""+keyframe.name()+"\"{\n";
		result += keyframe.frames.reduce(function(cssText,frame,i){
			var percent = Math.floor(i * step),
			percent = Math.min(percent,100);
			cssText += that.generateCssForFrame(percent,frame,isRotate);
			return cssText;
		},"");
		result += "}\n\n";
		return result;
	};

	CssGenerator.prototype.generateCssForFrame = function(percent,frame,isRotate){
		var result = "",angle,transform,
		point = frame.getPosition();
		transform = "translate3d("+point.x+"px, "+point.y+"px, 0px)";
		if(isRotate){
			angle = frame.getAngle();
			angle = mathPoint.toDegree(angle);
			transform += " rotate("+angle+"deg)";
		}
		result += "\t" + percent + "% {\n";
		result += "\t\t-webkit-transform: " + transform + ";\n";
		result += "\t}\n";
		return result;
	};

//	-webkit-transform: translate3d(-98px, 106px, 0px) rotate(0.4151019040664262deg);

	window.CssGenerator = CssGenerator;
})();