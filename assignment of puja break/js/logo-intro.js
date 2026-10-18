const intro = document.getElementById("logo-intro");
const skipButton = document.getElementById("intro-skip");
const introSeenKey = "ajmal-super-40-intro-seen-v2";

if ("IntersectionObserver" in window) {
    document.body.classList.add("reveal-ready");

    const revealItems = document.querySelectorAll(".school-intro, .programme-band, .journey-section, .explore-section, .exam-resources, .admission-panel");
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealItems.forEach((item) => revealObserver.observe(item));
}

if (intro && skipButton) {
    let hasSeenIntro = false;

    try {
        hasSeenIntro = window.localStorage.getItem(introSeenKey) === "true";
    } catch (error) {
        hasSeenIntro = false;
    }

    if (hasSeenIntro) {
        intro.classList.add("is-hidden");
    } else {
        try {
            window.localStorage.setItem(introSeenKey, "true");
        } catch (error) {
            // The animation can still play when storage is unavailable.
        }
    }

    skipButton.addEventListener("click", () => {
        intro.classList.add("is-hidden");
    });
}

const programmeCards = document.querySelectorAll("[data-programme]");

programmeCards.forEach((card) => {
    const toggle = card.querySelector(".programme-toggle");

    toggle.addEventListener("click", () => {
        const isOpen = card.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
    });
});
