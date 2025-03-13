<template>
  <el-container>
    <el-header>
      <naviBarAndButton :username="user.username" :role="user.role"></naviBarAndButton>
      
    </el-header>
    
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
                  <span class="info-label">Username: </span>
                  <span v-if="!isEditing" class="info-value align-right">{{ user.username }}</span>
                  <el-input v-else v-model="user.username" placeholder="Enter username" class="edit-input"></el-input>
                </div>

                <div class="info-item">
                  <span class="info-label">Email: </span>
                  <span class="info-value align-right email-text">{{ user.email }}</span>
                </div>

                <div class="info-item password-item">
                  <div class="password-container">
                    <span class="info-label ">Password: </span>
                    <span v-if="!isEditing" class="info-value align-right">
                      {{ showPassword ? user.realPassword : user.password }}
                    </span>
                    <el-input 
                      v-else 
                      v-model="user.realPassword" 
                      placeholder="Enter new password"
                      class="edit-input"
                      style="width: 240px"
                      type="password"
                      show-password
                    />
                  </div>
                </div>

                <div class="info-item">
                  <span class="info-label">Role: </span>
                  <span class="info-value align-right role-tag">{{ user.role }}</span>
                </div>

                <div class="edit-actions" v-if="isEditing">
                  <el-button type="success" @click="saveChanges" class="action-button">Save Changes</el-button>
                  <el-button type="danger" @click="cancelEdit" class="action-button">Cancel</el-button>
                </div>

                <div class="edit-actions" v-else>
                  <el-button type="primary" @click="startEdit" class="action-button">Edit Profile</el-button>
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
      try {
        const payload = {
          username: this.user.username,
          ...(this.user.realPassword && { password: this.user.realPassword })
        };
        const response = await this.$axios.put('/api/user/update', payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.code === 200) {
          this.$message.success('修改成功');
          this.originalUser = JSON.parse(JSON.stringify(this.user));
          this.user.password = '********';
          this.user.realPassword = '';
          this.isEditing = false;
          this.$emit('update-user', this.user.username);
        } else {
          this.$message.error(response.data.msg || '修改失败');
        }
      } catch (error) {
        console.error('保存失败:', error);
        this.$message.error(`保存失败: ${error.response?.data?.message || error.message}`);
        this.isEditing = true;
      }
    }
  }
};
</script>

