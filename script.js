// ===== Initialize Data =====
function initializeData() {
    if (!localStorage.getItem('blogPosts')) {
        const samplePosts = [
            {
                id: 1,
                title: 'Getting Started with Web Development',
                excerpt: 'Learn the basics of HTML, CSS, and JavaScript to build amazing websites.',
                content: 'Web development is an exciting field that allows you to create interactive and engaging websites. In this post, we will cover the fundamentals of HTML, CSS, and JavaScript. HTML provides the structure, CSS handles the styling, and JavaScript adds interactivity. By mastering these three technologies, you can build professional websites from scratch.',
                category: 'Technology',
                author: 'Admin',
                date: new Date().toISOString(),
                image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
                views: 142
            },
            {
                id: 2,
                title: 'The Future of Artificial Intelligence',
                excerpt: 'Exploring how AI is transforming industries and changing our daily lives.',
                content: 'Artificial Intelligence is revolutionizing the way we live and work. From healthcare to finance, AI is making processes more efficient and opening up new possibilities. This post explores the current state of AI technology, its applications across different sectors, and what the future might hold. We discuss machine learning, neural networks, and the ethical considerations surrounding AI development.',
                category: 'Technology',
                author: 'Admin',
                date: new Date(Date.now() - 86400000).toISOString(),
                image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
                views: 218
            },
            {
                id: 3,
                title: 'Best Travel Destinations for 2024',
                excerpt: 'Discover amazing places to visit and create unforgettable memories.',
                content: 'Planning your next adventure? Check out these incredible travel destinations for 2024. From pristine beaches to historic cities, we have curated a list of must-visit places around the world. Whether you are looking for relaxation, adventure, or cultural experiences, these destinations offer something for everyone. Learn about the best times to visit, local customs, and hidden gems.',
                category: 'Travel',
                author: 'Admin',
                date: new Date(Date.now() - 172800000).toISOString(),
                image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
                views: 187
            }
        ];
        localStorage.setItem('blogPosts', JSON.stringify(samplePosts));
    }

    // Initialize default admin user if not exists
    if (!localStorage.getItem('adminUser')) {
        const defaultAdmin = {
            username: 'admin',
            password: 'admin123' // In real app, this should be hashed
        };
        localStorage.setItem('adminUser', JSON.stringify(defaultAdmin));
    }
}

// ===== Theme Toggle =====
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
body.classList.toggle('dark-mode', currentTheme === 'dark');
updateThemeIcon();

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    updateThemeIcon();
});

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if (body.classList.contains('dark-mode')) {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// ===== Mobile Menu Toggle =====
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuToggle.querySelector('i');
        icon.className = navLinks.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
    });
}

// ===== Load Posts =====
function loadPosts(filter = 'all', searchQuery = '') {
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const postsGrid = document.getElementById('postsGrid');
    const noPosts = document.getElementById('noPosts');
    
    // Filter posts
    let filteredPosts = posts;
    
    if (filter !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.category === filter);
    }
    
    if (searchQuery) {
        filteredPosts = filteredPosts.filter(post => 
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    // Sort by date (newest first)
    filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (filteredPosts.length === 0) {
        postsGrid.style.display = 'none';
        noPosts.style.display = 'block';
        return;
    }
    
    postsGrid.style.display = 'grid';
    noPosts.style.display = 'none';
    
    postsGrid.innerHTML = filteredPosts.map(post => `
        <div class="post-card fade-in" onclick="viewPost(${post.id})">
            <div class="post-image-wrapper">
                <img src="${post.image}" alt="${post.title}" class="post-image" onerror="this.src='https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop'">
            </div>
            <div class="post-content">
                <span class="post-category">${post.category}</span>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-excerpt">${post.excerpt}</p>
                <div class="post-meta">
                    <div class="post-author">
                        <i class="fas fa-user"></i>
                        <span>${post.author}</span>
                    </div>
                    <div class="post-date">
                        <i class="fas fa-calendar"></i>
                        <span>${formatDate(post.date)}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== Load Categories =====
function loadCategories() {
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const categories = ['all', ...new Set(posts.map(post => post.category))];
    const categoriesFilter = document.getElementById('categoriesFilter');
    
    categoriesFilter.innerHTML = categories.map(category => `
        <button class="category-btn ${category === 'all' ? 'active' : ''}" 
                data-category="${category}" 
                onclick="filterByCategory('${category}')">
            ${category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
    `).join('');
}

// ===== Filter by Category =====
function filterByCategory(category) {
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Load filtered posts
    loadPosts(category);
}

// ===== Search Posts =====
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

searchBtn.addEventListener('click', () => {
    const query = searchInput.value;
    loadPosts('all', query);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value;
        loadPosts('all', query);
    }
});

// ===== View Post =====
function viewPost(postId) {
    // Increment view count
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
        posts[postIndex].views = (posts[postIndex].views || 0) + 1;
        localStorage.setItem('blogPosts', JSON.stringify(posts));
    }
    
    // Redirect to post page
    window.location.href = `post.html?id=${postId}`;
}

// ===== Format Date =====
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// ===== Scroll Animations =====
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in-up');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
    });
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    loadPosts();
    loadCategories();
    handleScrollAnimations();
});

// Make functions available globally
window.filterByCategory = filterByCategory;
window.viewPost = viewPost;
