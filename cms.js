/**
 * CMS Logic (cms.js)
 * Handles dynamic content injection from LocalStorage for:
 * 1. Project lists on the landing page (overriding hardcoded data if present).
 * 2. Inner page content (Mono & Motion, Graphic Design, etc.).
 */

function initCMS() {
    // 1. PROJECTS LIST ON LANDING PAGE
    const projectContainer = document.getElementById('project-list-container');
    if (projectContainer) {
        const storedProjects = localStorage.getItem('DIGIWEB_PORTFOLIO');
        if (storedProjects) {
            try {
                const projects = JSON.parse(storedProjects);
                if (projects.length > 0) {
                    // This will overwrite the default static projects if CMS data exists
                    renderLandingProjects(projects);
                }
            } catch(e) { console.error("CMS Error: Projects", e); }
        }
    }

    // 2. INNER PAGES CONTENT INJECTION
    const pageTitle = document.title;
    const storedPages = localStorage.getItem('DIGIWEB_PAGES_CONTENT');
    if (!storedPages) return;
    
    let pagesData;
    try { pagesData = JSON.parse(storedPages); } catch(e) { return; }

    // Helper functions
    const setHtml = (sel, val) => { 
        const els = document.querySelectorAll(sel);
        if(els.length > 0 && val) els.forEach(el => el.innerHTML = val);
    };
    const setText = (sel, val) => { 
        const els = document.querySelectorAll(sel); 
        if(els.length > 0 && val) els.forEach(el => el.innerText = val);
    };

    // PAGE 1: Mono & Motion
    if (pageTitle.includes("Mono & Motion")) {
        const data = pagesData.mono;
        if(data) {
            // Hero
            setHtml('.project-hero h1', data.heroTitle);
            setText('.project-subtitle', data.heroSubtitle);
            
            // Stats
            const statVals = document.querySelectorAll('.stat-item strong');
            const statLabs = document.querySelectorAll('.stat-item span');
            if(statVals[0]) statVals[0].innerText = data.stat1Val;
            if(statLabs[0]) statLabs[0].innerText = data.stat1Lab;
            if(statVals[1]) statVals[1].innerText = data.stat2Val;
            if(statLabs[1]) statLabs[1].innerText = data.stat2Lab;
            if(statVals[2]) statVals[2].innerText = data.stat3Val;
            if(statLabs[2]) statLabs[2].innerText = data.stat3Lab;

            // Main Featured Image
            const mainImg = document.querySelector('.staggered-image-wrap.image-full-width img');
            if(mainImg && data.mainImage) mainImg.src = data.mainImage;

            // Sticky Objective
            setText('.sticky-summary h3', data.objTitle);
            setText('.sticky-summary .paragraph-02', data.objDesc);
            setHtml('.sticky-summary .paragraph-03', data.objMeta); 

            // Detailed Content
            const headers = document.querySelectorAll('.detailed-content .h2');
            const paragraphs = document.querySelectorAll('.detailed-content .paragraph-02');
            
            if(headers[0]) headers[0].innerText = data.content1Title;
            if(paragraphs[0]) paragraphs[0].innerText = data.content1Desc;
            
            if(headers[1]) headers[1].innerText = data.content2Title;
            if(paragraphs[1]) paragraphs[1].innerText = data.content2Desc;
            
            if(headers[2]) headers[2].innerText = data.content3Title;
            if(paragraphs[2]) paragraphs[2].innerText = data.content3Desc;

            // Middle Content Image
            const midImg = document.querySelector('.detailed-content .staggered-image-wrap img');
            if(midImg && data.contentImage) midImg.src = data.contentImage;

            // Gallery Section
            setText('.gallery-section h2', data.galleryTitle);
            const galImg = document.querySelector('.gallery-section .staggered-image-wrap img');
            if(galImg && data.galleryImage) galImg.src = data.galleryImage;

            // Next Project
            setHtml('.next-project-cta h1', data.nextProject);
        }
    }

    // PAGE 2: Graphic Design
    else if (pageTitle.includes("Graphic Design")) {
        const data = pagesData.graphic;
        if(data) {
            // Hero
            const heroLine = document.querySelector('h1 span.hero-line:not(.text-transparent)');
            if(heroLine && data.heroTitle) heroLine.innerText = data.heroTitle;
            setText('header p', data.heroDesc);
            
            // Helper to update sections
            const updateSection = (secIndex, title, desc, imagesStr) => {
                const section = document.querySelectorAll('.split-section')[secIndex];
                if(!section) return;
                
                const h2 = section.querySelector('h2');
                const textContainer = section.querySelector('.text-container');
                
                if(h2 && title) h2.innerText = title;
                
                if(textContainer && desc) {
                    const oldPs = textContainer.querySelectorAll('p');
                    oldPs.forEach(p => p.remove());
                    h2.insertAdjacentHTML('afterend', desc);
                }

                if(imagesStr) {
                    const imgContainer = section.querySelector('.image-container');
                    const urls = imagesStr.split(',').map(u => u.trim()).filter(u => u);
                    if(urls.length > 0 && imgContainer) {
                        imgContainer.innerHTML = urls.map((url, i) => 
                            `<img src="${url}" class="slide-img ${i===0?'active':''}" alt="Slide ${i+1}">`
                        ).join('');
                        
                        if(secIndex === 0) {
                             const badge = `
                                <div class="absolute bottom-8 left-8 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 z-10">
                                    <div class="text-xs text-gray-400 uppercase">Project Type</div>
                                    <div class="text-white font-bold">Identity System</div>
                                </div>`;
                             if(!imgContainer.innerHTML.includes('Project Type')) {
                                imgContainer.insertAdjacentHTML('beforeend', badge);
                             }
                        }
                    }
                }
            };

            updateSection(0, data.sec1Title, data.sec1Desc, data.sec1Images);
            updateSection(1, data.sec2Title, data.sec2Desc, data.sec2Images);
            updateSection(2, data.sec3Title, data.sec3Desc, data.sec3Images);
        }
    }

    // PAGE 3: Digital Marketing
    else if (pageTitle.includes("Digital Marketing")) {
        const data = pagesData.marketing;
        if(data) {
            if(data.heroTitle1) setText('#p3-hero-title-1', data.heroTitle1);
            if(data.heroTitle2) setText('#p3-hero-title-2', data.heroTitle2);
            if(data.heroDesc) setText('#p3-hero-desc', data.heroDesc);

            if(data.seoTitle) setText('#card-seo h2', data.seoTitle);
            if(data.seoDesc) setText('#card-seo p', data.seoDesc);

            if(data.ppcTitle) setText('#card-ppc h2', data.ppcTitle);
            if(data.ppcDesc) setText('#card-ppc p', data.ppcDesc);

            if(data.smmTitle) setText('#card-smm h2', data.smmTitle);
            if(data.smmDesc) setText('#card-smm p', data.smmDesc);

            if(data.contentTitle) setText('#card-content h2', data.contentTitle);
            if(data.contentDesc) setText('#card-content p', data.contentDesc);

            if(data.dataTitle) setText('#card-analytics h2', data.dataTitle);
            if(data.dataDesc) setText('#card-analytics p', data.dataDesc);
            if(data.dataStatVal) setText('#card-analytics .text-6xl', data.dataStatVal);
            if(data.dataStatLab) setText('#card-analytics .text-sm', data.dataStatLab);
        }
    }

    // PAGE 4: Marketing Research
    else if (pageTitle.includes("Marketing Research")) {
        const data = pagesData.research;
        if(data) {
            if(data.heroTitleStart) setText('#p4-hero-title-start', data.heroTitleStart);
            if(data.heroTitleEnd) setText('#p4-hero-title-end', data.heroTitleEnd);
            if(data.heroDesc) setText('#p4-hero-desc', data.heroDesc);

            if(data.bento1Title) setText('#p4-bento1-title', data.bento1Title);
            if(data.bento1Desc) setText('#p4-bento1-desc', data.bento1Desc);
            
            if(data.bento2Title) setText('#p4-bento2-title', data.bento2Title);
            if(data.bento2Desc) setText('#p4-bento2-desc', data.bento2Desc);
            
            if(data.bento3Title) setText('#p4-bento3-title', data.bento3Title);
            if(data.bento3Desc) setText('#p4-bento3-desc', data.bento3Desc);
            
            if(data.bento4Title) setText('#p4-bento4-title', data.bento4Title);
            if(data.bento4Desc) setText('#p4-bento4-desc', data.bento4Desc);

            const updateStat = (id, val) => {
                const el = document.querySelector(id);
                if(el && val) {
                    el.innerText = val;
                    el.setAttribute('data-target', val);
                }
            };

            updateStat('#p4-stat1-val', data.stat1Val);
            if(data.stat1Label) setText('#p4-stat1-label', data.stat1Label);

            updateStat('#p4-stat2-val', data.stat2Val);
            if(data.stat2Label) setText('#p4-stat2-label', data.stat2Label);

            updateStat('#p4-stat3-val', data.stat3Val);
            if(data.stat3Label) setText('#p4-stat3-label', data.stat3Label);

            if(data.step1Title) setText('#p4-step1-title', data.step1Title);
            if(data.step1Desc) setText('#p4-step1-desc', data.step1Desc);

            if(data.step2Title) setText('#p4-step2-title', data.step2Title);
            if(data.step2Desc) setText('#p4-step2-desc', data.step2Desc);

            if(data.step3Title) setText('#p4-step3-title', data.step3Title);
            if(data.step3Desc) setText('#p4-step3-desc', data.step3Desc);

            if(data.step4Title) setText('#p4-step4-title', data.step4Title);
            if(data.step4Desc) setText('#p4-step4-desc', data.step4Desc);
        }
    }
}

