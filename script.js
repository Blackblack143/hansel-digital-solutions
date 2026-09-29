/* ==========================================================================
   HANSEL DIGITAL SOLUTIONS — SCRIPT
   1. Preloader
   2. Nav (scroll state, active section, mobile menu)
   3. Magnetic buttons
   4. Scroll reveal (data-aos)
   5. Animated counters
   6. Animated skill bars
   7. Project filter
   8. FAQ accordion
   9. Contact form (client-side demo)
   10. Back-to-top
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (window.lucide) lucide.createIcons();

  /* 1. Preloader ---------------------------------------------------------- */
  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (!loader) return;
    loader.style.opacity = "0";
    setTimeout(() => { loader.style.visibility = "hidden"; }, 500);
  });

  /* 2. Nav ------------------------------------------------------------------ */
  (function initNav() {
    const nav = document.getElementById("nav");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("main > section[id]");
    const toggle = document.getElementById("navToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 30); }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => link.classList.toggle("active", link.dataset.section === id));
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));

    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      mobileMenu.classList.toggle("open", !expanded);
    });
    mobileMenu.querySelectorAll(".mobile-link").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  })();

  /* 3. Magnetic buttons -------------------------------------------------------- */
  (function initMagnetic() {
    if (prefersReducedMotion || window.matchMedia("(hover: none)").matches) return;
    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
      });
      btn.addEventListener("mouseleave", () => { btn.style.transform = "translate(0, 0)"; });
    });
  })();

  /* 4. Scroll reveal ------------------------------------------------------------ */
  (function initReveal() {
    const targets = document.querySelectorAll("[data-aos]");
    if (prefersReducedMotion) { targets.forEach((el) => el.classList.add("aos-in")); return; }
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = parseInt(el.dataset.aosDelay || "0", 10);
            setTimeout(() => el.classList.add("aos-in"), delay);
            revealObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    targets.forEach((el) => revealObserver.observe(el));
  })();

  /* 5. Animated counters -------------------------------------------------------- */
  (function initCounters() {
    const counters = document.querySelectorAll("[data-count]");
    function animate(el) {
      const target = parseInt(el.dataset.count, 10);
      if (prefersReducedMotion) { el.textContent = target; return; }
      const duration = 1300;
      const start = performance.now();
      function step(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target);
        if (p < 1) requestAnimationFrame(step); else el.textContent = target;
      }
      requestAnimationFrame(step);
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { animate(e.target); obs.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach((el) => obs.observe(el));
  })();

  /* 6. Animated skill bars ------------------------------------------------------- */
  (function initSkillBars() {
    const bars = document.querySelectorAll(".progress-fill");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.getAttribute("data-width");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    bars.forEach((bar) => obs.observe(bar));
  })();

  /* 7. Project filter -------------------------------------------------------------- */
  (function initFilter() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const filterValue = btn.getAttribute("data-filter");
        projectCards.forEach((card) => {
          const match = filterValue === "all" || card.getAttribute("data-category") === filterValue;
          card.style.display = match ? "" : "none";
        });
      });
    });
  })();

  /* 8. FAQ accordion ----------------------------------------------------------------- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const trigger = item.querySelector(".faq-question");
    const panel = item.querySelector(".faq-answer");
    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach((other) => {
        other.classList.remove("open");
        other.querySelector(".faq-answer").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  /* 9. Contact form (client-side demo — no backend attached) ------------------------- */
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("formStatus");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        formStatus.style.color = "#FF6B6B";
        formStatus.textContent = "Please fill in all fields with a valid email.";
        return;
      }
      formStatus.style.color = "";
      formStatus.textContent = "Thanks! Your message is ready to be sent — we'll get back to you soon.";
      contactForm.reset();
    });
  }

  /* 10. Back to top ------------------------------------------------------------------- */
  const backToTopBtn = document.getElementById("back-to-top");
  window.addEventListener("scroll", () => {
    backToTopBtn.classList.toggle("show", window.scrollY > 400);
  }, { passive: true });
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
});
