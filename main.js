// Enhanced Mobile Menu Toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('fade-in-down');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link-mobile').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('fade-in-down');
        });
    });
}

// Enhanced Scroll to Top Button
const scrollToTopButton = document.getElementById('scroll-to-top');

if (scrollToTopButton) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopButton.classList.remove('opacity-0', 'translate-y-10');
            scrollToTopButton.classList.add('opacity-100', 'translate-y-0');
        } else {
            scrollToTopButton.classList.remove('opacity-100', 'translate-y-0');
            scrollToTopButton.classList.add('opacity-0', 'translate-y-10');
        }
    });

    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Enhanced Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || 0;
            setTimeout(() => {
                entry.target.classList.add('is-visible');
            }, delay);
        } else {
            entry.target.classList.remove('is-visible');
        }
    });
}, observerOptions);

// Enhanced scroll animations with direction detection
let lastScrollY = window.scrollY;
let ticking = false;

function updateScrollDirection() {
    const scrollY = window.scrollY;
    const direction = scrollY > lastScrollY ? 'down' : 'up';
    
    if (direction === 'up') {
        document.querySelectorAll('.fade-in-scroll').forEach(element => {
            if (!isElementInViewport(element)) {
                element.classList.remove('is-visible');
            }
        });
    }
    
    lastScrollY = scrollY;
    ticking = false;
}

function onScroll() {
    if (!ticking) {
        requestAnimationFrame(updateScrollDirection);
        ticking = true;
    }
}

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 &&
        rect.bottom >= 0
    );
}

// Observe all fade-in sections
document.querySelectorAll('.fade-in-scroll').forEach(section => {
    fadeObserver.observe(section);
});

