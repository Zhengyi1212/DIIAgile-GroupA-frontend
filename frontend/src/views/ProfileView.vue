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
              <span v-if="!isEditing" >
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

  <!--Verify Window-->
  <el-dialog title="Verify Your Password" v-model="passwordDialogVisible">
      <el-form @submit.prevent @keyup.enter="handleEnter">
        <el-form-item label="Enter Original Password">
          <el-input v-model="originalPasswordInput" type="password" show-password clearable ref="passwordInput"/>
        </el-form-item>
      </el-form>

      <template #footer>
      <div class="dialog-footer">
      <el-button @click="passwordDialogVisible = false">Cancel</el-button>
      <el-button type="primary" :disabled="!originalPasswordInput" @click="verifyOriginalPassword" native-type="button">Confirm</el-button>
    </div>
  </template>
</el-dialog>

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
      passwordDialogVisible:false,
      originalPasswordInput:"",
      isPasswordVerified: false,
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
    console.log('Route query:', this.$route.query);
    console.log('Initial user:', this.user);
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
      this.passwordDialogVisible = true;
    },

    cancelEdit() {
      this.user = JSON.parse(JSON.stringify(this.originalUser));
      this.isEditing = false;
    },

    openPasswordDialog() {
      if (!this.user.realPassword) {
        this.saveChanges(); 
      } else {
        this.passwordDialogVisible = true; 
     }
    },

    handleEnter() {
    if (this.originalPasswordInput.trim()) {
      this.verifyOriginalPassword()
    }
  },

    async verifyOriginalPassword() {
      let loading = null;
      try {
      
      if (!this.originalPasswordInput.trim()) {
        this.$message.error("Password cannot be empty!")
        this.$refs.passwordInput.focus()  
        return
      }

        loading = this.$loading({
        lock: true,
        text: 'Verifying...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      const response = await fetch("http://127.0.0.1:5000/verify-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          email: this.user.email,
          password: this.originalPasswordInput,
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Unknown error" }))
        throw new Error(error.message)
      }

      const data = await response.json()
      if (data.success) {
        this.isPasswordVerified = true
        this.passwordDialogVisible = false
        this.$message.success("Verification successful!")
      } else {
        this.$message.error("Incorrect password!")
        this.originalPasswordInput = ""  
        this.$refs.passwordInput.focus() 
      }
    } catch (error) {
      this.$message.error(`Verification failed: ${error.message}`)
    } finally {
      if(loading){
      loading.close()  
     }
   }
  },

  closeDialog() {
    this.passwordDialogVisible = false
    this.originalPasswordInput = ""  
    this.isPasswordVerified = false 
  },
  
    async saveChanges() {
      let loading = null;
      try {

    if (!this.isPasswordVerified) {
      this.$message.warning("Please verify original password!");
      return;
    }

      loading = this.$loading({
      lock: true,
      text: 'Saving...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });

    const profileData = {
      email: this.user.email,
      password: this.user.realPassword || undefined, 
      username: this.user.username
    };

    const response = await fetch("http://127.0.0.1:5000/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}` 
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Fail!" + response.status);
    }

    const data = await response.json();
    if (data.success) {
      this.$message.success("Save successfully!");
      
      if (data.token) {
        localStorage.setItem("token", data.token);
        this.originalUser = JSON.parse(JSON.stringify(this.user));
      }
      
      this.isEditing = false;
      this.isPasswordVerified = false; 
    }
  } catch (error) {
    console.error("Mistake!:", error);
    this.$message.error(`Failure!:${error.message}`);
  } finally {
    console.log("Closing loading...")
    if(loading){
      loading.close();
    }
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