(function(window, document, undefined) {

    /**
     * rAF shim
     * RequestAnimation polyfill by Erik Möller, Paul Irish and Tino Zijdel
     * https://gist.github.com/paulirish/1579671
     */
    (function(){
        var lastTime = 0;
        var vendors = ["ms", "moz", "webkit", "o"];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+"RequestAnimationFrame"];
            window.cancelAnimationFrame = window[vendors[x]+"CancelAnimationFrame"] 
                                       || window[vendors[x]+"CancelRequestAnimationFrame"];
        }
     
        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
                  timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
     
        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    });

    /**
     * Back to top button
     * 
     * @description           Allow users navigate back to top by clicking "to top" button
     * @param {HTMLelement}   "to top" button"s wrapper
     * @param {HTMLelement}   "to top" button itself
     */
    (function(container, button){

        var breakPoint = 400; // the button will appear passed this point
        var isVisible = false;

        // add event to "to top" button
        button.addEventListener("click", function(event) {
            event.preventDefault();
            scrollToY(0);
        });

        // make button appear only below the given scroll breakpoint
        window.addEventListener("scroll", toggleButton);

        // toggle the button
        // @return {undefined}
        function toggleButton() {
            var scrollTop = window.scrollY || document.documentElement.scrollTop;

            if (scrollTop > breakPoint) {
                if (!isVisible) {
                    container.className = "is-visible";
                    isVisible = true;
                }
            } else {
                if (isVisible) {
                    container.className = "";
                    isVisible = false;
                }
            }
        }

    })(document.getElementById("backToTop"), document.getElementById("backToTopButton"));

    /**
     * Continue button
     * 
     * @description           Allow users jump to `#introduction` section by clicking "continue" button
     * @param {HTMLelement}   "continue" button
     */
    (function(button) {

        button.addEventListener("click", function(event) {
            event.preventDefault();
            scrollToY(document.getElementById("introduction").offsetTop, 500);
        });

    })(document.getElementById("continueButton"));

    /**
     * scrollToY
     * http://stackoverflow.com/questions/8917921/cross-browser-javascript-not-jquery-scroll-to-top-animation#answer-26808520
     * CC BY-SA 3.0
     * 
     * @description           Scroll to a vertical position with a nice animation.
     *                        The animation uses requestAnimationFrame. Might need some polyfill. (see rAF shim)
     * @param {Number}        Target position (in pixels)
     * @param {Number}        Duration of animation (in miliseconds)
     */
    function scrollToY(pos, timing) {

        var scrollTop = window.scrollY || document.documentElement.scrollTop;
        var destination = pos || 0;
        var duration = timing || 1000;
        var time = Math.max(0.1, Math.min(Math.abs(scrollTop - destination) / duration, 0.8)); // min time .1, max time .8 seconds
        var currentTime = 0;

        // animation loop
        // @return {undefined}
        (function tick() {
            currentTime += 1 / 60;

            var p = currentTime / time;
            var t = Math.pow(p, 3); // easeInCubic

            if (p < 1) {
                window.requestAnimationFrame(tick);
                window.scrollTo(0, scrollTop + ((destination - scrollTop) * t));
            }
            else {
                window.scrollTo(0, destination);
            }
        })();

    }

    /**
     * dropodown
     * 
     * @description           Make a simple and classic dropdown menu
     * @param {Nodelist}      All dropdown trigger elements
     */
    (function(triggers) {

        // Dropdown object
        var DropdownObj = function(el) {
            this.container = el.parentElement;
            this.trigger = el;
            this.panel = el.nextElementSibling;
            this.isOpen = false;

            var self = this;

            // add toggle event
            this.trigger.addEventListener("click", function(event) {
                event.preventDefault();

                if (self.isOpen) {
                    self.hide();
                } else {
                    self.show();

                    // clicking anywhere else on the page will close all open dropdown menus
                    document.addEventListener("click", function(event) {
                        if (!self.container.contains(event.target)) {
                            self.hide();
                        }
                    });
                }
            });
        };

        // show, hide events
        DropdownObj.prototype = {
            show: function() {
                this.trigger.classList.add("is-triggered");
                this.trigger.setAttribute("aria-expanded", "true");
                this.panel.classList.add("is-expanded");
                this.isOpen = true;
            },
            hide: function() {
                this.trigger.classList.remove("is-triggered");
                this.trigger.setAttribute("aria-expanded", "false");
                this.panel.classList.remove("is-expanded");
                this.isOpen = false;
            }
        };

        // loop over all triggers and make Dropdown objects out of them
        Array.prototype.slice.call(triggers).forEach(function(el) {
            new DropdownObj(el);
        });

    })(document.getElementsByClassName("ui-dropdown-trigger"));

})(window, document);