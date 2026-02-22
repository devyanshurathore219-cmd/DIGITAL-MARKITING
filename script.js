/**
 * script.js - Complete Restoration & Master Blog Logic
 */

// 1. REGISTER GSAP PLUGINS
gsap.registerPlugin(ScrollTrigger);

// --- GLOBAL DATA DEFAULTS (Updated Links for Master Page) ---
const DEFAULTS = {
    HERO: [
        { id: 0, title: "Web Development", subtitle: "Architecting the Digital Future", description: "We build robust, scalable, and lightning-fast web applications.", colors: ["#06b6d4", "#2563eb"], icon: "ri-code-s-slash-line", tech: ["React", "Node.js", "WebGL"], stat: "99.9% Uptime", image: "https://www.creative-tim.com/blog/content/images/size/w960/2022/01/which-development-job-is-right-for-you.jpg" },
        { id: 1, title: "Graphic Design", subtitle: "Visuals That Breathe", description: "Forging brand identities that resonate.", colors: ["#a855f7", "#db2777"], icon: "ri-pen-nib-line", tech: ["UI/UX", "Motion", "Branding"], stat: "Award Winning", image: "https://images.unsplash.com/photo-1626785774583-b61d52677109?q=80&w=2071&auto=format&fit=crop" },
        { id: 2, title: "Digital Marketing", subtitle: "Data-Driven Dominance", description: "Scaling your reach through algorithmic precision.", colors: ["#f97316", "#dc2626"], icon: "ri-bar-chart-grouped-line", tech: ["SEO", "PPC", "Growth"], stat: "300% ROI", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" }
    ],
    PROJECTS: [
        { id: 1, title: "Mono & Motion", category: "Website", subtitle: "Design & Dev", isLarge: false, link: "projectpage1.html", image: "https://img.freepik.com/free-psd/flat-design-interior-design-template_23-2150031565.jpg?semt=ais_hybrid&w=740&q=80" },
        { id: 2, title: "Zero Studio", category: "App", subtitle: "Design & Dev", isLarge: true, link: "projectpage2.html", image: "https://images.unsplash.com/photo-1545239351-ef35f43d514b?q=80&w=1974&auto=format&fit=crop" },
        { id: 3, title: "Creative Canvas", category: "Design", subtitle: "Branding", isLarge: false, link: "projectpage3.html", image: "https://images.unsplash.com/photo-1558655146-d09347e0b7a9?q=80&w=2070&auto=format&fit=crop" },
        { id: 4, title: "Pixel Pioneers", category: "App", subtitle: "UI/UX", isLarge: false, link: "projectpage4.html", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop" }
    ],
    BLOG: [
        { id: 1, category: "Design", date: "Oct 24, 2025", image: "https://cdn.prod.website-files.com/68751abd96d2074611f9be95/687fa830bf6c16612accd187_Project%20Image%2002.avif", title: "Design Trends of 2025", excerpt: "Explore how minimalism, AI-driven design, and immersive storytelling will shape the digital landscape.", link: "blog-post.html?id=1", featured: true },
        { id: 2, category: "Branding", date: "Oct 18, 2025", image: "https://cdn.prod.website-files.com/68751abd96d2074611f9be95/687fa8955342ad8583494a7b_Project%20Image%2004.avif", title: "Why Branding Matters", excerpt: "Learn why consistent branding is essential for creating trust, loyalty and recognition in the digital space.", link: "blog-post.html?id=2", featured: true },
        { id: 3, category: "Tech", date: "Oct 12, 2025", image: "https://cdn.prod.website-files.com/68751abd96d2074611f9be95/687fa7ff583252dd175256f7_Project%20Image%2001.avif", title: "Future of UX/UI", excerpt: "Discover how user-centered design is evolving with Neural Interfaces and Spatial Computing.", link: "blog-post.html?id=3", featured: true },
        { id: 4, category: "Marketing", date: "Sep 28, 2025", image: "https://placehold.co/400x350/1a1a1a/0BA34E?text=SEO+Secrets", title: "The Top 5 SEO Secrets", excerpt: "Uncover the advanced strategies experts use to dominate search engine results and drive organic traffic.", link: "blog-post.html?id=4", featured: false }
    ],
    SERVICES: [
        { title: "Web Development", desc: "Scalable, high-performance web applications built with React & Node.js.", icon: "ri-code-s-slash-line", image: "https://images.unsplash.com/photo-1607705703571-c5a8695f18f6?q=80&w=2070&auto=format&fit=crop" },
        { title: "UI/UX Design", desc: "User-centric interfaces that drive engagement and improve conversion rates.", icon: "ri-pen-nib-line", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop" },
        { title: "Digital Marketing", desc: "Data-driven SEO & PPC strategies to boost your online visibility.", icon: "ri-bar-chart-grouped-line", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop" },
        { title: "E-Commerce", desc: "Secure, optimized online stores built on Shopify and WooCommerce.", icon: "ri-shopping-bag-3-line", image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2070&auto=format&fit=crop" }
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
        pinType: "transform"
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
            dynamicTitle: document.getElementById('dynamic-title'),
            dynamicSubtitle: document.getElementById('dynamic-subtitle'),
            dynamicDesc: document.getElementById('dynamic-desc'),
            dynamicTags: document.getElementById('dynamic-tags'),
            cardIconContainer: document.getElementById('card-icon-container'),
            cardMainIcon: document.getElementById('card-main-icon'),
            cardStat: document.getElementById('card-stat'),
            visualElement: document.getElementById('visual-element'),
            visualGlow: document.getElementById('visual-glow'),
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
        if (!this.dom.container) return; // Safely exit if not on homepage
        this.renderTabs();
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.startAutoSlide();
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
        
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const idx = parseInt(tab.getAttribute('data-index'));
                this.switchService(idx);
            });
        });
    }

    handleMouseMove(e) {
        if (window.innerWidth <= 1024) return;
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;

        if (this.dom.tiltCard) {
            this.dom.tiltCard.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${y * -5}deg)`;
        }
        if (this.dom.bgGrid) {
            this.dom.bgGrid.style.transform = `perspective(1000px) rotateX(60deg) translateY(${y * 20}px) translateZ(-100px)`;
        }
        if (this.dom.orbs[0]) this.dom.orbs[0].style.transform = `translate(${x * -30}px, ${y * -30}px)`;
        if (this.dom.orbs[1]) this.dom.orbs[1].style.transform = `translate(${x * 30}px, ${y * 30}px)`;
    }

    switchService(index) {
        if (this.state.activeIndex === index) return;
        this.state.activeIndex = index;
        this.startAutoSlide();
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

        const textEls = [this.dom.dynamicTitle, this.dom.dynamicSubtitle, this.dom.dynamicDesc];
        
        gsap.to(textEls, { 
            opacity: 0, 
            y: -10, 
            duration: 0.2, 
            onComplete: () => {
                if (this.dom.dynamicTitle) {
                    this.dom.dynamicTitle.textContent = data.title;
                    this.dom.dynamicTitle.style.background = gradient;
                    this.dom.dynamicTitle.style.webkitBackgroundClip = "text";
                    this.dom.dynamicTitle.style.webkitTextFillColor = "transparent";
                }
                if (this.dom.dynamicSubtitle) this.dom.dynamicSubtitle.textContent = data.subtitle;
                if (this.dom.dynamicDesc) this.dom.dynamicDesc.textContent = data.description;
                
                if (this.dom.dynamicTags) {
                    this.dom.dynamicTags.innerHTML = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
                }
                
                if (this.dom.ctaBtn) {
                    this.dom.ctaBtn.style.background = gradient;
                    this.dom.ctaBtn.style.boxShadow = `0 10px 25px -5px ${color1}66`;
                }

                gsap.to(textEls, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 });
            }
        });

        if (this.dom.cardIconContainer) this.dom.cardIconContainer.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
        if (this.dom.cardMainIcon) this.dom.cardMainIcon.className = data.icon;
        if (this.dom.cardStat) this.dom.cardStat.textContent = data.stat;
        if (this.dom.visualGlow) this.dom.visualGlow.style.background = `radial-gradient(circle at center, ${color1}33, transparent 70%)`;

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

    let projectData = DEFAULTS.PROJECTS;
    const stored = localStorage.getItem('DIGIWEB_PROJECTS');
    if (stored) {
        try { 
            const parsed = JSON.parse(stored);
            if (parsed.length > 0) projectData = parsed;
        } catch(e) {}
    }

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

    setTimeout(() => {
        const images = document.querySelectorAll('.image-parallax img');
        if (images.length > 0) {
            images.forEach(img => {
                gsap.to(img, {
                    yPercent: 15,
                    ease: "none",
                    scrollTrigger: {
                        trigger: img.closest('.work-item'),
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                        scroller: "#main"
                    }
                });
            });
        }
    }, 500);
}

// --- SERVICES SECTION ANIMATION (UPDATED: DYNAMIC LOADING) ---
function initServices() {
    const listContainer = document.getElementById('servicesList');
    const visualContainer = document.querySelector('.service-images-stack');
    
    if (!listContainer || !visualContainer) return;

    // 1. Fetch Data
    let servicesData = DEFAULTS.SERVICES;
    const stored = localStorage.getItem('DIGIWEB_SERVICES_DATA');
    if (stored) {
        try { servicesData = JSON.parse(stored); } catch(e) {}
    }

    // 2. Clear Existing Static Content
    listContainer.innerHTML = '';
    visualContainer.innerHTML = '';

    // 3. Render Dynamic Content
    servicesData.forEach((item, index) => {
        const isActive = index === 0 ? 'active' : '';

        // Generate List Item
        const itemHTML = `
            <div class="service-hover-item ${isActive}" data-index="${index}">
                <div class="s-content">
                    <div class="s-icon-box">
                        <i class="${item.icon}"></i>
                    </div>
                    <div class="s-text-wrap">
                        <h3 class="s-name">${item.title}</h3>
                        <p class="s-inline-desc" style="${index===0 ? 'max-height: 100px; opacity: 1; transform: translateY(0); margin-top: 10px;' : ''}">${item.desc}</p>
                    </div>
                </div>
                <div class="s-arrow">
                    <i class="ri-arrow-right-line"></i>
                </div>
            </div>
        `;
        listContainer.innerHTML += itemHTML;

        // Generate Image Item
        const imgHTML = `<img src="${item.image}" class="s-img ${isActive}" id="s-img-${index}" alt="${item.title}">`;
        visualContainer.innerHTML += imgHTML;
    });

    // 4. Re-Initialize Event Listeners
    const serviceItems = document.querySelectorAll('.service-hover-item');
    const serviceImages = document.querySelectorAll('.s-img');

    if (serviceItems.length === 0) return;

    serviceItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const index = item.getAttribute('data-index');
            
            // Update List Styles
            serviceItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Explicitly handle description animation for robustness
            serviceItems.forEach(i => {
                const desc = i.querySelector('.s-inline-desc');
                if(i === item) {
                    desc.style.maxHeight = '100px';
                    desc.style.opacity = '1';
                    desc.style.transform = 'translateY(0)';
                    desc.style.marginTop = '10px';
                } else {
                    desc.style.maxHeight = '0';
                    desc.style.opacity = '0';
                    desc.style.transform = 'translateY(-5px)';
                    desc.style.marginTop = '0';
                }
            });

            // Animate Images (Swap)
            serviceImages.forEach(img => img.classList.remove('active'));
            const targetImg = document.getElementById(`s-img-${index}`);
            if(targetImg) targetImg.classList.add('active');
        });
    });

    // Reveal Animation on Scroll
    gsap.from(".services-list-col", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
            trigger: ".services-modern-section",
            start: "top 70%",
            scroller: "#main"
        }
    });
}

// --- BLOG SECTION (Home Page Display Logic) ---
function initBlog() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;

    // 1. Load Data (Local Storage or Default)
    let blogData = DEFAULTS.BLOG;
    const stored = localStorage.getItem('DIGIWEB_BLOG_DATA');
    if(stored) {
        try {
            const parsed = JSON.parse(stored);
            if(Array.isArray(parsed) && parsed.length > 0) blogData = parsed;
        } catch(e) {}
    }

    // 2. Determine Logic based on current page
    const isBlogPage = window.location.pathname.includes('blog.html');

    let displayPosts = [];

    if (isBlogPage) {
        // BLOG PAGE: Show All Posts
        displayPosts = blogData;
    } else {
        // HOME PAGE: Show Featured Only
        const featuredPosts = blogData.filter(p => p.featured === true);
        // Fallback: If no posts are featured, show the first 3 recent ones
        displayPosts = featuredPosts.length > 0 ? featuredPosts : blogData.slice(0, 3);
    }

    // 4. Render
    grid.innerHTML = displayPosts.map(post => {
        // Force the link to use the dynamic ID if it's not set
        const finalLink = post.link && post.link.includes('blog-post.html') 
            ? post.link 
            : `blog-post.html?id=${post.id}`;

        return `
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
                    <a href="${finalLink}" class="button-02-text">Read Article</a>
                </div>
            </div>
        </article>
        `;
    }).join('');

    // 5. Animate Entrance
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
                start: "top 80%",
                scroller: "#main" // Only attach scroller proxy if on home/main page with locomotive
            }
        });

        // 3D Tilt Effect
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale3d(1, 1, 1)';
            });
        });
    }
}

// --- HELPER FUNCTIONS ---
function initAbout() {
    try {
        const stored = localStorage.getItem('DIGIWEB_ABOUT_DATA');
        if (!stored) return;
        const d = JSON.parse(stored);
        
        const setT = (sel, val) => { const el = document.querySelector(sel); if(el) el.textContent = val; };
        const setH = (sel, val) => { const el = document.querySelector(sel); if(el) el.innerHTML = val; };
        const setI = (sel, val) => { const el = document.querySelector(sel + ' img'); if(el) el.src = val; };

        setH('#content-mission h2', d.mission.title);
        setT('#content-mission p', d.mission.desc);
        setT('#content-mission .flex > div:nth-child(1) h4', d.mission.stat1Num);
        setT('#content-mission .flex > div:nth-child(1) p', d.mission.stat1Label);
        setT('#content-mission .flex > div:nth-child(2) h4', d.mission.stat2Num);
        setT('#content-mission .flex > div:nth-child(2) p', d.mission.stat2Label);
        setI('#img-mission', d.mission.image);

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

function switchTab(tabName) {
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('bg-primary-green', 'text-white', 'border-primary-green');
        btn.classList.add('text-slate-400', 'border-slate-800');
    });
    const activeBtn = document.getElementById(`tab-btn-${tabName}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-primary-green', 'text-white', 'border-primary-green');
        activeBtn.classList.remove('text-slate-400', 'border-slate-800');
    }

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden'); 
        content.classList.remove('fade-in-content');
    });
    const activeContent = document.getElementById(`content-${tabName}`);
    if (activeContent) {
        activeContent.classList.remove('hidden'); 
        void activeContent.offsetWidth; 
        activeContent.classList.add('fade-in-content');
    }

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
window.addEventListener("load", () => {
    
    // 1. Initialize Content
    initProjects();
    initBlog();
    initAbout();
    initTicker();
    initServices(); // Added initServices to the load sequence

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

              // 5. Refresh ScrollTrigger to map all positions
              ScrollTrigger.refresh();

              // 6. FIRE EVENT so other pages know we are ready
              window.dispatchEvent(new Event('site-loaded'));
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
            dot.style.left = `${x}px`;
            dot.style.top = `${y}px`;
            out.animate({ left: `${x}px`, top: `${y}px` }, { duration: 500, fill: "forwards" });
        });
    }
});