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

// ===== Check if already logged in =====
if (localStorage.getItem('isLoggedIn') === 'true') {
    window.location.href = 'admin.html';
}

// ===== Login Form Handler =====
const loginForm = document.getElementById('loginForm');
const loginAlert = document.getElementById('loginAlert');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Get admin credentials from localStorage
    const adminUser = JSON.parse(localStorage.getItem('adminUser'));
    
    if (username === adminUser.username && password === adminUser.password) {
        // Login successful
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentAdmin', username);
        
        showAlert('Login successful! Redirecting...', 'success');
        
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
    } else {
        // Login failed
        showAlert('Invalid username or password!', 'error');
    }
});

// ===== Show Alert =====
function showAlert(message, type) {
    loginAlert.textContent = message;
    loginAlert.className = `alert alert-${type}`;
    loginAlert.style.display = 'block';
    
    if (type === 'success') {
        setTimeout(() => {
            loginAlert.style.display = 'none';
        }, 2000);
    }
}

// ===== Add Enter Key Animation =====
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'scale(1.02)';
        });
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'scale(1)';
        });
    });
});
