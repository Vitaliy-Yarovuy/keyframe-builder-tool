(function($){
	var utils, noAttr = ["id","className","innerHTML","value","src"],
		colors=["#bb3333","#33bb33","#3333bb","#33bbbb","#bb33bb","#bbbb33","#771111","#117711","#111177","#117777","#771177","#777711"],
		colorCount = 0,
		names={};

	utils = {
		createElement : function(type,attrs,childs){
			var el = document.createElement(type), key;
			if(attrs){
				for(key in attrs){
					if(attrs.hasOwnProperty(key)){
						if(noAttr.indexOf(key) !== -1 ){
							el[key] = attrs[key];
						}else{
							el.setAttribute(key, attrs[key]);
						}
					}
				}
			}
			if(childs){
				if(!childs instanceof  Array){
					childs = [childs];
				}
				childs.forEach(function(child){
					el.appendChild(child);
				});
			}
			return el;
		},
		includeTemplate:function(path,templates,callback){
			async.forEach(templates,function(item,cback){
				$.ajax(path + "/" + item + ".html",{
					success:function(data, textStatus, jqXHR){
						var template = utils.createElement("script",{
							"type":"text/html",
							"id": item,
							"innerHTML": data
						});
						document.body.appendChild(template);
						cback();
					}
				})
			},callback);
		},
		includeStyle:function(path,replaceObj,callback){
			var key,reg;
			$.ajax(path,{
				success:function(data, textStatus, jqXHR){
					for(key in replaceObj){
						if(replaceObj.hasOwnProperty(key)){
							reg = new RegExp(key,"g");
							data = data.replace(reg,replaceObj[key]);
						}
					}
					var template = utils.createElement("style",{
						"innerHTML": data
					});
					document.body.appendChild(template);
					callback && callback();
				}
			})
		},
		getRectangle:function(el){
			var bodyRect = document.body.getBoundingClientRect(),
				elRect = el.getBoundingClientRect();
			return {
				left: parseInt(elRect.left - bodyRect.left),
				top: parseInt(elRect.top - bodyRect.top),
				width: parseInt(elRect.width),
				height: parseInt(elRect.height)
			}
		},
		getOffset:function(el,parent){
			var parentRect = parent.getBoundingClientRect(),
				elRect = el.getBoundingClientRect();
			return new fabric.Point(elRect.left - parentRect.left,elRect.top - parentRect.top);
		},
		setRectangle:function(el, rect){
			["top","left","width","height"].forEach(function(key){
				el.style[key] = rect[key] + "px";
			});
		},
		generateColor:function(){
			return colors[colorCount++ % colors.length];
		},
		generateName:function(name){
			if(!(name in names)){
				names[name]=0;
			}
			return name+"-"+(names[name]++);
		},
		setTranslate:function(el,point,angle,time){
			var transform;
			time = time || 0;
			el.style.webkitTransitionDuration = time + "ms";
			transform = "translate3d("+point.x+"px, "+point.y+"px, 0px)";
			if(angle){
				transform += " rotate("+angle+"deg)";
			}
			el.style.webkitTransform = transform;
		},
		removeTranslate:function(el,time){
			time = time || 0;
			el.style.webkitTransitionDuration = time + "ms";
			el.style.webkitTransform = "";
		}

	};
	window.utils = utils;
})(window.jQuery);