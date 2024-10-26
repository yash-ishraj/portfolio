// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form submission handler
document.querySelector('#contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const form = this;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            form.reset();
            alert('Thank you for your message! I will get back to you soon.');
        } else {
            throw new Error('Form submission failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Oops! There was a problem submitting your form. Please try again later.');
    })
    .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    });
});

// Add hover effect to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => card.style.transform = 'scale(1.05)');
    card.addEventListener('mouseleave', () => card.style.transform = 'scale(1)');
});

// Dark mode toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => document.body.classList.toggle('dark-mode'));
}

// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 200
});

// Animate skill bars
function animateSkillBars() {
    document.querySelectorAll('.skill-progress').forEach(bar => {
        const target = bar.getAttribute('data-target');
        let width = 0;
        const interval = setInterval(() => {
            if (width >= target) {
                clearInterval(interval);
            } else {
                width++;
                bar.style.width = `${width}%`;
                bar.querySelector('span').textContent = `${width}%`;
            }
        }, 10);
    });
}

// Observe about section to trigger skill bar animation
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        animateSkillBars();
        observer.unobserve(entries[0].target);
    }
}, { threshold: 0.5 });

observer.observe(document.querySelector('#about'));

// Scroll-to-top button
const scrollToTopButton = document.getElementById('scroll-to-top');
if (scrollToTopButton) {
    window.addEventListener('scroll', () => {
        scrollToTopButton.style.display = window.pageYOffset > 100 ? 'block' : 'none';
    });
    scrollToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Typing effect for main heading
const mainHeading = document.querySelector('h1');
if (mainHeading) {
    const text = mainHeading.textContent;
    mainHeading.textContent = '';
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            mainHeading.textContent += text.charAt(i++);
            setTimeout(typeWriter, 100);
        }
    };
    typeWriter();
}

// Smooth reveal animations
function reveal() {
    document.querySelectorAll('.reveal').forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        element.classList.toggle('active', elementTop < windowHeight - elementVisible);
    });
}

window.addEventListener('scroll', reveal);

// Particle background
particlesJS('particles-js', {
    particles: {
        number: { value: 100, density: { enable: true, value_area: 800 } },
        color: { value: '#64ffda' },
        shape: { type: 'circle' },
        opacity: { value: 0.3, random: false },
        size: { value: 2, random: true },
        line_linked: { enable: true, distance: 150, color: '#64ffda', opacity: 0.2, width: 1 },
        move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
    },
    interactivity: {
        detect_on: 'canvas',
        events: { 
            onhover: { enable: true, mode: 'repulse' }, 
            onclick: { enable: false },
            resize: true 
        },
        modes: { repulse: { distance: 100, duration: 0.4 } }
    },
    retina_detect: true
});

// Interactive floating icons
const floatingIcons = document.querySelectorAll('.floating-icons i');
const floatingIconsContainer = document.querySelector('.floating-icons');

function positionIcons() {
    const containerRect = floatingIconsContainer.getBoundingClientRect();
    floatingIcons.forEach(icon => {
        icon.style.top = `${Math.random() * (containerRect.height - icon.offsetHeight)}px`;
        icon.style.left = `${Math.random() * (containerRect.width - icon.offsetWidth)}px`;
        icon.style.animationDelay = `-${Math.random() * 10}s`;
        icon.style.animationDuration = `${15 + Math.random() * 15}s`;
    });
}

positionIcons();
window.addEventListener('resize', positionIcons);

console.log('Number of floating icons:', floatingIcons.length);

// Initial function calls
reveal();

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu toggle
const menuIcon = document.querySelector('.menu-icon');
const navUl = document.querySelector('nav ul');

menuIcon.addEventListener('click', () => {
    navUl.classList.toggle('show');
});

// Active link highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});
