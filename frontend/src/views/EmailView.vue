<template>
  <div class="email-wrapper">
    <div class="email-container">
      <button class="back-button" @click="goBack">← Back</button>
      <h2>Repair Requests</h2>
      <div class="repair-list">
        <div v-for="repair in repairs" :key="repair.id" class="repair-item">
          <div class="repair-header">
            <span class="room-number">Room {{ repair.room }}</span>
            <span :class="['urgency-tag', repair.urgency]">{{ formatUrgency(repair.urgency) }}</span>
          </div>
          <p class="description">{{ repair.description }}</p>
          <div class="repair-footer">
            <span class="reporter">Reported by: {{ repair.reporter }}</span>
            <span class="timestamp">{{ formatDate(repair.timestamp) }}</span>
            <div class="status-container">
              <label for="status">Status:</label>
              <select v-model="repair.status" @change="updateStatus(repair)">
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      repairs: []
    };
  },
  mounted() {
    this.loadRepairs();
  },
  methods: {
    loadRepairs() {
      this.repairs = JSON.parse(localStorage.getItem('repairRecords') || '[]');
    },
    formatUrgency(urgency) {
      const map = { low: 'Common', medium: 'Urgent', high: 'Pretty urgent' };
      return map[urgency] || urgency;
    },
    formatDate(isoString) {
      return new Date(isoString).toLocaleString();
    },
    updateStatus(repair) {
      const allRepairs = JSON.parse(localStorage.getItem('repairRecords'));
      const index = allRepairs.findIndex(r => r.id === repair.id);
      if (index > -1) {
        allRepairs[index].status = repair.status;
        localStorage.setItem('repairRecords', JSON.stringify(allRepairs));
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.email-wrapper {
  min-height: 100vh;
  background: 
    url('../assets/emailBackground.jpg') center/cover fixed;
  padding: 2rem;
}

.email-container {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  background: rgba(255,255,255,0.85);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 12px 30px rgba(0,0,0,0.15);
  border: 1px solid rgba(255,255,255,0.9);
}

h2 {
  text-align: center;
  font-size: 1.8rem;
  color: #333;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.back-button {
  background: #1890ff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1rem;
  transition: background 0.3s ease;
}

.back-button:hover {
  background: #40a9ff;
}

.repair-list {
  margin-top: 1.5rem;
}

.repair-item {
  background: (255,255,255,0.4);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1),
              0 8px 16px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.repair-item:hover {
  border-color: rgba(0, 0, 0, 0.25);
  transform: translateY(-3px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.repair-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.room-number {
  font-weight: bold;
  font-size: 1.2rem;
  color: #333;
}

.urgency-tag {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.urgency-tag.low {
  background: #d1e9ff;
  color: #1890ff;
}

.urgency-tag.medium {
  background: #fff3cd;
  color: #ffc107;
}

.urgency-tag.high {
  background: #ffe5e3;
  color: #dc3545;
}

.description {
  color: #555;
  margin-bottom: 1.5rem;
  line-height: 1.7;
}

.repair-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #777;
}

.reporter, .timestamp {
  margin-right: 1rem;
}

.status-container {
  display: flex;
  align-items: center;
}

label {
  margin-right: 8px;
  font-size: 0.9rem;
  color: #555;
}

select {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 1rem;
  background-color: #fafafa;
  transition: all 0.2s;
}

select:hover {
  border-color: #66afe9;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(25, 144, 255, 0.2);
}

select:focus {
  border-color: #1890ff;
  outline: none;
}

@media (max-width: 768px) {
  
  .email-container {
    margin: 10px;
    padding: 1rem;
    background: rgba(255,255,255,0.9);
  }

  .repair-footer {
    flex-direction: column;
    gap: 0.8rem;
  }

  .status-container {
    margin-top: 0.5rem;
    width: 100%;
    justify-content: flex-end;
  }
 }
</style>
