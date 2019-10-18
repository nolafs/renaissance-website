import { gsap, Power0, Power1, Power2, Power3, Power4, Linear, Quad, Cubic, Quart, Quint, Strong, Elastic, Back, SteppedEase, Bounce, Sine, Expo, Circ, TweenMax, TweenLite, TimelineLite, TimelineMax } from "./gsap-core.js";
import { CSSPlugin } from "./CSSPlugin.js";
import { MotionPathPlugin } from "./MotionPathPlugin.js";
import { PixiPlugin } from "./PixiPlugin.js";
import { Draggable } from "./Draggable.js";
import { EasePack, ExpoScaleEase, RoughEase, SlowMo } from "./EasePack.js";
import { ScrollToPlugin } from "./ScrollToPlugin.js";

//BONUS IMPORTS
import { CustomBounce } from "./CustomBounce.js";
import { CustomEase } from "./CustomEase.js";
import { CustomWiggle } from "./CustomWiggle.js";
import { DrawSVGPlugin } from "./DrawSVGPlugin.js";
import { InertiaPlugin } from "./InertiaPlugin.js";
import { VelocityTracker } from "./utils/VelocityTracker.js";
import { MorphSVGPlugin } from "./MorphSVGPlugin.js";
import { MotionPathHelper } from "./MotionPathHelper.js";
import { ScrambleTextPlugin } from "./ScrambleTextPlugin.js";
import { SplitText } from "./SplitText.js";

gsap.registerPlugin(CSSPlugin);

export {

	//-- CORE --
	gsap,
	gsap as default,
	CSSPlugin,
	TweenMax,
	TweenLite,
	TimelineMax,
	TimelineLite,
	Power0,
	Power1,
	Power2,
	Power3,
	Power4,
	Linear,
	Quad,
	Cubic,
	Quart,
	Quint,
	Strong,
	Elastic,
	Back,
	SteppedEase,
	Bounce,
	Sine,
	Expo,
	Circ,

	//-- PLUGINS --
	Draggable,
	MotionPathPlugin,
	PixiPlugin,
	ScrollToPlugin,

	//-- EASE PACK --
	ExpoScaleEase,
	RoughEase,
	SlowMo,
	EasePack,


	//-- BONUS --
	CustomBounce,
	CustomEase,
	CustomWiggle,
	DrawSVGPlugin,
	InertiaPlugin,
	MorphSVGPlugin,
	MotionPathHelper,
	ScrambleTextPlugin,
	SplitText,
	VelocityTracker

};