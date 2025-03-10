<template>
  <el-container>
    <el-header>
      <naviBar :username="username" :role="role">
      </naviBar>
    </el-header>
    <el-main>
      <div class="home-page">
        <div class="welcome-text">Welcome to DIICSU Room Book System!</div>
        <div class="image-container">
          <div class="image-box" @click="goToClassrooms">
            <img src="../assets/navi1.jpg" alt="Classroom Information">
            <router-link to="classrooms" class="image-button">Classroom Information</router-link>
          </div>
          <div class="image-box" @click="goToMyBookings">
            <img src="../assets/navi2.jpg" alt="My Booking">
            <router-link to="mybookings" class="image-button">My Booking</router-link>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>


import NaviBar from '@/components/NaviBar.vue';
import router from '@/router'
export default {

  data() {
    return {
      username: '',
      role: '',
    };
  },

  components: {
    naviBar: NaviBar, // Register the component
  },

  created() {
    this.username = this.$route.query.username;
    this.role = this.$route.query.role;
  },

  methods: {
    goToClassrooms() {
      router.push({
        path: '/classrooms',
        query: {                   
          username: this.username, 
          role: this.role }
      });
    },

    goToMyBookings() {
      router.push({
        path: '/mybookings',
        query: { 
          username: this.username,
           role: this.role }
      });
    }
  }

};

</script>

<style scoped>
.welcome-text {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: #005792;
  margin: 1rem 0;
  padding-top: 1.5rem;
}


.image-container {
  display: flex;
  justify-content: space-evenly;
  /* Distribute images evenly */
  align-items: center;
  gap: 2rem;
  width: 100%;
  /* Ensure it takes full width */
  max-width: 95%;
  /* Keep some margin from screen edges */
  padding: 1rem;
  margin: 0 auto 2rem;
  /* Center the container and add bottom spacing */
  box-sizing: border-box;
}

.image-box {
  position: relative;
  flex: 1;
  max-width: 50%;
  /* Increased width */
  height: calc(90vh - 200px);
  cursor: pointer;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}


.image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.image-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: transparent;
  color: black;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: bold;
  border: 2px solid white;
}

.image-button:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>