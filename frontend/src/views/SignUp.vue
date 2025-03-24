<template>
    
  <div class="background-container"  v-bind:style="{ backgroundImage: `url(${currentUrl})` }">
    <div class="top-style">
      <h1>DIICSU Booking System</h1>
    </div>
    
    <div class="register-wrapper">
      <div class="register-container card">
        <h2 class="register-title">
          Sign Up
        </h2>
        <form
          class="register-form"
          @submit.prevent="handleRegister"
        > 

          <!-- Email Input -->
          <div class="form-row">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="email"
              type="text"
              placeholder="Enter your Dundee email"
              required
            >
          </div>

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
  </div>

  </template>
  
  <script>
  export default {
    data() {
      return {
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        inviteCode: "", 
        images : [ 
        require('@/assets/csu1.jpg'),
        require('@/assets/csu2.jpg'),
        require('@/assets/csu3.jpg'),
        
      ],
      currentIndex: 0,
      currentUrl: require('@/assets/csu1.jpg') 
   
      };
    },
   

    mounted() {
     
      this.startImageLoop();
      
    },



    methods: {
      startImageLoop() {
      setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        
        this.currentUrl = this.images[this.currentIndex];
       
      }, 3000); 
      
     },

      handleRegister() {
        if (this.password !== this.confirmPassword) {
          alert("The passwords do not match. Please try again!");
          return;
        }
  
        // Set role based on invite code
        let role = "Student"; // Default role is Customer


        // change here!!!! bad practice
        if (this.inviteCode === "Admin") {
          // 改成 “invite code incorrect, refuse to register”
          role = "Admin";
        } else if(this.inviteCode == "Lecture") {
          role = "Lecture"
        }

        ////change here
  
        const SignUpData = {
          email: this.email,
          username: this.username,
          password: this.password,
          role: role, // Role set based on invite code
        };
  
        console.log(SignUpData);
        // Send registration request to the backend
        fetch(
          "http://127.0.0.1:5000/signup",     //
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(SignUpData),
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
            alert("Sign up request failed. Please try again later!");
          });
      },

      resetForm() {
        this.email = "";
        this.username = "";
        this.password = "";
        this.confirmPassword = "";
        this.inviteCode = ""; 
      },

      goToLogin() {
        this.$router.push("/login");
      },
    },
  };
  </script>
  


  <style scoped>
  /* Styles consistent with login page */
  .background-container {
  position: relative;
  width: 100%;
  height: 100vh; /* Full viewport height */
  background-image: v-bind(currentUrl);
  background-size: cover;
  background-position: center;
  transition: background-image 0.5s ease-in-out;
  background-repeat: no-repeat;
}

/* Enlarged Title for Better Visibility */
.top-style {
  display: flex;
  position: fixed;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2.5rem; /* Increased size */
  font-weight: bold;
  color: #4A90E2;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
}

/* Centering the Signup Container */
.register-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

/* Larger Signup Box with Enhanced Shadows */
.register-container {
  position: fixed;
  top: 140px;
  padding: 5px 30px 5px;
  border-radius: 20px; /* More rounded edges */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); /* Stronger shadow */
  background-color: rgba(255, 255, 255, 0.8);
  width: 90%;
  max-width: 550px; /* Increased max width */
  text-align: center;
}

/* Bigger Signup Title */
.register-title {
  margin-bottom: 20px;
  font-size: 2.2rem; /* Increased size */
  font-weight: bold;
  color: #333;
}

/* Improved Form Layout */
.form-row {
  margin-bottom: 20px;
  text-align: left;
}

/* Larger Labels */
.form-row label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  font-size: 1.1rem;
}

/* Bigger Input Fields */
.form-row input {
  width: 100%;
  padding: 12px;
  font-size: 1.1rem;
  border: 1px solid #bbb;
  border-radius: 8px;
}

/* Enhanced Primary Button */
.primary-btn {
  padding: 12px 24px;
  font-size: 1.1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease-in-out, transform 0.2s;
}

.primary-btn:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

/* Enhanced Secondary Button */
.secondary-btn {
  padding: 12px 24px;
  font-size: 1.1rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease-in-out, transform 0.2s;
}

.secondary-btn:hover {
  background-color: #565e64;
  transform: translateY(-2px);
}

/* More Visible Additional Info */
.additional-info {
  margin-top: 20px;
  font-size: 1rem;
  color: #444;
}

/* Bigger and Clearer Login Link */
.login-link {
  font-size: 1.2rem;
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.login-link:hover {
  text-decoration: underline;
}

  </style>
  


