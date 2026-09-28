// VitalCare — shared interactions

document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---------------------------------------------------------------
    // mobile nav toggle
    // ---------------------------------------------------------------
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".main-nav");
    if (toggle && nav) {
        toggle.addEventListener("click", () => {
            const open = nav.classList.toggle("open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => nav.classList.remove("open"));
        });
    }

    // ---------------------------------------------------------------
    // footer year
    // ---------------------------------------------------------------
    document.querySelectorAll("[data-year]").forEach((el) => {
        el.textContent = new Date().getFullYear();
    });

    // ---------------------------------------------------------------
    // header shadow on scroll
    // ---------------------------------------------------------------
    const header = document.querySelector(".site-header");
    if (header) {
        const setScrolled = () => {
            header.classList.toggle("scrolled", window.scrollY > 8);
        };
        setScrolled();
        window.addEventListener("scroll", setScrolled, { passive: true });
    }

    // ---------------------------------------------------------------
    // back to top button
    // ---------------------------------------------------------------
    const backToTop = document.querySelector("#back-to-top");
    if (backToTop) {
        const setVisible = () => {
            backToTop.classList.toggle("show", window.scrollY > 480);
        };
        setVisible();
        window.addEventListener("scroll", setVisible, { passive: true });
        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
        });
    }

    // ---------------------------------------------------------------
    // scroll reveal (fade/slide/zoom in on first view) + number count-up
    // ---------------------------------------------------------------
    const revealTargets = document.querySelectorAll(".reveal, .reveal-zoom");
    const countTargets = document.querySelectorAll("[data-count-to]");

    const animateCount = (el) => {
        const target = parseFloat(el.getAttribute("data-count-to"));
        if (isNaN(target)) return;
        const duration = 1400;
        const start = performance.now();
        const startVal = 0;

        const step = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const value = Math.round(startVal + (target - startVal) * eased);
            el.textContent = value.toLocaleString();
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target.toLocaleString();
            }
        };
        requestAnimationFrame(step);
    };

    if (prefersReducedMotion) {
        revealTargets.forEach((el) => el.classList.add("in-view"));
        countTargets.forEach((el) => {
            const target = parseFloat(el.getAttribute("data-count-to"));
            if (!isNaN(target)) el.textContent = target.toLocaleString();
        });
    } else if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in-view");
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
        );
        revealTargets.forEach((el) => revealObserver.observe(el));

        const countObserver = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateCount(entry.target);
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.6 }
        );
        countTargets.forEach((el) => countObserver.observe(el));
    } else {
        revealTargets.forEach((el) => el.classList.add("in-view"));
        countTargets.forEach((el) => animateCount(el));
    }

    // ---------------------------------------------------------------
    // vitals card — gentle 3D tilt that follows the cursor
    // ---------------------------------------------------------------
    const vitalsCard = document.querySelector(".vitals-card");
    if (vitalsCard && !prefersReducedMotion && window.matchMedia("(hover: hover)").matches) {
        const maxTilt = 6;
        vitalsCard.addEventListener("mousemove", (e) => {
            const rect = vitalsCard.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            vitalsCard.style.transform =
                `perspective(900px) rotateX(${(-y * maxTilt).toFixed(2)}deg) rotateY(${(x * maxTilt).toFixed(2)}deg) translateY(-2px)`;
        });
        vitalsCard.addEventListener("mouseleave", () => {
            vitalsCard.style.transform = "";
        });
    }

    // ---------------------------------------------------------------
    // contact form — front-end only demo submit
    // ---------------------------------------------------------------
    const form = document.querySelector("#contact-form");
    const status = document.querySelector("#form-status");
    if (form && status) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = form.querySelector("#name").value.trim();
            status.textContent = `Thanks${name ? ", " + name.split(" ")[0] : ""} — your message has been received. Our care team replies within one business day. For anything urgent, please call the emergency line above.`;
            status.classList.add("show", "ok");
            form.reset();
        });
    }
});