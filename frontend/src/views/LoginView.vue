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
            <label for="email">Email</label>
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
      // ✅ 登录成功，后端已发送验证码，跳转到验证码页面
      alert("Verification code has been sent to your email.");
      this.$router.push({
        path: '/verify',
        query: { email: this.email }
      });
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
  height: 100vh; /* Full viewport height */
  background-image: v-bind(currentUrl);
  background-size: cover;
  background-position: center;
  transition: background-image 0.5s ease-in-out;
  background-repeat: no-repeat;
}

@media (max-width: 768px) {
  .background-container {
    flex-direction: column;
    padding-top: 60px;
    height: auto;
    min-height: 100vh;
    background-size: cover;
    background-position: center;
  }

  .top-style {
    font-size: 1.8rem !important;
    margin-bottom: 10px;
    position: static;
    transform: none;
    text-align: center;
    width: 100%;
  }

  .top-style h1 {
    font-size: 1.8rem !important;
    text-align: center;
    margin: 0;
    line-height: 1.2;
  }

  @media (max-width: 768px) {
  .top-style {
    position: static;
    transform: none;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-top: 30px;
  }

  .top-style h1 {
    margin: 0;
    font-size: 1.8rem !important;
  }
}


  .login-wrapper {
    padding: 0 16px;
    align-items: flex-start;
    height: auto;
  }

  .login-container {
    width: 100%;
    max-width: 360px;
    padding: 20px;
    margin: 0 auto;
    border-radius: 12px;
  }

  .form-actions {
    flex-direction: column;
    gap: 10px;
  }

  .primary-btn,
  .secondary-btn {
    width: 100%;
  }
}

/* Enlarged Title for Better Visibility */
.top-style {
  display: flex;
  position: fixed;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 3rem; /* Increased size */
  font-weight: bold;
  color: #4A90E2;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
}

/* Centering the login container */
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

/* Larger Login Box with Enhanced Shadows */
.login-container {
  position: fixed;
  top: 200px;
  padding: 30px; /* Increased padding */
  border-radius: 15px; /* More rounded edges */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); /* Stronger shadow */
  background-color: rgba(255, 255, 255, 0.8);
  width: 90%;
  max-width: 500px; /* Increased max width */
  text-align: center;
}

/* Bigger Login Title */
.login-title {
  margin-bottom: 25px;
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

/* Bigger and Clearer Register Link */
.register-link {
  font-size: 1.2rem;
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.register-link:hover {
  text-decoration: underline;
}

</style>