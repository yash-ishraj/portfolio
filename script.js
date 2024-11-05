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

// Add this function definition before the DOMContentLoaded event listener
function reveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            } else {
                entry.target.classList.remove('revealed');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

// Update your DOMContentLoaded event listener to include the reveal() function call
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
            // Informal greetings
            'hello': "Hey there! I'm the AI assistant for Ashish raj's portfolio. What can I help you with?",
            'hi': "Hi! Ready to explore Ashish raj's awesome work? What would you like to know?",
            'hey': "Hey! I'm here to chat about Ashish raj's skills and projects. What's on your mind?",

            // Formal greetings
            'greetings': "Greetings! I'm the AI assistant for Ashish raj's professional portfolio. How may I assist you today?",
            'good day': "Good day! I'm here to provide information about Ashish raj's professional experience and accomplishments. How can I be of service?",

            // Skills - informal
            'skills': "Ashish raj is a pro at HTML, CSS, JavaScript, React, Node.js, and Git. Always picking up new tech too!",
            'what can they do': "Oh, Ashish raj's got mad skills! Web dev, app creation, you name it. Want details on anything specific?",

            // Skills - formal
            'technical proficiencies': "Ashish raj is proficient in HTML, CSS, JavaScript, React, Node.js, and Git. They consistently expand their skill set to remain current with industry trends.",
            'areas of expertise': "Ashish raj's areas of expertise include front-end and back-end web development, responsive design, and version control systems.",

            // Projects - informal
            'projects': "Ashish raj's worked on some cool stuff! Check out the Projects section. Any particular one catch your eye?",
            'what have they built': "A bunch of neat things! E-commerce sites,Basic game projects ,College fest website . Want me to highlight a few?",

            // Projects - formal
            'portfolio': "Ashish raj has an extensive portfolio of projects, ranging from e-commerce platforms to data visualization applications. Would you like more information on a specific project?",
            'professional work': "Ashish raj has contributed to various professional projects, demonstrating expertise in both front-end and back-end development. The Projects section provides detailed information on each.",

            // Contact - informal
            'contact': "Wanna get in touch with Ashish raj? Just use the contact form below. He'd love to hear from you!",
            'how to reach': "Easy peasy! There's a contact form right here on the site. Drop Ashish raj a line anytime!",

            // Contact - formal
            'professional inquiry': "For professional inquiries, please utilize the contact form provided in the Contact section. Ashish raj will respond promptly to your message.",
            'business communication': "To initiate business communication with Ashish raj, please submit your inquiry through the designated contact form. You can expect a timely and professional response.",

            // Experience - informal
            'experience': "Ashish raj's been in the game for 2 years, working on all sorts of cool web stuff. From small biz sites to big fancy E-commerce apps!",
            'work history': "Let's see... Ashish raj's done a bit of everything! Startups, big corps, freelance gigs. Want the full scoop?",

            // Experience - formal
            'professional experience': "Ashish raj has 2 years of professional experience in web development, encompassing a diverse range of projects from small business websites to enterprise-level web applications.",
            'career progression': "Ashish raj's career progression includes roles at startups, freelancing, and college projects, demonstrating a consistent trajectory of professional growth and increasing responsibilities.",

            // Education - informal
            'education': "Ashish raj is doing B.Tech from NIT Sikkim. But he's always learning new stuff online too!",
            'where did they study': "He's studying at NIT Sikkim, but honestly, he's always studying! Bootcamps, online courses, you name it.",

            // Education - formal
            'academic background': "Ashish raj is doing B.Tech from NIT Sikkim. Additionally, he regularly engages in professional development through online courses and industry certifications.",
            'qualifications': "Ashish raj's is doing B.Tech from NIT Sikkim, supplemented by continuous professional development and relevant industry certifications.",

            // Personal projects and volunteer work (as before)
            'personal projects': "Ashish raj has developed frontend for college fest website, a basic game project and a E-commerce site that utilizes svelte,sveltekit,react to build it.",
            'volunteer work': "Ashish raj has volunteered for college fest website, and contributed to hackathons."
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

    console.log('Menu icon:', menuIcon);
    console.log('Nav ul:', navUl);

    if (menuIcon && navUl) {
        menuIcon.addEventListener('click', () => {
            console.log('Menu icon clicked');
            navUl.classList.toggle('show');
            console.log('Nav classes after toggle:', navUl.classList);
        });

        // Close menu when a link is clicked
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.addEventListener('click', () => {
                navUl.classList.remove('show');
                console.log('Nav link clicked, nav classes:', navUl.classList);
            });
        });
    } else {
        console.error('Menu icon or nav ul not found');
    }

    // Add this function to your existing script.js
    function setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;

        console.log('Setting up theme toggle');
        console.log('Theme toggle element:', themeToggle);

        if (!themeToggle) {
            console.error('Theme toggle element not found');
            return;
        }

        // Check for saved user preference
        const savedNightMode = localStorage.getItem('nightMode');
        console.log('Saved night mode:', savedNightMode);

        if (savedNightMode === 'true') {
            body.classList.add('night-mode');
            themeToggle.checked = true;
            console.log('Applied saved night mode');
        }

        themeToggle.addEventListener('change', () => {
            console.log('Theme toggle changed', themeToggle.checked);
            if (themeToggle.checked) {
                body.classList.add('night-mode');
                localStorage.setItem('nightMode', 'true');
                document.documentElement.style.setProperty('--bg-color', '#ffffff');
                document.documentElement.style.setProperty('--text-color', '#333333');
            } else {
                body.classList.remove('night-mode');
                localStorage.setItem('nightMode', 'false');
                document.documentElement.style.setProperty('--bg-color', '#0a192f');
                document.documentElement.style.setProperty('--text-color', '#8892b0');
            }
            console.log('Body classes:', body.classList);
        });
    }

    // Make sure this function is being called
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM content loaded');
        setupThemeToggle();
    });

    // Call the reveal function
    reveal();
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






