// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Initialize animations on DOM load
document.addEventListener('DOMContentLoaded', function() {
    // CRITICAL FIX: Initialize logo and image loading first
    initializeLogoLoading();
    initializePhotoLoading();

    // Animate cards on scroll
    const animatedElements = document.querySelectorAll(
        '.approach-card, .solution-card, .team-member, .client-card'
    );
    
    animatedElements.forEach((el, index) => {
        // Set initial state
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.transitionDelay = `${index * 0.1}s`;
        
        // Observe for intersection
        observer.observe(el);
    });

    // Add hover effects to buttons (but don't interfere with CTA buttons)
    const buttons = document.querySelectorAll('.btn:not(.cta-buttons .btn)');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Handle hero CTA button - scroll to CTA section
    const heroButton = document.querySelector('.hero .btn');
    if (heroButton) {
        heroButton.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToSection('cta');
        });
    }

    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        
        if (hero && scrolled < hero.offsetHeight) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // Add active states to cards
    const cards = document.querySelectorAll('.approach-card, .solution-card, .client-card');
    cards.forEach(card => {
        card.addEventListener('click', function(event) {
            // Remove active class from all cards of the same type
            const sameTypeCards = this.parentElement.querySelectorAll('.' + this.className.split(' ')[0]);
            sameTypeCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            this.classList.add('active');
            
            // Add ripple effect
            createRipple(this, event);
        });
    });

    // Animate counters in results
    animateCounters();

    // Initialize mobile menu if needed
    initializeMobileInteractions();

    // CRITICAL FIX: Ensure CTA buttons work properly
    initializeCTAButtons();
});

// CRITICAL FIX: Initialize logo loading with proper fallback
function initializeLogoLoading() {
    const logoImage = document.querySelector('.logo-image');
    const logoFallback = document.querySelector('.logo-fallback');
    
    if (logoImage && logoFallback) {
        // Style the fallback
        logoFallback.style.cssText = `
            font-size: 4rem;
            color: rgb(203, 2, 19);
            transform: scaleY(1.8) scaleX(0.8);
            display: none;
            font-weight: bold;
            text-shadow: 0 2px 4px rgba(203, 2, 19, 0.3);
            animation: logoFallbackPulse 3s ease-in-out infinite;
        `;
        
        // Handle image load error
        logoImage.addEventListener('error', function() {
            console.log('Logo image failed to load, showing fallback');
            this.style.display = 'none';
            logoFallback.style.display = 'inline-block';
        });
        
        // Handle successful image load
        logoImage.addEventListener('load', function() {
            console.log('Logo image loaded successfully');
            this.style.display = 'block';
            logoFallback.style.display = 'none';
        });
        
        // Check if image is already loaded (cached)
        if (logoImage.complete) {
            if (logoImage.naturalWidth === 0) {
                // Image failed to load
                logoImage.style.display = 'none';
                logoFallback.style.display = 'inline-block';
            } else {
                // Image loaded successfully
                logoImage.style.display = 'block';
                logoFallback.style.display = 'none';
            }
        }
    }
}

// CRITICAL FIX: Initialize team photo loading with proper fallbacks
function initializePhotoLoading() {
    const memberImages = document.querySelectorAll('.member-image');
    
    memberImages.forEach(img => {
        const placeholder = img.parentNode.querySelector('.member-placeholder');
        
        if (placeholder) {
            // Style the placeholder
            placeholder.style.cssText = `
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, rgb(203, 2, 19), rgb(197, 42, 14));
                display: none;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 3rem;
                font-weight: bold;
                font-family: 'Alumni Sans', sans-serif;
            `;
        }
        
        // Handle image load error
        img.addEventListener('error', function() {
            console.log(`Team image failed to load: ${this.src}`);
            this.style.display = 'none';
            if (placeholder) {
                placeholder.style.display = 'flex';
            }
        });
        
        // Handle successful image load
        img.addEventListener('load', function() {
            console.log(`Team image loaded successfully: ${this.src}`);
            this.style.display = 'block';
            if (placeholder) {
                placeholder.style.display = 'none';
            }
        });
        
        // Check if image is already loaded (cached)
        if (img.complete) {
            if (img.naturalWidth === 0) {
                // Image failed to load
                img.style.display = 'none';
                if (placeholder) {
                    placeholder.style.display = 'flex';
                }
            } else {
                // Image loaded successfully
                img.style.display = 'block';
                if (placeholder) {
                    placeholder.style.display = 'none';
                }
            }
        }
    });
}

