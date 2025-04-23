document.addEventListener('DOMContentLoaded', () => {

    // --- Project Data & Config (Keep as before) ---
    const allProjects = [
        { category: "useful", title: "Personal Dashboard", repoName: "personal_dashboard", description: "A customizable dashboard for personal use.", tags: ["HTML", "CSS", "JavaScript"] },
        { category: "useful", title: "Shortcuts for Everything", repoName: "shortcuts", description: "A collection of useful shortcuts.", tags: ["Documentation", "Utility"] },
        { category: "useful", title: "Github Guide", repoName: "githubguide", description: "A helpful guide for using GitHub effectively.", tags: ["Documentation", "Markdown"] },
        { category: "useful", title: "QR Generator", repoName: "qrgenerator", description: "Generates QR codes from text input.", tags: ["JavaScript", "API"] },
        { category: "general", title: "Portfolio", repoName: "portfolio", description: "My personal portfolio website (you are here!).", tags: ["HTML", "CSS", "JS"] },
        { category: "general", title: "Digital PG Management", repoName: "pg_management_app", description: "Application for managing paying guest accommodations.", tags: ["Web App", "Management"] },
        { category: "general", title: "Windows 11 Clone", repoName: "windows11", description: "A web-based clone of the Windows 11 UI.", tags: ["HTML", "CSS", "JS", "UI Clone"] },
        { category: "general", title: "Expense Manager & Tracker", repoName: "expense_tracker", description: "Track your daily expenses.", tags: ["JavaScript", "LocalStorage"] },
        { category: "general", title: "Pro Typer", repoName: "pro_typer", description: "Improve your typing speed and accuracy.", tags: ["JavaScript", "Game", "Utility"] },
        { category: "general", title: "Chronoplan", repoName: "chronoplan", description: "A time management or planning tool concept.", tags: ["Planning", "Concept"] },
        { category: "general", title: "Chrono Weave", repoName: "chrono_weave", description: "Another time-related project concept.", tags: ["Concept", "Time"] },
        { category: "general", title: "Login-Signup Toggle Form", repoName: "login_signup_toggle_form", description: "A reusable form component with toggle animation.", tags: ["HTML", "CSS", "JS", "UI Component"] },
        { category: "general", title: "Meeting Room Manager", repoName: "meeting_room_manager", description: "Manage meeting room bookings.", tags: ["Web App", "Management"] },
        { category: "entertainment", title: "Netflix Clone", repoName: "netflix_clone", description: "A clone of the Netflix interface.", tags: ["HTML", "CSS", "JS", "UI Clone"] },
        { category: "entertainment", title: "Virtual Plant Caretaker", repoName: "virtual_plant_caretaker", description: "Take care of a virtual plant.", tags: ["JavaScript", "Game", "Simulation"] },
        { category: "entertainment", title: "Music Player", repoName: "music_player", description: "A web-based music player interface.", tags: ["HTML", "CSS", "JS", "Audio"] },
        { category: "entertainment", title: "Etheral Flow", repoName: "ethereal_flow", description: "An abstract visual or interactive experience.", tags: ["Creative Coding", "Visuals"] },
        { category: "entertainment", title: "Habit Steak Tracker", repoName: "habit_streak_tracker", description: "Track your habit streaks visually.", tags: ["JavaScript", "Tracking", "UI"] },
        { category: "entertainment", title: "Cricket Scoreboard", repoName: "score_board", description: "Display cricket scores.", tags: ["JavaScript", "Sports", "UI"] },
        { category: "entertainment", title: "Rubiks Cube", repoName: "cube", description: "A virtual Rubik's Cube simulation.", tags: ["JavaScript", "Three.js", "3D", "Game"] },
        { category: "game", title: "Quiz App", repoName: "quiz_app", description: "Test your knowledge with this quiz game.", tags: ["JavaScript", "Game", "Quiz"] },
        { category: "game", title: "Color Vision Trainer", repoName: "color_vision_trainer", description: "Train your color perception skills.", tags: ["JavaScript", "Game", "Color Theory"] },
        { category: "game", title: "Memory Challenge", repoName: "memory_challenge", description: "A classic card matching memory game.", tags: ["JavaScript", "Game"] },
        { category: "game", title: "Bubble Game", repoName: "bubble_game", description: "A simple bubble popping game.", tags: ["JavaScript", "Game", "Canvas"] },
        { category: "game", title: "Cosmic Cartographer", repoName: "cosmic_cartographer", description: "Scan star systems via diverse mini-games to map a space sector and earn a downloadable certificate.", tags: ["JavaScript", "Game", "Canvas","html2Canvas"] },
    ];

    const GITHUB_USERNAME = "prathameshvattamwar";
    const LIVE_DEMO_BASE_URL = `https://${GITHUB_USERNAME}.github.io/`;
    const SOURCE_CODE_BASE_URL = `https://github.com/${GITHUB_USERNAME}/`;
    const ITEMS_PER_LOAD = 6;
    const FILTER_CATEGORIES = ["all", "useful", "general", "entertainment", "game"];

    // --- DOM Elements ---
    const filterButtonsContainer = document.getElementById('filter-buttons');
    const projectGrid = document.getElementById('project-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const currentYearSpan = document.getElementById('current-year');
    const themeToggleButton = document.getElementById('theme-toggle'); // Get the toggle button
    const bodyElement = document.body; // Get the body element

    // --- State ---
    let currentFilter = 'all';
    let filteredProjects = [];
    let displayedCount = 0;
    let cardObserver;

    // --- Initialization ---
    function setup() {
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }
        setupTheme(); // Setup theme first
        setupIntersectionObserver();
        createFilterButtons();
        addFilterListeners();
        addLoadMoreListener();
        addThemeToggleListener(); // Add listener for theme toggle
        smoothScrollSetup();
        applyFilter('all'); // Initial load after setup
    }

    // --- Theme Toggle Logic ---
    function setupTheme() {
        const savedTheme = localStorage.getItem('portfolioTheme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        applyTheme(initialTheme, false); // Apply theme without saving again
    }

    function applyTheme(theme, savePreference = true) {
        bodyElement.setAttribute('data-theme', theme);
        // Icon toggling is handled by CSS using the data-theme attribute now
        if (savePreference) {
            localStorage.setItem('portfolioTheme', theme);
        }
    }

    function addThemeToggleListener() {
        if (themeToggleButton) {
            themeToggleButton.addEventListener('click', () => {
                const currentTheme = bodyElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                applyTheme(newTheme);
            });
        }
    }
    // --- End Theme Toggle Logic ---


    function setupIntersectionObserver() {
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
        cardObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
    }

    function createFilterButtons() {
        filterButtonsContainer.innerHTML = '';
        FILTER_CATEGORIES.forEach(category => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.dataset.category = category;
            button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            if (category === currentFilter) { // Use currentFilter for initial active state
                button.classList.add('active');
            }
            filterButtonsContainer.appendChild(button);
        });
    }

    function addFilterListeners() {
        filterButtonsContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('filter-btn')) {
                const category = event.target.dataset.category;
                if (category !== currentFilter) {
                    // Update active button state immediately
                    filterButtonsContainer.querySelectorAll('.filter-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    event.target.classList.add('active');
                    applyFilter(category); // Apply filter after updating button
                }
            }
        });
    }

    function applyFilter(category) {
        currentFilter = category;
        if (category === 'all') {
            filteredProjects = [...allProjects];
        } else {
            filteredProjects = allProjects.filter(project => project.category === category);
        }
        displayedCount = 0;
        projectGrid.innerHTML = '';
        // Re-observe cards if IntersectionObserver is used
        // (Optional: Reset observer or handle differently if needed)
        loadMoreItems();
    }


    function createProjectCard(project) {
        const card = document.createElement('article');
        card.className = 'project-card';
        card.dataset.category = project.category;

        const content = document.createElement('div');
        content.className = 'card-content';

        const title = document.createElement('h3');
        title.className = 'card-title';
        title.textContent = project.title;

        const description = document.createElement('p');
        description.className = 'card-description';
        description.textContent = project.description || "No description available.";

        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'card-tags';
        if (project.tags && project.tags.length > 0) {
            project.tags.forEach(tagText => {
                const tag = document.createElement('span');
                tag.textContent = tagText;
                tagsContainer.appendChild(tag);
            });
        }

        const linksContainer = document.createElement('div');
        linksContainer.className = 'card-links';

        const sourceLink = document.createElement('a');
        sourceLink.href = `${SOURCE_CODE_BASE_URL}${project.repoName}`;
        sourceLink.target = '_blank';
        sourceLink.rel = 'noopener noreferrer';
        sourceLink.className = 'link-icon';
        sourceLink.setAttribute('aria-label', 'Source Code');
        sourceLink.innerHTML = '<i class="fab fa-github"></i>';

        const demoLink = document.createElement('a');
        demoLink.href = `${LIVE_DEMO_BASE_URL}${project.repoName}`;
        demoLink.target = '_blank';
        demoLink.rel = 'noopener noreferrer';
        demoLink.className = 'link-button';
        demoLink.innerHTML = 'Live Demo <i class="fas fa-external-link-alt"></i>';

        linksContainer.appendChild(sourceLink);
        linksContainer.appendChild(demoLink);

        content.appendChild(title);
        content.appendChild(description);
        content.appendChild(tagsContainer);
        content.appendChild(linksContainer);
        card.appendChild(content);

        // Set category border color via style for initial state
        // The specific category color variable names MUST match your CSS (--category-game-color, etc.)
        const categoryColorVar = `--category-${project.category}-color`;
        const defaultColorVar = '--primary-color'; // Fallback
        card.style.borderLeftColor = `var(${categoryColorVar}, var(${defaultColorVar}))`;


        // Remove the JS hover listeners for border color; handled by CSS :hover now
        // card.addEventListener('mouseenter', () => { ... });
        // card.addEventListener('mouseleave', () => { ... });

        return card;
    }

    function loadMoreItems() {
        const startIndex = displayedCount;
        const endIndex = Math.min(startIndex + ITEMS_PER_LOAD, filteredProjects.length);

        for (let i = startIndex; i < endIndex; i++) {
            const card = createProjectCard(filteredProjects[i]);
            projectGrid.appendChild(card);
            if (cardObserver) {
                 cardObserver.observe(card);
            } else {
                 card.classList.add('is-visible');
            }
        }

        displayedCount = endIndex;

        if (displayedCount >= filteredProjects.length) {
            loadMoreBtn.disabled = true;
            loadMoreBtn.textContent = "All Projects Shown";
            loadMoreBtn.classList.add('hidden');
        } else {
            loadMoreBtn.disabled = false;
            loadMoreBtn.textContent = "Load More Projects";
            loadMoreBtn.classList.remove('hidden');
        }
    }

    function addLoadMoreListener() {
        loadMoreBtn.addEventListener('click', () => {
            if (!loadMoreBtn.disabled) {
                loadMoreItems();
            }
        });
    }

     function smoothScrollSetup() {
        const scrollLinks = document.querySelectorAll('.scroll-link');
        scrollLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // --- Run Setup ---
    setup();

});
