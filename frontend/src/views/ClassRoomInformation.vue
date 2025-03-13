<template>
  <el-container>
     <el-header>
        <naviBarAndButton :username="username" :role="role">
        </naviBarAndButton>
     </el-header>
     <el-main>
        <main class="main-content">
           <!-- 筛选区域 -->
           <div class="filters-container">
              <div class="filter-group">
                 <label>校区：</label>
                 <select v-model="selectedCampus" class="styled-select">
                    <option value="">全部校区</option>
                    <option v-for="campus in campuses" :key="campus.id" :value="campus.id">
                       {{ campus.name }}
                    </option>
                 </select>
              </div>

              <div class="filter-group">
                 <label>教学楼：</label>
                 <select v-model="selectedBuilding" class="styled-select">
                    <option value="">全部教学楼</option>
                    <option v-for="building in filteredBuildings" :key="building">
                       {{ building }}
                    </option>
                 </select>
              </div>

              <div class="filter-group">
                 <label>楼层：</label>
                 <select v-model="selectedFloor" class="styled-select">
                    <option value="">全部楼层</option>
                    <option v-for="floor in filteredFloors" :key="floor">
                       {{ floor }}
                    </option>
                 </select>
              </div>
           </div>
          <!-- 日期选择器 -->
        <div class="date-selector">
              <button v-for="offset in 7" :key="offset" @click="selectedDate = getFormattedDate(offset - 1)"
                 :class="{ active: selectedDate === getFormattedDate(offset - 1) }">
                 {{ getFormattedDate(offset - 1) }}
              </button>
           </div>
           <div class="content-container">
              <!-- 教室列表 -->
              <div class="pagination-controls">
                 <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
                 <span>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
                 <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
              </div>
              <div class="classroom-grid">
                 <div v-for="room in paginatedRooms" :key="room.id" class="classroom-card"
                    :class="{ selected: selectedRoom?.id === room.id }" @click="selectRoom(room)">
                    <div class="card-header">
                       <h3 class="room-name">{{ room.name }}</h3>
                       <span class="capacity-badge">{{ room.capacity }}人</span>
                    </div>
                    <div class="card-body">
                       <div class="room-info">
                          <span class="info-item">🖥️ {{ room.equipment || '多媒体设备' }}</span>
                          <span class="info-item">📍 {{ room.building }} {{ room.floor }}</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
          
           <!-- 时间表 -->
           <div v-if="selectedRoom" class="timetable-container">
              <h3 class="timetable-title">{{ selectedRoom.name }} 预约时间表</h3>
              <div class="time-grid">
                 <div v-for="slot in timeSlots" :key="slot" class="time-slot"
                    :class="{ available: isSlotAvailable(slot), booked: !isSlotAvailable(slot) }"
                    @click="bookSlot(slot)">
                    <span class="slot-time">{{ slot }}</span>
                    <span v-if="isSlotAvailable(slot)" class="slot-status">可预约</span>
                    <span v-else class="slot-status">已占用</span>
                 </div>
              </div>
           </div>
        </main>
     </el-main>
  </el-container>
</template>

<script>
import NaviBarAndButton from '@/components/NaviBarAndButton.vue';

