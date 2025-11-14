document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // --- 2. Close mobile menu when a link is clicked ---
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            
            if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
                e.preventDefault();
                
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                }

                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- 3. Dark Mode Toggle Logic ---
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;

    // Function to apply the saved theme
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
    };

    // Check for saved theme in localStorage
    let savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // If no saved theme, check OS preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            applyTheme('dark');
            savedTheme = 'dark'; // Save preference
            localStorage.setItem('theme', 'dark');
        } else {
            applyTheme('light');
            savedTheme = 'light';
            localStorage.setItem('theme', 'light');
        }
    }

    // Add click event listener to the toggle button
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            if (body.classList.contains('dark-mode')) {
                applyTheme('light');
                localStorage.setItem('theme', 'light');
            } else {
                applyTheme('dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // --- 4. Formspree Contact Form Logic ---
    const contactForm = document.getElementById('contact-form');
    const formSuccessMessage = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // نوقف الإرسال العادي

            const formData = new FormData(this);
            
            // This is your Formspree URL
            const formspreeURL = "https://formspree.io/f/xgvralvk"; 

            fetch(formspreeURL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // لو الرسالة وصلت
                    contactForm.style.display = "none"; // نخفي الفورم
                    formSuccessMessage.style.display = "block"; // نظهر رسالة الشكر
                } else {
                    // لو حصل مشكلة (زي إن اللينك غلط)
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            alert(data["errors"].map(error => error["message"]).join(", "));
                        } else {
                            alert("Oops! There was a problem submitting your form.");
                        }
                    })
                }
            })
            .catch(error => {
                // لو فيه مشكلة في النت
                alert("Error connecting to the server. Please check your internet connection.");
            });
        });
    }

});
