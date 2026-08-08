/**
 * script.js - Complete Restoration
 * Restores Hero 3D, Projects Parallax, Services Horizontal Scroll, and Blog Animations.
 */

// 1. REGISTER GSAP PLUGINS
gsap.registerPlugin(ScrollTrigger);

// --- GLOBAL DATA DEFAULTS (Fail-safe) ---
const DEFAULTS = {
    HERO: [
        { id: 0, title: "Web Development", subtitle: "Architecting the Digital Future", description: "We build robust, scalable, and lightning-fast web applications.", colors: ["#06b6d4", "#2563eb"], icon: "ri-code-s-slash-line", tech: ["React", "Node.js", "WebGL"], stat: "99.9% Uptime", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop" },
        { id: 1, title: "Graphic Design", subtitle: "Visuals That Breathe", description: "Forging brand identities that resonate.", colors: ["#a855f7", "#db2777"], icon: "ri-pen-nib-line", tech: ["UI/UX", "Motion", "Branding"], stat: "Award Winning", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop" },
        { id: 2, title: "Digital Marketing", subtitle: "Data-Driven Dominance", description: "Scaling your reach through algorithmic precision.", colors: ["#f97316", "#dc2626"], icon: "ri-bar-chart-grouped-line", tech: ["SEO", "PPC", "Growth"], stat: "300% ROI", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" }
    ],
    PROJECTS: [
        { id: 1, title: "Mono & Motion", category: "Website", subtitle: "Design & Dev", isLarge: false, link: "projectpage1.html", image: "images/projects/mono_hero.jpg" },
        { id: 2, title: "Zero Studio", category: "App", subtitle: "Design & Dev", isLarge: true, link: "projectpage2.html", image: "https://images.unsplash.com/photo-1545239351-ef35f43d514b?q=80&w=1974&auto=format&fit=crop" },
        { id: 3, title: "Creative Canvas", category: "Design", subtitle: "Branding", isLarge: false, link: "projectpage3.html", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop" },
        { id: 4, title: "Pixel Pioneers", category: "App", subtitle: "UI/UX", isLarge: false, link: "projectpage4.html", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop" }
    ],
    BLOG: [
        { id: 1, category: "Design", date: "Oct 24, 2025", image: "https://cdn.prod.website-files.com/68751abd96d2074611f9be95/687fa830bf6c16612accd187_Project%20Image%2002.avif", title: "Design Trends of 2025", excerpt: "Explore how minimalism, AI-driven design, and immersive storytelling will shape the digital landscape.", link: "blogpage1.html" },
        { id: 2, category: "Branding", date: "Oct 18, 2025", image: "https://cdn.prod.website-files.com/68751abd96d2074611f9be95/687fa8955342ad8583494a7b_Project%20Image%2004.avif", title: "Why Branding Matters", excerpt: "Learn why consistent branding is essential for creating trust, loyalty and recognition in the digital space.", link: "blogpage2.html" },
        { id: 3, category: "Tech", date: "Oct 12, 2025", image: "https://cdn.prod.website-files.com/68751abd96d2074611f9be95/687fa7ff583252dd175256f7_Project%20Image%2001.avif", title: "Future of UX/UI", excerpt: "Discover how user-centered design is evolving with Neural Interfaces and Spatial Computing.", link: "blogpage3.html" }
    ]
};

// --- LOCOMOTIVE SCROLL SETUP ---
let locoScroll;

function initLocomotiveScroll() {
    const scrollEl = document.querySelector("#main");
    if (!scrollEl) return;

    locoScroll = new LocomotiveScroll({
        el: scrollEl,
        smooth: true,
        tablet: { smooth: true },
        smartphone: { smooth: true }
    });

    locoScroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy("#main", {
        scrollTop(value) {
            return arguments.length 
                ? locoScroll.scrollTo(value, 0, 0) 
                : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return { 
                top: 0, 
                left: 0, 
                width: window.innerWidth, 
                height: window.innerHeight 
            };
        },
        // PinType "transform" is CRITICAL for pinning to work inside Locomotive
        pinType: scrollEl.style.transform ? "transform" : "fixed"
    });

    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.defaults({ scroller: "#main" });
}

// --- HERO SECTION (3D TILT & SLIDER) ---
class DimensionalHero {
    constructor() {
        this.dom = {
            container: document.querySelector('.hero-section'),
            tiltCard: document.getElementById('tilt-card'),
            bgGrid: document.querySelector('.hero-grid'),
            orbs: document.querySelectorAll('.hero-orb'),
            
            // Text Elements
            dynamicTitle: document.getElementById('dynamic-title'),
            dynamicSubtitle: document.getElementById('dynamic-subtitle'),
            dynamicDesc: document.getElementById('dynamic-desc'),
            dynamicTags: document.getElementById('dynamic-tags'),
            
            // Visuals
            cardIconContainer: document.getElementById('card-icon-container'),
            cardMainIcon: document.getElementById('card-main-icon'),
            cardStat: document.getElementById('card-stat'),
            visualElement: document.getElementById('visual-element'),
            visualGlow: document.getElementById('visual-glow'),
            
            // Navigation
            ctaBtn: document.getElementById('hero-cta-btn'),
            tabsContainer: document.querySelector('.card-nav-tabs') 
        };

        this.state = { activeIndex: 0 };
        this.services = this.loadData();
    }

    loadData() {
        const stored = localStorage.getItem('DIGIWEB_HERO_DATA');
        if (stored) {
            try { return JSON.parse(stored); } catch (e) {}
        }
        return DEFAULTS.HERO;
    }

    init() {
        if (!this.dom.container) return;
        
        // 1. Render Tabs
        this.renderTabs();
        
        // 2. Mouse Move Listener (3D Tilt)
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // 3. Auto Slider
        this.startAutoSlide();
        
        // 4. Initial Render
        this.render(0);
    }

    renderTabs() {
        if (!this.dom.tabsContainer) return;
        this.dom.tabsContainer.innerHTML = this.services.map((s, index) => `
            <button class="nav-tab ${index === 0 ? 'active' : ''}" data-index="${index}">
                <div class="tab-progress"></div>
                <i class="${s.icon}"></i>
                <span style="font-size: 0.6rem; font-weight: 600;">${s.title.split(' ')[0].toUpperCase()}</span>
            </button>
        `).join('');
        
        this.dom.tabsContainer.style.display = 'grid';
        this.dom.tabsContainer.style.gridTemplateColumns = `repeat(${this.services.length}, 1fr)`;
        
        // Tab Click Listeners
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const idx = parseInt(tab.getAttribute('data-index'));
                this.switchService(idx);
            });
        });
    }

    handleMouseMove(e) {
        if (window.innerWidth <= 1024) return;
        
        // Normalize coordinates (-1 to 1)
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;

        // Apply 3D Transform
        if (this.dom.tiltCard) {
            this.dom.tiltCard.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${y * -5}deg)`;
        }
        if (this.dom.bgGrid) {
            this.dom.bgGrid.style.transform = `perspective(1000px) rotateX(60deg) translateY(${y * 20}px) translateZ(-100px)`;
        }
        
        // Move Orbs
        if (this.dom.orbs[0]) this.dom.orbs[0].style.transform = `translate(${x * -30}px, ${y * -30}px)`;
        if (this.dom.orbs[1]) this.dom.orbs[1].style.transform = `translate(${x * 30}px, ${y * 30}px)`;
    }

    switchService(index) {
        if (this.state.activeIndex === index) return;
        this.state.activeIndex = index;
        this.startAutoSlide(); // Reset timer
        this.render(index);
    }

    startAutoSlide() {
        if (this.autoInterval) clearInterval(this.autoInterval);
        this.autoInterval = setInterval(() => {
            const next = (this.state.activeIndex + 1) % this.services.length;
            this.switchService(next);
        }, 8000);
    }

    render(index) {
        const data = this.services[index];
        const color1 = data.colors[0];
        const color2 = data.colors[1];
        const gradient = `linear-gradient(90deg, ${color1}, ${color2})`;

        // Animate Text Out -> Change -> In
        const textEls = [this.dom.dynamicTitle, this.dom.dynamicSubtitle, this.dom.dynamicDesc];
        
        gsap.to(textEls, { 
            opacity: 0, 
            y: -10, 
            duration: 0.2, 
            onComplete: () => {
                // Update Content
                if (this.dom.dynamicTitle) {
                    this.dom.dynamicTitle.textContent = data.title;
                    this.dom.dynamicTitle.style.background = gradient;
                    this.dom.dynamicTitle.style.webkitBackgroundClip = "text";
                    this.dom.dynamicTitle.style.webkitTextFillColor = "transparent";
                }
                if (this.dom.dynamicSubtitle) this.dom.dynamicSubtitle.textContent = data.subtitle;
                if (this.dom.dynamicDesc) this.dom.dynamicDesc.textContent = data.description;
                
                // Update Tags
                if (this.dom.dynamicTags) {
                    this.dom.dynamicTags.innerHTML = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
                }
                
                // Update Buttons
                if (this.dom.ctaBtn) {
                    this.dom.ctaBtn.style.background = gradient;
                    this.dom.ctaBtn.style.boxShadow = `0 10px 25px -5px ${color1}66`;
                }

                gsap.to(textEls, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 });
            }
        });

        // Update Visual Card
        if (this.dom.cardIconContainer) this.dom.cardIconContainer.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
        if (this.dom.cardMainIcon) this.dom.cardMainIcon.className = data.icon;
        if (this.dom.cardStat) this.dom.cardStat.textContent = data.stat;
        if (this.dom.visualGlow) this.dom.visualGlow.style.background = `radial-gradient(circle at center, ${color1}33, transparent 70%)`;

        // Update Image with Fade
        if (this.dom.visualElement) {
            const safeImg = data.image || "https://placehold.co/600x400";
            const newImgHTML = `
                <div class="image-wrapper" style="border-color: ${color1}">
                    <img src="${safeImg}" alt="${data.title}" class="card-visual-img" />
                    <div class="img-overlay" style="background: linear-gradient(to top, ${color1}40, transparent)"></div>
                </div>
            `;
            
            gsap.to(this.dom.visualElement, { opacity: 0, scale: 0.95, duration: 0.2, onComplete: () => {
                this.dom.visualElement.innerHTML = newImgHTML;
                gsap.to(this.dom.visualElement, { opacity: 1, scale: 1, duration: 0.4 });
            }});
        }

        // Update Tabs Active State
        document.querySelectorAll('.nav-tab').forEach(tab => {
            const tIdx = parseInt(tab.getAttribute('data-index'));
            const prog = tab.querySelector('.tab-progress');
            if (tIdx === index) {
                tab.classList.add('active');
                if (prog) prog.style.background = gradient;
            } else {
                tab.classList.remove('active');
            }
        });
    }
}

// --- PROJECTS SECTION (Dynamic + Parallax) ---
function initProjects() {
    const container = document.getElementById('project-list-container');
    if (!container) return;

    // Load Data
    let projectData = DEFAULTS.PROJECTS;
    const stored = localStorage.getItem('DIGIWEB_PROJECTS');
    if (stored) {
        try { 
            const parsed = JSON.parse(stored);
            if (parsed.length > 0) projectData = parsed;
        } catch(e) {}
    }

    // Render Grid
    container.innerHTML = '';
    let row = document.createElement('div');
    row.className = 'work-row';
    
    projectData.forEach((p, i) => {
        const item = document.createElement('div');
        item.className = `work-item ${p.isLarge ? 'large-item' : ''}`;
        let safeImg = p.image || `https://placehold.co/800x600/1a1a1a/555555?text=${encodeURIComponent(p.title)}`;

        item.innerHTML = `
            <article class="w-dyn-list">
                <div role="list" class="w-dyn-items">
                    <div role="listitem" class="w-dyn-item">
                        <a href="${p.link}" class="work-link w-inline-block">
                            <figure class="work-image-wrap ${p.isLarge ? 'large' : ''} image-parallax">
                                <img src="${safeImg}" class="fit-cover scale-image" loading="lazy" alt="${p.title}"/>
                            </figure>
                            <div class="work-details-wrap">
                                <h3 class="h6">${p.title}</h3>
                                <div><div class="paragraph-03">${p.category}</div></div>
                            </div>
                        </a>
                    </div>
                </div>
            </article>
        `;
        row.appendChild(item);

        if ((i + 1) % 2 === 0 || i === projectData.length - 1) {
            container.appendChild(row);
            row = document.createElement('div');
            row.className = 'work-row';
        }
    });

    // PARALLAX EFFECT FOR PROJECTS
    // This creates the subtle "slower scroll" effect on images
    setTimeout(() => {
        const images = document.querySelectorAll('.image-parallax img');
        if (images.length > 0) {
            images.forEach(img => {
                gsap.to(img, {
                    yPercent: 15, // Move image down slightly as we scroll
                    ease: "none",
                    scrollTrigger: {
                        trigger: img.closest('.work-item'),
                        start: "top bottom", // Start when item enters viewport
                        end: "bottom top",   // End when item leaves
                        scrub: true,
                        scroller: "#main"
                    }
                });
            });
        }
    }, 500); // Small delay to ensure DOM is ready
}

