
var WTween;
var WEase;
(function(){
	WTweenTransition = function() {
		this.linear = function (t, b, c, d) {
			return c*t/d + b;
		};
		this.easeInQuad = function (t, b, c, d) {
			return c*(t/=d)*t + b;
		};
		this.easeOutQuad = function (t, b, c, d) {
			return -c *(t/=d)*(t-2) + b;
		};
		this.easeInOutQuad = function (t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t + b;
			return -c/2 * ((--t)*(t-2) - 1) + b;
		};
		this.easeInCubic = function (t, b, c, d) {
			return c*(t/=d)*t*t + b;
		};
		this.easeOutCubic = function (t, b, c, d) {
			return c*((t=t/d-1)*t*t + 1) + b;
		};
		this.easeInOutCubic = function (t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t + b;
			return c/2*((t-=2)*t*t + 2) + b;
		};
		this.easeInQuart = function (t, b, c, d) {
			return c*(t/=d)*t*t*t + b;
		};
		this.easeOutQuart = function (t, b, c, d) {
			return -c * ((t=t/d-1)*t*t*t - 1) + b;
		};
		this.easeInOutQuart = function (t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
			return -c/2 * ((t-=2)*t*t*t - 2) + b;
		};
		this.easeInQuint = function (t, b, c, d) {
			return c*(t/=d)*t*t*t*t + b;
		};
		this.easeOutQuint = function (t, b, c, d) {
			return c*((t=t/d-1)*t*t*t*t + 1) + b;
		};
		this.easeInOutQuint = function (t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
			return c/2*((t-=2)*t*t*t*t + 2) + b;
		};
		this.easeInSine = function (t, b, c, d) {
			return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
		};
		this.easeOutSine = function (t, b, c, d) {
			return c * Math.sin(t/d * (Math.PI/2)) + b;
		};
		this.easeInOutSine = function (t, b, c, d) {
			return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
		};
		this.easeInExpo = function (t, b, c, d) {
			return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
		};
		this.easeOutExpo = function (t, b, c, d) {
			return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
		};
		this.easeInOutExpo = function (t, b, c, d) {
			if (t==0) return b;
			if (t==d) return b+c;
			if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
			return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
		};
		this.easeInCirc = function (t, b, c, d) {
			return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
		};
		this.easeOutCirc = function (t, b, c, d) {
			return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
		};
		this.easeInOutCirc = function (t, b, c, d) {
			if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
			return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
		};
		this.easeInElastic = function (t, b, c, d, a, p) {
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		};
		this.easeOutElastic = function (t, b, c, d, a, p) {
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
		};
		this.easeInOutElastic = function (t, b, c, d, a, p) {
			if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
			return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
		};
		this.easeInBack = function (t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c*(t/=d)*t*((s+1)*t - s) + b;
		};
		this.easeOutBack = function (t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		};
		this.easeInOutBack = function (t, b, c, d, s) {
			if (s == undefined) s = 1.70158; 
			if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
			return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
		};
		this.easeInBounce = function (t, b, c, d) {
			return c - Math.easeOutBounce (d-t, 0, c, d) + b;
		};
		this.easeOutBounce = function (t, b, c, d) {
			if ((t/=d) < (1/2.75)) {
				return c*(7.5625*t*t) + b;
			} else if (t < (2/2.75)) {
				return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
			} else if (t < (2.5/2.75)) {
				return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
			} else {
				return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
			}
		};
		this.easeInOutBounce = function (t, b, c, d) {
			if (t < d/2) return Math.easeInBounce (t*2, 0, c, d) * .5 + b;
			return Math.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
		};
	}
	WTweenAnimation = function() {
		this.intervalo;
		this.addTween = function($object, $propertie, $finish, $duration, $transition, $begin)
		{
			var tipo = "";
			var changer = ($object.style)?$object.style:$object
			$transition = $transition?$transition:transition.linear;
			var begin = changer[$propertie];
			begin = begin?begin:($begin?String($begin):"0")
			if(begin.indexOf("px") > 0) {
				begin = begin.split("px").join("");
				tipo = "px";
			}
			$duration = $duration * 32;
			var _c;
			var change = $finish - begin;
			var time = 0;
			clearInterval(this.intervalo);
			this.intervalo = setInterval(function() {
				changer[$propertie] = $transition(time++, Number(begin), Number(change), $duration) + tipo;
				if (time > $duration) clearInterval(WTween.intervalo);
			}, 33);
		}
	}
	WEase = new WTweenTransition();
	WTween = new WTweenAnimation();
}());