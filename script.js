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

// Update AOS initialization
AOS.init({
    duration: 500, // Match with --animation-duration
    easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)', // Match with --animation-timing
    once: true,
    offset: 100
});

// Update skill bar animation
function animateSkillBars() {
    document.querySelectorAll('.skill-progress').forEach(bar => {
        const target = bar.getAttribute('data-target');
        bar.style.width = `${target}%`;
        bar.querySelector('span').textContent = `${target}%`;
    });
}

// Update typing effect
function typeWriter(element, text, i = 0) {
    if (i < text.length) {
        element.textContent += text.charAt(i);
        setTimeout(() => typeWriter(element, text, i + 1), 50); // Adjust speed as needed
    }
}

// Trigger animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Trigger AOS
    AOS.refresh();

    // Animate skill bars
    animateSkillBars();

    // Start typing effect
    const mainHeading = document.querySelector('h1');
    if (mainHeading) {
        const text = mainHeading.textContent;
        mainHeading.textContent = '';
        typeWriter(mainHeading, text);
    }

    // Trigger floating icons animation
    document.querySelectorAll('.floating-icons i').forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.2}s`;
    });

    // Add this code at the end of your script.js file or replace the existing chatbot functionality
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotOpen = document.getElementById('chatbot-open');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    if (chatbotToggle && chatbotOpen && chatbotContainer) {
        chatbotToggle.addEventListener('click', () => {
            chatbotContainer.classList.add('chatbot-hidden');
            chatbotOpen.style.display = 'block';
        });

        chatbotOpen.addEventListener('click', () => {
            chatbotContainer.classList.remove('chatbot-hidden');
            chatbotOpen.style.display = 'none';
        });
    } else {
        console.error('Chatbot elements not found in the DOM');
    }

    if (sendButton && userInput) {
        sendButton.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessage('user', message);
            userInput.value = '';
            const response = generateResponse(message);
            setTimeout(() => addMessage('ai', response), 500);
        }
    }

    function addMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.textContent = message;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Define keywords and their responses
        const responses = {
            'hello': "Hello! I'm an AI assistant for [Your Name]'s portfolio. How can I help you?",
            'hi': "Hi there! I'm here to help you learn more about [Your Name]'s skills and projects. What would you like to know?",
            'skills': "[Your Name] is skilled in HTML, CSS, JavaScript, React, Node.js, and Git. They're always learning new technologies to stay up-to-date in the fast-paced world of web development.",
            'projects': "[Your Name] has worked on several exciting projects. You can find details about them in the Projects section of this portfolio. Is there a specific project you'd like to know more about?",
            'contact': "You can contact [Your Name] through the contact form in the Contact section of this portfolio. They'll be happy to hear from you!",
            'experience': "[Your Name] has X years of experience in web development, working on a variety of projects from small business websites to large-scale web applications.",
            'education': "[Your Name] has a degree in [Your Degree] from [Your University]. They also continuously learn through online courses and coding bootcamps.",
        };

        // Check if any keyword matches the input
        for (let keyword in responses) {
            if (lowerMessage.includes(keyword)) {
                return responses[keyword];
            }
        }

        // If no keyword matches, return a default response
        return "I'm not sure I understand. Could you rephrase your question? You can ask me about [Your Name]'s skills, projects, experience, or education.";
    }

    const menuIcon = document.querySelector('.menu-icon');
    const navUl = document.querySelector('nav ul');

    if (menuIcon && navUl) {
        menuIcon.addEventListener('click', () => {
            navUl.classList.toggle('show');
        });

        // Close menu when a link is clicked
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.addEventListener('click', () => {
                navUl.classList.remove('show');
            });
        });
    }
});

// Scroll-to-top button
const scrollToTopButton = document.getElementById('scroll-to-top');
if (scrollToTopButton) {
    window.addEventListener('scroll', () => {
        scrollToTopButton.style.display = window.pageYOffset > 100 ? 'block' : 'none';
    });
    scrollToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Sync 3D Skill Cube rotation with scroll position
window.addEventListener('scroll', () => {
    const scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    const rotation = scrollPercentage * 360;
    document.querySelector('.skill-cube').style.transform = `rotateX(${rotation}deg) rotateY(${rotation}deg)`;
});

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

if (menuIcon && navUl) {
    menuIcon.addEventListener('click', () => {
        navUl.classList.toggle('show');
    });
} else {
    console.error('Menu icon or navigation list not found');
}

// Close menu when a link is clicked
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        navUl.classList.remove('show');
    });
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

// 3D Skill Cube interaction
const skillCube = document.querySelector('.skill-cube');
const cubeFaces = document.querySelectorAll('.cube-face');

let isRotating = true;
let currentRotation = { x: 0, y: 0 };
let targetRotation = { x: 0, y: 0 };
let lastTime = 0;

function rotateCube(time) {
    if (lastTime !== 0) {
        const deltaTime = time - lastTime;
        if (isRotating) {
            currentRotation.x += 0.05 * deltaTime / 16;
            currentRotation.y += 0.05 * deltaTime / 16;
        } else {
            currentRotation.x += (targetRotation.x - currentRotation.x) * 0.1;
            currentRotation.y += (targetRotation.y - currentRotation.y) * 0.1;
        }
        skillCube.style.transform = `rotateX(${currentRotation.x}deg) rotateY(${currentRotation.y}deg)`;
    }
    lastTime = time;
    requestAnimationFrame(rotateCube);
}

skillCube.addEventListener('mouseenter', () => {
    isRotating = false;
});

skillCube.addEventListener('mouseleave', () => {
    isRotating = true;
});

cubeFaces.forEach((face, index) => {
    face.addEventListener('mouseenter', () => {
        const angle = 90 * index;
        targetRotation.x = Math.floor(index / 2) * 90;
        targetRotation.y = (index % 2 === 0 ? angle : -angle);
    });
});

requestAnimationFrame(rotateCube);