// CRITICAL FIX: Initialize CTA buttons functionality
function initializeCTAButtons() {
    const ctaButtons = document.querySelectorAll('.cta-buttons .btn');
    
    ctaButtons.forEach(button => {
        // Ensure buttons have proper attributes
        if (button.tagName === 'A' && button.href) {
            // Make sure target="_blank" is set
            button.setAttribute('target', '_blank');
            button.setAttribute('rel', 'noopener noreferrer');
            
            // Add click tracking without preventing default behavior
            button.addEventListener('click', function(e) {
                const buttonText = this.textContent.trim();
                const buttonUrl = this.href;
                
                console.log(`CTA Button clicked: ${buttonText} -> ${buttonUrl}`);
                
                // Track button clicks for analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'cta_click', {
                        event_category: 'conversion',
                        event_label: buttonText,
                        value: buttonUrl
                    });
                }
                
                // Don't prevent default - let the browser handle the navigation
            });
            
            // Add hover effects specifically for CTA buttons
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px)';
                this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
            });
        }
    });
}

// Create ripple effect
function createRipple(element, event) {
    const circle = document.createElement('span');
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;

    const rect = element.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');

    // Add ripple styles
    circle.style.position = 'absolute';
    circle.style.borderRadius = '50%';
    circle.style.background = 'rgba(203, 2, 19, 0.1)';
    circle.style.transform = 'scale(0)';
    circle.style.animation = 'ripple 0.6s linear';
    circle.style.pointerEvents = 'none';

    const existingRipple = element.querySelector('.ripple');
    if (existingRipple) {
        existingRipple.remove();
    }

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(circle);

    // Remove ripple after animation
    setTimeout(() => {
        circle.remove();
    }, 600);
}

// Animate counters
function animateCounters() {
    const results = document.querySelectorAll('.client-result');
    
    results.forEach(result => {
        const text = result.textContent;
        const hasNumber = /\d+/.test(text);
        
        if (hasNumber && !result.dataset.animated) {
            observer.observe(result);
            
            // Create intersection observer specifically for counter animation
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.dataset.animated) {
                        entry.target.dataset.animated = 'true';
                        
                        // Extract number and animate it
                        const number = text.match(/\d+/)[0];
                        const prefix = text.split(number)[0];
                        const suffix = text.split(number)[1];
                        
                        animateNumber(entry.target, 0, parseInt(number), prefix, suffix);
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            counterObserver.observe(result);
        }
    });
}

// Animate number counting
function animateNumber(element, start, end, prefix = '', suffix = '') {
    const duration = 2000;
    const startTime = Date.now();
    
    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (end - start) * easeOutCubic(progress));
        
        element.textContent = prefix + current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    update();
}