// --- SERVICES SECTION (Horizontal Scroll Fix) ---
function initServicesAnimation() {
    const wrap = document.querySelector('.services-07-wrap');
    const sticky = document.querySelector('.services-07-sticky-wrap');
    const cardsContainer = document.querySelector('.services-cards');

    if (!wrap || !sticky || !cardsContainer) return;

    // Corrected Logic:
    // 1. We rely on window.onload to ensure layout is ready.
    // 2. We use a function for 'x' so ScrollTrigger handles resize recalculations automatically.

    gsap.to(cardsContainer, {
        x: () => {
             // Calculate width dynamically
             return -(cardsContainer.scrollWidth - window.innerWidth);
        },
        ease: "none",
        scrollTrigger: {
            trigger: ".services-07-wrap", // The wrapper determines the scroll duration (height)
            start: "top top",
            end: "bottom bottom",
            pin: ".services-07-sticky-wrap", // Pin the container holding the cards
            scrub: 1,
            scroller: "#main", // Link to Locomotive
            invalidateOnRefresh: true // Recalculate on window resize
        }
    });
}

// --- BLOG SECTION (Entrance + Tilt) ---
function initBlog() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;

    // Render Cards
    grid.innerHTML = DEFAULTS.BLOG.map(post => `
        <article class="blog-card" style="opacity:0; transform:translateY(50px)">
            <div class="blog-image-wrap">
                <span class="card-tag">${post.category}</span>
                <img src="${post.image}" alt="${post.title}" onerror="this.src='https://via.placeholder.com/400x300/1a1a1a/cccccc?text=Image+Not+Found'">
            </div>
            <div class="blog-details">
                <div>
                    <div class="blog-meta"><time>${post.date}</time> • <span>5 min read</span></div>
                    <h3 class="h3">${post.title}</h3>
                    <p class="paragraph-03">${post.excerpt}</p>
                </div>
                <div class="button-wrap">
                    <a href="${post.link}" class="button-02-text">Read Article</a>
                </div>
            </div>
        </article>
    `).join('');

    // GSAP ScrollTrigger Entrance
    const cards = document.querySelectorAll('.blog-card');
    if (cards.length > 0) {
        gsap.to(cards, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: "#blogGrid",
                start: "top 80%", // Trigger when top of grid hits 80% of viewport height
                scroller: "#main"
            }
        });

        // 3D Tilt Effect
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                
                // Tilt calculation
                card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale3d(1, 1, 1)';
            });
        });
    }
}

