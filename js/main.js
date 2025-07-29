document.addEventListener('DOMContentLoaded', () => {

    // --- CORE INITIALIZATION ---
    function init() {
        initTheme();
        initPageTransitions();
        initCustomCursor();
        initMagneticItems();
        initNavbar();
        initScrollToTop();
        AOS.init({ duration: 800, once: true, offset: 50 });

        // --- PAGE-SPECIFIC INITIALIZATION ---
        if (document.getElementById('bg')) initThreeJS_NoDownload(); // <-- THIS FUNCTION IS NEW
        if (document.getElementById('projects-container')) loadProjects();
        if (document.getElementById('project-detail-container')) loadProjectDetails();
        if (document.getElementById('articles-container')) loadArticles();
        if (document.getElementById('article-detail-container')) loadArticleDetails();
        
        console.log("Next-Level Portfolio Initialized (No-Download Mode).");
    }

    // --- THEME (LIGHT/DARK MODE) ---
    function initTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const applyTheme = (theme) => {
            if (theme === 'dark') {
                document.documentElement.classList.add('dark-mode');
                if(themeToggle) themeToggle.textContent = '☀️';
            } else {
                document.documentElement.classList.remove('dark-mode');
                if(themeToggle) themeToggle.textContent = '🌙';
            }
        };
        const currentTheme = localStorage.getItem('theme') || 'light';
        applyTheme(currentTheme);
        if(themeToggle) themeToggle.addEventListener('click', () => {
            let newTheme = document.documentElement.classList.contains('dark-mode') ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
    
    // --- SIMPLE 3D HERO (NO DOWNLOAD REQUIRED) ---
    function initThreeJS_NoDownload() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.z = 4;

        // Create a geometric shape directly with code
        const geometry = new THREE.IcosahedronGeometry(1.5, 0); 
        const material = new THREE.MeshStandardMaterial({
            color: 0x6e9bff,
            metalness: 0.8,
            roughness: 0.2,
            wireframe: true // Looks cool and is lightweight
        });
        const shape = new THREE.Mesh(geometry, material);
        scene.add(shape);

        const pointLight1 = new THREE.PointLight(0x0d6efd, 2);
        pointLight1.position.set(5, 5, 5);
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(pointLight1, ambientLight);

        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) / 100;
            mouseY = (e.clientY - window.innerHeight / 2) / 100;
        });

        function animate() {
            requestAnimationFrame(animate);
            if (shape) {
                shape.rotation.y += 0.002;
                shape.rotation.x += 0.001;
                camera.position.x += (mouseX - camera.position.x) * 0.05;
                camera.position.y += (-mouseY - camera.position.y) * 0.05;
                camera.lookAt(scene.position);
            }
            renderer.render(scene, camera);
        }
        animate();
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // --- DYNAMIC CONTENT LOADING ---
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch data from ${url}:`, error);
            return null;
        }
    }

    async function loadProjects() {
        const projects = await fetchData('data/projects.json');
        const container = document.getElementById('projects-container');
        if (projects && container) {
            container.innerHTML = projects.map(p => `
                <a href="project-detail.html?id=${p.id}" class="project-card-link">
                    <div class="project-card" data-aos="fade-up">
                        <h3>${p.title}</h3>
                        <p>${p.tags.join(', ')}</p>
                        <span class="btn-link">View Details →</span>
                    </div>
                </a>
            `).join('');
        }
    }

    async function loadProjectDetails() {
        const params = new URLSearchParams(window.location.search);
        const projectId = params.get('id');
        const projects = await fetchData('data/projects.json');
        if (projects && projectId) {
            const project = projects.find(p => p.id === projectId);
            if (project) {
                document.title = `${project.title} - Sami Aridal`;
                document.getElementById('project-title').textContent = project.title;
                document.getElementById('project-image').src = project.image;
                document.getElementById('project-image').alt = project.title;
                document.getElementById('project-description').textContent = project.description;
                document.getElementById('project-tags').innerHTML = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
                document.getElementById('project-live-url').href = project.liveUrl;
                document.getElementById('project-source-url').href = project.sourceUrl;
            }
        }
    }

    async function loadArticles() {
        const articles = await fetchData('data/articles.json');
        const container = document.getElementById('articles-container');
        if (articles && container) {
            container.innerHTML = articles.map(a => `
                <a href="article-detail.html?slug=${a.slug}" class="project-card-link">
                    <div class="project-card" data-aos="fade-up">
                        <h3>${a.title}</h3>
                        <p>${a.excerpt}</p>
                        <span class="btn-link">Read More →</span>
                    </div>
                </a>
            `).join('');
        }
    }

     async function loadArticleDetails() {
        const params = new URLSearchParams(window.location.search);
        const slug = params.get('slug');
        const articles = await fetchData('data/articles.json');
        if (articles && slug) {
            const article = articles.find(a => a.slug === slug);
            if(article){
                document.title = `${article.title} - Sami Aridal`;
                document.getElementById('article-title').textContent = article.title;
                document.getElementById('article-date').textContent = article.date;
                document.getElementById('article-source').textContent = `Source: ${article.source}`;
                document.getElementById('article-body').innerHTML = article.contentHtml;
                const sourceLink = document.getElementById('article-source-url');
                const sourceName = document.getElementById('article-source-name');
                sourceLink.href = article.sourceUrl;
                sourceName.textContent = article.source;
            }
        }
    }

    // --- UI & INTERACTIONS ---
    function initCustomCursor() {
        const cursor = document.querySelector('.cursor');
        if (!cursor) return;
        window.addEventListener('mousemove', e => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        document.querySelectorAll('a, button, .magnetic-item').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
        });
    }

    function initMagneticItems() {
        document.querySelectorAll('.magnetic-item').forEach(item => {
            item.addEventListener('mousemove', e => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                item.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
            });
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translate(0, 0) scale(1)';
            });
        });
    }

    function initPageTransitions() {
        const overlay = document.querySelector('.page-transition-overlay');
        if (!overlay) return;
        window.addEventListener('load', () => {
             setTimeout(() => {
                document.body.classList.remove('is-transitioning');
                overlay.style.transform = 'translateY(-100%)';
            }, 50);
        });

        document.querySelectorAll('a').forEach(link => {
            if (link.hostname === window.location.hostname && !link.href.includes('#') && link.target !== '_blank') {
                link.addEventListener('click', e => {
                    e.preventDefault();
                    document.body.classList.add('is-leaving');
                    overlay.style.transform = 'translateY(0)';
                    setTimeout(() => {
                        window.location = link.href;
                    }, 500);
                });
            }
        });
    }

    function initNavbar() {
        const hamburger = document.getElementById('hamburger-menu');
        const navLinks = document.querySelector('.nav-links');
        const navbar = document.getElementById('navbar');
        if(hamburger) hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
        window.addEventListener('scroll', () => {
            if(navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    function initScrollToTop(){
        const btn = document.getElementById('scroll-to-top');
        if(btn){
            window.addEventListener('scroll', () => btn.style.display = window.scrollY > 300 ? 'block' : 'none');
            btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        }
    }

    init();
});