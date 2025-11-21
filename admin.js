// ===== Check Authentication =====
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

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

// ===== Logout =====
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentAdmin');
        window.location.href = 'login.html';
    }
});

// ===== Modal Management =====
const postModal = document.getElementById('postModal');
const deleteModal = document.getElementById('deleteModal');
const newPostBtn = document.getElementById('newPostBtn');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const closeDeleteModal = document.getElementById('closeDeleteModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

let deletePostId = null;
let editingPostId = null;

// Open new post modal
newPostBtn.addEventListener('click', () => {
    openPostModal();
});

// Close modals
closeModal.addEventListener('click', () => {
    postModal.classList.remove('active');
});

cancelBtn.addEventListener('click', () => {
    postModal.classList.remove('active');
});

closeDeleteModal.addEventListener('click', () => {
    deleteModal.classList.remove('active');
});

cancelDeleteBtn.addEventListener('click', () => {
    deleteModal.classList.remove('active');
});

// Close modal on outside click
postModal.addEventListener('click', (e) => {
    if (e.target === postModal) {
        postModal.classList.remove('active');
    }
});

deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        deleteModal.classList.remove('active');
    }
});

// ===== Open Post Modal =====
function openPostModal(postId = null) {
    editingPostId = postId;
    const modalTitle = document.getElementById('modalTitle');
    const postForm = document.getElementById('postForm');
    
    if (postId) {
        // Edit mode
        modalTitle.innerHTML = '<i class="fas fa-edit"></i> Edit Post';
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        const post = posts.find(p => p.id === postId);
        
        if (post) {
            document.getElementById('postId').value = post.id;
            document.getElementById('postTitle').value = post.title;
            document.getElementById('postCategory').value = post.category;
            document.getElementById('postAuthor').value = post.author;
            document.getElementById('postImage').value = post.image || '';
            document.getElementById('postExcerpt').value = post.excerpt;
            document.getElementById('postContent').value = post.content;
        }
    } else {
        // New post mode
        modalTitle.innerHTML = '<i class="fas fa-plus"></i> New Post';
        postForm.reset();
        document.getElementById('postId').value = '';
        
        // Set default author
        const currentAdmin = localStorage.getItem('currentAdmin') || 'Admin';
        document.getElementById('postAuthor').value = currentAdmin;
    }
    
    postModal.classList.add('active');
}

// ===== Save Post =====
document.getElementById('postForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const postId = document.getElementById('postId').value;
    
    const postData = {
        id: postId ? parseInt(postId) : Date.now(),
        title: document.getElementById('postTitle').value,
        category: document.getElementById('postCategory').value,
        author: document.getElementById('postAuthor').value,
        image: document.getElementById('postImage').value || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop',
        excerpt: document.getElementById('postExcerpt').value,
        content: document.getElementById('postContent').value,
        date: postId ? posts.find(p => p.id === parseInt(postId)).date : new Date().toISOString(),
        views: postId ? posts.find(p => p.id === parseInt(postId)).views : 0
    };
    
    if (postId) {
        // Update existing post
        const index = posts.findIndex(p => p.id === parseInt(postId));
        posts[index] = postData;
    } else {
        // Add new post
        posts.unshift(postData);
    }
    
    localStorage.setItem('blogPosts', JSON.stringify(posts));
    postModal.classList.remove('active');
    loadAdminPosts();
    updateStats();
    
    // Show success message
    showNotification(postId ? 'Post updated successfully!' : 'Post created successfully!');
});

// ===== Delete Post =====
function openDeleteModal(postId) {
    deletePostId = postId;
    deleteModal.classList.add('active');
}

confirmDeleteBtn.addEventListener('click', () => {
    if (deletePostId) {
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        const filteredPosts = posts.filter(p => p.id !== deletePostId);
        localStorage.setItem('blogPosts', JSON.stringify(filteredPosts));
        
        deleteModal.classList.remove('active');
        loadAdminPosts();
        updateStats();
        showNotification('Post deleted successfully!');
        deletePostId = null;
    }
});

// ===== Load Admin Posts =====
function loadAdminPosts() {
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const adminPostsList = document.getElementById('adminPostsList');
    
    if (posts.length === 0) {
        adminPostsList.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-tertiary);">
                <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>No posts yet. Create your first post!</p>
            </div>
        `;
        return;
    }
    
    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    adminPostsList.innerHTML = posts.map(post => `
        <div class="admin-post-item fade-in">
            <div class="admin-post-info">
                <h3>${post.title}</h3>
                <p>
                    <i class="fas fa-folder"></i> ${post.category} | 
                    <i class="fas fa-calendar"></i> ${formatDate(post.date)} | 
                    <i class="fas fa-eye"></i> ${post.views || 0} views
                </p>
            </div>
            <div class="admin-post-actions">
                <button class="icon-btn icon-btn-edit" onclick="openPostModal(${post.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="icon-btn icon-btn-delete" onclick="openDeleteModal(${post.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// ===== Update Stats =====
function updateStats() {
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const categories = new Set(posts.map(post => post.category));
    const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
    
    document.getElementById('totalPosts').textContent = posts.length;
    document.getElementById('totalViews').textContent = totalViews;
    document.getElementById('totalCategories').textContent = categories.size;
}

// ===== Format Date =====
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
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
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    loadAdminPosts();
    updateStats();
});

// Make functions available globally
window.openPostModal = openPostModal;
window.openDeleteModal = openDeleteModal;
