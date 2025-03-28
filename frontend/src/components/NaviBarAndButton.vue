<template>
  <div class="header-container">
    <header class="header">
      <div class="header-top">
        <div class="brand-section">
          <img src="../assets/dii-logo.png" alt="Project Icon" class="brand-logo" />
          <h1 class="brand-title">DIICSU Room Book System</h1>
        </div>

      
        <div class="hamburger" @click="isMobileMenuOpen = !isMobileMenuOpen">
          <span :class="{ open: isMobileMenuOpen }"></span>
          <span :class="{ open: isMobileMenuOpen }"></span>
          <span :class="{ open: isMobileMenuOpen }"></span>
        </div>
 
        <div class="button-section">
          <button @click="redirectToHome" class="nav-button">Home</button>
          <button @click="redirectToClassrooms" class="nav-button">Classroom Information</button>
          <button @click="redirectToMyBookings" class="nav-button">My Bookings</button>
          <button @click="downloadLog" class="nav-button">Download Log</button>
          <button v-if="role === 'Student'" @click="reportRepair" class="nav-button">Repairs</button>
        </div>

        <!--  -->
        <transition name="fade">
          <div v-if="isMobileMenuOpen" class="mobile-menu">
            <button @click="redirectToHome" class="nav-button">Home</button>
            <button @click="redirectToClassrooms" class="nav-button">Classroom Information</button>
            <button @click="redirectToMyBookings" class="nav-button">My Bookings</button>
            <button @click="downloadLog" class="nav-button">Download Log</button>
            <button v-if="role === 'Student'" @click="reportRepair" class="nav-button">Repairs</button>
          </div>
        </transition>

        <div class="profile-section" @mouseenter="showDropdown" @mouseleave="hideDropdown">
          <img v-if="role === 'Admin'" src="../assets/email-icon.jpg" alt="Email" class="email-icon" @click="redirectToEmailView" />
          <img src="../assets/avatar.png" alt="Profile" class="profile-avatar" @click="toggleDropdown" />

          <transition name="fade">
            <div v-if="dropdownVisible" class="dropdown-menu">
              <div class="dropdown-item profile-info">
                <p>Username: {{ username }}</p>
                <p>Role: {{ role }}</p>
              </div>
              <button @click="redirectToProfile" class="dropdown-item personal-info">Personal Information</button>
              <button @click="logout" class="dropdown-item exit-button">Exit</button>
            </div>
          </transition>
        </div>
      </div>
    </header>

    <!-- repair -->
    <div v-if="showRepairModal" class="modal-mask" @click.self="closeRepairModal">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Repair reporting</h3>
          <button class="modal-close" @click="closeRepairModal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitRepairReport">
            <div class="form-group">
              <label>Room:</label>
              <input v-model="repairForm.roomNumber" type="text" required />
            </div>
            <div class="form-group">
              <label>Description:</label>
              <textarea v-model="repairForm.description" required></textarea>
            </div>
            <div class="form-group">
              <label>Emergency degree:</label>
              <select v-model="repairForm.urgency">
                <option value="low">Common</option>
                <option value="medium">Urgent</option>
                <option value="high">Pretty urgent</option>
              </select>
            </div>
            <button type="submit" class="submit-button">Submit</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    username: String,
    role: String,
  },
  data() {
    return {
      dropdownVisible: false,
      showRepairModal: false,
      isMobileMenuOpen: false,
      repairForm: {
        roomNumber: '',
        description: '',
        urgency: 'low'
      }
    };
  },
  methods: {
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
    showDropdown() {
      this.dropdownVisible = true;
    },
    hideDropdown() {
      this.dropdownVisible = false;
    },
    redirectToProfile() {
      const token = localStorage.getItem("token");
      const userInfo = this.parseToken(token);
      this.$router.push({ path: '/profile', query: { username: userInfo.username, role: userInfo.role } });
    },
    redirectToHome() {
      const token = localStorage.getItem("token");
      const userInfo = this.parseToken(token);
      this.$router.push({ path: '/home', query: { username: userInfo.username, role: userInfo.role } });
    },
    redirectToClassrooms() {
      const token = localStorage.getItem("token");
      const userInfo = this.parseToken(token);
      this.$router.push({ path: '/classrooms', query: { username: userInfo.username, role: userInfo.role } });
    },
    redirectToMyBookings() {
      const token = localStorage.getItem("token");
      const userInfo = this.parseToken(token);
      this.$router.push({ path: '/mybookings', query: { username: userInfo.username, role: userInfo.role } });
    },
    redirectToEmailView() {
      this.$router.push('/email');
    },
    downloadLog() {
      window.location.href = "http://localhost:5000/export_logs";
    },
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
      alert("Log out successfully!");
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
    reportRepair() {
      this.showRepairModal = true;
    },
    closeRepairModal() {
      this.showRepairModal = false;
      this.repairForm = {
        roomNumber: '',
        description: '',
        urgency: 'low'
      };
    },
    submitRepairReport() {
      if (!this.repairForm.description.trim() || !this.repairForm.roomNumber.trim()) {
        alert("Please fill in all required fields.");
        return;
      }

      const token = localStorage.getItem("token");
      const userInfo = this.parseToken(token) || {};

      const repairRecord = {
        id: Date.now(),
        room: this.repairForm.roomNumber,
        description: this.repairForm.description,
        urgency: this.repairForm.urgency,
        reporter: userInfo.username || 'Unknown',
        status: 'pending',
        timestamp: new Date().toISOString()
      };

      try {
        const existingRepairs = JSON.parse(localStorage.getItem('repairRecords')) || [];
        if (!Array.isArray(existingRepairs)) {
          console.warn("Invalid data format in localStorage, resetting...");
          localStorage.setItem('repairRecords', JSON.stringify([]));
        }

        existingRepairs.push(repairRecord);
        localStorage.setItem('repairRecords', JSON.stringify(existingRepairs));
        alert("Repair report submitted successfully!");
        this.closeRepairModal();
      } catch (error) {
        console.error("Error parsing repair records:", error);
        alert("An error occurred while saving the repair report.");
        localStorage.removeItem('repairRecords');
      }
    }
  }
};
</script>

