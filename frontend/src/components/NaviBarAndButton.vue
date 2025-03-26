<template> 
  <div class="header-container">
      <header class="header">
          <div class="header-top">
              <div class="brand-section">
                  <img src="../assets/dii-logo.png" alt="Project Icon" class="brand-logo" />
                  <h1 class="brand-title">DIICSU Room Book System</h1>
              </div>

              <div class="button-section">
                  <button @click="redirectToHome" class="nav-button">Home</button>
                  <button @click="redirectToClassrooms" class="nav-button">Classroom Information</button>
                  <button @click="redirectToMyBookings" class="nav-button">My Bookings</button>
                  <button @click="downloadLog" class="nav-button">Download Log</button>
                  <button v-if="role === 'Student'" @click="reportRepair" class="nav-button">Repairs</button>
              </div>

              <div v-if="showFeedbackModal" class="modal-mask" @click.self="closeFeedbackModal">
                <div class="modal-container">
                  <div class="modal-header">
                    <h3>Repair Feedback</h3>
                    <button class="modal-close" @click="closeFeedbackModal">&times;</button>
                  </div>
                <div class="modal-body">
                   <div class="feedback-content">
                     <p v-if="currentFeedback">{{ currentFeedback }}</p>
                    <p v-else class="no-feedback">No feedback available yet</p>
                  </div>
                 <button @click="closeFeedbackModal" class="submit-button">Close</button>
                </div>
               </div>
             </div>

              <!-- New repair window -->
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
    <button @click="openFeedback" class="view-feedback-button">View Feedback</button>
  </div>
</div>

              <div v-if="showFeedbackModal" class="modal-mask" @click.self="closeFeedbackModal">
           <div class="modal-container">
    <div class="modal-header">
      <h3>All Repair Feedbacks</h3>
      <button class="modal-close" @click="closeFeedbackModal">&times;</button>
    </div>
    <div class="modal-body">
      <div class="feedback-list">
        <div v-if="feedbacks.length === 0" class="no-feedback">
          No feedback available yet
        </div>
        <div v-else v-for="(feedback, index) in feedbacks" :key="index" class="feedback-item">
          <div class="feedback-header">
            <span class="room">Room {{ feedback.room }}</span>
            <span class="status-badge" :class="feedback.status">{{ feedback.status }}</span>
            <span class="date">{{ formatFeedbackDate(feedback.timestamp) }}</span>
          </div>
          <div class="feedback-content">
            <p class="feedback-text">{{ feedback.text || 'No feedback provided' }}</p>
            <div class="urgency-tag" :class="feedback.urgency">
              Urgency: {{ formatUrgency(feedback.urgency) }}
            </div>
          </div>
        </div>
      </div>
      <button @click="closeFeedbackModal" class="submit-button">Close</button>
    </div>
  </div>
</div>

              <div class="profile-section" @mouseenter="showDropdown" @mouseleave="hideDropdown">
                  <img 
                      v-if="role === 'Admin'" 
                      src="../assets/email-icon.jpg" 
                      alt="Email" 
                      class="email-icon" 
                      @click="redirectToEmailView" 
                  />
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
  </div>
</template>

