/**
 * Daksh's Cybersecurity Portfolio - Ivress-Inspired Editorial Narrative Engine
 * Handles Custom Cursor Follower, Organic Atmospheric Particle Canvas, 
 * Client-Side Security Auditor Modal, Clipboard-Copy Snackbar, and Navigation Scroll Spy.
 */

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initCanvasParticles();
    initThemeToggle();
    initSecurityAuditor();
    initContactClipboard();
    initScrollSpy();
});

// ----------------------------------------------------
// 1. Custom Cursor Follower (Lag & Scale Animations)
// ----------------------------------------------------
function initCustomCursor() {
    const cursorDot = document.createElement('div');
    const cursorFollower = document.createElement('div');
    
    cursorDot.className = 'custom-cursor-dot';
    cursorFollower.className = 'custom-cursor-follower';
    
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorFollower);

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    let dotX = 0, dotY = 0;
    
    const lagSpeed = 0.16; // Lerp factor for the follower ring (smooth lag)
    const dotSpeed = 0.35; // Faster lerp for the center dot

    let isHidden = true;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (isHidden) {
            cursorDot.style.opacity = '1';
            cursorFollower.style.opacity = '1';
            isHidden = false;
        }
    });

    window.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorFollower.style.opacity = '0';
        isHidden = true;
    });

    // Render loop for smooth cursor animation
    function updateCursor() {
        // Follower lerp
        followerX += (mouseX - followerX) * lagSpeed;
        followerY += (mouseY - followerY) * lagSpeed;
        
        // Dot lerp
        dotX += (mouseX - dotX) * dotSpeed;
        dotY += (mouseY - dotY) * dotSpeed;

        cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
        cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;

        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Hover scale effects on interactive elements
    const hoverables = document.querySelectorAll('a, button, .copy-trigger, .btn');
    hoverables.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            cursorFollower.classList.add('cursor-active');
            cursorDot.classList.add('dot-active');
        });
        el.addEventListener('mouseleave', () => {
            cursorFollower.classList.remove('cursor-active');
            cursorDot.classList.remove('dot-active');
        });
    });
}

// ----------------------------------------------------
// 2. Atmospheric Particle Canvas Background
// ----------------------------------------------------
function initCanvasParticles() {
    const canvas = document.getElementById('canvas-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const maxParticles = Math.min(80, Math.floor((width * height) / 18000));
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        scrollVelocity = currentScrollY - lastScrollY;
        lastScrollY = currentScrollY;
    });

    class Spore {
        constructor() {
            this.reset();
            this.y = Math.random() * height; // Start at random positions initially
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + 10; // Start just off-screen bottom
            this.size = Math.random() * 2 + 0.5;
            this.speed = Math.random() * 0.4 + 0.15; // Slow drift
            this.opacity = Math.random() * 0.4 + 0.1;
            this.drift = (Math.random() - 0.5) * 0.2;
        }

        update() {
            // Constant vertical drift upward
            this.y -= this.speed + Math.abs(scrollVelocity * 0.15); // Reacts to scroll speed
            this.x += this.drift;

            // Decay scroll velocity drag
            scrollVelocity *= 0.95;

            // Reset when drifting off-screen top or sides
            if (this.y < -10 || this.x < -10 || this.x > width + 10) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            // Render champagne gold or soft grey based on active theme
            const color = document.body.classList.contains('light-theme') 
                ? `rgba(23, 112, 181, ${this.opacity})` // Slate blue in light
                : `rgba(197, 168, 128, ${this.opacity})`; // Warm gold in dark
            ctx.fillStyle = color;
            ctx.fill();
        }
    }

    // Populate particles
    for (let i = 0; i < maxParticles; i++) {
        const spore = new Spore();
        particles.push(spore);
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p) => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }
    animate();
}

// ----------------------------------------------------
// 3. Light/Dark Theme Switcher
// ----------------------------------------------------
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    const applyTheme = (theme) => {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
            toggleBtn.innerHTML = '<i class="fa-solid fa-sun" aria-hidden="true"></i>';
        } else {
            document.body.classList.remove('light-theme');
            toggleBtn.innerHTML = '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
        }
    };

    if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
        applyTheme('light');
    } else {
        applyTheme('dark');
    }

    toggleBtn.addEventListener('click', () => {
        const isCurrentlyLight = document.body.classList.contains('light-theme');
        const nextTheme = isCurrentlyLight ? 'dark' : 'light';
        applyTheme(nextTheme);
        localStorage.setItem('theme', nextTheme);
    });
}

