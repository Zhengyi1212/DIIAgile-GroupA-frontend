<template>
  <el-container>
    <el-header>
      <naviBarAndButton :username="user.username" :role="user.role">
      </naviBarAndButton>
    </el-header>
  <!--
    add "Edit button"-->
    <el-main>
      <div class="profile-container">
        <div class="centered-card">
          <div class="user-card">
            <div class="card-header">
              <h2 class="user-title">👤 User Information</h2>
              <div class="decorative-line"></div>
            </div>

            <div class="card-body">
              <div class="info-box">
                <div class="info-item">
                  <span class="info-label">Username:</span>
                  <span class="info-value align-right">{{ user.username }}</span>
                </div>

                <div class="info-item">
                  <span class="info-label">Email</span>
                  <span class="info-value align-right email-text">{{ user.email }}</span>
                </div>

                <div class="info-item password-item">
                  <div class="password-container">
                    <span class="info-label">密码：</span>
                    <span class="info-value align-right">
                      {{ showPassword ? user.realPassword : user.password }}
                    </span>
                  </div>
                  <button class="toggle-password" @click="togglePassword" :class="{ 'visible': showPassword }">
                    {{ showPassword ? '🔒' : '👁️' }}
                  </button>
                </div>

                <div class="info-item">
                  <span class="info-label">Role:</span>
                  <span class="info-value align-right role-tag">{{ user.role }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import NaviBarAndButton from '@/components/NaviBarAndButton.vue';

export default {
  name: 'ProfileView',
  data() {
    return {
      showPassword: false,
      user: {
        username: 'MOMo',
        password: '********',
        role: 'Student',
        email: 'chris@edu.com'
      },
    };
  },
  components: {
    naviBarAndButton: NaviBarAndButton
  },
  created() {
    this.user.username = this.$route.query.username;
    this.user.role = this.$route.query.role;
   
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    getInEmail() {
      const token = localStorage.getItem("token");
      const userInfo = this.parseToken(token);
      this.email = userInfo.email;
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
  }
};
</script>

<style scoped>
.el-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.el-header {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
}

.el-main {
  flex: 1;
  padding-top: 160px; /* Increased padding to move content further down */
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); /* Background for the main content */
}

.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); /* Ensure background covers the entire container */
}

.centered-card {
  width: 100%;
  max-width: 500px;
  padding: 20px;
}

.user-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  transition: transform 0.3s ease;
  position: relative;
}

.user-card:hover {
  transform: translateY(-3px);
}

.card-header {
  padding: 2rem;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.user-title {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.decorative-line {
  width: 50px;
  height: 3px;
  background: #3498db;
  margin: -0.5rem auto 1rem;
  border-radius: 2px;
}

.info-box {
  padding: 2rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: #7f8c8d;
  font-weight: 500;
  font-size: 1rem;
}

.info-value {
  font-size: 1rem;
  font-weight: 500;
  color: #2c3e50;
}

.align-right {
  text-align: right;
  flex-grow: 1;
}

.email-text {
  color: #3498db;
}

.password-item {
  position: relative;
  padding-right: 60px;
}

.toggle-password {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.3rem;
  padding: 8px;
  transition: all 0.3s ease;
}

.toggle-password:hover {
  opacity: 0.8;
  transform: translateY(-50%) scale(1.1);
}

.toggle-password.visible {
  color: #3498db;
}

.role-tag {
  color: #3498db;
  font-weight: 600;
}
</style>