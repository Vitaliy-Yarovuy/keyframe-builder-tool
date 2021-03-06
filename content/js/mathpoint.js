(function(){
	'use strict';
	var mathPoint = {

		getLength: function(p1,p2){
			var dx = p1.x -p2.x,
				dy = p1.y -p2.y;
			return Math.sqrt(dx * dx + dy * dy);
		},

		getLinesLength: function(points){
			var i,length = 0;
			for(i = 1; i< points.length ;i++){
				length += this.getLength(points[i], points[i-1]);
			}
			return length;
		},

		getPointOnLine: function(p1, p2, lenght){
			var dx = p2.x - p1.x,
				dy = p2.y - p1.y,
				percent = lenght / this.getLength(p1, p2);
			return new fabric.Point(p1.x + percent * dx, p1.y + percent * dy);
		},

		approximateLine: function(points,dlength){
			var i = 0 , currLength = dlength,
				approxPoints = [points[0]];
			while(i < points.length - 1){
				if(currLength <= 0){
					var point = this.getPointOnLine(points[i],points[i-1],-currLength);
					approxPoints.push(point);
					currLength += dlength;
				}
				else{
					i++;
					currLength -= this.getLength(points[i-1],points[i]);
				}
			}
			approxPoints.push(points[i]);
			return approxPoints;
		},

		approximateLineByPercent: function(points,percent){
			var length = this.getLinesLength(points),
				dLength = length * percent;
			return this.approximateLine(points,dLength);
		},
		toRadian: function(angle){
			return ((angle % 360) * Math.PI / 180);
		},
		toDegree: function(angle){
			return (angle * 180 / Math.PI ) % 360;
		},
		normalizeAngle: function( val){
			while(val < 0 ){
				val+= 2 * Math.PI;
			}
			while(val > 2 * Math.PI ){
				val-= 2 * Math.PI;
			}
			return val;
		},
		getAngleDiff:function(alpha,beta){
			var diff = beta - alpha;
			if(diff > Math.PI){
				diff -= Math.PI*2;
			}
			if(diff < -Math.PI){
				diff += Math.PI*2;
			}
			return diff;
		},
		getAngle: function(p1, p2){
			var diff = p2.subtract(p1);
			return this.normalizeAngle(Math.atan2(diff.y, diff.x));
		},


		getPointFromPolarSystem: function(angle, length, center){
			center = center || new fabric.Point(0, 0);
			return center.add(new fabric.Point(length * Math.cos(angle), length * Math.sin(angle)));
		}

	};

	window.mathPoint = mathPoint;
})();