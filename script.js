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
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');
const switchTabLinks = document.querySelectorAll('.switch-tab-link');

// Buttons that trigger the auth modal
let pendingAction = null; // Store what action to perform after login
let pendingProduct = null; // Store product data for the action

const openAuthButtons = [
  document.getElementById('open-auth-modal-mobile'),
];

// Don't automatically add these buttons - we'll handle them separately
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
const buyNowButtons = document.querySelectorAll('.buy-now-btn');

// Initialize users database in localStorage
if (!localStorage.getItem('ukambani_users')) {
  localStorage.setItem('ukambani_users', JSON.stringify([]));
}

// Check if user is logged in
let currentUser = JSON.parse(localStorage.getItem('ukambani_current_user'));

// Update UI based on login status
function updateAuthUI() {
  currentUser = JSON.parse(localStorage.getItem('ukambani_current_user'));
  
  const userMenu = document.getElementById('user-menu');
  const loginLink = document.getElementById('login-link');
  const userNameDisplay = document.getElementById('user-name-display');
  
  if (currentUser) {
    // User is logged in - show user menu
    if (userMenu) {
      userMenu.classList.remove('hidden');
    }
    if (loginLink) {
      loginLink.style.display = 'none';
    }
    if (userNameDisplay) {
      userNameDisplay.textContent = currentUser.name.split(' ')[0]; // First name only
    }
    
    console.log('User logged in:', currentUser.name);
  } else {
    // User is not logged in - show login link
    if (userMenu) {
      userMenu.classList.add('hidden');
    }
    if (loginLink) {
      loginLink.style.display = 'flex';
    }
  }
}

// User menu dropdown toggle
const userMenuButton = document.getElementById('user-menu-button');
const userDropdown = document.getElementById('user-dropdown');

if (userMenuButton && userDropdown) {
  userMenuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown.classList.toggle('hidden');
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    if (userDropdown && !userDropdown.classList.contains('hidden')) {
      userDropdown.classList.add('hidden');
    }
  });
}

// Login link click handler
const loginLink = document.getElementById('login-link');
if (loginLink) {
  loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    openAuthModal('login');
  });
}

// Logout button handler
const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
  logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}

// Open authentication modal
const openAuthModal = (tab = 'login') => {
  authModal.classList.remove('hidden');
  closeMenu(); // Close mobile menu if open
  document.body.style.overflow = 'hidden'; // Prevent scrolling
  switchAuthTab(tab);
};

// Close authentication modal
const closeAuthModal = () => {
  authModal.classList.add('hidden');
  document.body.style.overflow = ''; // Restore scrolling
  // Reset forms
  if (loginForm) loginForm.reset();
  if (signupForm) signupForm.reset();
  clearPasswordStrength();
};

// Switch between login and signup tabs
function switchAuthTab(tabName) {
  // Update tab buttons
  authTabs.forEach(tab => {
    if (tab.dataset.tab === tabName) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  
  // Update forms
  authForms.forEach(form => {
    if (form.id === `${tabName}-form`) {
      form.classList.add('active');
    } else {
      form.classList.remove('active');
    }
  });
}

// Tab click handlers
authTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    switchAuthTab(tab.dataset.tab);
  });
});

// Switch tab link handlers
switchTabLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    switchAuthTab(link.dataset.tab);
  });
});

// Add event listeners to all auth trigger buttons
openAuthButtons.forEach(button => {
  if (button) {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Check if user is already logged in
      if (currentUser) {
        showMessage(`Welcome back, ${currentUser.name}! You're already logged in.`, 'success');
      } else {
        openAuthModal('login');
      }
    });
  }
});

