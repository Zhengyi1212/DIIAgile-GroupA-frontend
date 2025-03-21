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
                                    <input v-model="repairForm.roomNumber" type="text" required>
                                </div>
                                <div class="form-group">
                                    <label>Description:</label>
                                    <textarea v-model="repairForm.description" required></textarea>
                                </div>
                                <div class="form-group">
                                    <label>Emergency degree:</label>
                                    <select v-model="repairForm.urgency">
                                        <option value="low">Common</option>
                                        <option value="medium">Ergent</option>
                                        <option value="high">Pretty ergent</option>
                                    </select>
                                </div>
                                <button type="submit" class="submit-button">Submit</button>
                            </form>
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

  // fetch current user information
  const token = localStorage.getItem("token");
  const userInfo = this.parseToken(token) || {};
  
  // create repair record
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
    width: 30px;
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
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.modal-container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
    margin-bottom: 15px;
}

.modal-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
}

.form-group input,
.form-group textarea,
.form-group select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.submit-button {
    background-color: #28a745;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
}

.submit-button:hover {
    background-color: #218838;
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
</style>