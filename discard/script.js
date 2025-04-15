gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', function() {
    // Initialize smooth scroll (using smooth-scrollbar)
    const Scrollbar = window.Scrollbar;
    const scrollbar = Scrollbar.init(document.body, {
        damping: 0.1,
        renderByPixels: true,
        continuousScrolling: true
    });

    // Connect GSAP ScrollTrigger with smooth-scrollbar
    ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) {
            if (arguments.length) {
                scrollbar.scrollTop = value;
            }
            return scrollbar.scrollTop;
        },
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight
            };
        }
    });

    scrollbar.addListener(ScrollTrigger.update);
    ScrollTrigger.defaults({ scroller: document.body });

    // Initialize other components
    initThreeJsBackground();
    initAnimations();
    initModal();
    initMobileMenu();
    initFormSubmission();
});

// ThreeJS Background Animation
function initThreeJsBackground() {
    const headerElement = document.querySelector('header');
    
    // Only initialize if ThreeJS is loaded
    if (typeof THREE === 'undefined' || !headerElement) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, headerElement.offsetWidth / headerElement.offsetHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(headerElement.offsetWidth, headerElement.offsetHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Create a container for the canvas and position it absolutely
    const threeContainer = document.createElement('div');
    threeContainer.style.position = 'absolute';
    threeContainer.style.top = '0';
    threeContainer.style.left = '0';
    threeContainer.style.width = '100%';
    threeContainer.style.height = '100%';
    threeContainer.style.overflow = 'hidden';
    threeContainer.style.zIndex = '1';
    threeContainer.style.opacity = '0.3';
    
    threeContainer.appendChild(renderer.domElement);
    headerElement.insertBefore(threeContainer, headerElement.firstChild);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 100;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: 0xFFFFFF
    });
    
    // Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    camera.position.z = 5;
    
    // Animation loop
    const animate = () => {
        requestAnimationFrame(animate);
        
        particlesMesh.rotation.x += 0.001;
        particlesMesh.rotation.y += 0.001;
        
        renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
        renderer.setSize(headerElement.offsetWidth, headerElement.offsetHeight);
        camera.aspect = headerElement.offsetWidth / headerElement.offsetHeight;
        camera.updateProjectionMatrix();
    });
}

// GSAP Animations
function initAnimations() {
    // Hero section animations
    gsap.from('.hero-content', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-image', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
    });
    
    // Features section animations
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: index * 0.2,
            ease: 'power3.out'
        });
    });
    
    // Steps animations
    const steps = document.querySelectorAll('.step');
    
    steps.forEach((step, index) => {
        gsap.from(step, {
            scrollTrigger: {
                trigger: step,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: -50,
            duration: 0.8,
            delay: index * 0.2,
            ease: 'power3.out'
        });
    });
    
    // App preview animations
    gsap.from('.app-preview-content', {
        scrollTrigger: {
            trigger: '.app-preview',
            start: 'top 70%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        x: -50,
        duration: 1,
        ease: 'power3.out'
    });
    
    gsap.from('.phone-frame', {
        scrollTrigger: {
            trigger: '.app-preview',
            start: 'top 70%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        x: 50,
        duration: 1,
        ease: 'power3.out'
    });
    
    // Restaurant logos animations
    const logos = document.querySelectorAll('.logo-container');
    
    logos.forEach((logo, index) => {
        gsap.from(logo, {
            scrollTrigger: {
                trigger: '.restaurant-logos',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'power3.out'
        });
    });
    
    // Restaurant CTA animation
    gsap.from('.restaurant-cta', {
        scrollTrigger: {
            trigger: '.restaurant-cta',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
    });
    
    // Testimonial animations
    const testimonials = document.querySelectorAll('.testimonial');
    
    testimonials.forEach((testimonial, index) => {
        gsap.from(testimonial, {
            scrollTrigger: {
                trigger: testimonial,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: index * 0.2,
            ease: 'power3.out'
        });
    });
    
    // Download section animations
    gsap.from('.download-content', {
        scrollTrigger: {
            trigger: '.download',
            start: 'top 70%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        x: -50,
        duration: 1,
        ease: 'power3.out'
    });
    
    gsap.from('.download-image', {
        scrollTrigger: {
            trigger: '.download',
            start: 'top 70%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        x: 50,
        duration: 1,
        ease: 'power3.out'
    });
}

// Modal functionality
function initModal() {
    const modal = document.getElementById('loginModal');
    const btn = document.getElementById('shopLoginBtn');
    const closeBtn = document.querySelector('.close-modal');
    
    if (!modal || !btn || !closeBtn) return;
    
    btn.addEventListener('click', () => {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Animate modal opening
        gsap.fromTo(
            '.modal-content',
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
        );
    });
    
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Prevent form submission (demo)
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show success message
        const form = e.target;
        const successMessage = document.createElement('div');
        successMessage.textContent = 'Login successful!';
        successMessage.style.color = 'green';
        successMessage.style.marginTop = '1rem';
        successMessage.style.textAlign = 'center';
        
        form.appendChild(successMessage);
        
        // Reset form after 2 seconds and close modal
        setTimeout(() => {
            form.reset();
            form.removeChild(successMessage);
            closeModal();
        }, 2000);
    });
    
    function closeModal() {
        gsap.to('.modal-content', {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// Mobile menu functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (!hamburger || !navLinks) return;
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Animate hamburger icon
        const spans = hamburger.querySelectorAll('span');
        
        if (navLinks.classList.contains('active')) {
            gsap.to(spans[0], { rotate: 45, y: 9, duration: 0.3 });
            gsap.to(spans[1], { opacity: 0, duration: 0.3 });
            gsap.to(spans[2], { rotate: -45, y: -9, duration: 0.3 });
        } else {
            gsap.to(spans[0], { rotate: 0, y: 0, duration: 0.3 });
            gsap.to(spans[1], { opacity: 1, duration: 0.3 });
            gsap.to(spans[2], { rotate: 0, y: 0, duration: 0.3 });
        }
    });
    
    // Close mobile menu when clicking a nav link
    const mobileNavLinks = navLinks.querySelectorAll('a');
    
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                
                // Reset hamburger icon
                const spans = hamburger.querySelectorAll('span');
                gsap.to(spans[0], { rotate: 0, y: 0, duration: 0.3 });
                gsap.to(spans[1], { opacity: 1, duration: 0.3 });
                gsap.to(spans[2], { rotate: 0, y: 0, duration: 0.3 });
            }
        });
    });
}

// Form submission handling
function initFormSubmission() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show success message
        const form = e.target;
        const successMessage = document.createElement('div');
        successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
        successMessage.style.color = 'green';
        successMessage.style.marginTop = '1rem';
        successMessage.style.textAlign = 'center';
        
        form.appendChild(successMessage);
        
        // Reset form after 3 seconds
        setTimeout(() => {
            form.reset();
            form.removeChild(successMessage);
        }, 3000);
    });
}

// Implement smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href^="#"]');
    
    if (link) {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const scrollbar = Smoothscroll.get(document.querySelector('.smooth-scroll'));
            
            if (scrollbar) {
                const targetPosition = scrollbar.offset.y + targetElement.getBoundingClientRect().top;
                
                scrollbar.scrollTo(0, targetPosition, 1000);
            } else {
                // Fallback for browsers without smooth-scrollbar
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    }
});

// Handle navigation bar color change on scroll
window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    const nav = document.querySelector('nav');
    
    if (scrollPosition > 50) {
        nav.style.backgroundColor = 'var(--primary-color)';
        nav.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.backgroundColor = 'transparent';
        nav.style.boxShadow = 'none';
    }
});