// ----------------------------------------------------
// 4. Client-Side Security Auditor Modal
// ----------------------------------------------------
function initSecurityAuditor() {
    const auditBtn = document.getElementById('btn-security-audit');
    const modal = document.getElementById('security-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const auditResults = document.getElementById('audit-results');

    if (!auditBtn || !modal || !closeBtn || !auditResults) return;

    auditBtn.addEventListener('click', () => {
        runClientAudit();
        modal.classList.add('modal-active');
        document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('modal-active')) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove('modal-active');
        document.body.style.overflow = '';
    }

    function runClientAudit() {
        const isHttps = window.location.protocol === 'https:';
        const isCookiesEnabled = navigator.cookieEnabled;
        const doNotTrack = navigator.doNotTrack === "1" || navigator.doNotTrack === "yes";
        const screenDimensions = `${window.screen.width}x${window.screen.height}`;
        const windowSize = `${window.innerWidth}x${window.innerHeight}`;
        
        const ua = navigator.userAgent;
        let browserName = "Unknown Browser";
        if (ua.indexOf("Firefox") > -1) browserName = "Firefox";
        else if (ua.indexOf("SamsungBrowser") > -1) browserName = "Samsung Browser";
        else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) browserName = "Opera";
        else if (ua.indexOf("Trident") > -1) browserName = "Internet Explorer";
        else if (ua.indexOf("Edge") > -1 || ua.indexOf("Edg") > -1) browserName = "Microsoft Edge";
        else if (ua.indexOf("Chrome") > -1) browserName = "Google Chrome";
        else if (ua.indexOf("Safari") > -1) browserName = "Apple Safari";

        let score = 60;
        if (isHttps) score += 20;
        if (isCookiesEnabled) score += 10;
        if (doNotTrack) score += 10;

        let protocolBadge = isHttps 
            ? '<span class="badge badge-success">SECURE (HTTPS)</span>' 
            : '<span class="badge badge-warning">INSECURE (HTTP/LOCAL)</span>';

        let cookiesBadge = isCookiesEnabled 
            ? '<span class="badge badge-info">ENABLED</span>' 
            : '<span class="badge badge-muted">DISABLED</span>';

        let dntBadge = doNotTrack 
            ? '<span class="badge badge-success">ACTIVE</span>' 
            : '<span class="badge badge-muted">INACTIVE / UNSPECIFIED</span>';

        let scoreClass = 'score-mid';
        if (score >= 90) scoreClass = 'score-high';
        else if (score < 70) scoreClass = 'score-low';

        auditResults.innerHTML = `
            <div class="audit-summary-box">
                <div class="audit-score-circle ${scoreClass}">
                    <span class="score-num">${score}</span>
                    <span class="score-label">Sec Rating</span>
                </div>
                <div class="audit-summary-text">
                    <h4>NARRATIVE DIAGNOSTICS: COMPLETE</h4>
                    <p>Audited at ${new Date().toLocaleTimeString()}. Sandbox environment verified stable.</p>
                </div>
            </div>
            
            <ul class="audit-details-list">
                <li>
                    <span class="detail-label">Audit Protocol:</span>
                    <span class="detail-value">${protocolBadge}</span>
                </li>
                <li>
                    <span class="detail-label">Client Browser:</span>
                    <span class="detail-value">${browserName}</span>
                </li>
                <li>
                    <span class="detail-label">Cookie Context:</span>
                    <span class="detail-value">${cookiesBadge}</span>
                </li>
                <li>
                    <span class="detail-label">Do Not Track:</span>
                    <span class="detail-value">${dntBadge}</span>
                </li>
                <li>
                    <span class="detail-label">Grid Resolution:</span>
                    <span class="detail-value">${screenDimensions} (Viewport: ${windowSize})</span>
                </li>
                <li>
                    <span class="detail-label">Host Signature:</span>
                    <span class="detail-value">${window.location.hostname || 'localhost'}</span>
                </li>
                <li>
                    <span class="detail-label">Sandbox CORS:</span>
                    <span class="detail-value"><span class="badge badge-success">ACTIVE (Enforced)</span></span>
                </li>
            </ul>
        `;
    }
}

// ----------------------------------------------------
// 5. Clipboard-Copy and Toast Snackbar Alert
// ----------------------------------------------------
function initContactClipboard() {
    const copyTriggers = document.querySelectorAll('.copy-trigger');
    const snackbar = document.getElementById('snackbar');

    if (!snackbar) return;

    copyTriggers.forEach((trigger) => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const textToCopy = trigger.getAttribute('data-copy');
            if (!textToCopy) return;

            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    showToast(`Copied signature values to clipboard //`);
                })
                .catch((err) => {
                    console.error('Clipboard copy failure: ', err);
                });
        });
    });

    function showToast(message) {
        snackbar.textContent = message;
        snackbar.classList.add('snackbar-active');
        
        setTimeout(() => {
            snackbar.classList.remove('snackbar-active');
        }, 3000);
    }
}

// ----------------------------------------------------
// 6. Navigation Scroll Spy
// ----------------------------------------------------
function initScrollSpy() {
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (sections.length === 0 || navLinks.length === 0) return;

    const spyObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id') || 'about';
                    
                    navLinks.forEach((link) => {
                        link.classList.remove('nav-active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('nav-active');
                        }
                    });
                }
            });
        },
        {
            threshold: 0.3,
            rootMargin: '-10% 0px -30% 0px'
        }
    );

    sections.forEach((sec) => spyObserver.observe(sec));
}