// Handle Add to Cart buttons
addToCartButtons.forEach(button => {
  button.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Get product data from the card
    const productCard = this.closest('.product-card');
    const product = {
      id: Date.now() + Math.random(), // Unique ID
      name: productCard.querySelector('.product-name').textContent,
      price: productCard.querySelector('.product-price').textContent,
      image: productCard.querySelector('.product-image-real').src,
      location: productCard.querySelector('.product-location').textContent
    };
    
    // Check if user is logged in
    if (currentUser) {
      // User is logged in - add to cart directly
      addToCart(product);
    } else {
      // User not logged in - store action and show SSL login modal immediately
      pendingAction = 'addToCart';
      pendingProduct = product;
      openAuthModal('login'); // Open SSL secured modal immediately
    }
  });
});

// Handle Buy Now buttons
buyNowButtons.forEach(button => {
  button.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Get product data from the card
    const productCard = this.closest('.product-card');
    const product = {
      id: Date.now() + Math.random(),
      name: productCard.querySelector('.product-name').textContent,
      price: productCard.querySelector('.product-price').textContent,
      image: productCard.querySelector('.product-image-real').src,
      location: productCard.querySelector('.product-location').textContent
    };
    
    // Check if user is logged in
    if (currentUser) {
      // User is logged in - proceed to checkout
      addToCart(product);
      setTimeout(() => {
        showCheckoutModal();
      }, 500);
    } else {
      // User not logged in - store action and show SSL login modal immediately
      pendingAction = 'buyNow';
      pendingProduct = product;
      openAuthModal('login'); // Open SSL secured modal immediately
    }
  });
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

// ===== Password Strength Checker =====
const signupPasswordInput = document.getElementById('signup-password');
const passwordStrengthIndicator = document.getElementById('password-strength');

function checkPasswordStrength(password) {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  
  return strength;
}

function updatePasswordStrength(password) {
  if (!passwordStrengthIndicator) return;
  
  const strength = checkPasswordStrength(password);
  
  passwordStrengthIndicator.className = 'password-strength';
  
  if (password.length === 0) {
    passwordStrengthIndicator.className = 'password-strength';
  } else if (strength <= 2) {
    passwordStrengthIndicator.classList.add('weak');
  } else if (strength <= 4) {
    passwordStrengthIndicator.classList.add('medium');
  } else {
    passwordStrengthIndicator.classList.add('strong');
  }
}

function clearPasswordStrength() {
  if (passwordStrengthIndicator) {
    passwordStrengthIndicator.className = 'password-strength';
  }
}

if (signupPasswordInput) {
  signupPasswordInput.addEventListener('input', (e) => {
    updatePasswordStrength(e.target.value);
  });
}

// ===== LOGIN FORM SUBMISSION =====
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage('Please enter a valid email address.', 'error');
      return;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('ukambani_users'));
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Successful login
      const userData = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem('ukambani_current_user', JSON.stringify(userData));
      
      if (rememberMe) {
        localStorage.setItem('ukambani_remember', 'true');
      }
      
      showMessage(`Welcome back, ${user.name}! Login successful.`, 'success');
      
      loginForm.reset();
      setTimeout(() => {
        closeAuthModal();
        updateAuthUI();
        
        // Execute pending action after login
        if (pendingAction && pendingProduct) {
          if (pendingAction === 'addToCart') {
            addToCart(pendingProduct);
          } else if (pendingAction === 'buyNow') {
            addToCart(pendingProduct);
            setTimeout(() => {
              showCheckoutModal();
            }, 500);
          }
          pendingAction = null;
          pendingProduct = null;
        }
      }, 1500);
      
    } else {
      // Failed login
      showMessage('Invalid email or password. Please try again.', 'error');
    }
  });
}