<style scoped>
.header-container {
display: flex;
flex-direction: column;
align-items: center;
}

.header {
width: 100%;
background-color: #005792;
padding: 1rem;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-top {
display: flex;
justify-content: space-between;
align-items: center;
}

.brand-section {
display: flex;
align-items: center;
margin-left: -0.6rem;
}

.brand-logo {
width: 50px;
height: 50px;
margin-right: 1rem;
}

.brand-title {
font-size: 1.5rem;
color: white;
}

.button-section {
display: flex;
gap: 1rem;
}

.hamburger {
display: none;
flex-direction: column;
gap: 5px;
cursor: pointer;
margin-right: 1rem;
}

.hamburger span {
display: block;
width: 25px;
height: 3px;
background-color: white;
transition: all 0.3s ease;
}

.hamburger span.open:nth-child(1) {
transform: rotate(45deg) translateY(8px);
}

.hamburger span.open:nth-child(2) {
opacity: 0;
}

.hamburger span.open:nth-child(3) {
transform: rotate(-45deg) translateY(-8px);
}

.mobile-menu {
position: absolute;
top: 100px;
right: 1rem;
background-color: #ffffff;
border: 1px solid #ccc;
border-radius: 12px;
box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
z-index: 999;
display: flex;
flex-direction: column;
padding: 1rem;
gap: 0.75rem;
width: 250px;
}

.nav-button {
padding: 10px 20px;
background-color: #007bff;
color: white;
border: none;
border-radius: 5px;
cursor: pointer;
font-size: 14px;
height: 45px;
}

.nav-button:hover {
background-color: #0056b3;
}

.profile-section {
position: relative;
display: flex;
align-items: center;
margin-right: 0.2rem;
}

.email-icon {
width: 40px;
height: 30px;
cursor: pointer;
margin-right: 10px;
}

.profile-avatar {
width: 60px;
height: 60px;
border-radius: 50%;
cursor: pointer;
}

.modal-mask {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.3);
display: flex;
justify-content: center;
align-items: center;
z-index: 999;
backdrop-filter: blur(3px);
animation: fadeIn 0.3s ease;
}

