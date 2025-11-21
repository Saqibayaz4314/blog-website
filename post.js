// ===== Theme Toggle =====
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

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

// ===== Get Post ID from URL =====
const urlParams = new URLSearchParams(window.location.search);
const postId = parseInt(urlParams.get('id'));

if (!postId) {
    window.location.href = 'index.html';
}

// ===== Load Post =====
function loadPost() {
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
        window.location.href = 'index.html';
        return;
    }
    
    // Update page title
    document.title = `${post.title} - My Blog`;
    
    // Load post header
    const postHeader = document.getElementById('postHeader');
    postHeader.innerHTML = `
        <span class="post-category">${post.category}</span>
        <h1>${post.title}</h1>
        <div class="post-meta">
            <div class="post-author">
                <i class="fas fa-user"></i>
                <span>${post.author}</span>
            </div>
            <div class="post-date">
                <i class="fas fa-calendar"></i>
                <span>${formatDate(post.date)}</span>
            </div>
            <div class="post-views">
                <i class="fas fa-eye"></i>
                <span>${post.views || 0} views</span>
            </div>
        </div>
        ${post.image ? `<img src="${post.image}" alt="${post.title}" class="post-image" onerror="this.style.display='none'">` : ''}
    `;
    
    // Load post body
    const postBody = document.getElementById('postBody');
    postBody.innerHTML = `
        <p>${post.content.split('\n').join('</p><p>')}</p>
    `;
    
    // Load related posts
    loadRelatedPosts(post.category, post.id);
}

// ===== Load Related Posts =====
function loadRelatedPosts(category, currentPostId) {
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const relatedPosts = posts
        .filter(p => p.category === category && p.id !== currentPostId)
        .slice(0, 3);
    
    const relatedPostsContainer = document.getElementById('relatedPosts');
    
    if (relatedPosts.length === 0) {
        relatedPostsContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-tertiary);">
                <p>No related posts found</p>
            </div>
        `;
        return;
    }
    
    relatedPostsContainer.innerHTML = relatedPosts.map(post => `
        <div class="post-card fade-in" onclick="navigateToPost(${post.id})">
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

// ===== Navigate to Post =====
function navigateToPost(postId) {
    window.location.href = `post.html?id=${postId}`;
}

// ===== Reading Progress Bar =====
function updateReadingProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const progress = (scrollTop / documentHeight) * 100;
    
    document.getElementById('readingProgress').style.width = `${progress}%`;
}

window.addEventListener('scroll', updateReadingProgress);

// ===== Share Buttons =====
document.querySelector('.share-btn.facebook').addEventListener('click', () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
});

document.querySelector('.share-btn.twitter').addEventListener('click', () => {
    const url = encodeURIComponent(window.location.href);
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const post = posts.find(p => p.id === postId);
    const text = encodeURIComponent(post.title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
});

document.querySelector('.share-btn.linkedin').addEventListener('click', () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
});

// Copy Link Button
document.getElementById('copyLinkBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showNotification('Link copied to clipboard!');
    });
});

// ===== Format Date =====
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// ===== Show Notification =====
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-xl);
        z-index: 9999;
        animation: slideDown 0.3s ease;
    `;
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    loadPost();
    updateReadingProgress();
});

// Make function available globally
window.navigateToPost = navigateToPost;
