<template>
  <el-container>
    <el-header>
      <naviBarAndButton :username="username" :role="role">
      </naviBarAndButton>
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

        <transition-group v-if="bookings.length" name="booking-list" tag="div" class="booking-grid">
          <div v-for="booking in bookings" :key="booking.id" class="booking-card"
            :class="{ 'past-booking': isPastBooking(booking.endTime), 'active-booking': !isPastBooking(booking.endTime) }">
            <div class="card-header">
              <h3 class="room-name">
                <span class="icon">🏫</span>
                {{ booking.classroom_details.classroom_name }}
              </h3>
            </div>

            <div class="card-body">
              <div class="info-item">
                <span class="icon">📍</span>
                <div class="info-content">
                  <span class="info-label">Campus</span>
                  <span class="info-value">{{ booking.campus }}</span>
                </div>
              </div>

              <div class="info-item">
                <span class="icon">📧</span>
                <div class="info-content">
                  <span class="info-label">Building</span>
                  <span class="info-value">{{ booking.building }}</span>
                </div>
              </div>

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
      bookings: [
        {
          id: 1,
          room: 'A101',
          campus: 'Xiaoxiang Campus',
          building: 'Block A',
          startTime: '2025-03-14T14:00:00',
          endTime: '2025-03-14T16:00:00',
        },
        {
          id: 2,
          room: 'B202',
          campus: 'Xiaoxiang Campus',
          building: 'Block B',
          startTime: '2025-03-15T16:00:00',
          endTime: '2025-03-15T18:00:00',
        },
      ],
      loading: false,
      error: null
    };
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
    isPastBooking(endTime) {
      const endDate = new Date(endTime);
      const now = new Date();
      return endDate.getTime() < now.getTime();
    },
    handleCancel(id) {
      this.bookings = this.bookings.filter(booking => booking.id !== id);
    },
    formatDateTime(datetime) {
      const date = new Date(datetime);
      return date.toLocaleString();
    },
    getStatusText(booking) {
      console.log('Current:', new Date(), 'EndTime:', new Date(booking.endTime));
      return this.isPastBooking(booking.endTime) ? 'Expired' : 'Active';
    },
    getStatusClass(booking) {
      return this.isPastBooking(booking.endTime) ? 'expired' : 'active';
    }
  },
  mounted() {
    this.getInfor();
    this.getBookingsInformation();
  }
};
</script>




<style scoped>
.student-card {
  border-left-color: #366bf1 !important;
  background-color: #dfe3ff !important;
}

.teacher-card {
  border-left-color: #66bb6a !important;
  background-color: #e8f5e9 !important;
}

.admin-card {
  border-left-color: #ef5350 !important;
  background-color: #ffebee !important;
}
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
  opacity: 0.4;
  border-left-color: #f8f9f9;
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