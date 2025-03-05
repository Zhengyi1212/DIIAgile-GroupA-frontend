<template>
  <div class="home-page">
    <!-- 筛选条件 -->
    <section class="filters">
      <div class="filter-item">
        <label>校区:</label>
        <select v-model="selectedCampus" @change="onCampusChange">
          <option v-for="campus in campuses" :key="campus.id" :value="campus.id">
            {{ campus.name }}
          </option>
        </select>
      </div>

      <div class="filter-item">
        <label>楼层:</label>
        <select v-model="selectedFloor" @change="onFloorChange">
          <option v-for="floor in floors" :key="floor" :value="floor">
            {{ floor }}F
          </option>
        </select>
      </div>
    </section>

    <!-- 房间展示 -->
    <section class="room-section">
      <div 
        v-for="room in filteredRooms"
        :key="room.id"
        class="room-card"
        @click="showBooking(room)"
      >
        <div class="room-number">{{ room.number }}</div>
        <div class="room-status">
          <span class="symbol">▲</span>
          {{ room.occupancy }}%
        </div>
      </div>
    </section>

    <!-- 预约模态框 -->
    <div v-if="showModal" class="booking-modal">
      <div class="modal-content">
        <h3>{{ selectedRoom?.number }} 未来七天预约情况</h3>
        <div class="calendar">
          <div 
            v-for="day in bookingData"
            :key="day.date"
            class="calendar-day"
            :class="{ booked: day.isBooked }"
          >
            {{ day.date }}<br>
            {{ day.status }}
          </div>
        </div>
        <button @click="showModal = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      // 筛选条件
      selectedCampus: null,
      selectedFloor: 1,
      
      // 数据存储
      campuses: [],       // 从接口获取
      floors: [],         // 从接口获取
      allRooms: [],       // 从接口获取
      
      // 预约相关
      showModal: false,
      selectedRoom: null,
      bookingData: []     // 从接口获取
    }
  },
  computed: {
    filteredRooms() {
      return this.allRooms.filter(room => 
        room.campusId === this.selectedCampus &&
        room.floor === this.selectedFloor
      )
    }
  },
  async created() {
    // 初始化数据接口
    await this.fetchCampuses()
    await this.fetchFloors()
    await this.fetchRooms()
    
    // 设置默认值
    if(this.campuses.length > 0) {
      this.selectedCampus = this.campuses[0].id
    }
  },
  methods: {
    // 数据接口占位 ----------------------------
    async fetchCampuses() {
      // TODO: 替换为真实API调用
      this.campuses = [
        { id: 1, name: 'Yoshi Mountain Campus' },
        { id: 2, name: 'Luzun Campus' }
      ]
    },

    async fetchFloors() {
      // TODO: 替换为真实API调用
      this.floors = [1, 2, 3, 4, 5]
    },

    async fetchRooms() {
      // TODO: 替换为真实API调用，需包含campusId和floor字段
      this.allRooms = [
        { id: 101, number: 'A101', occupancy: 80, campusId: 1, floor: 1 },
        { id: 102, number: 'A102', occupancy: 60, campusId: 1, floor: 2 }
      ]
    },

    async fetchBookingData(roomId) {
      // TODO: 替换为真实API调用
      this.bookingData = [
        { date: '2023-10-01', status: '可预约', isBooked: false },
        { date: '2023-10-02', status: '已满', isBooked: true }
      ]
    },

    // 事件处理 ----------------------------
    onCampusChange() {
      this.selectedFloor = 1  // 切换校区时重置楼层
      this.fetchRooms()
    },

    onFloorChange() {
      this.fetchRooms()
    },

    async showBooking(room) {
      this.selectedRoom = room
      await this.fetchBookingData(room.id)
      this.showModal = true
    }
  }
}
</script>

<style scoped>
/* 新增样式 */
.filters {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.filter-item select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.booking-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  min-width: 600px;
}

.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin: 1rem 0;
}

.calendar-day {
  border: 1px solid #eee;
  padding: 0.5rem;
  text-align: center;
  border-radius: 4px;
}

.calendar-day.booked {
  background: #ffe5e5;
  color: #c00;
}

/* 原有样式优化 */
.room-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.room-card:hover {
  transform: translateY(-2px);
}
</style>