// ===== SIGNUP FORM SUBMISSION =====
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const phone = document.getElementById('signup-phone').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const termsAccepted = document.getElementById('terms').checked;
    
    // Validate name
    if (name.length < 2) {
      showMessage('Please enter your full name.', 'error');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage('Please enter a valid email address.', 'error');
      return;
    }
    
    // Validate phone
    if (phone.length < 10) {
      showMessage('Please enter a valid phone number.', 'error');
      return;
    }
    
    // Validate password length
    if (password.length < 8) {
      showMessage('Password must be at least 8 characters long.', 'error');
      return;
    }
    
    // Check password strength
    const strength = checkPasswordStrength(password);
    if (strength < 2) {
      showMessage('Please choose a stronger password. Include uppercase, lowercase, numbers, or special characters.', 'error');
      return;
    }
    
    // Password confirmation
    if (password !== confirmPassword) {
      showMessage('Passwords do not match. Please check and try again.', 'error');
      return;
    }
    
    // Terms acceptance
    if (!termsAccepted) {
      showMessage('Please accept the Terms & Conditions to continue.', 'error');
      return;
    }
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('ukambani_users'));
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
      showMessage('This email is already registered. Please login instead.', 'error');
      return;
    }
    
    // Create new user
    const newUser = {
      id: Date.now(),
      name: name,
      email: email,
      phone: phone,
      password: password, // In real app, this should be hashed
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('ukambani_users', JSON.stringify(users));
    
    // Auto login after signup
    const userData = {
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('ukambani_current_user', JSON.stringify(userData));
    
    showMessage(`Welcome, ${name}! Your account has been created successfully.`, 'success');
    
    signupForm.reset();
    clearPasswordStrength();
    
    setTimeout(() => {
      closeAuthModal();
      updateAuthUI();
      
      // Execute pending action after signup
      if (pendingAction && pendingProduct) {
        if (pendingAction === 'addToCart') {
          addToCart(pendingProduct);
        } else if (pendingAction === 'buyNow') {
          addToCart(pendingProduct);
          setTimeout(() => {
            showCheckoutModal();
          }, 500);
        }
        pendingAction = null;
        pendingProduct = null;
      }
    }, 1500);
  });
}

// ===== LOGOUT FUNCTION =====
function logout() {
  localStorage.removeItem('ukambani_current_user');
  localStorage.removeItem('ukambani_remember');
  showMessage('You have been logged out successfully.', 'info');
  updateAuthUI();
}

// Initialize on page load
updateAuthUI();

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

// ===== Cart Badge Update =====
let cartItems = JSON.parse(localStorage.getItem('ukambani_cart')) || [];
const cartBadge = document.querySelector('.cart-badge');
const cartIcon = document.querySelector('.cart-icon');

function updateCartBadge() {
  cartItems = JSON.parse(localStorage.getItem('ukambani_cart')) || [];
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  if (cartBadge) {
    cartBadge.textContent = totalItems;
  }
}

function addToCart(product) {
  cartItems = JSON.parse(localStorage.getItem('ukambani_cart')) || [];
  
  // Check if product already exists in cart
  const existingItem = cartItems.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      location: product.location,
      quantity: 1
    });
  }
  
  localStorage.setItem('ukambani_cart', JSON.stringify(cartItems));
  updateCartBadge();
  
  showMessage(`✅ ${product.name} added to cart!`, 'success');
}

function clearCart() {
  localStorage.setItem('ukambani_cart', JSON.stringify([]));
  updateCartBadge();
}

// Cart icon click handler - show cart modal
if (cartIcon) {
  cartIcon.addEventListener('click', (e) => {
    e.preventDefault();
    showCartModal();
  });
}

// Initialize cart badge on page load
updateCartBadge();

// ===== CART MODAL FUNCTIONS =====
const cartModal = document.getElementById('cart-modal');
const closeCartModalButton = document.getElementById('close-cart-modal');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartEmpty = document.getElementById('cart-empty');
const cartSummary = document.getElementById('cart-summary');
const continueShoppingBtn = document.getElementById('continue-shopping-btn');
const proceedCheckoutBtn = document.getElementById('proceed-checkout-btn');

function showCartModal() {
  cartModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  renderCart();
}

function closeCartModal() {
  cartModal.classList.add('hidden');
  document.body.style.overflow = '';
}

