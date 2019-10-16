/*!
 * VERSION: 3.0.0-beta.9
 * http://greensock.com
 *
 * Copyright 2008-2019, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
/* eslint-disable */

import {gsap, _getProperty, _numExp, _getUnit, _isString, _isUndefined, _renderComplexString, _relExp, _forEachName, _sortPropTweensByPriority, _colorStringFilter, _checkPlugin, _replaceRandom, _plugins, GSCache, PropTween, _config, _ticker, _round, _warn, _getSetter,
	_setDefaults, _removeLinkedListItem //for the commented-out className feature.
} from "./gsap-core.js";

let _win, _doc, _docElement, _pluginInitted, _tempDiv, _tempDivStyler, _recentSetterPlugin,
	_windowExists = () => typeof(window) !== "undefined",
	_transformProps = {},
	_RAD2DEG = 180 / Math.PI,
	_DEG2RAD = Math.PI / 180,
	_atan2 = Math.atan2,
	_bigNum = 1e8,
	_capsExp = /([A-Z])/g,
	_numWithUnitExp = /[-+=\.]*\d+[\.e-]*\d*[a-z%]*/g,
	_horizontalExp = /(?:left|right|width|margin|padding|x)/i,
	_complexExp = /[\s,\(]\S/,
	_propertyAliases = {autoAlpha:"opacity,visibility", scale:"scaleX,scaleY", alpha:"opacity"},
	_renderCSSProp = (ratio, data) => data.set(data.t, data.p, (~~((data.s + data.c * ratio) * 10000) / 10000) + data.u, data),
	_renderPropWithEnd = (ratio, data) => data.set(data.t, data.p, ratio === 1 ? data.e : (~~((data.s + data.c * ratio) * 10000) / 10000) + data.u, data),
	_renderCSSPropWithBeginning = (ratio, data) => data.set(data.t, data.p, ratio ? (~~((data.s + data.c * ratio) * 10000) / 10000) + data.u : data.b, data), //if units change, we need a way to render the original unit/value when the tween goes all the way back to the beginning (ratio:0)
	_renderRoundedCSSProp = (ratio, data) => {
		let value = data.s + data.c * ratio;
		data.set(data.t, data.p, ~~(value + (value < 0 ? -.5 : .5)) + data.u, data);
	},
	_renderNonTweeningValue = (ratio, data) => data.set(data.t, data.p, ratio ? data.e : data.b, data),
	_renderNonTweeningValueOnlyAtEnd = (ratio, data) => data.set(data.t, data.p, ratio !== 1 ? data.b : data.e, data),
	_setterCSSStyle = (target, property, value) => target.style[property] = value,
	_setterCSSProp = (target, property, value) => target.style.setProperty(property, value),
	_setterTransform = (target, property, value) => target._gsap[property] = value,
	_setterScale = (target, property, value) => target._gsap.scaleX = target._gsap.scaleY = value,
	_setterScaleWithRender = (target, property, value, data, ratio) => {
		let cache = target._gsap;
		cache.scaleX = cache.scaleY = value;
		cache.renderTransform(ratio, cache);
	},
	_setterTransformWithRender = (target, property, value, data, ratio) => {
		let cache = target._gsap;
		cache[property] = value;
		cache.renderTransform(ratio, cache);
	},
	_transformProp = "transform",
	_transformOriginProp = _transformProp + "Origin",
	_supports3D,
	_createElement = (type, ns) => {
		let e = _doc.createElementNS ? _doc.createElementNS((ns || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), type) : _doc.createElement(type); //some servers swap in https for http in the namespace which can break things, making "style" inaccessible.
		return e.style ? e : _doc.createElement(type); //some environments won't allow access to the element's style when created with a namespace in which case we default to the standard createElement() to work around the issue. Also note that when GSAP is embedded directly inside an SVG file, createElement() won't allow access to the style object in Firefox (see https://greensock.com/forums/topic/20215-problem-using-tweenmax-in-standalone-self-containing-svg-file-err-cannot-set-property-csstext-of-undefined/).
	},
	_getComputedProperty = (target, property) => {
		let cs = getComputedStyle(target);
		return cs[property] || cs.getPropertyValue(property.replace(_capsExp, "-$1").toLowerCase()) || cs.getPropertyValue(property); //css variables may not need caps swapped out for dashes and lowercase.
	},
	_checkPropPrefix = (property, element) => {
		let e = element || _tempDiv,
			s = e.style,
			i = 5,
			a = "O,Moz,ms,Ms,Webkit".split(",");
		if (property in s) {
			return property;
		}
		property = property.charAt(0).toUpperCase() + property.substr(1);
		while (i-- && !((a[i]+property) in s)) { }
		return (i < 0) ? null : ((i === 3) ? "ms" : (i >= 0) ? a[i] : "") + property;
	},
	_initPlugin = () => {
		if (_windowExists()) {
			_win = window;
			_doc = _win.document;
			_docElement = _doc.documentElement;
			_tempDiv = _createElement("div") || {style:{}};
			_tempDivStyler = _createElement("div");
			_transformProp = _checkPropPrefix(_transformProp);
			_transformOriginProp = _checkPropPrefix(_transformOriginProp);
			_tempDiv.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0"; //make sure to override certain properties that may contaminate measurements, in case the user has overreaching style sheets.
			_supports3D = !!_checkPropPrefix("perspective");
			_pluginInitted = 1;
		}
	},
	_getBBoxHack = function(swapIfPossible) { //works around issues in some browsers (like Firefox) that don't correctly report getBBox() on SVG elements inside a <defs> element and/or <mask>. We try creating an SVG, adding it to the documentElement and toss the element in there so that it's definitely part of the rendering tree, then grab the bbox and if it works, we actually swap out the original getBBox() method for our own that does these extra steps whenever getBBox is needed. This helps ensure that performance is optimal (only do all these extra steps when absolutely necessary...most elements don't need it).
		let svg = _createElement("svg", (this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns")) || "http://www.w3.org/2000/svg"),
			oldParent = this.parentNode,
			oldSibling = this.nextSibling,
			oldCSS = this.style.cssText,
			bbox;
		_docElement.appendChild(svg);
		svg.appendChild(this);
		this.style.display = "block";
		if (swapIfPossible) {
			try {
				bbox = this.getBBox();
				this._gsapBBox = this.getBBox; //store the original
				this.getBBox = _getBBoxHack;
			} catch (e) { }
		} else if (this._gsapBBox) {
			bbox = this._gsapBBox();
		}
		if (oldSibling) {
			oldParent.insertBefore(this, oldSibling);
		} else {
			oldParent.appendChild(this);
		}
		_docElement.removeChild(svg);
		this.style.cssText = oldCSS;
		return bbox;
	},
	_getAttributeFallbacks = (target, attributesArray) => {
		let i = attributesArray.length;
		while (i--) {
			if (target.hasAttribute(attributesArray[i])) {
				return target.getAttribute(attributesArray[i]);
			}
		}
	},
	_getBBox = target => {
		let bounds;
		try {
			bounds = target.getBBox(); //Firefox throws errors if you try calling getBBox() on an SVG element that's not rendered (like in a <symbol> or <defs>). https://bugzilla.mozilla.org/show_bug.cgi?id=612118
		} catch (error) {
			bounds = _getBBoxHack.call(target, true);
		}
		//some browsers (like Firefox) misreport the bounds if the element has zero width and height (it just assumes it's at x:0, y:0), thus we need to manually grab the position in that case.
		return (bounds && !bounds.width && !bounds.x && !bounds.y) ? {x: +_getAttributeFallbacks(target, ["x","cx","x1"]), y:+_getAttributeFallbacks(target, ["y","cy","y1"]), width:0, height:0} : bounds;
	},
	_isSVG = e => !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && _getBBox(e)), //reports if the element is an SVG on which getBBox() actually works
	_removeProperty = (target, property) => {
		if (property) {
			let style = target.style;
			if (property in _transformProps) {
				property = _transformProp;
			}
			if (style.removeProperty) {
				if (property.substr(0,2) === "ms" || property.substr(0,6) === "webkit") { //Microsoft and some Webkit browsers don't conform to the standard of capitalizing the first prefix character, so we adjust so that when we prefix the caps with a dash, it's correct (otherwise it'd be "ms-transform" instead of "-ms-transform" for IE9, for example)
					property = "-" + property;
				}
				style.removeProperty(property.replace(_capsExp, "-$1").toLowerCase());
			} else { //note: old versions of IE use "removeAttribute()" instead of "removeProperty()"
				style.removeAttribute(property);
			}
		}
	},
	_addNonTweeningPT = (plugin, target, property, beginning, end, onlySetAtEnd) => {
		let pt = new PropTween(plugin._pt, target, property, 0, 1, onlySetAtEnd ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue);
		plugin._pt = pt;
		pt.b = beginning;
		pt.e = end;
		plugin._props.push(property);
		return pt;
	},
	_nonConvertibleUnits = {deg:1, rad:1, turn:1},
	//takes a single value like 20px and converts it to the unit specified, like "%", returning only the numeric amount.
	_convertToUnit = (target, property, value, unit) => {
		let curValue = parseFloat(value),
			curUnit = (value + "").substr((curValue + "").length),
			style = _tempDiv.style,
			horizontal = _horizontalExp.test(property),
			isRootSVG = target.tagName.toLowerCase() === "svg",
			measureProperty = (isRootSVG ? "client" : "offset") + (horizontal ? "Width" : "Height"),
			amount = 100,
			toPixels = unit === "px",
			px, parent, cache, isSVG;
		if (unit === curUnit || _nonConvertibleUnits[unit] || _nonConvertibleUnits[curUnit]) {
			return curValue;
		}
		isSVG = target.getCTM && _isSVG(target);
		if (unit === "%" && _transformProps[property]) { //transforms are relative to the size of the element itself!
			return _round(curValue / (isSVG ? target.getBBox()[horizontal ? "width" : "height"] : target[measureProperty]) * amount);
		}
		style[horizontal ? "width" : "height"] = amount + (toPixels ? curUnit : unit);
		parent = (unit === "em" && target.appendChild && !isRootSVG) ? target : target.parentNode;
		if (isSVG) {
			parent = (target.ownerSVGElement || {}).parentNode;
		}
		if (!parent || parent === _doc || !parent.appendChild) {
			parent = _doc.body;
		}
		cache = parent._gsap;
		if (cache && unit === "%" && cache.width && horizontal && cache.time === _ticker.time) {
			px = cache.width * curValue / amount;
		} else {
			parent.appendChild(_tempDiv);
			px = _tempDiv[measureProperty];
			parent.removeChild(_tempDiv);
			if (horizontal && unit === "%") {
				cache = parent._gsap = parent._gsap || {};
				cache.time = _ticker.time;
				cache.width = px / curValue * amount;
			}
		}
		return _round(toPixels ? px * curValue / amount : amount / px * curValue);
	},
	_get = (target, property, unit, uncache) => {
		let skipStyle, value;
		if (!_pluginInitted) {
			_initPlugin();
		}
		if (property in _propertyAliases) {
			property = _propertyAliases[property];
			if (~property.indexOf(",")) {
				property = property.split(",")[0];
			}
		}
		if (_transformProps[property]) {
			value = _parseTransform(target, uncache)[property];
			skipStyle = property !== "transformOrigin";
		}
		if (!skipStyle) {
			value = target.style[property];
			if (!value || value === "auto" || uncache) {
				value = _getComputedProperty(target, property) || _getProperty(target, property);
			}
		}
		return unit ? _convertToUnit(target, property, value, unit) + unit : value;

	},
	_tweenComplexCSSString = function(target, prop, start, end) { //note: we call _tweenComplexCSSString.call(pluginInstance...) to ensure that it's scoped properly. We may call it from within a plugin too, thus "this" would refer to the plugin.
		let pt = new PropTween(this._pt, target.style, prop, 0, 1, _renderComplexString),
			index = 0,
			matchIndex = 0,
			a, result,	startValues, startNum, color, startValue, endValue, endNum, chunk, endUnit, startUnit, relative, endValues;
		pt.b = start;
		pt.e = end;
		start += ""; //ensure values are strings
		end += "";
		if (end === "auto") {
			target.style[prop] = end;
			end = _getComputedProperty(target, prop) || end;
			target.style[prop] = start;
		}
		a = [start, end];
		_colorStringFilter(a); //pass an array with the starting and ending values and let the filter do whatever it needs to the values.
		start = a[0];
		end = a[1];
		startValues = start.match(_numWithUnitExp) || [];
		endValues = end.match(_numWithUnitExp) || [];
		if (endValues.length) {
			while ((result = _numWithUnitExp.exec(end))) {
				endValue = result[0];
				chunk = end.substring(index, result.index);
				if (color) {
					color = (color + 1) % 5;
				} else if (chunk.substr(-5) === "rgba(") {
					color = 1;
				}
				if (endValue !== (startValue = startValues[matchIndex++] || "")) {
					startNum = parseFloat(startValue) || 0;
					startUnit = startValue.substr((startNum + "").length);
					relative = (endValue.charAt(1) === "=") ? +(endValue.charAt(0) + "1") : 0;
					if (relative) {
						endValue = endValue.substr(2);
					}
					endNum = parseFloat(endValue);
					endUnit = endValue.substr((endNum + "").length);
					index = _numWithUnitExp.lastIndex - endUnit.length;
					if (!endUnit) { //if something like "perspective:300" is passed in and we must add a unit to the end
						endUnit = endUnit || _config.units[prop] || startUnit;
						if (index === end.length) {
							end += endUnit;
							pt.e += endUnit;
						}
					}
					if (startUnit !== endUnit) {
						startNum = _convertToUnit(target, prop, startValue, endUnit);
					}
					//these nested PropTweens are handled in a special way - we'll never actually call a render or setter method on them. We'll just loop through them in the parent complex string PropTween's render method.
					pt._pt = {
						_next:pt._pt,
						p:(chunk || (matchIndex === 1)) ? chunk : ",", //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
						s:startNum,
						c:relative ? relative * endNum : endNum - startNum,
						m:(color && color < 4) ? Math.round : 0
					};
				}
			}
			pt.c = (index < end.length) ? end.substring(index, end.length) : ""; //we use the "c" of the PropTween to store the final part of the string (after the last number)
		} else {
			pt.r = prop === "display" ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue;
		}
		if (_relExp.test(end)) {
			pt.e = 0; //if the end string contains relative values or dynamic random(...) values, delete the end it so that on the final render we don't actually set it to the string with += or -= characters (forces it to use the calculated value).
		}
		this._pt = pt; //start the linked list with this new PropTween. Remember, we call _tweenComplexCSSString.call(pluginInstance...) to ensure that it's scoped properly. We may call it from within another plugin too, thus "this" would refer to the plugin.
		return pt;
	},
	_keywordToPercent = {top:"0%", bottom:"100%", left:"0%", right:"100%", center:"50%"},
	_convertKeywordsToPercentages = value => {
		let split = value.split(" "),
			x = split[0],
			y = split[1] || "50%";
		if (x === "top" || x === "bottom" || y === "left" || y === "right") { //the user provided them in the wrong order, so flip them
			split = x;
			x = y;
			y = split;
		}
		split[0] = _keywordToPercent[x] || x;
		split[1] = _keywordToPercent[y] || y;
		return split.join(" ");
	},
	_renderClearProps = (ratio, data) => {
		if (data.tween && data.tween._time === data.tween._dur) {
			let target = data.t,
				style = target.style,
				props = data.u,
				prop, clearTransforms, i;
			if (props === "all" || props === true) {
				style.cssText = "";
				clearTransforms = 1;
			} else {
				props = props.split(",");
				i = props.length;
				while (--i > -1) {
					prop = props[i];
					if (_transformProps[prop]) {
						clearTransforms = 1;
						prop = (prop === "transformOrigin") ? _transformOriginProp : _transformProp;
					}
					_removeProperty(target, prop);
				}
			}
			if (clearTransforms) {
				_removeProperty(target, _transformProp);
				clearTransforms = target._gsap;
				if (clearTransforms) {
					if (clearTransforms.svg) {
						target.removeAttribute("transform");
					}
					delete clearTransforms.x;
				}
			}
		}
	},
	// note: specialProps should return 1 if (and only if) they have a non-zero priority. It indicates we need to sort the linked list.
	_specialProps = {
		clearProps(plugin, target, property, endValue, tween) {
			let pt = plugin._pt = new PropTween(plugin._pt, target, property, 0, 0, _renderClearProps);
			pt.u = endValue;
			pt.pr = -10;
			pt.tween = tween;
			plugin._props.push(property);
			return 1;
		}
		/* className feature (about 0.4kb gzipped).
		, className(plugin, target, property, endValue, tween) {
			let _renderClassName = (ratio, data) => {
					data.css.render(ratio, data.css);
					if (!ratio || ratio === 1) {
						let inline = data.rmv,
							target = data.t,
							p;
						target.setAttribute("class", ratio ? data.e : data.b);
						for (p in inline) {
							_removeProperty(target, p);
						}
					}
				},
				_getAllStyles = (target) => {
					let styles = {},
						computed = getComputedStyle(target),
						p;
					for (p in computed) {
						if (isNaN(p) && p !== "cssText" && p !== "length") {
							styles[p] = computed[p];
						}
					}
					_setDefaults(styles, _parseTransform(target, 1));
					return styles;
				},
				startClassList = target.getAttribute("class"),
				style = target.style,
				cssText = style.cssText,
				cache = target._gsap,
				classPT = cache.classPT,
				inlineToRemoveAtEnd = {},
				data = {t:target, plugin:plugin, rmv:inlineToRemoveAtEnd, b:startClassList, e:(endValue.charAt(1) !== "=") ? endValue : startClassList.replace(new RegExp("(?:\\s|^)" + endValue.substr(2) + "(?![\\w-])"), "") + ((endValue.charAt(0) === "+") ? " " + endValue.substr(2) : "")},
				changingVars = {},
				startVars = _getAllStyles(target),
				transformRelated = /(transform|perspective)/i,
				endVars, p;
			if (classPT) {
				classPT.r(1, classPT.d);
				_removeLinkedListItem(classPT.d.plugin, classPT, "_pt");
			}
			target.setAttribute("class", data.e);
			endVars = _getAllStyles(target, true);
			target.setAttribute("class", startClassList);
			for (p in endVars) {
				if (endVars[p] !== startVars[p] && !transformRelated.test(p)) {
					changingVars[p] = endVars[p];
					if (!style[p] && style[p] !== "0") {
						inlineToRemoveAtEnd[p] = 1;
					}
				}
			}
			cache.classPT = plugin._pt = new PropTween(plugin._pt, target, "className", 0, 0, _renderClassName, data, 0, -11);
			if (style.cssText !== cssText) { //only apply if things change. Otherwise, in cases like a background-image that's pulled dynamically, it could cause a refresh. See https://greensock.com/forums/topic/20368-possible-gsap-bug-switching-classnames-in-chrome/.
				style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
			}
			_parseTransform(target, true); //to clear the caching of transforms
			data.css = new gsap.plugins.css();
			data.css.init(target, changingVars, tween);
			plugin._props.push(...data.css._props);
			return 1;
		}
		*/
	},





	/*
	 * --------------------------------------------------------------------------------------
	 * TRANSFORMS
	 * --------------------------------------------------------------------------------------
	 */
	_identity2DMatrix = [1,0,0,1,0,0],
	_rotationalProperties = {},
	_getComputedTransformMatrixAsArray = target => {
		let matrixString = _getComputedProperty(target, _transformProp);
		return (matrixString === "matrix(1, 0, 0, 1, 0, 0)" || matrixString === "none" || !matrixString) ? _identity2DMatrix : matrixString.substr(7).match(_numExp).map(_round);
	},
	_getMatrix = (target, force2D) => {
		let cache = target._gsap,
			style = target.style,
			matrix = _getComputedTransformMatrixAsArray(target),
			parent, nextSibling, temp, addedToDOM;
		if (cache.svg && target.getAttribute("transform")) {
			temp = target.transform.baseVal.consolidate().matrix; //ensures that even complex values like "translate(50,60) rotate(135,0,0)" are parsed because it mashes it into a matrix.
			matrix = [temp.a, temp.b, temp.c, temp.d, temp.e, temp.f];
			return (matrix.join(",") === "1,0,0,1,0,0") ? _identity2DMatrix : matrix;
		} else if (matrix === _identity2DMatrix && !target.offsetParent && target !== _docElement && !cache.svg) { //note: if offsetParent is null, that means the element isn't in the normal document flow, like if it has display:none or one of its ancestors has display:none). Firefox returns null for getComputedStyle() if the element is in an iframe that has display:none. https://bugzilla.mozilla.org/show_bug.cgi?id=548397
			//browsers don't report transforms accurately unless the element is in the DOM and has a display value that's not "none". Firefox and Microsoft browsers have a partial bug where they'll report transforms even if display:none BUT not any percentage-based values like translate(-50%, 8px) will be reported as if it's translate(0, 8px).
			temp = style.display;
			style.display = "block";
			parent = target.parentNode;
			if (!parent || !target.offsetParent) {
				addedToDOM = 1; //flag
				nextSibling = target.nextSibling;
				_docElement.appendChild(target); //we must add it to the DOM in order to get values properly
			}
			matrix = _getComputedTransformMatrixAsArray(target);
			if (temp) {
				style.display = temp;
			} else {
				_removeProperty(target, "display");
			}
			if (addedToDOM) {
				if (nextSibling) {
					parent.insertBefore(target, nextSibling);
				} else if (parent) {
					parent.appendChild(target);
				} else {
					_docElement.removeChild(target);
				}
			}
		}
		return (force2D && matrix.length > 6) ? [matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]] : matrix;
	},
	_applySVGOrigin = (target, origin, originIsAbsolute, smooth, matrixArray, pluginToAddPropTweensTo) => {
		let cache = target._gsap,
			matrix = matrixArray || _getMatrix(target, true),
			xOriginOld = cache.xOrigin || 0,
			yOriginOld = cache.yOrigin || 0,
			xOffsetOld = cache.xOffset || 0,
			yOffsetOld = cache.yOffset || 0,
			a = matrix[0],
			b = matrix[1],
			c = matrix[2],
			d = matrix[3],
			tx = matrix[4],
			ty = matrix[5],
			originSplit = origin.split(" "),
			xOrigin = parseFloat(originSplit[0]) || 0,
			yOrigin = parseFloat(originSplit[1]) || 0,
			bounds, determinant, x, y;
		if (!originIsAbsolute) {
			bounds = _getBBox(target);
			xOrigin = bounds.x + (~originSplit[0].indexOf("%") ? xOrigin / 100 * bounds.width : xOrigin);
			yOrigin = bounds.y + (~((originSplit[1] || originSplit[0]).indexOf("%")) ? yOrigin / 100 * bounds.height : yOrigin);
		} else if (matrix !== _identity2DMatrix && (determinant = (a * d - b * c))) { //if it's zero (like if scaleX and scaleY are zero), skip it to avoid errors with dividing by zero.
			x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + ((c * ty - d * tx) / determinant);
			y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - ((a * ty - b * tx) / determinant);
			xOrigin = x;
			yOrigin = y;
		}
		if (smooth || (smooth !== false && cache.smooth)) {
			tx = xOrigin - xOriginOld;
			ty = yOrigin - yOriginOld;
			cache.xOffset += (tx * a + ty * c) - tx;
			cache.yOffset += (tx * b + ty * d) - ty;
		} else {
			cache.xOffset = cache.yOffset = 0;
		}
		cache.xOrigin = xOrigin;
		cache.yOrigin = yOrigin;
		cache.smooth = !!smooth;
		cache.origin = origin;
		cache.originIsAbsolute = !!originIsAbsolute;
		if (pluginToAddPropTweensTo) {
			_addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOrigin", xOriginOld, xOrigin);
			_addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOrigin", yOriginOld, yOrigin);
			_addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOffset", xOffsetOld, cache.xOffset);
			_addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOffset", yOffsetOld, cache.yOffset);
		}
	},
	_parseTransform = (target, uncache) => {
		let cache = target._gsap || new GSCache(target);
		if ("x" in cache && !uncache) {
			return cache;
		}
		let style = target.style,
			invertedScaleX = cache.scaleX < 0,
			xOrigin = cache.xOrigin || 0,
			yOrigin = cache.yOrigin || 0,
			px = "px",
			deg = "deg",
			x, y, z, scaleX, scaleY, rotation, rotationX, rotationY, skewX, skewY, perspective,
			matrix, angle, cos, sin, a, b, c, d, a12, a22, t1, t2, t3, a13, a23, a33, a42, a43, a32;
		x = y = z = rotation = rotationX = rotationY = skewX = skewY = perspective = 0;
		scaleX = scaleY = 1;
		cache.svg = !!(target.getCTM && _isSVG(target));
		matrix = _getMatrix(target, cache.svg);
		if (cache.svg) {
			_applySVGOrigin(target, _getComputedProperty(target, "transformOrigin") || "0", cache.originIsAbsolute, cache.smooth !== false, matrix);
		}
		if (matrix !== _identity2DMatrix) {
			a = matrix[0]; //a11
			b = matrix[1]; //a21
			c = matrix[2]; //a31
			d = matrix[3]; //a41
			x = a12 = matrix[4];
			y = a22 = matrix[5];

			//2D matrix
			if (matrix.length === 6) {
				scaleX = Math.sqrt(a * a + b * b);
				scaleY = Math.sqrt(d * d + c * c);
				rotation = (a || b) ? _atan2(b, a) * _RAD2DEG : cache.rotation || 0; //note: if scaleX is 0, we cannot accurately measure rotation. Same for skewX with a scaleY of 0. Therefore, we default to the previously recorded value (or zero if that doesn't exist).
				skewX = (c || d) ? _atan2(c, d) * _RAD2DEG + rotation : cache.skewX || 0;
				if (cache.svg) {
					x -= xOrigin - (xOrigin * a + yOrigin * c);
					y -= yOrigin - (xOrigin * b + yOrigin * d);
				}

				//3D matrix
			} else {
				a32 = matrix[6];
				a42 = matrix[7];
				a13 = matrix[8];
				a23 = matrix[9];
				a33 = matrix[10];
				a43 = matrix[11];
				x = matrix[12];
				y = matrix[13];
				z = matrix[14];

				angle = _atan2(a32, a33);
				rotationX = angle * _RAD2DEG;
				//rotationX
				if (angle) {
					cos = Math.cos(-angle);
					sin = Math.sin(-angle);
					t1 = a12*cos+a13*sin;
					t2 = a22*cos+a23*sin;
					t3 = a32*cos+a33*sin;
					a13 = a12*-sin+a13*cos;
					a23 = a22*-sin+a23*cos;
					a33 = a32*-sin+a33*cos;
					a43 = a42*-sin+a43*cos;
					a12 = t1;
					a22 = t2;
					a32 = t3;
				}
				//rotationY
				angle = _atan2(-c, a33);
				rotationY = angle * _RAD2DEG;
				if (angle) {
					cos = Math.cos(-angle);
					sin = Math.sin(-angle);
					t1 = a*cos-a13*sin;
					t2 = b*cos-a23*sin;
					t3 = c*cos-a33*sin;
					a43 = d*sin+a43*cos;
					a = t1;
					b = t2;
					c = t3;
				}
				//rotationZ
				angle = _atan2(b, a);
				rotation = angle * _RAD2DEG;
				if (angle) {
					cos = Math.cos(angle);
					sin = Math.sin(angle);
					t1 = a*cos+b*sin;
					t2 = a12*cos+a22*sin;
					b = b*cos-a*sin;
					a22 = a22*cos-a12*sin;
					a = t1;
					a12 = t2;
				}

				if (rotationX && Math.abs(rotationX) + Math.abs(rotation) > 359.9) { //when rotationY is set, it will often be parsed as 180 degrees different than it should be, and rotationX and rotation both being 180 (it looks the same), so we adjust for that here.
					rotationX = rotation = 0;
					rotationY = 180 - rotationY;
				}
				scaleX = _round(Math.sqrt(a * a + b * b + c * c));
				scaleY = _round(Math.sqrt(a22 * a22 + a32 * a32));
				angle = _atan2(a12, a22);
				skewX = (Math.abs(angle) > 0.0002) ? angle * _RAD2DEG : 0;
				perspective = a43 ? 1 / ((a43 < 0) ? -a43 : a43) : 0;
			}

		}

		if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) {
			if (invertedScaleX) {
				scaleX *= -1;
				skewX += (rotation <= 0) ? 180 : -180;
				rotation += (rotation <= 0) ? 180 : -180;
			} else {
				scaleY *= -1;
				skewX += (skewX <= 0) ? 180 : -180;
			}
		}

		cache.x = x + px;
		cache.y = y + px;
		cache.z = z + px;
		cache.scaleX = _round(scaleX);
		cache.scaleY = _round(scaleY);
		cache.rotation = _round(rotation) + deg;
		cache.rotationX = _round(rotationX) + deg;
		cache.rotationY = _round(rotationY) + deg;
		cache.skewX = skewX + deg;
		cache.skewY = skewY + deg;
		cache.transformPerspective = perspective + px;
		cache.xPercent = cache.yPercent = cache.xOffset = cache.yOffset = 0;
		cache.force3D = _config.force3D;
		cache.renderTransform = cache.svg ? _renderSVGTransforms : _supports3D ? _renderCSSTransforms : _renderNon3DTransforms;
		if (cache.svg && style[_transformProp]) {
			gsap.delayedCall(0.001, () => _removeProperty(target, _transformProp)); //if we apply this right away (before anything has rendered), we risk there being no transforms for a brief moment and it also interferes with adjusting the transformOrigin in a tween with immediateRender:true (it'd try reading the matrix and it wouldn't have the appropriate data in place because we just removed it).
		}

		return cache;
	},
	_renderNon3DTransforms = (ratio, cache) => {
		cache.z = "0px";
		cache.rotationY = cache.rotationX = "0deg";
		cache.force3D = 0;
		_renderCSSTransforms(ratio, cache);
	},
	_renderCSSTransforms = (ratio, cache) => {
		let {xPercent, yPercent, x, y, z, rotation, rotationY, rotationX, skewX, skewY, scaleX, scaleY, transformPerspective, force3D, target} = cache,
			transforms = "",
			zeroDeg = "0deg",
			endParenthesis = ") ",
			use3D = (force3D === "auto" && ratio && ratio !== 1),
			zeroPx = "0px";
		if (xPercent || yPercent) {
			transforms = "translate(" + xPercent + "%, " + yPercent + "%) ";
		}
		if (use3D || x !== zeroPx || y !== zeroPx || z !== zeroPx) {
			transforms += (z !== zeroPx || use3D) ? "translate3d(" + x + ", " + y + ", " + z + ") " : "translate(" + x + ", " + y + endParenthesis;
		}
		if (transformPerspective !== zeroPx) {
			transforms += "perspective(" + transformPerspective + endParenthesis;
		}
		if (rotation !== zeroDeg) {
			transforms += "rotate(" + rotation + endParenthesis;
		}
		if (rotationY !== zeroDeg) {
			transforms += "rotateY(" + rotationY + endParenthesis;
		}
		if (rotationX !== zeroDeg) {
			transforms += "rotateX(" + rotationX + endParenthesis;
		}
		if (skewX !== zeroDeg || skewY !== zeroDeg) {
			transforms += "skew(" + skewX + ", " + skewY + endParenthesis;
		}
		if (scaleX !== 1 || scaleY !== 1) {
			transforms += "scale(" + scaleX + ", " + scaleY + endParenthesis;
		}
		target.style[_transformProp] = transforms || "translate(0, 0)";
	},
	_renderSVGTransforms = (ratio, cache) => {
		let {xPercent, yPercent, x, y, rotation, skewX, skewY, scaleX, scaleY, target, xOrigin, yOrigin, xOffset, yOffset} = cache,
			tx = parseFloat(x),
			ty = parseFloat(y),
			a11, a21, a12, a22, temp;
		rotation = parseFloat(rotation);
		skewX = parseFloat(skewX);
		skewY = parseFloat(skewY);
		if (skewY) { //for performance reasons, we combine all skewing into the skewX and rotation values. Remember, a skewY of 10 degrees looks the same as a rotation of 10 degrees plus a skewX of 10 degrees.
			skewY = parseFloat(skewY);
			skewX += skewY;
			rotation += skewY;
		}
		if (rotation || skewX) {
			rotation *= _DEG2RAD;
			skewX *= _DEG2RAD;
			a11 = Math.cos(rotation) * scaleX;
			a21 = Math.sin(rotation) * scaleX;
			a12 = Math.sin(rotation - skewX) * -scaleY;
			a22 = Math.cos(rotation - skewX) * scaleY;
			if (skewX) {
				skewY *= _DEG2RAD;
				temp = Math.tan(skewX - skewY);
				temp = Math.sqrt(1 + temp * temp);
				a12 *= temp;
				a22 *= temp;
				if (skewY) {
					temp = Math.tan(skewY);
					temp = Math.sqrt(1 + temp * temp);
					a11 *= temp;
					a21 *= temp;
				}
			}
			a11 = _round(a11);
			a21 = _round(a21);
			a12 = _round(a12);
			a22 = _round(a22);
		} else {
			a11 = scaleX;
			a22 = scaleY;
			a21 = a12 = 0;
		}
		if ((tx && !~x.indexOf("px")) || (ty && !~y.indexOf("px"))) {
			tx = _convertToUnit(target, "x", x, "px");
			ty = _convertToUnit(target, "y", y, "px");
		}
		if (xOrigin || yOrigin || xOffset || yOffset) {
			tx = _round(tx + xOrigin - (xOrigin * a11 + yOrigin * a12) + xOffset);
			ty = _round(ty + yOrigin - (xOrigin * a21 + yOrigin * a22) + yOffset);
		}
		if (xPercent || yPercent) {
			//The SVG spec doesn't support percentage-based translation in the "transform" attribute, so we merge it into the translation to simulate it.
			temp = target.getBBox();
			tx = _round(tx + xPercent / 100 * temp.width);
			ty = _round(ty + yPercent / 100 * temp.height);
		}
		target.setAttribute("transform", "matrix(" + a11 + "," + a21 + "," + a12 + "," + a22 + "," + tx + "," + ty + ")");
	},
	_addRotationalPropTween = function(plugin, target, property, startNum, endValue, relative) {
		let cap = 360,
			isString = _isString(endValue),
			endNum = parseFloat(endValue) * ((isString && ~endValue.indexOf("rad")) ? _RAD2DEG : 1),
			change = relative ? endNum * relative : endNum - startNum,
			finalValue = (startNum + change) + "deg",
			direction, pt;
		if (isString) {
			direction = endValue.split("_")[1];
			if (direction === "short") {
				change %= cap;
				if (change !== change % (cap / 2)) {
					change += (change < 0) ? cap : -cap;
				}
			}
			if (direction === "cw" && change < 0) {
				change = ((change + cap * _bigNum) % cap) - ~~(change / cap) * cap;
			} else if (direction === "ccw" && change > 0) {
				change = ((change - cap * _bigNum) % cap) - ~~(change / cap) * cap;
			}
		}
		plugin._pt = pt = new PropTween(plugin._pt, target, property, startNum, change, _renderPropWithEnd);
		pt.e = finalValue;
		pt.u = "deg";
		plugin._props.push(property);
		return pt;
	},
	_addRawTransformPTs = (plugin, transforms, target) => { //for handling cases where someone passes in a whole transform string, like transform: "scale(2, 3) rotate(20deg) translateY(30em)"
		let style = _tempDivStyler.style,
			startCache = target._gsap,
			endCache, p, startValue, endValue, startNum, endNum, startUnit, endUnit;
		style.cssText = getComputedStyle(target).cssText + ";position:absolute;display:block;"; //%-based translations will fail unless we set the width/height to match the original target (and padding/borders can affect it)
		style[_transformProp] = transforms;
		_doc.body.appendChild(_tempDivStyler);
		endCache = _parseTransform(_tempDivStyler, 1);
		for (p in _transformProps) {
			startValue = startCache[p];
			endValue = endCache[p];
			if (startValue !== endValue && p !== "perspective") { //tweening to no perspective gives very unintuitive results - just keep the same perspective in that case.
				startUnit = _getUnit(startValue);
				endUnit = _getUnit(endValue);
				startNum = (startUnit !== endUnit) ?_convertToUnit(target, p, startValue, endUnit) : parseFloat(startValue);
				endNum = parseFloat(endValue);
				plugin._pt = new PropTween(plugin._pt, startCache, p, startNum, endNum - startNum, _renderCSSProp);
				plugin._pt.u = endUnit;
				plugin._props.push(p);
			}
		}
		_doc.body.removeChild(_tempDivStyler);
	};




