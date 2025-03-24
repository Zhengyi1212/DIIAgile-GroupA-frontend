<template>
  <div class="email-container">
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
    }
  }
};
</script>

<style scoped>
.email-container {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f1f6fb, #e1efff);
  border-radius: 10px;
}

h2 {
  text-align: center;
  font-size: 1.8rem;
  color: #333;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.repair-list {
  margin-top: 1.5rem;
}

.repair-item {
  background: #ffffff;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.repair-item:hover {
  transform: translateY(-5px);
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
  background: #e6f4ff;
  color: #1890ff;
}

.urgency-tag.medium {
  background: #fffbe6;
  color: #faad14;
}

.urgency-tag.high {
  background: #fff1f0;
  color: #ff4d4f;
}

.description {
  color: #555;
  margin-bottom: 1.5rem;
  line-height: 1.6;
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
  transition: border 0.3s ease;
}

select:hover {
  border-color: #66afe9;
}

select:focus {
  border-color: #1890ff;
  outline: none;
}
</style>