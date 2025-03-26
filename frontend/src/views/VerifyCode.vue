<template>
    <div class="verify-container">
      <div class="verify-box">
        <h2>Enter Verification Code</h2>
        <p class="hint">We have sent a 6-digit verification code to <strong>{{ email }}</strong>.</p>
  
        <input
          v-model="code"
          type="text"
          placeholder="Enter your code"
          maxlength="6"
          class="code-input"
        />
  
        <div class="btn-group">
          <button @click="verifyCode" :disabled="isLoading">
            {{ isLoading ? "Verifying..." : "Verify & Login" }}
          </button>
          <button @click="goBack" :disabled="isLoading">Back</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "VerifyCode",
    data() {
      return {
        email: this.$route.query.email || "",
        code: "",
        isLoading: false,
      };
    },
    methods: {
      async verifyCode() {
        if (!this.code || this.code.length !== 6) {
          alert("Please enter a 6-digit code.");
          return;
        }
        this.isLoading = true;
        try {
          const response = await fetch("http://127.0.0.1:5000/login/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: this.email, code: this.code })
          });
          const data = await response.json();
  
          if (data.success) {
            localStorage.setItem("token", data.token);
            this.$router.push({
              path: "/home",
              query: {
                username: data.username,
                role: data.role,
              },
            });
          } else {
            alert("Verification failed: " + data.message);
          }
        } catch (error) {
          console.error("Error verifying code:", error);
          alert("Verification request failed.");
        } finally {
          this.isLoading = false;
        }
      },
      goBack() {
        this.$router.push("/");
      },
    },
  };
  </script>
  
  <style scoped>
  .verify-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f4f8;
  }
  
  .verify-box {
    background: white;
    padding: 30px 40px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 400px;
    width: 100%;
  }
  
  .verify-box h2 {
    margin-bottom: 15px;
  }
  
  .hint {
    margin-bottom: 20px;
    font-size: 14px;
    color: #666;
  }
  
  .code-input {
    padding: 10px;
    font-size: 18px;
    width: 100%;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 20px;
  }
  
  .btn-group button {
    padding: 10px 20px;
    margin: 0 10px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
  }
  
  .btn-group button:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
  </style>
  