// Easing function
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// Initialize mobile-specific interactions
function initializeMobileInteractions() {
    // Add touch feedback for mobile
    if ('ontouchstart' in window) {
        const touchElements = document.querySelectorAll('.btn:not(.cta-buttons .btn), .approach-card, .solution-card, .client-card');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touching');
            });
            
            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touching');
                }, 150);
            });
        });
    }

    // Optimize scroll performance on mobile
    let ticking = false;
    
    function updateScrollEffects() {
        // Throttle scroll events for better performance
        if (!ticking) {
            requestAnimationFrame(() => {
                // Update any scroll-based animations here
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', updateScrollEffects, { passive: true });
}

// Add CSS animations via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .touching {
        transform: scale(0.95);
        transition: transform 0.1s ease;
    }
    
    .active {
        transform: translateY(-5px) !important;
        box-shadow: 0 15px 35px rgba(203, 2, 19, 0.2) !important;
        border-color: rgb(203, 2, 19) !important;
    }
    
    .member-placeholder {
        border-radius: 0;
    }
    
    .logo-fallback {
        animation: logoFallbackPulse 3s ease-in-out infinite;
    }
    
    @keyframes logoFallbackPulse {
        0%, 100% {
            transform: scaleY(1.8) scaleX(0.8);
        }
        50% {
            transform: scaleY(1.9) scaleX(0.85);
        }
    }
    
    /* Enhanced hover effects */
    .approach-card:hover,
    .solution-card:hover,
    .client-card:hover {
        border-color: rgba(203, 2, 19, 0.3);
    }
    
    /* Team photo hover effects */
    .member-photo:hover {
        transform: scale(1.05);
        transition: transform 0.3s ease;
    }
    
    /* Client grid hover effect */
    .clients-grid-2x2:hover .client-card:not(:hover) {
        opacity: 0.7;
        transform: scale(0.98);
    }
    
    .clients-grid-2x2 .client-card {
        transition: all 0.3s ease;
    }
    
    /* CTA buttons enhanced styling */
    .cta-buttons .btn-secondary {
        background: transparent;
        border: 2px solid white;
        color: white;
    }
    
    .cta-buttons .btn-secondary:hover {
        background: white;
        color: rgb(203, 2, 19);
    }
    
    /* Ensure CTA buttons are clickable */
    .cta-buttons .btn {
        pointer-events: auto;
        cursor: pointer;
        position: relative;
        z-index: 10;
    }
    
    /* Logo hover effect */
    .logo-image:hover {
        transform: scale(1.1);
        transition: transform 0.3s ease;
        filter: drop-shadow(0 4px 8px rgba(203, 2, 19, 0.4));
    }
    
    /* Enterprise text animation */
    .enterprise-text {
        animation: enterpriseGlow 2s ease-in-out infinite alternate;
    }
    
    @keyframes enterpriseGlow {
        from {
            text-shadow: 0 0 5px rgba(203, 2, 19, 0.3);
        }
        to {
            text-shadow: 0 0 10px rgba(203, 2, 19, 0.6);
        }
    }
`;
document.head.appendChild(style);

// Performance optimization: Debounce resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize
const handleResize = debounce(() => {
    // Recalculate any size-dependent animations
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = 'translateY(0)';
    }
}, 250);

window.addEventListener('resize', handleResize);

// Preload critical resources and optimize performance
function preloadResources() {
    // Preload team photos and logo
    const criticalImages = ['logo.jpg', 'IMG_0636.jpg', 'photo_2025-10-06-12.01.26.jpg'];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadResources);
} else {
    preloadResources();
}

// Export functions for potential external use
window.DIVO = {
    scrollToSection
};

// Add enhanced scroll tracking for analytics
function initializeScrollTracking() {
    const sections = document.querySelectorAll('section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Track section view for analytics
                const sectionName = entry.target.id || entry.target.className;
                console.log(`Section viewed: ${sectionName}`);
                
                // You can add Google Analytics or other tracking here
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'section_view', {
                        event_category: 'engagement',
                        event_label: sectionName
                    });
                }
            }
        });
    }, { threshold: 0.3 });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Initialize scroll tracking after page load
window.addEventListener('load', function() {
    initializeScrollTracking();
    
    // Add final performance optimizations
    setTimeout(() => {
        // Enable smooth scrolling after initial load
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // Lazy load non-critical animations
        const nonCriticalElements = document.querySelectorAll('.footer, .enterprise-clients, .clients');
        nonCriticalElements.forEach(el => {
            observer.observe(el);
        });
    }, 1000);
});

// Handle navigation and improve UX - BUT DON'T INTERFERE WITH CTA BUTTONS
document.addEventListener('click', function(e) {
    // Handle internal navigation (but skip CTA buttons)
    if (e.target.matches('a[href^="#"]') && !e.target.closest('.cta-buttons')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        scrollToSection(targetId);
    }
    
    // Add click tracking for buttons (but don't prevent CTA button defaults)
    if ((e.target.matches('.btn') || e.target.closest('.btn')) && !e.target.closest('.cta-buttons')) {
        const button = e.target.matches('.btn') ? e.target : e.target.closest('.btn');
        const buttonText = button.textContent.trim();
        
        console.log(`Button clicked: ${buttonText}`);
        
        // Track button clicks
        if (typeof gtag !== 'undefined') {
            gtag('event', 'button_click', {
                event_category: 'engagement',
                event_label: buttonText
            });
        }
    }
});

// Special handling for font loading optimization
function optimizeFontLoading() {
    // Ensure fallbacks are properly handled
    if ('fonts' in document) {
        Promise.all([
            document.fonts.load('400 1em "KS Bistra"'),
            document.fonts.load('700 1em "Alumni Sans"'),
            document.fonts.load('300 1em "Roboto"')
        ]).then(() => {
            console.log('All fonts loaded successfully');
            document.body.classList.add('fonts-loaded');
        }).catch(() => {
            console.warn('Some fonts failed to load, using fallbacks');
            document.body.classList.add('fonts-fallback');
        });
    }
}

// Initialize font optimization
document.addEventListener('DOMContentLoaded', optimizeFontLoading);