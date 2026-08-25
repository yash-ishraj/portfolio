// Smooth scrolling for in-page nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Contact form submission handler
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const form = this;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        fetch(form.action, {
            method: form.method,
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
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
                console.error('Contact form error:', error);
                alert('Oops! There was a problem submitting your form. Please try again later.');
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            });
    });
}

// Project card hover lift
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-6px)');
    card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0)');
});

// AOS (scroll animation library) init
AOS.init({
    duration: 500,
    easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    once: true,
    offset: 100
});

// Reveal-on-scroll for .reveal sections
function reveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

// Hero stat counters — animate 0 -> target once visible
function animateStatCounters() {
    const counters = document.querySelectorAll('.stat-value[data-count]');
    if (!counters.length) return;

    const animateOne = (el) => {
        const target = parseFloat(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 900;
        const start = performance.now();

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateOne(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    counters.forEach((el) => observer.observe(el));
}

// Typewriter effect for the hero heading
function typeWriter(element, text, i = 0) {
    if (i < text.length) {
        element.textContent += text.charAt(i);
        setTimeout(() => typeWriter(element, text, i + 1), 45);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    AOS.refresh();
    animateStatCounters();
    reveal();

    const mainHeading = document.querySelector('h1');
    if (mainHeading) {
        const text = mainHeading.textContent;
        mainHeading.textContent = '';
        typeWriter(mainHeading, text);
    }

    document.querySelectorAll('.floating-icons i').forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.2}s`;
    });

    setupChatbot();
    setupThemeToggle();
    setupMobileMenu();
});

// ---------------------------------------------------------------------------
// Chatbot ("Ask about Ashish") — a small rule-based FAQ assistant, not an LLM.
// Each entry scores against the user's message by counting whole-word
// keyword matches; the highest-scoring entry above zero wins.
// ---------------------------------------------------------------------------
const CHAT_KNOWLEDGE = [
    {
        keywords: ['hi', 'hello', 'hey', 'greetings'],
        answer: "Hey! I'm a small FAQ bot for this site — ask me about Ashish's skills, experience, projects, education, or how to get in touch."
    },
    {
        keywords: ['skill', 'skills', 'stack', 'tech', 'technology', 'proficient', 'expertise', 'language', 'languages'],
        answer: "Ashish is backend-focused: Python, Node.js, FastAPI, Express.js, PostgreSQL, Redis, Docker, and AWS — currently expanding into Golang and Kubernetes. Full breakdown in the About section."
    },
    {
        keywords: ['project', 'projects', 'built', 'build', 'portfolio', 'app', 'apps'],
        answer: "A few highlights: a food & grocery delivery platform live on both app stores (500+ users), an LLM-powered legal document search engine, a multi-modal misinformation detection API, and an IoT warehouse climate control system. See the Projects section for details."
    },
    {
        keywords: ['experience', 'work', 'job', 'intern', 'internship', 'career', 'history'],
        answer: "Ashish has interned as a Backend Intern at Propell Action (RBAC + security work on a health-tech app), an SDE Intern at ValueKare Technologies (fixed asset management system), and a Software Development Intern at iGURUS (fintech comparison platform). Full details in Experience."
    },
    {
        keywords: ['education', 'college', 'university', 'degree', 'study', 'studied', 'cgpa', 'gpa', 'school', 'nit', 'sikkim', 'qualification'],
        answer: "Ashish is pursuing a B.Tech in Computer Science & Engineering at NIT Sikkim (2023–2027), currently in the 7th semester with a CGPA of 7.02 through the 6th semester."
    },
    {
        keywords: ['contact', 'reach', 'email', 'mail', 'phone', 'hire', 'hiring', 'available', 'opportunity', 'opportunities'],
        answer: "Best ways to reach Ashish: the contact form below, email at as7488896@gmail.com, or LinkedIn. He's open to backend engineering internships and full-time roles."
    },
    {
        keywords: ['resume', 'cv', 'download'],
        answer: "You can download the résumé from the button in the hero section or the Contact section — it's a direct PDF link, no sign-up needed."
    },
    {
        keywords: ['github', 'repo', 'code', 'source'],
        answer: "Ashish's GitHub is github.com/yash-ishraj — several project repos are linked directly from the Projects section too."
    },
    {
        keywords: ['flutter', 'mobile', 'android', 'ios'],
        answer: "Ashish built and shipped the Groozo delivery app in Flutter to both the Play Store and App Store, and also built a Flutter mobile client during his internship at Propell Action."
    },
    {
        keywords: ['thanks', 'thank', 'thankyou', 'cool', 'nice', 'awesome', 'great'],
        answer: "Glad that helped! Anything else — skills, projects, experience, or how to get in touch?"
    }
];

const CHAT_QUICK_REPLY_TEXT = {
    skills: 'What are your skills?',
    experience: 'Tell me about your experience',
    projects: 'What projects have you built?',
    contact: 'How can I contact you?'
};

const CHAT_FALLBACK = "I don't have a canned answer for that. Try asking about skills, projects, experience, education, or how to get in touch — or just use the contact form below.";

function scoreChatEntry(message, entry) {
    let score = 0;
    for (const keyword of entry.keywords) {
        const pattern = new RegExp(`\\b${keyword}\\b`, 'i');
        if (pattern.test(message)) score += 1;
    }
    return score;
}

function getChatResponse(message) {
    let best = null;
    let bestScore = 0;
    for (const entry of CHAT_KNOWLEDGE) {
        const score = scoreChatEntry(message, entry);
        if (score > bestScore) {
            bestScore = score;
            best = entry;
        }
    }
    return best ? best.answer : CHAT_FALLBACK;
}

function setupChatbot() {
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotOpen = document.getElementById('chatbot-open');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const quickReplies = document.querySelectorAll('.quick-reply-chip');

    if (!chatbotToggle || !chatbotOpen || !chatbotContainer) {
        console.error('Chatbot elements not found in the DOM');
        return;
    }

    let greeted = false;

    function addMessage(sender, text) {
        const el = document.createElement('div');
        el.classList.add('message', `${sender}-message`);
        el.textContent = text;
        chatbotMessages.appendChild(el);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        return el;
    }

    function showTyping() {
        const el = document.createElement('div');
        el.classList.add('message', 'ai-message');
        el.innerHTML = '<span class="typing-indicator"><span></span><span></span><span></span></span>';
        chatbotMessages.appendChild(el);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        return el;
    }

    function respondTo(message) {
        const typingEl = showTyping();
        const delay = 400 + Math.random() * 400;
        setTimeout(() => {
            typingEl.remove();
            addMessage('ai', getChatResponse(message));
        }, delay);
    }

    function sendMessage(overrideText) {
        const message = (overrideText !== undefined ? overrideText : userInput.value).trim();
        if (!message) return;
        addMessage('user', message);
        userInput.value = '';
        respondTo(message);
    }

    function greetOnce() {
        if (greeted) return;
        greeted = true;
        addMessage('ai', "Hi! I'm a small FAQ bot — not a real AI — but I can answer quick questions about Ashish's skills, projects, experience, and how to get in touch.");
    }

    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.classList.add('chatbot-hidden');
        chatbotOpen.style.display = 'flex';
    });

    chatbotOpen.addEventListener('click', () => {
        chatbotContainer.classList.remove('chatbot-hidden');
        chatbotOpen.style.display = 'none';
        greetOnce();
        userInput.focus();
    });

    sendButton.addEventListener('click', () => sendMessage());
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    quickReplies.forEach((chip) => {
        chip.addEventListener('click', () => {
            const key = chip.getAttribute('data-query');
            sendMessage(CHAT_QUICK_REPLY_TEXT[key] || key);
        });
    });
}

// ---------------------------------------------------------------------------
// Theme toggle (persisted via localStorage)
// ---------------------------------------------------------------------------
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    if (!themeToggle) return;

    const savedNightMode = localStorage.getItem('nightMode');
    if (savedNightMode === 'true') {
        body.classList.add('night-mode');
        themeToggle.checked = true;
    }

    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            body.classList.add('night-mode');
            localStorage.setItem('nightMode', 'true');
        } else {
            body.classList.remove('night-mode');
            localStorage.setItem('nightMode', 'false');
        }
    });
}

// ---------------------------------------------------------------------------
// Mobile menu
// ---------------------------------------------------------------------------
function setupMobileMenu() {
    const menuIcon = document.querySelector('.menu-icon');
    const navUl = document.querySelector('nav ul');
    if (!menuIcon || !navUl) return;

    menuIcon.addEventListener('click', () => navUl.classList.toggle('show'));

    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => navUl.classList.remove('show'));
    });
}

// Scroll-to-top button
const scrollToTopButton = document.getElementById('scroll-to-top');
if (scrollToTopButton) {
    window.addEventListener('scroll', () => {
        scrollToTopButton.style.display = window.pageYOffset > 300 ? 'block' : 'none';
    });
    scrollToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Particle background
particlesJS('particles-js', {
    particles: {
        number: { value: 70, density: { enable: true, value_area: 800 } },
        color: { value: '#6366f1' },
        shape: { type: 'circle' },
        opacity: { value: 0.25, random: false },
        size: { value: 2, random: true },
        line_linked: { enable: true, distance: 150, color: '#6366f1', opacity: 0.15, width: 1 },
        move: { enable: true, speed: 1.6, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
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
    if (!floatingIconsContainer) return;
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

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) header.classList.toggle('scrolled', window.scrollY > 50);
});

// Active link highlighting
const sections = document.querySelectorAll('section[id]');
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
