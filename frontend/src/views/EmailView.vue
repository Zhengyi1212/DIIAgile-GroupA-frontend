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
          <select v-model="repair.status" @change="updateStatus(repair)">
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
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
  max-width: 800px;
  margin: 0 auto;
}

.repair-list {
  margin-top: 1.5rem;
}

.repair-item {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.repair-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.room-number {
  font-weight: bold;
  font-size: 1.1rem;
}

.urgency-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
}

.urgency-tag.low { background: #e6f4ff; color: #1890ff; }
.urgency-tag.medium { background: #fffbe6; color: #faad14; }
.urgency-tag.high { background: #fff1f0; color: #ff4d4f; }

.description {
  color: #666;
  margin-bottom: 1rem;
}

.repair-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #999;
}

select {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}
</style>