// Function to render projects specifically from CMS Data
function renderLandingProjects(projects) {
    const container = document.getElementById('project-list-container');
    if(!container) return;
    container.innerHTML = '';

    let projectRows = [];
    let currentRow = [];
    projects.forEach((project) => {
        if (currentRow.length === 2) {
            projectRows.push(currentRow);
            currentRow = [];
        }
        currentRow.push(project);
    });
    if (currentRow.length > 0) {
        if (currentRow.length === 1 && projectRows.length > 0) {
            currentRow.push({
                title: 'Placeholder', category: 'Coming Soon', subtitle: 'Waiting for next project',
                isLarge: false, link: '#', image: 'https://placehold.co/660x452/1a1a1a/555555?text=Future+Project'
            });
        }
        projectRows.push(currentRow);
    }

    projectRows.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'work-row';
        row.forEach(project => {
            const itemDiv = document.createElement('div');
            const isPlaceholder = project.title === 'Placeholder'; 
            itemDiv.className = `work-item ${project.isLarge ? 'large-item' : ''} ${isPlaceholder ? 'pointer-events-none opacity-80' : ''}`;
            itemDiv.innerHTML = `
                <article class="w-dyn-list">
                    <div role="list" class="w-dyn-items">
                        <div role="listitem" class="w-dyn-item">
                            <a href="${project.link}" class="work-link w-inline-block">
                                <figure class="work-image-wrap ${project.isLarge ? 'large' : ''} image-parallax">
                                    <img loading="lazy" src="${project.image}" class="fit-cover scale-image"/>
                                </figure>
                                <div class="work-details-wrap">
                                    <h3 class="h6">${project.title}</h3>
                                    <div><div class="paragraph-03">${project.category}</div><div class="paragraph-03 work-subtitle">${project.subtitle}</div></div>
                                </div>
                            </a>
                        </div>
                    </div>
                </article>
            `;
            rowDiv.appendChild(itemDiv);
        });
        container.appendChild(rowDiv);
    });
}