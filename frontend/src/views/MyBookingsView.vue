<template>
  <el-container>
    <el-header>
      <naviBarAndButton :username="username" :role="role"></naviBarAndButton>
    </el-header>
    <el-main>
      <div class="my-bookings-container">
        
        <h1 class="page-title">My Bookings</h1>

        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading...</p>
        </div>

        <div v-if="error" class="error-state">
          <span class="error-icon">⚠️</span>
          <p class="error-message">{{ error }}</p>
        </div>

        <transition-group v-if="paginatedBookings.length" name="booking-list" tag="div" class="booking-grid">
          <div v-for="booking in paginatedBookings" :key="booking.booking_id" class="booking-card"
            :class="{ 'past-booking': isPastBooking(booking.classroom_details.start_time), 'active-booking': !isPastBooking(booking.classroom_details.start_time) }">
            <div class="card-header">
              <h3 class="room-name">
                <span class="icon">🏫</span>
                {{ booking.classroom_details.classroom_name }}
              </h3>
            </div>

            <div class="card-body">
              <div class="info-item">
                <span class="icon">🏢</span>
                <div class="info-content">
                  <span class="info-label">Building: </span>
                  <span class="info-value">{{ booking.classroom_details.building }}</span>
                </div>
              </div>
              
            <!--add booking owner' username and email-->

              <div class="time-range">
                <div class="time-block">
                  <span class="time-label">Start Time</span>
                  <span class="time-value">{{ formatDateTime(getCorrectTime(booking.classroom_details.start_time)) }}</span>
                </div>
                <div class="time-separator">→</div>
                <div class="time-block">
                  <span class="time-label">End Time</span>
                  <span class="time-value">{{ formatDateTime(getEndTime(booking.classroom_details.start_time)) }}</span>
                </div>
              </div>
            </div>
          </div>
        </transition-group>

        <div v-if="bookings.length" class="pagination-controls">
          <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
        </div>

        <div v-else class="empty-state">
          <div class="empty-illustration">📅</div>
          <h3 class="empty-title">No Booking Record</h3>
          <p class="empty-hint">Go and book a classroom now!</p>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import NaviBarAndButton from '@/components/NaviBarAndButton.vue';

export default {
  name: 'MyBookings',
  components: {
    naviBarAndButton: NaviBarAndButton
  },
  data() {
    return {
      username: '',
      role: '',
      bookings: [],
      currentPage: 1,
      itemsPerPage: 5,
      loading: false,
      error: null
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.bookings.length / this.itemsPerPage);
    },
    paginatedBookings() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.bookings.slice(start, start + this.itemsPerPage);
    }
  },
  methods: {
    getInfor() {
      const token = localStorage.getItem("token");
      const userInfo = this.parseToken(token);
      this.username = userInfo.username;
      this.role = userInfo.role;
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

    isPastBooking(start_time) {
      if (!start_time) return true;
      const startDate = new Date(start_time);
      return startDate.getTime() < Date.now();
    },
    getCorrectTime(startTime) {
      if (!startTime) return new Date();
      const start = new Date(startTime);
      start.setHours(start.getHours() -8);
      return start;
    },

    getEndTime(startTime) {
      if (!startTime) return new Date();
      const start = new Date(startTime);
      start.setHours(start.getHours() -6);
      return start;
    },
    
    async getBookingsInformation() {
      this.loading = true;
      this.error = null;
      const token = localStorage.getItem("token");
      const userInfo = this.parseToken(token);
      if (!userInfo) {
        this.error = "Invalid token. Please log in again.";
        this.loading = false;
        return;
      }
      
      try {
        const response = await fetch("http://127.0.0.1:5000/mybookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userInfo.email })
        });
        
        const data = await response.json();
        if (response.ok) {
          this.bookings = data.bookings;
        } else {
          this.error = data.message || "Failed to fetch bookings.";
        }
      } catch (error) {
        this.error = "Request failed. Please try again later.";
      } finally {
        this.loading = false;
      }
    },

    formatDateTime(datetime) {
      return datetime ? new Date(datetime).toLocaleString() : 'N/A';
    },
    
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  },
  mounted() {
    this.getInfor();
    this.getBookingsInformation();
  }
};
</script>





<style scoped>
.my-bookings-container {
  width: 100%;
  min-height: 100vh;
  padding: 0 1.5rem;
  margin: 0 auto;
  background: #f8f9fa;
  left:0%
}


.page-title {
  color: #2c3e50;
  font-size: 2rem;
  margin: 2rem 0;
  text-align: center;
}


.booking-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  width: 100%;
  padding: 1rem 0;
}

.booking-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 4px solid #3498db;
  display: flex;
  flex-direction: column;
}

.active-booking {
  background: #e3f2fd;
}

.booking-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
}

.past-booking {
  opacity: 0.6;
  border-left-color: #95a5a6;
}


.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
}

.room-name {
  font-size: 1.2rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-badge.active {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-badge.expired {
  background: #ffebee;
  color: #c62828;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.2rem;
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 0.85rem;
  color: #7f8c8d;
}

.info-value {
  font-weight: 500;
  color: #2c3e50;
}

.time-range {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: auto;
  padding-top: 1.2rem;
  border-top: 1px solid #ecf0f1;
}

.time-block {
  flex: 1;
}

.time-label {
  font-size: 0.85rem;
  color: #7f8c8d;
}

.time-value {
  display: block;
  font-weight: 500;
  color: #2c3e50;
  margin-top: 0.3rem;
}

.cancel-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.8rem;
  margin-top: 1.2rem;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  opacity: 0.7;
}

.cancel-button:not(:disabled):hover {
  background: #ff5252;
  box-shadow: 0 2px 4px rgba(255, 107, 107, 0.3);
}
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}
.pagination-controls button {
  padding: 5px 10px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}
.pagination-controls button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.loading-state {
  text-align: center;
  padding: 4rem 0;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 4rem 0;
}

.empty-illustration {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-title {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.empty-hint {
  color: #7f8c8d;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }

  .nav-items {
    gap: 1rem;
  }

  .page-title {
    font-size: 1.75rem;
    margin: 1.5rem 0;
  }

  .booking-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 1600px) {
  .booking-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>