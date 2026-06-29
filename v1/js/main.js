const menuButton = document.querySelector('.mobile-menu-button');
const menu = document.querySelector('.menu');
const navLinks = document.querySelectorAll('.menu a');

if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('is-open');
        menuButton.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            menu.classList.remove('is-open');
            menuButton.setAttribute('aria-expanded', 'false');
        });
    });
}

const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12
});

revealElements.forEach((element) => observer.observe(element));

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('문의가 접수된 것처럼 처리되었습니다. 실제 전송 기능은 백엔드 연결 후 사용할 수 있습니다.');
        contactForm.reset();
    });
}