// Enhanced smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Enhanced Contact Form Submission Handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form elements
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const projectSelect = document.getElementById('project_type');
        const messageInput = document.getElementById('message');
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const projectType = projectSelect.value;
        const message = messageInput.value.trim();
        
        // Reset error messages
        resetErrors();
        
        // Validation flags
        let isValid = true;
        
        // Validate Name
        if (!name) {
            showError('name-error', 'Please enter your full name');
            isValid = false;
        }
        
        // Validate Email
        if (!email) {
            showError('email-error', 'Please enter your email address');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email-error', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate Project Type
        if (!projectType) {
            showError('project-error', 'Please select a project type');
            isValid = false;
        }
        
        // Validate Message
        if (!message) {
            showError('message-error', 'Please enter your message');
            isValid = false;
        } else if (message.length < 10) {
            showError('message-error', 'Message should be at least 10 characters long');
            isValid = false;
        }
        
        // If validation fails, stop here
        if (!isValid) {
            showNotification('Please fix the errors above and try again.', 'error');
            return;
        }
        
        // Add loading state
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing Email...';
        submitButton.disabled = true;
        
        // Prepare email content
        setTimeout(() => {
            try {
                const subject = `New Project Inquiry: ${projectType} - From ${name}`;
                const emailBody = `
Hello Eclipsia Techs,

I would like to discuss a ${projectType.toLowerCase()} project with you.

Here are my details:
- Name: ${name}
- Email: ${email}
- Project Type: ${projectType}

My Message:
${message}

I look forward to hearing from you.

Best regards,
${name}
                `.trim();
                
                // Create mailto link
                const mailtoLink = `mailto:eclipsiatechs@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
                
                // Show success message
                showNotification('Opening your email client... Please click send to complete your message.', 'success');
                
                // Open email client after a short delay
                setTimeout(() => {
                    window.location.href = mailtoLink;
                    
                    // Reset form after opening email
                    setTimeout(() => {
                        this.reset();
                        submitButton.innerHTML = originalText;
                        submitButton.disabled = false;
                    }, 2000);
                    
                }, 1500);
                
            } catch (error) {
                console.error('Error preparing email:', error);
                showNotification('Error preparing email. Please try again.', 'error');
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        }, 1000);
    });
    
    // Real-time validation
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const projectSelect = document.getElementById('project_type');
    const messageInput = document.getElementById('message');
    
    // Name validation on blur
    nameInput.addEventListener('blur', function() {
        const name = this.value.trim();
        if (!name) {
            showError('name-error', 'Please enter your full name');
        } else {
            hideError('name-error');
        }
    });
    
    // Email validation on blur
    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        if (!email) {
            showError('email-error', 'Please enter your email address');
        } else if (!isValidEmail(email)) {
            showError('email-error', 'Please enter a valid email address');
        } else {
            hideError('email-error');
        }
    });
    
    // Project type validation on change
    projectSelect.addEventListener('change', function() {
        if (!this.value) {
            showError('project-error', 'Please select a project type');
        } else {
            hideError('project-error');
        }
    });
    
    // Message validation on blur
    messageInput.addEventListener('blur', function() {
        const message = this.value.trim();
        if (!message) {
            showError('message-error', 'Please enter your message');
        } else if (message.length < 10) {
            showError('message-error', 'Message should be at least 10 characters long');
        } else {
            hideError('message-error');
        }
    });
}

// Error handling functions
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        
        // Add error styling to input
        const inputElement = document.querySelector(`[name="${elementId.replace('-error', '')}"]`);
        if (inputElement) {
            inputElement.classList.add('border-red-500');
            inputElement.classList.remove('border-gray-600');
        }
    }
}

function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.classList.add('hidden');
        
        // Remove error styling from input
        const inputElement = document.querySelector(`[name="${elementId.replace('-error', '')}"]`);
        if (inputElement) {
            inputElement.classList.remove('border-red-500');
            inputElement.classList.add('border-gray-600');
        }
    }
}

function resetErrors() {
    const errorElements = document.querySelectorAll('[id$="-error"]');
    errorElements.forEach(element => {
        element.classList.add('hidden');
    });
    
    // Reset input borders
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.classList.remove('border-red-500');
        input.classList.add('border-gray-600');
    });
}

// Enhanced email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Premium Notification System
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.custom-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `custom-notification fixed top-4 right-4 p-4 rounded-lg shadow-2xl z-50 transform transition-all duration-500 ${
        type === 'success' ? 'bg-gradient-to-r from-green-500 to-green-600' : 
        type === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600' : 
        type === 'info' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
        'bg-gradient-to-r from-yellow-500 to-yellow-600'
    } text-white backdrop-blur-sm border border-white/10`;
    
    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' :
                type === 'error' ? 'fa-exclamation-circle' :
                type === 'info' ? 'fa-info-circle' :
                'fa-exclamation-triangle'
            }"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('translate-x-0', 'opacity-100');
        notification.classList.remove('translate-x-full', 'opacity-0');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('translate-x-0', 'opacity-100');
        notification.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5000);
}

// Add CSS for enhanced notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .custom-notification {
        transform: translateX(100%);
        opacity: 0;
    }
    .custom-notification.translate-x-0 {
        transform: translateX(0);
        opacity: 1;
    }
    .custom-notification.translate-x-full {
        transform: translateX(100%);
        opacity: 0;
    }
`;
document.head.appendChild(notificationStyles);

// Enhanced service card interactions
function initServiceCardInteractions() {
    const serviceCards = document.querySelectorAll('.premium-service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Enhanced media icon interactions
function initMediaIconInteractions() {
    const mediaIcons = document.querySelectorAll('.media-icon');
    
    mediaIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.filter = 'drop-shadow(0 0 20px currentColor) brightness(1.3)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.filter = 'drop-shadow(0 0 10px currentColor) brightness(1)';
        });
    });
}

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initServiceCardInteractions();
    initMediaIconInteractions();
    
    window.addEventListener('scroll', throttle(onScroll, 100));
    
    // Add loading animation to stats
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const finalValue = stat.textContent;
        if (finalValue && !finalValue.includes('₦')) {
            stat.textContent = '0';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(stat, finalValue);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(stat);
        }
    });
});

// Counter animation for stats
function animateCounter(element, finalValue) {
    let current = 0;
    const increment = finalValue.includes('+') ? 1 : parseInt(finalValue) / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= parseInt(finalValue)) {
            element.textContent = finalValue;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (finalValue.includes('+') ? '+' : '');
        }
    }, 20);
}

// Enhanced navigation active state
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Add active state styles to CSS
const activeNavStyles = document.createElement('style');
activeNavStyles.textContent = `
    .nav-link.active {
        color: #3b82f6;
    }
    .nav-link.active::after {
        width: 100%;
    }
    .nav-link-mobile.active {
        color: #3b82f6;
        background: rgba(59, 130, 246, 0.1);
    }
`;
document.head.appendChild(activeNavStyles);

// Update active nav link on scroll
window.addEventListener('scroll', throttle(updateActiveNavLink, 100));