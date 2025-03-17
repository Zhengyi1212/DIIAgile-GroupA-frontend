<template>
  <el-container>
    <el-header>
      <naviBarAndButton :username="user.username" :role="user.role"></naviBarAndButton>
    </el-header>

    <el-main class="main-content">
      <div class="profile-container">
        <el-card class="user-card">
          <template #header>
            <div class="card-header">
              <h2 class="user-title">User Profile</h2>
              <el-divider></el-divider>
            </div>
          </template>

          <el-form label-width="120px" label-position="left">
            <el-form-item label="Username:">
              <span v-if="!isEditing">{{ user.username }}</span>
              <el-input 
                v-else 
                v-model="user.username" 
                placeholder="Enter username"
                clearable
              />
            </el-form-item>

            <el-form-item label="Email:">
              <span>{{ user.email }}</span>
            </el-form-item>

            <el-form-item label="Password:">
              <span v-if="!isEditing">
                {{ '********' }}
              </span>
              <el-input
                v-else
                v-model="user.realPassword"
                placeholder="Enter new password"
                type="password"
                show-password
                clearable
                />
              </el-form-item>

            <el-form-item label="Role:">
              <el-tag type="info">{{ user.role }}</el-tag>
            </el-form-item>

            <el-form-item>
              <div v-if="isEditing" class="action-buttons">
                <el-button type="primary" @click="saveChanges">Save Changes</el-button>
                <el-button @click="cancelEdit">Cancel</el-button>
              </div>
              <el-button v-else type="primary" @click="startEdit">Edit Profile</el-button>
            </el-form-item>
          </el-form>
        </el-card>
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
      isEditing: false,
      originalUser: null,
      user: {
        username: 'MOMo',
        password: '********',
        realPassword: '',
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
    this.getEmail();
  
    this.originalUser = JSON.parse(JSON.stringify(this.user));
  },

  methods: {
    getEmail() {
      const token = localStorage.getItem("token");
      const userInfo = this.parseToken(token);
      if (userInfo && userInfo.email) {
        this.user.email = userInfo.email;
      }
    },

    parseToken(token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(decodeURIComponent(escape(atob(base64))));
      } catch (error) {
        console.error("Token parsing error:", error);
        return null;
      }
    },

    startEdit() {
      this.isEditing = true;
      this.originalUser = JSON.parse(JSON.stringify(this.user));
      console.log("Edit mode activated:", this.isEditing);
    },

    cancelEdit() {
      this.user = JSON.parse(JSON.stringify(this.originalUser));
      this.isEditing = false;
    },

    async saveChanges() {
  const profileData = {
    email: this.user.email,
    password: this.user.realPassword || this.originalUser.realPassword, 
    username: this.user.username,
  };
  
  try {
    const response = await fetch("http://127.0.0.1:5000/profile", {  
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });
    
    const data = await response.json();
    if (data.success) {
      localStorage.setItem("token", data.token);
      alert("Profile modification successful!");
    } else {
      alert("Failed to modify the profile: " + data.message);
    }
  } catch (error) {
    console.error("Request Error:", error);
    alert("The profile modification request failed, please try again later!");
  } finally {
    this.isLoading = false;
  }
}
    
  }
};
</script>

<style scoped>

.el-header {
  margin-bottom: 20px;  
}

.main-content {
  margin-top: 30px;     
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px;  
}

.user-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.card-header {
  text-align: center;
  margin-bottom: 20px;
}

.user-title {
  color: #303133;
  font-size: 24px;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.el-form-item {
  margin-bottom: 24px;
}

.el-tag {
  font-size: 14px;
  padding: 0 10px;
  height: 28px;
  line-height: 26px;
}
</style>