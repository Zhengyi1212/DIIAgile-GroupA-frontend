<template>
  <div class="background-container" :style="{ backgroundImage: `url(${currentUrl})` }">
    <div class="top-style">
      <h1>DIICSU Booking System</h1>

    </div>

    <div class="login-wrapper">
      <div class="login-container card">
        <h2 class="login-title">
          Login
        </h2>
        <form class="login-form" @submit.prevent="handleLogin">

          <div class="form-row">
            <label for="email">Username</label>
            <input id="email" v-model="email" type="email" placeholder="Enter your email" required>
          </div>


          <div class="form-row">
            <label for="password">Password</label>
            <input id="password" v-model="password" type="password" placeholder="Enter your password" required>
          </div>


          <div class="form-actions">
            <button type="submit" class="primary-btn" :disabled="isLoading">
              {{ isLoading ? "Logging in..." : "Login" }}
            </button>
            <button type="button" class="secondary-btn" :disabled="isLoading" @click="resetForm">
              Reset
            </button>
          </div>
        </form>

        <p class="additional-info">
          Don't have an account yet?
          <a href="#" class="register-link" @click="goToRegister">Register for free</a>
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
      password: "",
      usaername: "",
      isLoading: false,
      images: [
        require('@/assets/boat.jpg'),
        require('@/assets/duck2.jpg'),
        require('@/assets/Uni-view.jpg'),
        require('@/assets/duck.jpg')
      ],
      currentIndex: 0,
      currentUrl: require('@/assets/boat.jpg') // Correct way to load the default image
    };
  },

  mounted() {
    this.checkToken(this.Username);
    this.startImageLoop();

  },


  methods: {
    startImageLoop() {
      setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
       
        this.currentUrl = this.images[this.currentIndex];
        
      }, 4000);

    },


    async handleLogin() {
      if (!this.email || !this.password) {
        alert("Please enter your email and password");
        return;
      }

      this.isLoading = true;

      const loginData = {
        email: this.email,  
        password: this.password,
        username: this.username,
      };

      try {
        const response = await fetch("http://127.0.0.1:5000/login", {  
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          
          body: JSON.stringify(loginData),
        });

        const data = await response.json();
        console.log(data);

        if (data.success) {
          localStorage.setItem("token", data.token);
          this.checkToken();
          alert("Login successful! Welcome "+ this.username + "! You are a " + this.role +".");
        } else {
          alert("Login Failure: " + data.message);
        }
      } catch (error) {
        console.error("Request Error:", error);
        alert("The login request failed, please try again later!");
      } finally {
        this.isLoading = false;
      }
    }
    ,
    resetForm() {
      this.email = "";
      this.password = "";
    },

    goToRegister() {
      if (!this.isLoading) {
        event.preventDefault();
        console.log("Jump to the registration page");
        this.$router.push("/signup");
      }
    },

    isTokenValid(token) {
      if (!token) return false;
      try {
        const decoded = this.parseToken(token);
        if (!decoded || !decoded.exp) return false;
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp > currentTime;
      } catch (error) {
        console.error("Token validation error:", error);
        return false;
      }
    },
    checkToken() {
      const token = localStorage.getItem("token");
      if (token && this.isTokenValid(token)) {
        const userInfo = this.parseToken(token);
        console.log("Token is valid, welcome, username:", userInfo.username, "Role:", userInfo.role);
        //this.$router.push(`/classrooms/${username}/${role}`);
        this.$router.push(
          {
            path : '/home',
            query : {
              username : userInfo.username,
              role : userInfo.role,
            }
          }
        );
      } else {
        console.log("The token is invalid or has expired, please log in again!");
      }
    },
    parseToken(token) {
      try {
        const base64Url = token.split(".")[1];  // JWT 结构为 header.payload.signature
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(decodeURIComponent(escape(atob(base64))));
      } catch (error) {
        console.error("Token parsing error:", error);
        return null;
      }
    },
  },
};
</script>

<style scoped>
.background-container {
  position: relative;
  width: 100%;
  height: 100vh;
  /* Full viewport height */
  background-image: v-bind(currentUrl);
  background-size: cover;
  background-position: center;
  transition: background-image 0.5s ease-in-out;
  background-repeat: no-repeat;
}

.top-style {
  display: flex;
  position: fixed;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2.0rem;
  font-weight: bold;
  color: #4A90E2;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
}


.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;


}

.login-container {
  position: fixed;
  top: 200px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.7);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-title {
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
  margin-right: 10px;
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

.register-link {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.register-link:hover {
  text-decoration: underline;
}
</style>