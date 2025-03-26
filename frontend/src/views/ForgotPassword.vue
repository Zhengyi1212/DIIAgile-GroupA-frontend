<template>
  <div class="login-wrapper">
    <div class="login-container card">
      <h2>Retrieve Password</h2>

      <!-- Step 1: Email input -->
      <div v-if="step === 1" class="form-section">
        <input v-model="email" type="email" placeholder="Enter your email" />
        <button @click="sendCode">Send Verification Code</button>
      </div>

      <!-- Step 2: Enter code -->
      <div v-if="step === 2" class="form-section">
        <input v-model="code" placeholder="Enter the code sent to your email" />
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
      } else {
        alert(data.message);
      }
    },
    async resetPassword() {
      if (this.newPassword !== this.confirmPassword) {
        alert("Passwords do not match. Please re-enter.");
        return;
      }

      const res = await fetch("http://127.0.0.1:5000/forgot/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: this.email,
          code: this.code,
          new_password: this.newPassword,
          confirm_password:this.confirmPassword
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

button:hover {
  background-color: #0056b3;
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
