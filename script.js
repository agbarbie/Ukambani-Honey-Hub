// ===== Week 5: Mobile Menu Functionality =====
const menuButton = document.getElementById('menu-button');
const closeMenuButton = document.getElementById('close-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuContent = document.getElementById('mobile-menu-content');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

// Open mobile menu
const openMenu = () => {
  mobileMenu.classList.remove('hidden');
  // Trigger animation after a small delay
  setTimeout(() => {
    mobileMenuContent.classList.add('active');
  }, 10);
};

// Close mobile menu
const closeMenu = () => {
  mobileMenuContent.classList.remove('active');
  setTimeout(() => {
    mobileMenu.classList.add('hidden');
  }, 300); // Wait for animation to complete
};

// Event listeners for mobile menu
if (menuButton) {
  menuButton.addEventListener('click', openMenu);
}

if (closeMenuButton) {
  closeMenuButton.addEventListener('click', closeMenu);
}

// Close menu when clicking on the overlay
if (mobileMenu) {
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      closeMenu();
    }
  });
}

// Close menu when clicking on navigation links
mobileNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    closeMenu();
  });
});

// ===== Week 6: Authentication Modal Functionality =====
const authModal = document.getElementById('auth-modal');
const closeAuthModalButton = document.getElementById('close-auth-modal');
const authForm = document.getElementById('auth-form');

// Buttons that trigger the auth modal
const openAuthButtons = [
  document.getElementById('open-auth-modal-mobile'),
  ...document.querySelectorAll('.add-to-cart-btn'),
  ...document.querySelectorAll('.buy-now-btn')
];

// Open authentication modal
const openAuthModal = () => {
  authModal.classList.remove('hidden');
  closeMenu(); // Close mobile menu if open
  document.body.style.overflow = 'hidden'; // Prevent scrolling
};

// Close authentication modal
const closeAuthModal = () => {
  authModal.classList.add('hidden');
  document.body.style.overflow = ''; // Restore scrolling
};

// Add event listeners to all auth trigger buttons
openAuthButtons.forEach(button => {
  if (button) {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      openAuthModal();
    });
  }
});

// Close modal when clicking the close button
if (closeAuthModalButton) {
  closeAuthModalButton.addEventListener('click', closeAuthModal);
}

// Close modal when clicking on the overlay
if (authModal) {
  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
      closeAuthModal();
    }
  });
}

// Close modal on Escape key press
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!authModal.classList.contains('hidden')) {
      closeAuthModal();
    }
    if (!mobileMenu.classList.contains('hidden')) {
      closeMenu();
    }
  }
});

// ===== Week 6: Form Validation and Submission =====
if (authForm) {
  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const confirmPassword = document.getElementById('auth-confirm-password').value;
    
    // Week 6: Password validation (integrity check)
    if (password !== confirmPassword) {
      showMessage('Error: Passwords do not match. Please check and try again.', 'error');
      return;
    }
    
    // Validate password length
    if (password.length < 8) {
      showMessage('Error: Password must be at least 8 characters long.', 'error');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage('Error: Please enter a valid email address.', 'error');
      return;
    }
    
    // Success message (in a real app, this would send data to server)
    showMessage('Success! Your account has been created. Welcome to Ukambani Honey Hub!', 'success');
    
    // Reset form and close modal
    authForm.reset();
    setTimeout(() => {
      closeAuthModal();
    }, 2000);
  });
}

// ===== Custom Message Display Function =====
function showMessage(message, type = 'info') {
  // Remove any existing message
  const existingMessage = document.getElementById('custom-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Create message element
  const messageDiv = document.createElement('div');
  messageDiv.id = 'custom-message';
  messageDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 300;
    background-color: white;
    border-radius: 0.75rem;
    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.3);
    padding: 2rem;
    max-width: 400px;
    width: 90%;
    text-align: center;
  `;
  
  // Set message color based on type
  const color = type === 'error' ? '#dc2626' : type === 'success' ? '#059669' : '#d97706';
  
  messageDiv.innerHTML = `
    <div style="color: ${color}; font-size: 1.125rem; font-weight: 600; margin-bottom: 1.5rem;">
      ${message}
    </div>
    <button 
      onclick="document.getElementById('custom-message').remove()" 
      style="
        background-color: ${color};
        color: white;
        font-weight: bold;
        padding: 0.75rem 2rem;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        font-size: 1rem;
        transition: opacity 0.3s;
      "
      onmouseover="this.style.opacity='0.8'"
      onmouseout="this.style.opacity='1'"
    >
      Close
    </button>
  `;
  
  document.body.appendChild(messageDiv);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (document.getElementById('custom-message')) {
      messageDiv.remove();
    }
  }, 5000);
}

// ===== Smooth Scrolling for Navigation Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// ===== Cart Badge Update (Demo) =====
let cartCount = 3;
const cartBadge = document.querySelector('.cart-badge');

function updateCartCount(change) {
  cartCount += change;
  if (cartCount < 0) cartCount = 0;
  if (cartBadge) {
    cartBadge.textContent = cartCount;
  }
}

// Add to cart functionality (demo)
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
  button.addEventListener('click', () => {
    // In a real app, this would add the product to cart after authentication
    console.log('Add to cart clicked - authentication modal will open');
  });
});

// Buy now functionality (demo)
document.querySelectorAll('.buy-now-btn').forEach(button => {
  button.addEventListener('click', () => {
    // In a real app, this would proceed to checkout after authentication
    console.log('Buy now clicked - authentication modal will open');
  });
});

// ===== Search Functionality (Demo) =====
const searchInput = document.querySelector('.search-input');
if (searchInput) {
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        showMessage(`Searching for: "${searchTerm}"...`, 'info');
        // In a real app, this would trigger a search
      }
    }
  });
}

// ===== Responsive Header on Scroll =====
let lastScroll = 0;
const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll <= 0) {
    header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
  }
  
  lastScroll = currentScroll;
});

// ===== Initialize =====
console.log('Ukambani Honey Hub - Initialized');
console.log('Features: Mobile Menu, Authentication Modal, Form Validation, Smooth Scrolling');