export default {
  name: 'ClassRoomInformation',
  components: {
    naviBarAndButton: NaviBarAndButton
  },
  data() {
    return {
      username: '',
      role: '',
      campuses: [
        { id: '1', name: '南校区' },
        { id: '2', name: '北校区' }
      ],
      buildings: {
        '1': ['教学楼A', '教学楼B'],
        '2': ['教学楼C', '教学楼D']
      },
      rooms: [
        { id: '101', name: 'A101', capacity: 50, building: '教学楼A', floor: '1层', equipment: '投影仪' },
        { id: '102', name: 'A102', capacity: 40, building: '教学楼A', floor: '1层', equipment: '白板' },
        { id: '103', name: 'A103', capacity: 50, building: '教学楼A', floor: '1层', equipment: '投影仪' },
        { id: '105', name: 'A105', capacity: 50, building: '教学楼A', floor: '1层', equipment: '投影仪' },
        { id: '106', name: 'A106', capacity: 50, building: '教学楼A', floor: '1层', equipment: '投影仪' },
        { id: '104', name: 'A104', capacity: 50, building: '教学楼A', floor: '1层', equipment: '投影仪' },
        { id: '107', name: 'A107', capacity: 50, building: '教学楼A', floor: '1层', equipment: '投影仪' },
        { id: '108', name: 'A108', capacity: 50, building: '教学楼A', floor: '1层', equipment: '投影仪' },
        { id: '109', name: 'A109', capacity: 50, building: '教学楼A', floor: '1层', equipment: '投影仪' },
        { id: '110', name: 'A110', capacity: 50, building: '教学楼A', floor: '1层', equipment: '投影仪' },
        { id: '111', name: 'A111', capacity: 50, building: '教学楼A', floor: '1层', equipment: '投影仪' },
        { id: '112', name: 'A112', capacity: 50, building: '教学楼A', floor: '1层', equipment: '投影仪' },
        { id: '113', name: 'A113', capacity: 50, building: '教学楼A', floor: '1层', equipment: '投影仪' },
        { id: '114', name: 'A114', capacity: 50, building: '教学楼A', floor: '1层', equipment: '投影仪' },
        { id: '115', name: 'A115', capacity: 50, building: '教学楼A', floor: '1层', equipment: '投影仪' },
        { id: '116', name: 'A116', capacity: 50, building: '教学楼A', floor: '1层', equipment: '投影仪' },
        { id: '117', name: 'A117', capacity: 50, building: '教学楼A', floor: '1层', equipment: '投影仪' },
        { id: '201', name: 'B201', capacity: 60, building: '教学楼B', floor: '2层', equipment: '电脑' }
      ],
      currentPage: 1,
      roomsPerPage: 12,
      selectedCampus: '',
      selectedBuilding: '',
      selectedFloor: '',
      selectedRoom: null,
      timeSlots: ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00'],
      bookedSlots: {},
      selectedDate: new Date().toISOString().split('T')[0]
    };
  },
  computed: {
    filteredBuildings() {
      return this.selectedCampus ? this.buildings[this.selectedCampus] || [] : [];
    },
    filteredFloors() {
      const floors = new Set();
      this.rooms.forEach(room => {
        if ((!this.selectedBuilding || room.building === this.selectedBuilding)) {
          floors.add(room.floor);
        }
      });
      return Array.from(floors);
    },
    filteredRooms() {
      return this.rooms.filter(room => {
        return (
          (!this.selectedBuilding || room.building === this.selectedBuilding) &&
          (!this.selectedFloor || room.floor === this.selectedFloor)
        );
      });
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredRooms.length / this.roomsPerPage));
    },
    paginatedRooms() {
      const start = (this.currentPage - 1) * this.roomsPerPage;
      const end = start + this.roomsPerPage;
      return this.filteredRooms.slice(start, end);
    }
  },
  methods: {



    getInfor() {
      const token = localStorage.getItem("token");
      const userInfo = this.parseToken(token);
      this.username = userInfo.user_id;
      this.role = userInfo.role;
    },
    parseToken(token) {
      try {
        const base64Url = token.split(".")[1];  // JWT 结构为 header.payload.signature
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(decodeURIComponent(escape(atob(base64))));
      } catch (error) {
        console.error("Token parsing error:", error);
        return null;
      }
    },
    selectRoom(room) {
      this.selectedRoom = room;
    },
    isSlotAvailable(slot) {
      return !this.bookedSlots[this.selectedRoom?.id]?.[this.selectedDate]?.includes(slot);
    },
    bookSlot(slot) {
      if (!this.selectedRoom) return;
      if (!this.bookedSlots[this.selectedRoom.id]) {
        this.bookedSlots[this.selectedRoom.id] = {};
      }
      if (!this.bookedSlots[this.selectedRoom.id][this.selectedDate]) {
        this.bookedSlots[this.selectedRoom.id][this.selectedDate] = [];
      }
      this.bookedSlots[this.selectedRoom.id][this.selectedDate].push(slot);
    },
    
    getFormattedDate(offset) {
      const date = new Date();
      date.setDate(date.getDate() + offset);
      return date.toISOString().split('T')[0];
    },
    nextPage() {
   
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
     
    } 
  }, 
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      
    }
  },
  
  
  mounted() {
    this.getInfor();
  },
  watch: {
    filteredRooms() {
      this.currentPage = 1; // 重新过滤时，重置到第一页
    }
  }
}
};


</script>

<style scoped>
.el-main {
  padding-top: 60px; /* 调整这个值以确保内容不会与导航栏重叠 */
}

.main-content {
  padding: 10px;
  max-width: 1200px;
  margin: 0 auto;
  background: #f8f9fa;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.filters-container {
  position: sticky;
  top: 0;
  background: #f8f9fa;
  padding: 10px;
  z-index: 100;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.styled-select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  cursor: pointer;
}

.classroom-timetable-container {
  display: flex;
  gap: 20px;
  width: 100%;
  align-items: flex-start;
}

.classroom-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  padding-bottom: 10px;
}

.classroom-card {
  background: #fff;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  min-width: 180px;
}

.classroom-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.classroom-card.selected {
  border: 2px solid #0073e6;
}


.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.capacity-badge {
  background: #0073e6;
  color: white;
  padding: 3px 8px;
  border-radius: 5px;
  font-size: 12px;
}

.card-body {
  margin-top: 10px;
}

.room-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-item {
  font-size: 14px;
  color: #555;
}
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
}

.pagination-controls button {
  padding: 8px 12px;
  margin: 0 5px;
  border: none;
  background: #0073e6;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.pagination-controls button:disabled {
  background: #ccc;
  cursor: not-allowed;
}


/* 日期选择器 */
.date-selector {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.date-selector button {
  padding: 8px 12px;
  border: none;
  background: #eee;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.date-selector button.active {
  background: #0073e6;
  color: white;
}

.date-selector button:hover {
  background: #005bb5;
  color: white;
}

/* 时间表 */
.timetable-container {
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  flex: 1;
  max-width: 650px;
  min-height: 100px;
  max-height: 200px;
  margin-top: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 40px; /* 保留两个时间卡牌的高度空间 */
}

.time-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  justify-content: center;
}

.time-slot {
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
  transition: background 0.3s;
  min-width: 120px;
  font-size: 14px;
}

.time-slot.available {
  background: #d4edda;
  color: #155724;
}

.time-slot.booked {
  background: #f8d7da;
  color: #721c24;
  cursor: not-allowed;
}

.time-slot:hover {
  opacity: 0.8;
}

</style>