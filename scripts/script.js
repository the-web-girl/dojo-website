/**
 * Club de Judo - Complete JavaScript
 * Accessible and responsive interactions
 */

'use strict';

// ===== UTILITY FUNCTIONS =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// ===== NAVIGATION =====
class Navigation {
    constructor() {
        this.navToggle = $('.nav-toggle');
        this.navMenu = $('.nav-menu');
        this.init();
    }

    init() {
        if (this.navToggle && this.navMenu) {
            this.navToggle.addEventListener('click', this.toggleMenu.bind(this));
            this.navToggle.addEventListener('keydown', this.handleKeydown.bind(this));
            
            // Close menu when clicking outside
            document.addEventListener('click', this.handleOutsideClick.bind(this));
            
            // Close menu on escape key
            document.addEventListener('keydown', this.handleEscape.bind(this));
            
            // Handle resize
            window.addEventListener('resize', debounce(this.handleResize.bind(this), 250));
        }
    }

    toggleMenu() {
        const isExpanded = this.navToggle.getAttribute('aria-expanded') === 'true';
        this.navToggle.setAttribute('aria-expanded', !isExpanded);
        this.navMenu.classList.toggle('active');
        
        // Toggle hamburger animation
        this.navToggle.classList.toggle('active');
        
        // Manage focus
        if (!isExpanded) {
            const firstLink = this.navMenu.querySelector('.nav-link');
            if (firstLink) firstLink.focus();
        }
    }

    closeMenu() {
        this.navToggle.setAttribute('aria-expanded', 'false');
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
    }

    handleKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.toggleMenu();
        }
    }

    handleOutsideClick(event) {
        if (!this.navToggle.contains(event.target) && !this.navMenu.contains(event.target)) {
            this.closeMenu();
        }
    }

    handleEscape(event) {
        if (event.key === 'Escape') {
            this.closeMenu();
            this.navToggle.focus();
        }
    }

    handleResize() {
        if (window.innerWidth > 768) {
            this.closeMenu();
        }
    }
}

// ===== GALLERY =====
class Gallery {
    constructor() {
        this.filterButtons = $$('.filter-btn');
        this.galleryItems = $$('.gallery-item');
        this.lightbox = $('#lightbox');
        this.lightboxImg = $('#lightbox-img');
        this.lightboxTitle = $('#lightbox-title');
        this.lightboxDescription = $('#lightbox-description');
        this.currentImageIndex = 0;
        this.visibleImages = [];
        
        this.init();
    }

    init() {
        if (this.filterButtons.length > 0) {
            this.initFilters();
        }
        
        if (this.galleryItems.length > 0 && this.lightbox) {
            this.initLightbox();
        }
    }

