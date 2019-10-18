// WIP!!! We will be filling this in...

declare namespace GSAPStatic {

  /**
   * Base class for Tween and Timeline classes.
   *
   * @class Animation
   */
  class Animation {

		/**
		 * A place to store any data you want (initially populated with vars.data if it exists)
		 *
		 * @member {Animation}
		 * @default undefined
		 */
		data: object;

    /**
     * Creates an instance of Animation.
     *
     * @param {object} vars
     * @param {number} [time]
     * @memberof Animation
     */
    constructor(vars: object, time?: number);


		/**
     * Gets the animation's initial delay which is the length of time in seconds before the animation should begin.
     *
     * @returns {number} The progress value
     * @memberof Animation
     */
    delay(): number;

    /**
     * Sets the animation's initial delay which is the length of time in seconds before the animation should begin.
     *
     * @param {number} value - Delay value
     * @returns {this} Returns self, useful for chaining.
     * @memberof Animation
     */
    delay(value: number): this;

    /**
     * Gets the animation's progress which is a value between 0 and 1 indicating the position of the virtual
     * playhead (excluding repeats) where 0 is at the beginning, 0.5 is halfway complete, and 1 is complete.
     *
     * @returns {number} The progress value
     * @memberof Animation
     */
    progress(): number;

    /**
     * Sets the animation's progress which is a value between 0 and 1 indicating the position of the virtual
     * playhead (excluding repeats) where 0 is at the beginning, 0.5 is halfway complete, and 1 is complete.
     *
     * @param {number} value - Progress value
     * @param {boolean} [supressEvents=false] - (default = false) If true, no events or callbacks will be triggered when the playhead moves to the new position.
     * @returns {this} Returns self, useful for chaining.
     * @memberof Animation
     */
    progress(value: number, supressEvents?: boolean): this;
  }

  /**
   * Tween description
   *
   * @class Tween
   * @extends {Animation}
   */
  class Tween extends Animation {

		/**
		 * The vars object passed into the constructor
		 *
		 * @member {Tween}
		 * @default {duration: 0.5, overwrite: false, delay: 0, ease: "power2.out"}
		 */
		vars: number;

    /**
     * Creates a Tween animating to destination values that are set.
     *
     * @static
     * @returns {Tween}
     * @memberof Tween
     */
	  static to(targets: any, duration: number, vars: object, position?: number|string): Tween;
    static to(targets: any, vars: object, position?: number|string): Tween;
  }

  /**
   * Timelines are essentially chains of tweens (.to, from, fromTo, etc.) calls. They are the ultimate
	 * sequencing tool that acts like a container for tweens and other timelines, making it simple to control
	 * them as a whole and precisely manage their timing.
   *
   * @class Timeline
   * @extends {Animation}
   */
  class Timeline extends Animation {

		/**
		 * If true, child tweens and timelines will be removed as soon as they complete
		 *
		 * @member {Timeline}
		 * @default false, except on the root timeline(s)
		 */
		autoRemoveChildren: boolean;

		/**
		 * Stores any labels that have been added to the timeline.
		 *
		 * @member {Timeline}
		 * @default {}
		 */
		labels: object;

		/**
		 * Controls whether or not child tweens and timelines are repositioned automatically (changing their startTime) in order to maintain smooth playback when properties are changed on-the-fly.
		 *
		 * @member {Timeline}
		 * @default false, except on the root timeline(s)
		 */
		smoothChildTiming: boolean;





		/**
	   * Adds a tween, timeline, callback, or label (or an array of them) to the timeline.
	   *
	   * @returns {Timeline}
	   * @memberof Timeline
	   */
		add(value: Tween|Timeline|string|function|array, position?: number|string, align?: string, stagger?: number|string): this;

		/**
	   * Adds a label to the timeline, making it easy to mark important positions/times.
	   *
	   * @returns {Timeline}
	   * @memberof Timeline
	   */
		addLabel(label: string, position?: number|string): this;

		/**
	   * Inserts a special callback that pauses playback of the timeline at a particular time or label.
	   *
	   * @returns {Timeline}
	   * @memberof Timeline
	   */
		addPause(position?: number|string, callback?: function, params?: array): this;

	  /**
	   * Creates a Tween animating to destination values that are set.
	   *
	   * @returns {Timeline}
	   * @memberof Timeline
	   */
		to(targets: any, duration: number, vars: object, position?: number|string): this;
    to(targets: any, vars: object, position?: number|string): this;
  }

  interface gsap {

    /**
     * Creates an animation
     *
     * ```js
     *  var tween = gsap.to(".class", { x: 100 });
     * ```
     *
     * @param {*} targets
     * @param {object} vars
     * @returns {Tween} Tween instance
     * @memberof gsap
     */
    to(targets: any, vars: object): Tween;

    /**
     *
     *
     * @param {object} [vars]
     * @returns {Timeline} Timeline instance
     * @memberof gsap
     */
    timeline(vars?: object): Timeline;
  }

  const gsap: gsap;
}

declare const gsap: GSAPStatic.gsap;
declare const TweenLite: typeof GSAPStatic.Tween;
declare const TweenMax: typeof GSAPStatic.Tween;
declare const TimelineLite: typeof GSAPStatic.Timeline;
declare const TimelineMax: typeof GSAPStatic.Timeline;

declare module "gsap" {

  const gsap: GSAPStatic.gsap;
  const TweenLite: typeof GSAPStatic.Tween;
  const TweenMax: typeof GSAPStatic.Tween;
  const TimelineLite: typeof GSAPStatic.Timeline;
  const TimelineMax: typeof GSAPStatic.Timeline;

  export {
    gsap,
    gsap as default,
    TweenLite,
    TweenMax,
    TimelineLite,
    TimelineMax
  }
}
