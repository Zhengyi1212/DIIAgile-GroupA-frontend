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
                {{ showPassword ? user.realPassword : '********' }}
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

<style scoped>
/* 新增间距样式 */
.el-header {
  margin-bottom: 20px;  /* 导航栏底部增加间距 */
}

.main-content {
  margin-top: 30px;     /* 主内容区域顶部增加间距 */
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px;   /* 增加容器内边距 */
}

/* 保持其他样式不变 */
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