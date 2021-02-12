/**
 * @license MIT
 * @author ProgramistaZpolski
 */

"use strict";

/**
 * @alias HTMLElement.addEventListener
 * @public
 */

HTMLElement.prototype.on = HTMLElement.prototype.addEventListener;


/**
 * @var {Object} pzpl__state Specifies the current state of the application
 * @public
 */

let pzpl__state = {};


/**
 * @function pzpl The main handler for the application	
 * @param {Object} feedback Specified feedback from an event
 * @public
 * @name pzpl
 */

function pzpl(feedback) {

	/**
	 * @function pzpl__ Selects elements and runs a specified callback
	 * @param {String} selector Selects all elements that match the query
	 * @param {Function} callback Runs a function for every matched element
	 * @borrows from Kasztanwire - The shortcut for looping on every matched element 
	 * @access private
	*/

	function pzpl__(selector, callback) {
		document.querySelectorAll(selector).forEach(el => callback(el));
	};

	/**
	 * @function b Builds a data attribute
	 * @param {String} name The name to get a data param from
	 * @access private
	*/

	const b = name => {
		return `data-pzpl-${name}`;
	};

	/**
	 * @private
	 * @constant {Object} triggers A set of functions to execute after an update
	 */

	const triggers = {

		/**
		 * @param {Function} callback A piece of code to execute for every matched element
		 * @function counterLookup An internal function for handling counter lookups
		 * @returns {any} A retured value from a callback
		 * @param {String} sel A querySelectorAll String
		 */

		counterLookup: function (sel, callback) {
			return pzpl__(sel, el => callback(el));
		},

		/**
		 * @param {Number} stateItem A counter from the state of the website
		 * @param {String} name The name of the counter
		 * @function CounterRefresher Refreshes all instances of a specified counter
		 * @returns {Number} A counter from the state of the website
		 */

		CounterRefresher: function (stateItem, name) {
			this.counterLookup(`img[${b("src")}="${name}"]`, el => {
				el.src = el.src.replace(/[0-9]/g, stateItem);
			});

			this.counterLookup(`[${b("count-text")}="${name}"]`, el => {
				el.innerText = stateItem;
			});
			return stateItem;
		}
	};

	if (!feedback) {

		/**
		 * @param {HTMLElement} el Every matched element
		 */

		pzpl__(`input[type='text'][${b("value")}],
		input[type='range'][${b("value")}], 
		input[type='tel'][${b("value")}], 
		input[type='email'][${b("value")}], 
		input[type='password'][${b("value")}], 
		select[${b("value")}]`, el => {

			/**
			 * @param {Event} e an event from an html element
			 */

			el.on("input", e => {
				pzpl(e);
			});
		});

		pzpl__(`input[type="checkbox"][${b("value")}]`, el => {
			el.on("click", e => {

				/**
				 * @var {Object} eTemp Emulates a Object from the response from an event
				 * @summary This function handles checkboxes, as normally they will output "on" even when they are off.
				 */

				let eTemp = {
					target: {
						dataset: e.target.dataset,
						value: e.target.checked ? "on" : "off"
					}
				};
				pzpl(eTemp);
			});
		});

		pzpl__(`[${b("up")}], [${b("down")}]`, el => {
			/**
			 * @todo Handle more events
			 * @summary Handle increasing the counter for buttons
			 */
			el.on("click", e => {
				pzpl(e);
			});
		});

		pzpl__(`[${b("for")}]`, el => {
			/**
			 * @todo Makke it better
			 * @summary Handle templating
			 */

			const data = JSON.parse(el.dataset.pzplFor.replaceAll("'", "\""));
			const el2 = el.querySelector("[data-slot]");
			data.forEach(el3 => {
				let temp = el2.cloneNode(true);
				temp.innerText = el3[temp.dataset.slot];
				el.innerHTML += temp.outerHTML;
			});
			el.querySelector(":nth-child(1)").remove();
		});
	} else {

		/**
		 * @constant {Object} ftarget The target element of the feedback object
		 */

		const ftarget = feedback.target;

		if (ftarget.dataset.pzplUp) {

			/**
			 * @summary Handle the up event (Increase a counter)
			 * @constant {Number} up A shortcut for the data-pzpl-up value
			 */

			const up = ftarget.dataset.pzplUp;
			if (pzpl__state[up]) {
				pzpl__state[up]++;
			} else {
				pzpl__state[up] = 1;
			};

			triggers.CounterRefresher(pzpl__state[up], up);
		} else if (ftarget.dataset.pzplDown) {

			/**
			 * @summary Handle the down event (Decrease a counter)
			 * @constant {Number} down A shortcut for the data-pzpl-up value
			 */

			const up = ftarget.dataset.pzplDown;
			if (pzpl__state[up] || pzpl__state[up] < 1) {
				pzpl__state[up]--;
			} else {
				pzpl__state[up] = 0;
			};

			triggers.CounterRefresher(pzpl__state[up], up);
		};

		/**
		 * @constant {String} data Get the data-pzpl-value attribute from an HTML element
		 * @var {String} state Gets the current element from the state object  
		 * @summary Here we are handling any events from HTML elements
		 */

		const data = ftarget.dataset.pzplValue;
		let state = pzpl__state[data];
		state = ftarget.value;
		pzpl__(`[${b("text")}="${data}"]`, el => {

			/**
			 * @summary Update the text of an element
			 * @param {HTMLElement} el A HTML Element
			 */

			if (el.dataset.pzplPassword === "") {

				/**
				 * @var {String} temp The censored password
				 * @private
				 */

				let temp = "";
				[...state].forEach(() => temp += "*");
				el.innerText = temp;
			} else {
				el.innerText = state;
			}

		});

		pzpl__(`[${b("html")}="${data}"]`, el => {

			/**
			 * @summary Update the text of an element
			 * @param {HTMLElement} el A HTML Element
			 */

			el.innerHTML = state;

		});

		pzpl__(`[${b("value")}="${data}"]`, el => {

			/**
			 * @param {HTMLElement} el A HTML Element
			 * @summary Update the value of an input element
			 */

			el.value = state;
		});

		/**
		 * @param {HTMLElement} el A HTML Element
		 * @summary Plays the audio if the state is true
		 */

		pzpl__(`audio[${b("bind")}="${data}"]`, el => {
			if (state === "off" || state === false) {
				el.pause();
			} else {
				el.play();
			};
		});

		pzpl__(`[${b("if")}="${data}"]`, el => {
			if (state === "off" || state === false) {
				el.style.display = "none";
			} else {
				el.style.display = "block" ?? el.dataset.pzplDisplayMode;
			};
		});
	};
};

pzpl();
