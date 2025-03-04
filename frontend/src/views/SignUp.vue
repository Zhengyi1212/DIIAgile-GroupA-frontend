<template>
    <div class="register-wrapper">
      <div class="register-container card">
        <h2 class="register-title">
          Register
        </h2>
        <form
          class="register-form"
          @submit.prevent="handleRegister"
        >
          <!-- Username Input -->
          <div class="form-row">
            <label for="username">Username</label>
            <input
              id="username"
              v-model="username"
              type="text"
              placeholder="Enter your username"
              required
            >
          </div>
  
          <!-- Password Input -->
          <div class="form-row">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Enter your password"
              required
            >
          </div>
  
          <!-- Confirm Password Input -->
          <div class="form-row">
            <label for="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              required
            >
          </div>
  
          <!-- Invite Code Input -->
          <div class="form-row">
            <label for="inviteCode">Invite Code</label>
            <input
              id="inviteCode"
              v-model="inviteCode"
              type="text"
              placeholder="Enter invite code (optional)"
            >
          </div>
  
          <!-- Submit and Reset Buttons -->
          <div class="form-actions">
            <button
              type="submit"
              class="primary-btn"
            >
              Register
            </button>
            <button
              type="button"
              class="secondary-btn"
              @click="resetForm"
            >
              Reset
            </button>
          </div>
        </form>
  
        <!-- Navigate to Login Page -->
        <p class="additional-info">
          Already have an account?
          <a
            href="#"
            class="login-link"
            @click="goToLogin"
          >Login now</a>
        </p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: "",
        password: "",
        confirmPassword: "",
        inviteCode: "", // Invite code field
      };
    },
    methods: {
      handleRegister() {
        if (this.password !== this.confirmPassword) {
          alert("The passwords do not match. Please try again!");
          return;
        }
  
        // Set role based on invite code
        let role = "Customer"; // Default role is Customer
        if (this.inviteCode === "store1234") {
          // Validate invite code (replace with your actual invite code logic)
          role = "StoreManager";
        }
  
        const registerData = {
          Username: this.username,
          Password: this.password,
          Role: role, // Role set based on invite code
        };
  
        console.log(registerData);
        // Send registration request to the backend
        fetch(
          "/api/SystemRegister.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(registerData),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              alert("Registration successful! Please login.");
              console.log(data);
              this.$router.push("/login");
            } else {
              alert("Registration failed: " + data.message);
            }
          })
          .catch((error) => {
            console.error("Registration request failed:", error);
            alert("Registration request failed. Please try again later!");
          });
      },
      resetForm() {
        this.username = "";
        this.password = "";
        this.confirmPassword = "";
        this.inviteCode = ""; // Reset invite code
      },
      goToLogin() {
        this.$router.push("/login");
      },
    },
  };
  </script>
  
  <style scoped>
  /* Styles consistent with login page */
  .register-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f4f4f9;
  }
  
  .register-container {
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: white;
    width: 100%;
    max-width: 400px;
    text-align: center;
  }
  
  .register-title {
    margin-bottom: 20px;
    font-size: 1.8rem;
    color: #333;
  }
  
  .form-row {
    margin-bottom: 15px;
    text-align: left;
  }
  
  .form-row label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .form-row input {
    width: 94%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .primary-btn {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .primary-btn:hover {
    background-color: #0056b3;
  }
  
  .secondary-btn {
    padding: 10px 20px;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .secondary-btn:hover {
    background-color: #565e64;
  }
  
  .additional-info {
    margin-top: 15px;
    color: #555;
  }
  
  .login-link {
    color: #007bff;
    text-decoration: none;
  }
  
  .login-link:hover {
    text-decoration: underline;
  }
  </style>
  