.modal-container {
background: #ffffff;
padding: 2rem 2rem;
border-radius: 16px;
width: 440px;
max-width: 90vw;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
transform-origin: center;
animation: scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.modal-header {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 1.5rem;
position: relative;
}

.modal-header h3 {
font-size: 1.5rem;
color: #1a1a1a;
font-weight: 600;
letter-spacing: -0.5px;
}

.modal-close {
background: none;
border: none;
font-size: 28px;
color: #a0a0a0;
cursor: pointer;
transition: all 0.2s ease;
line-height: 1;
padding: 0 0.5rem;
margin-right: -0.5rem;
}

.modal-close:hover {
color: #707070;
transform: scale(1.1);
}

.form-group {
margin-bottom: 1.5rem;
position: relative;
}

.form-group label {
display: block;
font-size: 0.95rem;
color: #404040;
margin-bottom: 0.75rem;
font-weight: 500;
padding-left: 0.25rem;
}

.form-group input,
.form-group textarea,
.form-group select {
width: 100%;
margin: 0;
box-sizing: border-box;
padding: 0.85rem;
border: 1px solid #e0e0e0;
border-radius: 8px;
font-size: 0.95rem;
color: #333;
transition: all 0.2s ease;
background: #f8f9fa;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
border-color: #007bff;
box-shadow: 0 2px 8px rgba(0, 123, 255, 0.15);
background: #ffffff;
}

.form-group textarea {
resize: none;
height: 120px;
overflow-y: auto;
line-height: 1.5;
min-width: auto;
}

.form-group select {
appearance: none;
background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
background-repeat: no-repeat;
background-position: right 0.75rem center;
background-size: 1.2em;
}

.submit-button {
background-color: #007bff;
color: white;
padding: 1rem 2rem;
border: none;
border-radius: 8px;
cursor: pointer;
width: 100%;
font-size: 1rem;
font-weight: 600;
transition: all 0.2s ease;
letter-spacing: 0.5px;
text-transform: uppercase;
}

.submit-button:hover {
background-color: #0069d9;
transform: translateY(-1px);
box-shadow: 0 4px 12px rgba(0, 123, 255, 0.25);
}

.submit-button:active {
transform: translateY(0);
}

.fade-enter-active, .fade-leave-active {
transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
opacity: 0;
}

.dropdown-menu {
position: absolute;
top: 60px;
left: 40%;
transform: translateX(-50%);
background-color: white;
border: 1px solid #ddd;
border-radius: 5px;
box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
z-index: 1000;
width: 180px;
}

.dropdown-item {
padding: 0.5rem 1rem;
cursor: pointer;
text-align: left;
width: 100%;
border: none;
background: none;
}

.dropdown-item:hover {
background-color: #f1f1f1;
}

.personal-info {
width: 100%;
padding: 1rem;
border: none;
border-radius: 5px;
cursor: pointer;
font-size: 14px;
background-color: rgb(111, 161, 227);
color: white;
}

.personal-info:hover {
background-color: #1c6adf;
}

.exit-button {
width: 100%;
padding: 1rem;
border: none;
border-radius: 6px;
cursor: pointer;
font-size: 14px;
background-color: red;
color: white;
}

.exit-button:hover {
background-color: #5c2425;
}


@media (max-width: 768px) {
.button-section {
  display: none;
}

.hamburger {
  display: flex;
}
}
</style>
