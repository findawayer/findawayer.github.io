(function(window, document, undefined) {

	/* Back to top button */
    var toTop = {
        container: document.getElementById("backToTop"),
        button: document.getElementById("backToTopButton"),
        isVisible: false,
        breakPoint: 400
    };

	toTop.button.addEventListener("click", function(e) {
		e.preventDefault();
		scrollToY(0);
	});

    window.addEventListener("scroll", toggleToTopButton);

    function toggleToTopButton() {
        var scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollTop > 400) {
            if (!toTop.isVisible) {
                toTop.container.className = "is-visible";
                toTop.isVisible = true;
            }
        } else {
            if (toTop.isVisible) {
                toTop.container.className = "";
                toTop.isVisible = false;
            }
        }
    }

	/* Continue button */
	var continueButton = document.getElementById("continueButton");

	continueButton.addEventListener("click", function(e) {
		e.preventDefault();
		scrollToY(document.getElementById("introduction").offsetTop, 500);
	});

    function scrollToY(pos, timing) {
        var scrollTop = window.scrollY || document.documentElement.scrollTop;
        var destination = pos || 0;
        var duration = timing || 1000;
        var time = Math.max(0.1, Math.min(Math.abs(scrollTop - destination) / duration, 0.8));
        var currentTime = 0;

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

    /* Dropdown */
    (function dropdown() {
        var triggers = document.getElementsByClassName("ui-dropdown-trigger");

        var DropdownObj = function(el) {
            this.container = el.parentElement;
            this.trigger = el;
            this.panel = el.nextElementSibling;
            this.isOpen = false;

            var self = this;

            this.trigger.addEventListener("click", function(event) {
                event.preventDefault();

                if (self.isOpen) {
                    self.hide();
                } else {
                    self.show();

                    document.addEventListener("click", function(event) {
                        if (!self.container.contains(event.target)) {
                            self.hide();
                        }
                    });
                }
            });
        };

        DropdownObj.prototype = {
            show: function() {
                this.trigger.classList.add("is-triggered");
                this.panel.classList.add("is-expanded");
                this.isOpen = true;
            },
            hide: function() {
                this.trigger.classList.remove("is-triggered");
                this.panel.classList.remove("is-expanded");
                this.isOpen = false;
            }
        };

        Array.prototype.slice.call(triggers).forEach(function(el) {
            new DropdownObj(el);
        });
    })();

})(window, document);