// Fetch products for the homepage
document.addEventListener("DOMContentLoaded", () => {
  const shopNowButton = document.getElementById("shop-now-button");
  if (shopNowButton) {
    shopNowButton.addEventListener("click", fetchProducts);
  } else {
    console.error("Shop Now button not found.");
  }
});
async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:5000/get-product");
    const result = await response.json();
    if (response.ok) {
      const categoryList = document.getElementById("category-list");
      categoryList.innerHTML = ""; // Clear existing items
      result.products.forEach((product) => {
        const categoryItem = document.createElement("div");
        categoryItem.className = "category-item";
        categoryItem.innerHTML = `
                  <img src="${product.img}" alt="${product.name}" />
                  <h3>${product.name}</h3>
                  <p>Price: $${product.price}</p>
                  <button onclick="addToCart('${product.productId}', 1)">Add to Cart</button>
              `;
        categoryList.appendChild(categoryItem);
      });
    } else {
      console.error(`Error fetching products: ${result.message}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Add product to cart
async function addToCart(productId, quantity) {
  const userId = sessionStorage.getItem("userId"); // Assuming userId is stored in session
  if (!userId) {
    alert("Please log in to add items to your cart.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/cart/addtocart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, productId, quantity }),
    });
    const result = await response.json();
    if (response.ok) {
      alert("Product added to cart successfully!");
    } else {
      console.error(`Error adding to cart: ${result.message}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Handle user login
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission

  const email = event.target.email.value;
  const password = event.target.password.value;

  // Prepare the data to be sent to the server
  const loginData = {
      email: email,
      password: password
  };

  // Send a POST request to the backend API
  fetch('/api/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json(); // Parse the JSON from the response
  })
  .then(data => {
      // Check if login was successful
      if (data.success) {
          document.getElementById('login-message').textContent = "Login successful!";
          // Redirect to another page or perform other actions
          window.location.href = "index.html"; // Redirect to homepage
      } else {
          document.getElementById('login-message').textContent = "Invalid email or password.";
      }
  })
  .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      document.getElementById('login-message').textContent = "An error occurred. Please try again.";
  });
});

// Handle user signup
document
  .getElementById("signup-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const phone = event.target.phone.value;

    try {
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const result = await response.json();
      if (response.ok) {
        alert("User  registered successfully!");
        window.location.href = "login.html"; // Redirect to login page
      } else {
        document.getElementById("signup-message").innerText = result.error;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

// Fetch cart items
async function fetchCart() {
  const userId = sessionStorage.getItem("userId");
  if (!userId) {
    alert("Please log in to view your cart.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/cart/get-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
    const result = await response.json();
    if (response.ok) {
      const cartItems = document.getElementById("cart-items");
      cartItems.innerHTML = ""; // Clear existing items
      result.cart.productsInCart.forEach((item) => {
        const cartItem = document.createElement("div");
        cartItem.innerHTML = `
                  <p>Product ID: ${item.productId} - Quantity: ${item.productQty}</p>
                  <button onclick="removeFromCart('${item.productId}')">Remove</button>
              `;
        cartItems.appendChild(cartItem);
      });
      document.getElementById(
        "cart-total"
      ).innerText = `Total: ${result.cart.productsInCart.length} items`;
    } else {
      console.error(`Error fetching cart: ${result.message}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Remove item from cart
async function removeFromCart(productId) {
  const userId = sessionStorage.getItem("userId");
  if (!userId) {
    alert("Please log in to remove items from your cart.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/cart/delete-items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, productId }),
    });
    const result = await response.json();
    if (response.ok) {
      alert("Item removed from cart successfully!");
      fetchCart(); // Refresh cart items
    } else {
      console.error(`Error removing item: ${result.message}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Submit a complaint
document
  .getElementById("complaint-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const message = event.target.message.value;

    try {
      const response = await fetch(
        "http://localhost:5000/complaints/post-complaints",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, message, userType: "customer" }),
        }
      );
      const result = await response.json();
      if (response.ok) {
        alert("Complaint submitted successfully!");
        event.target.reset(); // Reset the form
      } else {
        console.error(`Error submitting complaint: ${result.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

// Apply a coupon
document
  .getElementById("apply-coupon-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const code = event.target.code.value;

    try {
      const response = await fetch(
        "http://localhost:5000/coupon/verify-coupon",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        }
      );
      const result = await response.json();
      if (response.ok) {
        alert(`Coupon applied! Discount: ${result.discountPercentage}%`);
      } else {
        console.error(`Error applying coupon: ${result.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

// Fetch available coupons
async function fetchCoupons() {
  try {
    const response = await fetch("http://localhost:5000/coupon/get-coupon");
    const result = await response.json();
    if (response.ok) {
      const couponList = document.getElementById("coupon-list");
      couponList.innerHTML = ""; // Clear existing coupons
      result.coupons.forEach((coupon) => {
        const couponItem = document.createElement("div");
        couponItem.innerHTML = `
                  <p>Code: ${coupon.code} - Discount: ${coupon.discountPercentage}%</p>
              `;
        couponList.appendChild(couponItem);
      });
    } else {
      console.error(`Error fetching coupons: ${result.message}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Call fetchCoupons on page load
window.onload = fetchCoupons;
