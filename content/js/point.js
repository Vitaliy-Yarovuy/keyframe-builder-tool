(function(){
	'use strict';
	var mathPoint;

	/*********************/
	function Point(x, y){
		this.x = ko.observable(x);
		this.y = ko.observable(y);
	}

	Point.prototype.toString = function(){
		return '{x=' + this.x + ',y=' + this.y + '}';
	};
	Point.prototype.add = function(p){
		return new Point(this.x() + p.x(), this.y() + p.y());
	};
	Point.prototype.sub = function(p){
		return new Point(this.x() - p.x(), this.y() - p.y());
	};
	Point.prototype.mult = function(k){
		return new Point(this.x() * k, this.y() * k);
	};
	Point.prototype.negative = function(){
		return new Point(-this.x(), -this.y());
	};
	Point.prototype.compare = function(p){
		return (this.x() === p.x() && this.y() === p.y());
	};
	Point.prototype.clone = function(){
		return new Point(this.x(), this.y());
	};


	window.Point = Point;
})();