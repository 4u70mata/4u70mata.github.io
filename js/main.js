document.addEventListener('DOMContentLoaded', () => {

    // --- 1. INITIALIZE AOS FOR SCROLL ANIMATIONS ---
    AOS.init({
        duration: 1000,
        once: true,
        offset: 50,
    });

    // --- 2. THREE.JS 3D BACKGROUND (only on homepage) ---
    if (document.getElementById('bg')) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), alpha: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.z = 5;

        // Use a more complex geometry like an Icosahedron
        const geometry = new THREE.IcosahedronGeometry(2, 0); 
        const material = new THREE.MeshStandardMaterial({ color: 0x007bff, wireframe: true });
        const shape = new THREE.Mesh(geometry, material);
        scene.add(shape);

        // Add some lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 0.8);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // Animate the shape
        function animate() {
            requestAnimationFrame(animate);
            shape.rotation.x += 0.001;
            shape.rotation.y += 0.001;
            renderer.render(scene, camera);
        }
        animate();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // --- 3. THEME (LIGHT/DARK MODE) TOGGLE ---
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    // Apply saved theme on load
    if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }

    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark-mode');
        let theme = 'light';
        if (document.documentElement.classList.contains('dark-mode')) {
            theme = 'dark';
            themeToggle.textContent = '☀️';
        } else {
            themeToggle.textContent = '🌙';
        }
        localStorage.setItem('theme', theme);
    });
    
    // --- 4. HAMBURGER MENU FOR MOBILE ---
    const hamburger = document.getElementById('hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
    // --- 5. STICKY NAVBAR & SCROLL-TO-TOP BUTTON ---
    const navbar = document.getElementById('navbar');
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    window.onscroll = () => {
        // Sticky navbar styling
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Show/hide scroll-to-top button
        if (window.scrollY > 300) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    };
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    console.log("Portfolio scripts loaded and ready!");
});