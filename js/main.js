document.addEventListener('DOMContentLoaded', function() {
    
    const hamburger = document.getElementById('hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    console.log("Portfolio loaded and scripts are running.");

});