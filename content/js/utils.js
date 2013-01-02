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
		getRectangle:function(el){
			var bodyRect = document.body.getBoundingClientRect(),
				elRect = el.getBoundingClientRect();
			return {
				left: elRect.left - bodyRect.left,
				top: elRect.top - bodyRect.top,
				width: elRect.width,
				height: elRect.height
			}
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
		}
	};
	window.utils = utils;
})(window.jQuery);