function renderCart() {
  cartItems = JSON.parse(localStorage.getItem('ukambani_cart')) || [];
  
  if (cartItems.length === 0) {
    cartEmpty.classList.remove('hidden');
    cartSummary.classList.add('hidden');
    cartItemsContainer.innerHTML = '';
    return;
  }
  
  cartEmpty.classList.add('hidden');
  cartSummary.classList.remove('hidden');
  
  // Render cart items
  cartItemsContainer.innerHTML = cartItems.map((item, index) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-location">${item.location}</div>
        <div class="cart-item-price">${item.price}</div>
      </div>
      <div class="cart-item-actions">
        <div class="quantity-control">
          <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">−</button>
          <span class="quantity-display">${item.quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
        </div>
        <button class="remove-item-btn" onclick="removeFromCart(${index})" title="Remove">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  `).join('');
  
  // Calculate totals
  updateCartSummary();
}

function updateQuantity(index, change) {
  cartItems = JSON.parse(localStorage.getItem('ukambani_cart')) || [];
  
  if (cartItems[index]) {
    cartItems[index].quantity += change;
    
    if (cartItems[index].quantity <= 0) {
      cartItems.splice(index, 1);
    }
    
    localStorage.setItem('ukambani_cart', JSON.stringify(cartItems));
    updateCartBadge();
    renderCart();
  }
}

function removeFromCart(index) {
  cartItems = JSON.parse(localStorage.getItem('ukambani_cart')) || [];
  
  if (cartItems[index]) {
    const itemName = cartItems[index].name;
    cartItems.splice(index, 1);
    localStorage.setItem('ukambani_cart', JSON.stringify(cartItems));
    updateCartBadge();
    renderCart();
    showMessage(`${itemName} removed from cart`, 'info');
  }
}

function updateCartSummary() {
  cartItems = JSON.parse(localStorage.getItem('ukambani_cart')) || [];
  
  let subtotal = 0;
  cartItems.forEach(item => {
    const priceStr = item.price.replace('KES', '').replace(',', '').trim();
    const price = parseFloat(priceStr);
    subtotal += price * item.quantity;
  });
  
  const delivery = 200;
  const total = subtotal + delivery;
  
  document.getElementById('cart-subtotal').textContent = `KES ${subtotal.toLocaleString()}`;
  document.getElementById('cart-delivery').textContent = `KES ${delivery}`;
  document.getElementById('cart-total').textContent = `KES ${total.toLocaleString()}`;
}

// Cart modal event listeners
if (closeCartModalButton) {
  closeCartModalButton.addEventListener('click', closeCartModal);
}

if (cartModal) {
  cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
      closeCartModal();
    }
  });
}

if (continueShoppingBtn) {
  continueShoppingBtn.addEventListener('click', () => {
    closeCartModal();
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  });
}

if (proceedCheckoutBtn) {
  proceedCheckoutBtn.addEventListener('click', () => {
    closeCartModal();
    showCheckoutModal();
  });
}

// ===== CHECKOUT MODAL FUNCTIONS =====
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckoutModalButton = document.getElementById('close-checkout-modal');
const checkoutForm = document.getElementById('checkout-form');

function showCheckoutModal() {
  if (!currentUser) {
    showMessage('Please login to proceed with checkout', 'error');
    openAuthModal('login');
    return;
  }
  
  cartItems = JSON.parse(localStorage.getItem('ukambani_cart')) || [];
  
  if (cartItems.length === 0) {
    showMessage('Your cart is empty', 'error');
    return;
  }
  
  checkoutModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  
  // Pre-fill user information
  document.getElementById('delivery-name').value = currentUser.name;
  document.getElementById('delivery-phone').value = currentUser.phone;
  
  renderCheckoutSummary();
}

function closeCheckoutModal() {
  checkoutModal.classList.add('hidden');
  document.body.style.overflow = '';
}

function renderCheckoutSummary() {
  cartItems = JSON.parse(localStorage.getItem('ukambani_cart')) || [];
  
  // Render items
  const checkoutItemsHtml = cartItems.map(item => `
    <div class="checkout-item">
      <span class="checkout-item-name">${item.name} x${item.quantity}</span>
      <span>${item.price}</span>
    </div>
  `).join('');
  
  document.getElementById('checkout-items').innerHTML = checkoutItemsHtml;
  
  // Calculate totals
  let subtotal = 0;
  cartItems.forEach(item => {
    const priceStr = item.price.replace('KES', '').replace(',', '').trim();
    const price = parseFloat(priceStr);
    subtotal += price * item.quantity;
  });
  
  const delivery = 200;
  const total = subtotal + delivery;
  
  document.getElementById('checkout-subtotal').textContent = `KES ${subtotal.toLocaleString()}`;
  document.getElementById('checkout-delivery').textContent = `KES ${delivery}`;
  document.getElementById('checkout-total').textContent = `KES ${total.toLocaleString()}`;
}

// Checkout modal event listeners
if (closeCheckoutModalButton) {
  closeCheckoutModalButton.addEventListener('click', closeCheckoutModal);
}

if (checkoutModal) {
  checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) {
      closeCheckoutModal();
    }
  });
}

// Checkout form submission
if (checkoutForm) {
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const deliveryName = document.getElementById('delivery-name').value;
    const deliveryPhone = document.getElementById('delivery-phone').value;
    const deliveryAddress = document.getElementById('delivery-address').value;
    const deliveryCity = document.getElementById('delivery-city').value;
    const deliveryCounty = document.getElementById('delivery-county').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    cartItems = JSON.parse(localStorage.getItem('ukambani_cart')) || [];
    
    // Calculate order total
    let subtotal = 0;
    cartItems.forEach(item => {
      const priceStr = item.price.replace('KES', '').replace(',', '').trim();
      const price = parseFloat(priceStr);
      subtotal += price * item.quantity;
    });
    const total = subtotal + 200;
    
    // Create order
    const order = {
      id: 'ORD-' + Date.now(),
      user: currentUser,
      items: cartItems,
      delivery: {
        name: deliveryName,
        phone: deliveryPhone,
        address: deliveryAddress,
        city: deliveryCity,
        county: deliveryCounty
      },
      payment: paymentMethod,
      total: total,
      date: new Date().toISOString(),
      status: 'pending'
    };
    
    // Save order to localStorage
    let orders = JSON.parse(localStorage.getItem('ukambani_orders')) || [];
    orders.push(order);
    localStorage.setItem('ukambani_orders', JSON.stringify(orders));
    
    // Clear cart
    clearCart();
    
    // Show success message
    showMessage(`🎉 Order ${order.id} placed successfully! We'll contact you shortly for ${paymentMethod === 'mpesa' ? 'M-Pesa payment' : paymentMethod === 'card' ? 'card payment' : 'cash on delivery'}.`, 'success');
    
    // Close modal and reset form
    checkoutForm.reset();
    setTimeout(() => {
      closeCheckoutModal();
    }, 2000);
  });
}

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

// ===== Newsletter Subscription =====
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('.newsletter-input');
    const email = emailInput.value.trim();
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage('Please enter a valid email address.', 'error');
      return;
    }
    
    // Get existing subscribers or initialize array
    let subscribers = JSON.parse(localStorage.getItem('ukambani_newsletter_subscribers') || '[]');
    
    // Check if already subscribed
    if (subscribers.includes(email)) {
      showMessage('You are already subscribed to our newsletter!', 'info');
      emailInput.value = '';
      return;
    }
    
    // Add new subscriber
    subscribers.push(email);
    localStorage.setItem('ukambani_newsletter_subscribers', JSON.stringify(subscribers));
    
    showMessage('Thank you for subscribing! You will receive our weekly updates.', 'success');
    emailInput.value = '';
  });
}

// ===== Forgot Password Handler (Placeholder) =====
const forgotPasswordLink = document.querySelector('.forgot-password');
if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    showMessage('Password reset feature coming soon! Please contact support at info@ukambanihoney.co.ke', 'info');
  });
}