    initFilters() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', this.handleFilter.bind(this));
        });
    }

    handleFilter(event) {
        const filter = event.target.getAttribute('data-filter');
        
        // Update active button
        this.filterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });
        event.target.classList.add('active');
        event.target.setAttribute('aria-pressed', 'true');
        
        // Filter items
        this.galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                item.setAttribute('aria-hidden', 'false');
            } else {
                item.style.display = 'none';
                item.setAttribute('aria-hidden', 'true');
            }
        });
        
        // Update visible images for lightbox
        this.updateVisibleImages();
        
        // Announce filter change to screen readers
        this.announceFilterChange(filter);
    }

    updateVisibleImages() {
        this.visibleImages = Array.from(this.galleryItems).filter(item => 
            item.style.display !== 'none'
        );
    }

    announceFilterChange(filter) {
        const announcement = filter === 'all' 
            ? 'Toutes les photos sont affichées' 
            : `Photos filtrées par catégorie : ${filter}`;
        
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.textContent = announcement;
        document.body.appendChild(announcer);
        
        setTimeout(() => document.body.removeChild(announcer), 1000);
    }

    initLightbox() {
        this.galleryItems.forEach((item, index) => {
            const viewButton = item.querySelector('.gallery-view');
            if (viewButton) {
                viewButton.addEventListener('click', () => this.openLightbox(index));
            }
        });

        // Lightbox controls
        const closeBtn = this.lightbox.querySelector('.lightbox-close');
        const prevBtn = this.lightbox.querySelector('.lightbox-prev');
        const nextBtn = this.lightbox.querySelector('.lightbox-next');
        const overlay = this.lightbox.querySelector('.lightbox-overlay');

        if (closeBtn) closeBtn.addEventListener('click', this.closeLightbox.bind(this));
        if (prevBtn) prevBtn.addEventListener('click', this.prevImage.bind(this));
        if (nextBtn) nextBtn.addEventListener('click', this.nextImage.bind(this));
        if (overlay) overlay.addEventListener('click', this.closeLightbox.bind(this));

        // Keyboard navigation
        document.addEventListener('keydown', this.handleLightboxKeydown.bind(this));
        
        // Update visible images initially
        this.updateVisibleImages();
    }

    openLightbox(index) {
        this.currentImageIndex = index;
        this.updateLightboxContent();
        this.lightbox.classList.add('active');
        this.lightbox.setAttribute('aria-hidden', 'false');
        
        // Focus management
        const closeBtn = this.lightbox.querySelector('.lightbox-close');
        if (closeBtn) closeBtn.focus();
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        this.lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Return focus to the gallery item that opened the lightbox
        const currentItem = this.galleryItems[this.currentImageIndex];
        const viewButton = currentItem?.querySelector('.gallery-view');
        if (viewButton) viewButton.focus();
    }

    prevImage() {
        this.currentImageIndex = this.currentImageIndex > 0 
            ? this.currentImageIndex - 1 
            : this.visibleImages.length - 1;
        this.updateLightboxContent();
    }

    nextImage() {
        this.currentImageIndex = this.currentImageIndex < this.visibleImages.length - 1 
            ? this.currentImageIndex + 1 
            : 0;
        this.updateLightboxContent();
    }

    updateLightboxContent() {
        const currentItem = this.visibleImages[this.currentImageIndex];
        if (!currentItem) return;

        const img = currentItem.querySelector('.gallery-image');
        const title = currentItem.querySelector('.gallery-title');
        const description = currentItem.querySelector('.gallery-description');

        if (img && this.lightboxImg) {
            this.lightboxImg.src = img.src;
            this.lightboxImg.alt = img.alt;
        }

        if (title && this.lightboxTitle) {
            this.lightboxTitle.textContent = title.textContent;
        }

        if (description && this.lightboxDescription) {
            this.lightboxDescription.textContent = description.textContent;
        }
    }

    handleLightboxKeydown(event) {
        if (!this.lightbox.classList.contains('active')) return;

        switch (event.key) {
            case 'Escape':
                this.closeLightbox();
                break;
            case 'ArrowLeft':
                this.prevImage();
                break;
            case 'ArrowRight':
                this.nextImage();
                break;
        }
    }
}

// ===== CALENDAR =====
class Calendar {
    constructor() {
        this.calendarGrid = $('#calendar-grid');
        this.currentMonth = $('#current-month');
        this.prevBtn = $('#prev-month');
        this.nextBtn = $('#next-month');
        
        this.currentDate = new Date();
        this.displayDate = new Date();
        
        // Sample events data
        this.events = {
            '2024-03-15': { type: 'stage', title: 'Stage Technique avec Kenji Tanaka' },
            '2024-03-22': { type: 'grade', title: 'Passage de Grades Enfants' },
            '2024-04-05': { type: 'club', title: 'Tournoi Interne Printemps' },
            '2024-04-12': { type: 'competition', title: 'Championnat Régional Jeunes' }
        };
        
        this.init();
    }

    init() {
        if (this.calendarGrid && this.currentMonth && this.prevBtn && this.nextBtn) {
            this.prevBtn.addEventListener('click', this.prevMonth.bind(this));
            this.nextBtn.addEventListener('click', this.nextMonth.bind(this));
            this.render();
        }
    }

