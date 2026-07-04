const navbar = document.getElementById("navbar");
const menuToggle = document.getElementById("menuToggle");
const mainMenu = document.getElementById("mainMenu");

window.addEventListener("scroll", () => {
  if (!navbar) return;
  navbar.classList.toggle("scrolled", window.scrollY > 10);
});

menuToggle?.addEventListener("click", () => {
  mainMenu?.classList.toggle("show");
});

mainMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => mainMenu.classList.remove("show"));
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