<script>
export default {
  data() {
      return {
          dropdownVisible: false,
          showRepairModal: false,
          showFeedbackModal:false,
          currentFeedback:'',
          feedbacks:[],
          repairForm: {
              roomNumber: '',
              description: '',
              urgency: 'low'
          }
      };
  },

  props: {
      username: String,
      role: String,
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
      async openFeedback() {
    try {
      const token = localStorage.getItem("token");
      const userInfo = this.parseToken(token) || {};
      const currentUser = userInfo.username;

      const rawData = localStorage.getItem('repairRecords');
      const repairs = rawData ? JSON.parse(rawData) : [];

      // 获取当前用户所有包含反馈的记录
      this.feedbacks = repairs
        .filter(r => 
          r.reporter === currentUser && 
          r.feedback && 
          r.feedback.trim() !== ''
        )
        .map(r => ({
          room: r.room,
          text: r.feedback,
          status: r.status,
          urgency: r.urgency,
          timestamp: r.timestamp
        }))
        .sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );

      this.showRepairModal = false;
      this.showFeedbackModal = true;
    } catch (error) {
      console.error("Error loading feedback:", error);
      this.feedbacks = [];
      this.showFeedbackModal = true;
    }
  },

    
    closeFeedbackModal() {
         this.showFeedbackModal = false;
         this.showRepairModal = true;
       },

    closeRepairModal() {
      this.showRepairModal = false;
      this.showFeedbackModal = false; 
      this.repairForm = {
        roomNumber: '',
        description: '',
        urgency: 'low'
      };
    },

    formatFeedbackDate(isoString) {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(isoString).toLocaleString('en-US', options);
  },
  
  formatUrgency(urgency) {
    const map = { 
      low: 'Common', 
      medium: 'Urgent', 
      high: 'Very Urgent' 
    };
    return map[urgency] || urgency;
  },

      submitRepairReport() {
    if (!this.repairForm.description.trim() || !this.repairForm.roomNumber.trim()) {
      alert("Please fill in all required fields.");
      return;
      }

      // fetch current user information
     const token = localStorage.getItem("token");
     const userInfo = this.parseToken(token) || {};

     // create repair record
     const repairRecord = {
     id: Date.now(),
     room: this.repairForm.roomNumber.toString(),
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
      localStorage.removeItem('repairRecords'); // clean wrong data
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
  height: 100vh;
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

.profile-section {
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 2.5rem;
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

.button-section {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.nav-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  height: 50px;
}

.nav-button:hover {
  background-color: #0056b3;
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
  width: 100% ;
  margin: 0 ;
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

.action-buttons {
  display: flex;
  flex-direction: column;  
  align-items: center;   
  gap: 1.5rem;            
  margin-top: 1.5rem; 
}

.feedback-content {
  min-height: 100px;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  overflow-y: auto;
  max-height: 200px;
  line-height: 1.6;
}

.no-feedback {
  color: #6c757d;
  font-style: italic;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleUp {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
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

.feedback-list {
  max-height: 65vh;
  padding: 0 1rem;
  overflow-y: auto;
}

.feedback-item {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(145deg, #f8f9fa, #ffffff);
  border-radius: 12px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.08);
  border-left: 0;
  position: relative;
  overflow: hidden;
  max-height: 400px;
}

.feedback-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #007bff;
}

.feedback-header {
  grid-column: 1 / 2;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding-right: 1rem;
  border-right: 1px solid #eee;
}

.feedback-content {
  grid-column: 2 / 3;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.view-feedback-button {
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
   margin-top: 20px;
  }

.view-feedback-button:hover {
    background-color: #0069d9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.25);
}

.view-feedback-button:active {
  transform: translateY(0);
}

.room {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2c3e50;
}

.date {
  font-size: 0.85rem;
  color: #7f8c8d;
}

.status-badge {
  align-self: flex-start;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.feedback-text {
  width: 100%; 
  height: 150px; 
  overflow-y: auto; 
  word-wrap: break-word; 
  white-space: pre-wrap; 
  padding: 10px; 
  border: 1px solid #ccc; 
  box-sizing: border-box;
}

.urgency-tag {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s;
}

.urgency-tag::before {
  content: "•";
  margin-right: 8px;
  font-size: 1.2em;
}

.urgency-tag.low {
  background: rgba(0,123,255,0.1);
  color: #007bff;
}
.urgency-tag.low::before {
  color: #007bff;
}

.urgency-tag.medium {
  background: rgba(255,193,7,0.1);
  color: #ffc107;
}
.urgency-tag.medium::before {
  color: #ffc107;
}

.urgency-tag.high {
  background: rgba(220,53,69,0.1);
  color: #dc3545;
}
.urgency-tag.high::before {
  color: #dc3545;
}

.status-badge.pending {
  background: rgba(255,224,138,0.3);
  color: #8a6d3b;
}
.status-badge.in-progress {
  background: rgba(179,224,255,0.3);
  color: #004085;
}
.status-badge.resolved {
  background: rgba(195,230,203,0.3);
  color: #155724;
}

.feedback-list::-webkit-scrollbar {
  width: 8px;
}

.feedback-list::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.05);
}

.feedback-list::-webkit-scrollbar-thumb {
  background: #b6babf;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .feedback-item {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .feedback-header {
    grid-column: 1 / 2;
    border-right: none;
    border-bottom: 1px solid #eee;
    padding-bottom: 1rem;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .feedback-content {
    grid-column: 1 / 2;
  }
 
  .view-feedback-button{
     width: 80%;
  }
}
  

</style>