    prevMonth() {
        this.displayDate.setMonth(this.displayDate.getMonth() - 1);
        this.render();
    }

    nextMonth() {
        this.displayDate.setMonth(this.displayDate.getMonth() + 1);
        this.render();
    }

    render() {
        this.updateMonthTitle();
        this.renderCalendarGrid();
    }

    updateMonthTitle() {
        const options = { year: 'numeric', month: 'long' };
        this.currentMonth.textContent = this.displayDate.toLocaleDateString('fr-FR', options);
    }

    renderCalendarGrid() {
        this.calendarGrid.innerHTML = '';
        
        // Add day headers
        const dayHeaders = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        dayHeaders.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-day calendar-header';
            header.textContent = day;
            header.setAttribute('aria-label', day);
            this.calendarGrid.appendChild(header);
        });

        const year = this.displayDate.getFullYear();
        const month = this.displayDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        
        // Adjust to start on Monday
        const dayOfWeek = (firstDay.getDay() + 6) % 7;
        startDate.setDate(startDate.getDate() - dayOfWeek);

        // Generate calendar days
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            const dayElement = this.createDayElement(currentDate, month);
            this.calendarGrid.appendChild(dayElement);
        }
    }

    createDayElement(date, currentMonth) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        day.textContent = date.getDate();
        
        const dateString = date.toISOString().split('T')[0];
        const event = this.events[dateString];
        
        // Style current month vs other months
        if (date.getMonth() !== currentMonth) {
            day.style.opacity = '0.3';
        }
        
        // Highlight today
        if (this.isSameDay(date, this.currentDate)) {
            day.style.background = 'var(--judo-red)';
            day.style.color = 'white';
        }
        
        // Add event indicator
        if (event) {
            day.classList.add('has-event', `event-${event.type}`);
            day.setAttribute('title', event.title);
            day.setAttribute('aria-label', `${date.getDate()} - ${event.title}`);
        } else {
            day.setAttribute('aria-label', date.getDate().toString());
        }
        
        return day;
    }

    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }
}

// ===== FORM HANDLING =====
class FormHandler {
    constructor() {
        this.contactForm = $('.contact-form');
        this.init();
    }

    init() {
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', this.handleSubmit.bind(this));
            this.initFormValidation();
        }
    }

    initFormValidation() {
        const inputs = this.contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', this.validateField.bind(this));
            input.addEventListener('input', this.clearFieldError.bind(this));
        });
    }

    validateField(event) {
        const field = event.target;
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        
        this.clearFieldError(event);
        
        if (isRequired && !value) {
            this.showFieldError(field, 'Ce champ est obligatoire');
            return false;
        }
        
        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            this.showFieldError(field, 'Veuillez saisir une adresse email valide');
            return false;
        }
        
        if (field.type === 'tel' && value && !this.isValidPhone(value)) {
            this.showFieldError(field, 'Veuillez saisir un numéro de téléphone valide');
            return false;
        }
        
        return true;
    }

    clearFieldError(event) {
        const field = event.target;
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        field.classList.remove('error');
        field.removeAttribute('aria-describedby');
    }

    showFieldError(field, message) {
        const errorId = `${field.id}-error`;
        const errorElement = document.createElement('span');
        errorElement.id = errorId;
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = 'var(--judo-red)';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = 'var(--space-1)';
        
        field.classList.add('error');
        field.setAttribute('aria-describedby', errorId);
        field.parentNode.appendChild(errorElement);
        
        // Announce error to screen readers
        errorElement.setAttribute('aria-live', 'polite');
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^(?:(?:\+33|0)[1-9](?:[0-9]{8}))$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    handleSubmit(event) {
        const formData = new FormData(this.contactForm);
        const isValid = this.validateForm();
        
        if (!isValid) {
            event.preventDefault();
            this.focusFirstError();
            return;
        }
        
        // Show loading state
        const submitButton = this.contactForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Envoi en cours...';
            submitButton.disabled = true;
        }
        
        // Form will be submitted to FormSubmit
        // Add success message handling if needed
    }

    validateForm() {
        const inputs = this.contactForm.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            const fieldValid = this.validateField({ target: input });
            if (!fieldValid) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    focusFirstError() {
        const firstError = this.contactForm.querySelector('.error');
        if (firstError) {
            firstError.focus();
        }
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.animatedElements = $$('[class*="animate-"]');
        this.observer = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window && this.animatedElements.length > 0) {
            this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            this.animatedElements.forEach(element => {
                this.observer.observe(element);
            });
        }
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// ===== SMOOTH SCROLLING =====
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        const links = $$('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', this.handleClick.bind(this));
        });
    }

    handleClick(event) {
        const href = event.currentTarget.getAttribute('href');
        if (href === '#') return;
        
        const target = $(href);
        if (target) {
            event.preventDefault();
            this.scrollToElement(target);
        }
    }

    scrollToElement(element) {
        const offsetTop = element.offsetTop - 80; // Account for fixed header
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Focus management for accessibility
        element.focus();
        if (document.activeElement !== element) {
            element.setAttribute('tabindex', '-1');
            element.focus();
        }
    }
}

