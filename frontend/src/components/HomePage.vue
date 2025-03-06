<template>
  <div class="header">

    <div class="project-icon">

      <img src="../assets/dii-logo.png" alt="Project Icon" />
    </div>

    <div class="title">
      <h1>DIICSU Booking System</h1>
    </div>

    <div class="profile-section">
      <div class="profile-icon" @click="redirectToProfile">
        <img src="../assets/avatar.png" alt="Profile" />
      </div>


      <div class="info">
        <!-- add method， 后端 pass !!!!!! -->
        <div class="profile-name">Your Name</div>
        <div class="profile-role">Your Role</div>
      </div>

      <div>

        <button @click="logout" class="logout-btn">
          退出登录
        </button>
      </div>

    </div>
  </div>

  <nav class="navbar">
    <ul class="nav-list">
      <li><router-link to="classrooms">Classroom Information</router-link></li>
      <li><router-link to="mybookings">My Bookings</router-link></li>
    </ul>
  </nav>

</template>

<script>
export default {
  name: 'HomePage',
  methods: {
    redirectToProfile() {
      // Redirect to the profile page
      this.$router.push('/profile');
    },
    logout() {
      localStorage.removeItem("token");

      this.$router.push("/login");

      alert("您已退出登录");
    },
  },
};
</script>

<style scoped>
/* Container for header with project icon and profile icon */
.header {
  display: flex;
  justify-content: space-between;
  /* Distribute space between the elements */
  align-items: center;
  padding: 0 10px;
  width: 100%;
}

.project-icon img {
  height: 120px;
  /* Adjust size as needed */
  cursor: pointer;
}

.title {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-size: 30px;
  color: #4A90E2;

  text-align: center;
  white-space: none;
}

.profile-section {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.profile-icon img {
  height: 120px;
  cursor: pointer;
}

.info {
  margin-right: 10px;
  text-align: left;
}


.profile-icon:hover {
  filter: brightness(0.7);
}

.logout-btn {
  padding: 10px 20px;
  background-color: #ff4444;
  /* 红色背景 */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.logout-btn:hover {
  background-color: #cc0000;
  /* 深红色 */
}

.navbar {
  background-color: #ADD8E6;
  /* Light Blue */
  padding: 12px 0;
  text-align: center;
}

.nav-list {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  gap: 150px;
}

.nav-list li {
  display: inline;
}

.nav-list a,
.nav-list router-link {
  text-decoration: none;
  color: black;
  font-size: 30px;
  font-weight: bold;
}

.nav-list a:hover,
.nav-list router-link:hover {
  color: #004080;
}
</style>