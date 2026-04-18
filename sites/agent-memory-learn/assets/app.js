document.querySelectorAll("[data-section-link]").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll("[data-section-link]").forEach((item) => {
      item.classList.remove("active");
    });
    link.classList.add("active");
  });
});

const sections = Array.from(document.querySelectorAll("[data-observe-section]"));
const navLinks = Array.from(document.querySelectorAll("[data-section-link]"));

if (sections.length && navLinks.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      const id = visible.target.getAttribute("id");
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("data-section-link") === id);
      });
    },
    { rootMargin: "-18% 0px -58% 0px", threshold: [0.12, 0.35, 0.7] },
  );

  sections.forEach((section) => observer.observe(section));
}

document.querySelectorAll("[data-toggle-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("data-toggle-target");
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (!target) return;
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    target.hidden = expanded;
  });
});