// ===== LAZY LOADING =====
class LazyLoader {
    constructor() {
        this.images = $$('img[loading="lazy"]');
        this.observer = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window && this.images.length > 0) {
            this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
                threshold: 0.1,
                rootMargin: '50px'
            });

            this.images.forEach(img => {
                this.observer.observe(img);
            });
        }
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.addEventListener('load', () => {
                    img.style.opacity = '1';
                });
                this.observer.unobserve(img);
            }
        });
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupReducedMotion();
        this.setupHighContrast();
    }

    setupKeyboardNavigation() {
        // Enhanced tab navigation for complex components
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setupFocusManagement() {
        // Ensure proper focus indicators
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-navigation *:focus {
                outline: 2px solid var(--judo-red) !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(style);
    }

    setupReducedMotion() {
        // Respect user's motion preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupHighContrast() {
        // Enhanced styles for high contrast mode
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.body.classList.add('high-contrast');
        }
    }
}

// ===== EVENT REGISTRATION =====
class EventRegistration {
    constructor() {
        this.registerButtons = $$('.event-register');
        this.init();
    }

    init() {
        this.registerButtons.forEach(button => {
            button.addEventListener('click', this.handleRegistration.bind(this));
        });
    }

    handleRegistration(event) {
        event.preventDefault();
        const button = event.target;
        const eventCard = button.closest('.event-card');
        const eventTitle = eventCard.querySelector('.event-title').textContent;
        
        // Simple modal or redirect to contact form with pre-filled subject
        const confirmed = confirm(`Voulez-vous vous inscrire à : ${eventTitle} ?`);
        if (confirmed) {
            // Redirect to contact form with pre-filled data
            const contactUrl = 'contact.html#form-title';
            window.location.href = contactUrl;
            
            // Store event info for form pre-filling
            sessionStorage.setItem('selectedEvent', eventTitle);
        }
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new Navigation();
    new Gallery();
    new Calendar();
    new FormHandler();
    new ScrollAnimations();
    new SmoothScroll();
    new LazyLoader();
    new AccessibilityManager();
    new EventRegistration();
    
    // Pre-fill contact form if coming from event registration
    const selectedEvent = sessionStorage.getItem('selectedEvent');
    if (selectedEvent && window.location.pathname.includes('contact.html')) {
        const subjectSelect = $('#subject');
        const messageTextarea = $('#message');
        
        if (subjectSelect) {
            subjectSelect.value = 'stage';
        }
        
        if (messageTextarea) {
            messageTextarea.value = `Je souhaite m'inscrire à : ${selectedEvent}\n\n`;
        }
        
        sessionStorage.removeItem('selectedEvent');
    }
    
    console.log('Club de Judo - Website loaded successfully');
});

// ===== SERVICE WORKER (PWA) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}