// --- HELPER FUNCTIONS (About & Ticker) ---

function initAbout() {
    try {
        const stored = localStorage.getItem('DIGIWEB_ABOUT_DATA');
        if (!stored) return;
        const d = JSON.parse(stored);
        
        // Helper to set Text/HTML/Image
        const setT = (sel, val) => { const el = document.querySelector(sel); if(el) el.textContent = val; };
        const setH = (sel, val) => { const el = document.querySelector(sel); if(el) el.innerHTML = val; };
        const setI = (sel, val) => { const el = document.querySelector(sel + ' img'); if(el) el.src = val; };

        // Mission
        setH('#content-mission h2', d.mission.title);
        setT('#content-mission p', d.mission.desc);
        setT('#content-mission .flex > div:nth-child(1) h4', d.mission.stat1Num);
        setT('#content-mission .flex > div:nth-child(1) p', d.mission.stat1Label);
        setT('#content-mission .flex > div:nth-child(2) h4', d.mission.stat2Num);
        setT('#content-mission .flex > div:nth-child(2) p', d.mission.stat2Label);
        setI('#img-mission', d.mission.image);

        // Stack & Vision
        setH('#content-stack h2', d.stack.title);
        setT('#content-stack > p', d.stack.desc);
        setI('#img-stack', d.stack.image);
        setH('#content-vision h2', d.vision.title);
        setT('#content-vision p', d.vision.desc);
        setI('#img-vision', d.vision.image);

    } catch(e) {}
}

