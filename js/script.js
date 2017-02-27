(function(window, document, undefined) {

    document.addEventListener("DOMContentLoaded", function() {
        // explicitely wait a few moment even if document is instantly loaded
        setTimeout(destroyPreloadLayer, 1000);
    });

    function destroyPreloadLayer() {
        var layer = document.getElementById("preload");

        fadeOut(layer, initAOS);

        function fadeOut(el, callback) {
            var opacity = 1;
            var interval = 1 / 8;

            (function animate() {
                opacity -= interval;

                if (opacity > 0) {
                    el.style.opacity = opacity;
                    window.requestAnimationFrame( animate );
                } else {
                    el.removeAttribute("style");
                    el.classList.add("is-fired");
                }
            })();

            if (typeof callback == "function") {
                callback();
            }
        }

        function initAOS() {
            AOS.init({
                offset: 0,
                easing: "ease-in-out-sine",
                duration: 800
            });
        }
    }

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
    };

	/* Continue button */
	var continueButton = document.getElementById("continueButton");

	continueButton.addEventListener("click", function(e) {
		e.preventDefault();
		scrollToY(document.getElementById("introduction").offsetTop, 500);
	});

    function scrollToY(targetY, duration) {
        var scrollTop = window.scrollY || document.documentElement.scrollTop;
        var destination = targetY || 0;
        var duration = duration || 1000;
        var time = Math.max(.1, Math.min(Math.abs(scrollTop - destination) / duration, .8));
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

})(window, document);