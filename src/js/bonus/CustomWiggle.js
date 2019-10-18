(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.window = global.window || {}));
}(this, function (exports) { 'use strict';

	/*!
	 * VERSION: 3.0.0
	 * DATE: 2019-09-18
	 * http://greensock.com
	 *
	 * Copyright (c) 2008-2019, GreenSock. All rights reserved.
	 * This work is subject to the terms at http://greensock.com/standard-license or for
	 * Club GreenSock members, the agreement that was issued with that membership.
	 * @author: Jack Doyle, jack@greensock.com
	*/

	/* eslint-disable */
	var _DEG2RAD = Math.PI / 180,
	    _RAD2DEG = 180 / Math.PI;
	/*
	// takes a segment with coordinates [x, y, x, y, ...] and converts the control points into angles and lengths [x, y, angle, length, angle, length, x, y, angle, length, ...] so that it animates more cleanly and avoids odd breaks/kinks. For example, if you animate from 1 o'clock to 6 o'clock, it'd just go directly/linearly rather than around. So the length would be very short in the middle of the tween.
	export function cpCoordsToAngles(segment, copy) {
		var result = copy ? segment.slice(0) : segment,
			x, y, i;
		for (i = 0; i < segment.length; i+=6) {
			x = segment[i+2] - segment[i];
			y = segment[i+3] - segment[i+1];
			result[i+2] = Math.atan2(y, x);
			result[i+3] = Math.sqrt(x * x + y * y);
			x = segment[i+6] - segment[i+4];
			y = segment[i+7] - segment[i+5];
			result[i+4] = Math.atan2(y, x);
			result[i+5] = Math.sqrt(x * x + y * y);
		}
		return result;
	}

	// takes a segment that was converted with cpCoordsToAngles() to have angles and lengths instead of coordinates for the control points, and converts it BACK into coordinates.
	export function cpAnglesToCoords(segment, copy) {
		var result = copy ? segment.slice(0) : segment,
			length = segment.length,
			rnd = 1000,
			angle, l, i, j;
		for (i = 0; i < length; i+=6) {
			angle = segment[i+2];
			l = segment[i+3]; //length
			result[i+2] = (((segment[i] + Math.cos(angle) * l) * rnd) | 0) / rnd;
			result[i+3] = (((segment[i+1] + Math.sin(angle) * l) * rnd) | 0) / rnd;
			angle = segment[i+4];
			l = segment[i+5]; //length
			result[i+4] = (((segment[i+6] - Math.cos(angle) * l) * rnd) | 0) / rnd;
			result[i+5] = (((segment[i+7] - Math.sin(angle) * l) * rnd) | 0) / rnd;
		}
		return result;
	}

	//adds an "isSmooth" array to each segment and populates it with a boolean value indicating whether or not it's smooth (the control points have basically the same slope). For any smooth control points, it converts the coordinates into angle (x, in radians) and length (y) and puts them into the same index value in a smoothData array.
	export function populateSmoothData(rawPath) {
		let j = rawPath.length,
			smooth, segment, x, y, x2, y2, i, l, a, a2, isSmooth, smoothData;
		while (--j > -1) {
			segment = rawPath[j];
			isSmooth = segment.isSmooth = segment.isSmooth || [0, 0, 0, 0];
			smoothData = segment.smoothData = segment.smoothData || [0, 0, 0, 0];
			isSmooth.length = 4;
			l = segment.length - 2;
			for (i = 6; i < l; i += 6) {
				x = segment[i] - segment[i - 2];
				y = segment[i + 1] - segment[i - 1];
				x2 = segment[i + 2] - segment[i];
				y2 = segment[i + 3] - segment[i + 1];
				a = _atan2(y, x);
				a2 = _atan2(y2, x2);
				smooth = (Math.abs(a - a2) < 0.09);
				if (smooth) {
					smoothData[i - 2] = a;
					smoothData[i + 2] = a2;
					smoothData[i - 1] = _sqrt(x * x + y * y);
					smoothData[i + 3] = _sqrt(x2 * x2 + y2 * y2);
				}
				isSmooth.push(smooth, smooth, 0, 0, smooth, smooth);
			}
			//if the first and last points are identical, check to see if there's a smooth transition. We must handle this a bit differently due to their positions in the array.
			if (segment[l] === segment[0] && segment[l+1] === segment[1]) {
				x = segment[0] - segment[l-2];
				y = segment[1] - segment[l-1];
				x2 = segment[2] - segment[0];
				y2 = segment[3] - segment[1];
				a = _atan2(y, x);
				a2 = _atan2(y2, x2);
				if (Math.abs(a - a2) < 0.09) {
					smoothData[l-2] = a;
					smoothData[2] = a2;
					smoothData[l-1] = _sqrt(x * x + y * y);
					smoothData[3] = _sqrt(x2 * x2 + y2 * y2);
					isSmooth[l-2] = isSmooth[l-1] = true; //don't change indexes 2 and 3 because we'll trigger everything from the END, and this will optimize file size a bit.
				}
			}
		}
		return rawPath;
	}
	export function pointToScreen(svgElement, point) {
		if (arguments.length < 2) { //by default, take the first set of coordinates in the path as the point
			let rawPath = getRawPath(svgElement);
			point = svgElement.ownerSVGElement.createSVGPoint();
			point.x = rawPath[0][0];
			point.y = rawPath[0][1];
		}
		return point.matrixTransform(svgElement.getScreenCTM());
	}

	*/

	/*!
	 * VERSION: 3.0.0
	 * DATE: 2019-09-25
	 * http://greensock.com
	 *
	 * @license Copyright (c) 2008-2019, GreenSock. All rights reserved.
	 * This work is subject to the terms at http://greensock.com/standard-license or for
	 * Club GreenSock members, the agreement that was issued with that membership.
	 * @author: Jack Doyle, jack@greensock.com
	*/

	var gsap,
	    _coreInitted,
	    createCustomEase,
	    _getGSAP = function _getGSAP() {
	  return gsap || typeof window !== "undefined" && (gsap = window.gsap);
	},
	    _eases = {
	  easeOut: "M0,1,C0.7,1,0.6,0,1,0",
	  easeInOut: "M0,0,C0.1,0,0.24,1,0.444,1,0.644,1,0.6,0,1,0",
	  anticipate: "M0,0,C0,0.222,0.024,0.386,0,0.4,0.18,0.455,0.65,0.646,0.7,0.67,0.9,0.76,1,0.846,1,1",
	  uniform: "M0,0,C0,0.95,0,1,0,1,0,1,1,1,1,1,1,1,1,0,1,0"
	},
	    _linearEase = function _linearEase(p) {
	  return p;
	},
	    _initCore = function _initCore(required) {
	  if (!_coreInitted) {
	    gsap = _getGSAP();
	    createCustomEase = gsap && gsap.parseEase("_CE");

	    if (createCustomEase) {
	      for (var p in _eases) {
	        _eases[p] = createCustomEase("", _eases[p]);
	      }

	      _coreInitted = 1;

	      _create("wiggle").config = function (vars) {
	        return typeof vars === "object" ? _create("", vars) : _create("wiggle(" + vars + ")", {
	          wiggles: +vars
	        });
	      };
	    } else {
	      required && console.warn("Please gsap.registerPlugin(CustomEase, CustomWiggle)");
	    }
	  }
	},
	    _parseEase = function _parseEase(ease, invertNonCustomEases) {
	  if (typeof ease !== "function") {
	    ease = gsap.parseEase(ease) || createCustomEase("", ease);
	  }

	  return ease.custom || !invertNonCustomEases ? ease : function (p) {
	    return 1 - ease(p);
	  };
	},
	    //<name>CustomWiggle</name>
	_create = function _create(id, vars) {
	  if (!_coreInitted) {
	    _initCore(1);
	  }

	  vars = vars || {};
	  var wiggles = (vars.wiggles || 10) | 0,
	      inc = 1 / wiggles,
	      x = inc / 2,
	      anticipate = vars.type === "anticipate",
	      yEase = _eases[vars.type] || _eases.easeOut,
	      xEase = _linearEase,
	      rnd = 1000,
	      nextX,
	      nextY,
	      angle,
	      handleX,
	      handleY,
	      easedX,
	      y,
	      path,
	      i;

	  {
	    if (anticipate) {
	      //the anticipate ease is actually applied on the x-axis (timing) and uses easeOut for amplitude.
	      xEase = yEase;
	      yEase = _eases.easeOut;
	    }

	    if (vars.timingEase) {
	      xEase = _parseEase(vars.timingEase);
	    }

	    if (vars.amplitudeEase) {
	      yEase = _parseEase(vars.amplitudeEase, true);
	    }

	    easedX = xEase(x);
	    y = anticipate ? -yEase(x) : yEase(x);
	    path = [0, 0, easedX / 4, 0, easedX / 2, y, easedX, y];

	    if (vars.type === "random") {
	      //if we just select random values on the y-axis and plug them into the "normal" algorithm, since the control points are always straight horizontal, it creates a bit of a slowdown at each anchor which just didn't seem as desirable, so we switched to an algorithm that bends the control points to be more in line with their context.
	      path.length = 4;
	      nextX = xEase(inc);
	      nextY = Math.random() * 2 - 1;

	      for (i = 2; i < wiggles; i++) {
	        x = nextX;
	        y = nextY;
	        nextX = xEase(inc * i);
	        nextY = Math.random() * 2 - 1;
	        angle = Math.atan2(nextY - path[path.length - 3], nextX - path[path.length - 4]);
	        handleX = Math.cos(angle) * inc;
	        handleY = Math.sin(angle) * inc;
	        path.push(x - handleX, y - handleY, x, y, x + handleX, y + handleY);
	      }

	      path.push(nextX, 0, 1, 0);
	    } else {
	      for (i = 1; i < wiggles; i++) {
	        path.push(xEase(x + inc / 2), y);
	        x += inc;
	        y = (y > 0 ? -1 : 1) * yEase(i * inc);
	        easedX = xEase(x);
	        path.push(xEase(x - inc / 2), y, easedX, y);
	      }

	      path.push(xEase(x + inc / 4), y, xEase(x + inc / 4), 0, 1, 0);
	    }

	    i = path.length;

	    while (--i > -1) {
	      path[i] = ~~(path[i] * rnd) / rnd; //round values to avoid odd strings for super tiny values
	    }

	    path[2] = "C" + path[2];
	    return createCustomEase(id, "M" + path.join(","));
	  }
	};

	var CustomWiggle =
	/*#__PURE__*/
	function () {
	  function CustomWiggle(id, vars) {
	    this.ease = _create(id, vars);
	  }

	  CustomWiggle.create = function create(id, vars) {
	    return _create(id, vars);
	  };

	  CustomWiggle.register = function register(core) {
	    gsap = core;

	    _initCore();
	  };

	  return CustomWiggle;
	}();
	_getGSAP() && gsap.registerPlugin(CustomWiggle);
	CustomWiggle.version = "3.0.0";

	exports.CustomWiggle = CustomWiggle;
	exports.default = CustomWiggle;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
