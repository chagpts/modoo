const revealTargets = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealTargets.forEach((target) => observer.observe(target));

const video = document.querySelector('.hero-video');
if (video) {
  video.addEventListener('error', () => {
    video.style.display = 'none';
  });
}