export const CSSPlugin = {
	name:"css",
	register:_initPlugin,
	targetTest(target) {
		return target.style && target.nodeType;
	},
	init(target, vars, tween, index, targets) {
		let props = this._props,
			style = target.style,
			startValue, endValue, endNum, startNum, type, specialProp, p, startUnit, endUnit, relative, isTransformRelated, transformPropTween, cache, smooth, hasPriority;
		if (!_pluginInitted) {
			_initPlugin();
		}
		for (p in vars) {
			if (p === "autoRound") {
				continue;
			}
			endValue = vars[p];
			if (_plugins[p] && _checkPlugin(p, vars, tween, index, target, targets)) { //plugins
				continue;
			}
			type = typeof(endValue);
			specialProp = _specialProps[p];
			if (type === "function") {
				endValue = endValue.call(tween, index, target, targets);
				type = typeof(endValue);
			}
			if (type === "string" && ~endValue.indexOf("random(")) {
				endValue = _replaceRandom(endValue);
			}
			if (specialProp) {
				if (specialProp(this, target, p, endValue, tween)) {
					hasPriority = 1;
				}
			} else if (p.substr(0,2) === "--") { //CSS variable
				this.add(style, "setProperty", getComputedStyle(target).getPropertyValue(p) + "", endValue + "", index, targets, 0, 0, p);
			} else {
				startValue = _get(target, p);
				startNum = parseFloat(startValue);
				relative = (type === "string" && endValue.charAt(1) === "=") ? +(endValue.charAt(0) + "1") : 0;
				if (relative) {
					endValue = endValue.substr(2);
				}
				endNum = parseFloat(endValue);
				if (p in _propertyAliases) {
					if (p === "autoAlpha") { //special case where we control the visibility along with opacity. We still allow the opacity value to pass through and get tweened.
						if (startNum === 1 && _get(target, "visibility") === "hidden" && endNum) { //if visibility is initially set to "hidden", we should interpret that as intent to make opacity 0 (a convenience)
							startNum = 0;
						}
						_addNonTweeningPT(this, style, "visibility", startNum ? "inherit" : "hidden", endNum ? "inherit" : "hidden", !endNum);
					}
					if (p !== "scale") {
						p = _propertyAliases[p];
						if (~p.indexOf(",")) {
							p = p.split(",")[0];
						}
					}
				}

				isTransformRelated = (p in _transformProps);

				//--- TRANSFORM-RELATED ---
				if (isTransformRelated) {
					if (!transformPropTween) {
						cache = target._gsap;
						smooth = (vars.smoothOrigin !== false && cache.smooth);
						transformPropTween = this._pt = new PropTween(this._pt, style, _transformProp, 0, 1, cache.renderTransform, cache); //the first time through, create the rendering PropTween so that it runs LAST (in the linked list, we keep adding to the beginning)
						transformPropTween.dep = 1; //flag it as dependent so that if things get killed/overwritten and this is the only PropTween left, we can safely kill the whole tween.
					}
					if (p === "scale") {
						this._pt = new PropTween(this._pt, target, "scale", startNum, relative ? relative * endNum : endNum - startNum, 0, 0, _setterScale);
						props.push("scale");
						continue;
					} else if (p === "transformOrigin") {
						endValue = _convertKeywordsToPercentages(endValue); //in case something like "left top" or "bottom right" is passed in. Convert to percentages.
						if (cache.svg) {
							_applySVGOrigin(target, endValue, 0, smooth, 0, this);
						} else {
							_addNonTweeningPT(this, style, p, startValue, endValue);
						}
						continue;
					} else if (p === "svgOrigin") {
						_applySVGOrigin(target, endValue, 1, smooth, 0, this);
						continue;
					} else if (p in _rotationalProperties) {
						_addRotationalPropTween(this, cache, p, startNum, endValue, relative);
						continue;

					} else if (p === "smoothOrigin") {
						_addNonTweeningPT(this, cache, "smooth", cache.smooth, endValue);
						continue;
					} else if (p === "force3D") {
						cache[p] = endValue;
						continue;
					} else if (p === "transform") {
						_addRawTransformPTs(this, endValue, target);
						continue;
					}
				}

				if (isTransformRelated || ((endNum || endNum === 0) && (startNum || startNum === 0) && !_complexExp.test(endValue) && (p in style))) {
					startUnit = (startValue + "").substr((startNum + "").length);
					endUnit = (endValue + "").substr((endNum + "").length) || ((p in _config.units) ? _config.units[p] : startUnit);
					if (startUnit !== endUnit) {
						startNum = _convertToUnit(target, p, startValue, endUnit);
					}
					//console.log(p, startNum, startUnit, "to", endNum, endUnit);
					this._pt = new PropTween(this._pt, isTransformRelated ? cache : style, p, startNum, relative ? relative * endNum : endNum - startNum, (endUnit === "px" && vars.autoRound !== false && !isTransformRelated) ? _renderRoundedCSSProp : _renderCSSProp);
					this._pt.u = endUnit || 0;
					if (startUnit !== endUnit) { //when the tween goes all the way back to the beginning, we need to revert it to the OLD/ORIGINAL value (with those units). We record that as a "b" (beginning) property and point to a render method that handles that. (performance optimization)
						this._pt.b = startValue;
						this._pt.r = _renderCSSPropWithBeginning;
					}
				} else if (!(p in style)) {
					if (p in target) { //maybe it's not a style - it could be a property added directly to an element in which case we'll try to animate that.
						this.add(target, p, target[p], endValue, index, targets);
					} else {
						_warn("Invalid " + p + " tween " + endValue + ". Missing a plugin? gsap.registerPlugin()");
						continue;
					}
				} else {
					_tweenComplexCSSString.call(this, target, p, startValue, endValue);
				}
				props.push(p);
			}
		}
		if (hasPriority) {
			_sortPropTweensByPriority(this);
		}

	},
	get:_get,
	aliases:_propertyAliases,
	getSetter(target, property, plugin) { //returns a setter function that accepts target, property, value and applies it accordingly. Remember, properties like "x" aren't as simple as target.style.property = value because they've got to be applied to a proxy object and then merged into a transform string in a renderer.
		return (property in _transformProps && property !== _transformOriginProp && (target._gsap.x || _get(target, "x"))) ? (plugin && _recentSetterPlugin === plugin ? (property === "scale" ? _setterScale : _setterTransform) : (_recentSetterPlugin = plugin || {}) && (property === "scale" ? _setterScaleWithRender : _setterTransformWithRender)) : target.style && !_isUndefined(target.style[property]) ? _setterCSSStyle : ~property.indexOf("-") ? _setterCSSProp : _getSetter(target, property);
	}

};

gsap.utils.checkPrefix = _checkPropPrefix;
(function(positionAndScale, rotation, others, aliases) {
	let all = _forEachName(positionAndScale + "," + rotation + "," + others, name => {_transformProps[name] = 1});
	_forEachName(rotation, name => {_config.units[name] = "deg"; _rotationalProperties[name] = 1});
	_propertyAliases[all[13]] = positionAndScale + "," + rotation;
	_forEachName(aliases, name => {
		let split = name.split(":");
		_propertyAliases[split[1]] = all[split[0]];
	});
})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,9:rotateX,10:rotateY");
_forEachName("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", name => {_config.units[name] = "px"});

gsap.registerPlugin(CSSPlugin);

export { CSSPlugin as default, _getBBox, _createElement };