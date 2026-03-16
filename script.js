// DOM Elements
const body = document.body;
const themeSwitches = document.querySelectorAll('.theme-switch');
const loadingScreen = document.querySelector('.loading-screen');
const backToTopBtn = document.getElementById('back-to-top');
const hamburgerIcon = document.getElementById('hamburger-icon');
const menuLinks = document.getElementById('menu-links');
const navLinks = document.querySelectorAll('.nav-link');
const currentYear = document.getElementById('year');
const typewriterText = document.querySelector('.typewriter-text');
const sections = document.querySelectorAll('section');
const scrollDownButtons = document.querySelectorAll('.scroll-down');
const menuOverlay = document.querySelector('.menu-overlay');

// Constants
const typingConfig = {
    speed: 100,
    deleteSpeed: 50,
    endPause: 1000,
    startPause: 500
};

// State Variables
let charIndex = 0;
let isDeleting = false;
let currentTypingSpeed = typingConfig.speed;
const professions = ["Cybersecurity Researcher","SOC Analyst","NOC Enginner","NOC Analyst"];
let professionIndex = 0;
let profession = professions[professionIndex];

// Initialize
function init() {
    setCurrentYear();
    setupTheme();
    setupEventListeners();
    startTypewriterEffect();
    setupScrollAnimations();
    setupPageLoad();
}

// Set current year in footer
function setCurrentYear() {
    currentYear.textContent = new Date().getFullYear();
}

// Theme functionality
function setupTheme() {
    // Always default to dark mode on first load
    let savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
        savedTheme = 'dark';
        localStorage.setItem('theme', 'dark');
    }
    body.setAttribute('data-theme', savedTheme);
    
    themeSwitches.forEach(switchEl => {
        switchEl.checked = savedTheme === 'light';
    });
}

// Event Listeners
function setupEventListeners() {
    // Theme toggle
    themeSwitches.forEach(switchEl => {
        switchEl.addEventListener('change', toggleTheme);
    });
    
    // Back to top button
    window.addEventListener('scroll', toggleBackToTopButton);
    backToTopBtn.addEventListener('click', scrollToTop);
    
    // Mobile menu
    hamburgerIcon.addEventListener('click', toggleMenu);
    document.querySelectorAll('.menu-links a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close menu when clicking overlay
    menuOverlay.addEventListener('click', closeMenu);
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });
    
    // Scroll animations
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);
    
    // Scroll down buttons
    scrollDownButtons.forEach(button => {
        button.addEventListener('click', scrollToNextSection);
    });
}

// Page load handler
function setupPageLoad() {
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
    }, 1000);
}

// Theme toggle handler
function toggleTheme() {
    const isLight = body.getAttribute('data-theme') === 'light';
    const newTheme = isLight ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    document.querySelectorAll('.theme-switch').forEach(switchEl => {
        switchEl.checked = newTheme === 'light';
    });
}

// Back to top functionality
function toggleBackToTopButton() {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Mobile menu toggle
function toggleMenu() {
    hamburgerIcon.classList.toggle('open');
    menuLinks.classList.toggle('open');
    body.classList.toggle('menu-active');
    
    if (menuLinks.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
        menuOverlay.style.visibility = 'visible';
        menuOverlay.style.opacity = '1';
    } else {
        document.body.style.overflow = '';
        menuOverlay.style.visibility = 'hidden';
        menuOverlay.style.opacity = '0';
    }
}

// Close mobile menu
function closeMenu() {
    hamburgerIcon.classList.remove('open');
    menuLinks.classList.remove('open');
    body.classList.remove('menu-active');
    document.body.style.overflow = '';
    menuOverlay.style.visibility = 'hidden';
    menuOverlay.style.opacity = '0';
}

// Scroll to next section
function scrollToNextSection() {
    const currentSection = this.closest('section');
    const nextSection = currentSection.nextElementSibling;
    
    if (nextSection) {
        window.scrollTo({
            top: nextSection.offsetTop,
            behavior: 'smooth'
        });
    }
}

// Typewriter effect
function typeWriter() {
    if (isDeleting) {
        typewriterText.textContent = profession.substring(0, charIndex - 1);
        charIndex--;
        currentTypingSpeed = typingConfig.deleteSpeed;
    } else {
        typewriterText.textContent = profession.substring(0, charIndex + 1);
        charIndex++;
        currentTypingSpeed = typingConfig.speed;
    }

    if (!isDeleting && charIndex === profession.length) {
        isDeleting = true;
        currentTypingSpeed = typingConfig.endPause;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        professionIndex = (professionIndex + 1) % professions.length;
        profession = professions[professionIndex];
        currentTypingSpeed = typingConfig.startPause;
    }

    setTimeout(typeWriter, currentTypingSpeed);
}

function startTypewriterEffect() {
    setTimeout(typeWriter, 1000);
}

// Smooth scrolling
function handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (menuLinks.classList.contains('open')) {
            closeMenu();
        }
    }
}

