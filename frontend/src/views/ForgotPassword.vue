<template>
  <div class="login-wrapper">
    <div class="login-container card">
      <h2>Forget password?</h2>

      <!-- Step 1: Email input -->
      <div v-if="step === 1" class="form-section">
        <input v-model="email" type="email" placeholder="Enter your email" />
        <button @click="sendCode" :disabled="countdown > 0">
          {{ countdown > 0 ? `Resend (${countdown}s)` : "Send Verification Code" }}
        </button>
      </div>

      <!-- Step 2: Enter code -->
<div v-if="step === 2" class="form-section">
  <div class="code-input-row">
    <input v-model="code" placeholder="Enter the code sent to your email" />
    <button @click="sendCode" :disabled="countdown > 0" class="resend-btn">
      {{ countdown > 0 ? `(${countdown}s)` : "Resend" }}
    </button>
  </div>
  <button @click="verifyCode">Verify Code</button>
</div>


      <!-- Step 3: Reset password -->
      <div v-if="step === 3" class="form-section">
        <input v-model="newPassword" type="password" placeholder="Enter new password" />
        <input v-model="confirmPassword" type="password" placeholder="Confirm new password" />
        <button @click="resetPassword">Reset Password</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      step: 1,
      email: "",
      code: "",
      newPassword: "",
      confirmPassword: "",
      countdown: 0,
      countdownTimer: null,
    };
  },
  methods: {
    async sendCode() {
      const res = await fetch("http://127.0.0.1:5000/forgot/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: this.email }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Code sent to email.");
        this.step = 2;
        this.startCountdown();
      } else {
        alert(data.message);
      }
    },

    async verifyCode() {
      const res = await fetch("http://127.0.0.1:5000/forgot/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: this.email, code: this.code }),
      });
      const data = await res.json();
      if (data.success) {
        this.step = 3;
        this.stopCountdown();
      } else {
        alert(data.message);
      }
    },

    async resetPassword() {
      if (this.newPassword !== this.confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      const res = await fetch("http://127.0.0.1:5000/forgot/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: this.email,
          code: this.code,
          new_password: this.newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Password has been reset.");
        this.$router.push("/login");
      } else {
        alert(data.message);
      }
    },

    startCountdown() {
      this.countdown = 60;
      this.countdownTimer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(this.countdownTimer);
        }
      }, 1000);
    },

    stopCountdown() {
      clearInterval(this.countdownTimer);
      this.countdown = 0;
    },
  },
  beforeUnmount() {
    this.stopCountdown();
  },
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #f2f6fc, #e6efff);
}

.login-container {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.login-container h2 {
  margin-bottom: 24px;
  font-size: 1.8rem;
  color: #333;
  font-weight: bold;
  font-family: 'Poppins', sans-serif;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

input {
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #007bff;
  outline: none;
}

button {
  padding: 12px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover:enabled {
  background-color: #0056b3;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
.code-input-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.code-input-row input {
  flex: 1;
}

.resend-btn {
  white-space: nowrap;
  padding: 12px 16px;
}

@media (max-width: 480px) {
  .login-container {
    padding: 20px;
  }

  .login-container h2 {
    font-size: 1.5rem;
  }
}
</style>