function initTicker() {
    try {
        const stored = localStorage.getItem('DIGIWEB_TICKER_DATA');
        if (!stored) return;
        const tData = JSON.parse(stored);
        if (tData.length > 0) {
            const html = tData.map(l => `<img src="${l.src}" alt="${l.alt}">`).join('');
            document.querySelectorAll('#moving-div .move').forEach(d => d.innerHTML = html);
        }
    } catch(e) {}
}

// Tab Switcher for About Section
function switchTab(tabName) {
    // Buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('bg-primary-green', 'text-white', 'border-primary-green');
        btn.classList.add('text-slate-400', 'border-slate-800');
    });
    const activeBtn = document.getElementById(`tab-btn-${tabName}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-primary-green', 'text-white', 'border-primary-green');
        activeBtn.classList.remove('text-slate-400', 'border-slate-800');
    }

    // Content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden'); 
        content.classList.remove('fade-in-content');
    });
    const activeContent = document.getElementById(`content-${tabName}`);
    if (activeContent) {
        activeContent.classList.remove('hidden'); 
        // Force reflow for fade animation
        void activeContent.offsetWidth; 
        activeContent.classList.add('fade-in-content');
    }

    // Images
    document.querySelectorAll('.about-image').forEach(img => {
        img.classList.remove('active-img', 'opacity-100'); 
        img.classList.add('opacity-0');
    });
    const imgId = `img-${tabName}`;
    const activeImg = document.getElementById(imgId);
    if (activeImg) {
        activeImg.classList.add('active-img', 'opacity-100'); 
        activeImg.classList.remove('opacity-0');
    }
}

// --- MAIN INITIALIZATION SEQUENCE ---
// Using 'window.onload' to ensure images/fonts are loaded for correct scroll calculations

window.addEventListener("load", () => {
    
    // 1. Initialize Content
    initProjects();
    initBlog();
    initAbout();
    initTicker();

    // 2. Initialize Hero Logic
    const hero = new DimensionalHero();
    hero.init();

    // 3. Reveal Site (Loader)
    const tl = gsap.timeline();
    tl.to("#loader-inner", { height: "100vh", width: "100vw", borderRadius: 0, duration: 1.0, ease: "expo.inOut" })
      .to("#loader", { display: "none" })
      .to("nav, #main", { 
          opacity: 1, 
          duration: 0.5, 
          onComplete: () => {
              // 4. Initialize SCROLL ENGINE (Crucial Step)
              initLocomotiveScroll();

              // 5. Initialize SCROLL ANIMATIONS
              // (Must happen after Locomotive is ready)
              initServicesAnimation();
              
              // 6. Refresh ScrollTrigger to map all positions
              ScrollTrigger.refresh();
          }
      });
});

// --- CUSTOM CURSOR ---
document.addEventListener("DOMContentLoaded", () => {
    const dot = document.querySelector(".cursor-dot");
    const out = document.querySelector(".cursor-outline");
    
    if (dot && out) {
        window.addEventListener("mousemove", (e) => {
            const x = e.clientX;
            const y = e.clientY;
            
            // Dot moves instantly
            dot.style.left = `${x}px`;
            dot.style.top = `${y}px`;
            
            // Outline follows with native animation for smoothness
            out.animate({
                left: `${x}px`,
                top: `${y}px`
            }, { duration: 500, fill: "forwards" });
        });
    }
});