// Scroll animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.reveal');
    const screenPosition = window.innerHeight / 1.3;
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        
        if (elementPosition < screenPosition) {
            element.classList.add('active');
        }
    });
    
    // Update active nav link
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - 300)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

function setupScrollAnimations() {
    document.querySelectorAll('.section, .details-container, .project-img').forEach(el => {
        el.classList.add('reveal');
    });
}

function loadParticlesForTheme(theme) {
    if (window.pJSDom && window.pJSDom.length) {
        window.pJSDom[0].pJS.fn.vendors.destroypJS();
        window.pJSDom = [];
    }
    if (theme === 'light') {
        particlesJS("particles-js", {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 800 } },
                color: { value: "#66FCFF" },
                shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
                opacity: { value: 0.85, random: false },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#66FCFF",
                    opacity: 0.6,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "grab" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 0.8 } },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    } else {
        particlesJS("particles-js", {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 800 } },
                color: { value: "#00F0FF" },
                shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#00F0FF",
                    opacity: 0.3,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "grab" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 0.5 } },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }
}

// Detect initial theme
const htmlEl = document.documentElement;
const initialTheme = htmlEl.getAttribute('data-theme') || 'dark';
loadParticlesForTheme(initialTheme);

// Listen for theme changes
const themeSwitch = document.getElementById('theme-switch');
const themeSwitchMobile = document.getElementById('theme-switch-mobile');

function handleThemeChange() {
    const theme = htmlEl.getAttribute('data-theme') || 'dark';
    loadParticlesForTheme(theme);
}

if (themeSwitch) themeSwitch.addEventListener('change', handleThemeChange);
if (themeSwitchMobile) themeSwitchMobile.addEventListener('change', handleThemeChange);

// Initialize the application
document.addEventListener('DOMContentLoaded', init);

// --- AI Chatbot Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // Show toggle button with a slight delay
    setTimeout(() => {
        chatToggleBtn.style.display = 'flex';
        // Add animation class after it's displayed
        chatToggleBtn.classList.add('animate__animated', 'animate__bounceIn');
    }, 2000);

    // Toggle Chat Window
    chatToggleBtn.addEventListener('click', () => {
        const isActive = chatbotContainer.classList.contains('active');
        if (isActive) {
            chatbotContainer.classList.remove('active');
        } else {
            chatbotContainer.classList.add('active');
            chatInput.focus();
            // Scroll to bottom when opening
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
    });

    // Close Chat Window
    chatbotClose.addEventListener('click', () => {
        chatbotContainer.classList.remove('active');
    });

    // Handle Input Enter Key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });

    // Handle Send Button Click
    chatSendBtn.addEventListener('click', handleSendMessage);

    // Message History Array
    let conversationHistory = [];

    async function handleSendMessage() {
        const messageText = chatInput.value.trim();
        if (!messageText) return;

        // Clear input and disable
        chatInput.value = '';
        chatInput.disabled = true;
        chatSendBtn.disabled = true;

        // Add user message to UI
        appendMessage('user', messageText);
        
        // Add to history
        conversationHistory.push({ role: 'user', content: messageText });

        // Show typing indicator
        const typingId = showTypingIndicator();

        try {
            // Call our Serverless API endpoint
            // If running locally with Vercel CLI, it hits /api/chat
            // In production, it hits the relative path /api/chat
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages: conversationHistory })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            // Remove typing indicator
            removeTypingIndicator(typingId);
            
            // Add bot response to UI
            appendMessage('bot', data.content);
            
            // Add to history
            conversationHistory.push({ role: 'assistant', content: data.content });

        } catch (error) {
            console.error('Chat Error:', error);
            removeTypingIndicator(typingId);
            appendMessage('bot', "Sorry, I'm having trouble connecting right now. Please try again later.", true);
            // Remove the failed message from history
            conversationHistory.pop();
        } finally {
            // Re-enable input
            chatInput.disabled = false;
            chatSendBtn.disabled = false;
            chatInput.focus();
        }
    }

    function appendMessage(sender, text, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        
        if (isError) {
            messageDiv.style.color = '#ff4d4d';
        }

        // Extremely basic markdown-to-html for bold text from API
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Handle basic line breaks
        formattedText = formattedText.replace(/\n/g, '<br>');

        messageDiv.innerHTML = formattedText;
        chatbotMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const typingDiv = document.createElement('div');
        typingDiv.id = id;
        typingDiv.classList.add('message', 'bot-typing');
        
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        return id;
    }

    function removeTypingIndicator(id) {
        const typingIndicator = document.getElementById(id);
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
});
