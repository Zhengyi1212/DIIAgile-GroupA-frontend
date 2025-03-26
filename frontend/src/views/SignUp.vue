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
  <input id="email" v-model="email" type="text" placeholder="Enter your Dundee email" required />
  <button type="button" class="code-btn" @click="sendCode" :disabled="!email || codeSent">
    {{ codeSent ? "Code Sent" : "Send Code" }}
  </button>
  <p v-if="codeSent" style="color: green; font-size: 0.9em;">✔ Code has been sent to your email</p>
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
          <!-- Verify Code Input -->



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
  
         
<div class="form-row">
  <label for="code">Verification Code</label>
  <input id="code" v-model="code" type="text" placeholder="Enter verification code" required>
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
        code: "",
        codeSent: false, 
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
     sendCode() {
      fetch("http://127.0.0.1:5000/signup/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: this.email })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Verification code sent to your email.");
          this.codeSent = true;
        } else {
          alert("Failed to send code: " + data.message);
        }
      })
      .catch(err => {
        console.error("Send code error:", err);
        alert("Error sending code");
      });
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
        } else if(this.inviteCode == "Tutor") {
          role = "Tutor"
        }

        ////change here
  
        const SignUpData = {
          email: this.email,
          username: this.username,
          password: this.password,
          code: this.code,
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
        this.code = "";
        this.codeSent = false;
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

  .register-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    ;
  }
  
  .register-container {
    position: fixed;
    padding: 15px;
    border-radius: 10px;
    top: 150px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color:rgba(255,255,255,0.7);
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
  .code-btn {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.code-btn:disabled {
  background-color: gray;
  cursor: not-allowed;
}
  </style>
  


