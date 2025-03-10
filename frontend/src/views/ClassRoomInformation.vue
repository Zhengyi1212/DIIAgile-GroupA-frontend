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

            <!-- 教室列表 -->
            <div class="classroom-grid">
               <div v-for="room in filteredRooms" :key="room.id" class="classroom-card"
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
            <div class="date-selector">
               <button v-for="offset in 7" :key="offset" @click="selectedDate = getFormattedDate(offset - 1)"
                  :class="{ active: selectedDate === getFormattedDate(offset - 1) }">
                  {{ getFormattedDate(offset - 1) }}
               </button>
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
        { id: '201', name: 'B201', capacity: 60, building: '教学楼B', floor: '2层', equipment: '电脑' }
      ],
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
    }
  },
  mounted() {
    this.getInfor();
  }
};
</script>

<style scoped>


.main-content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: #f8f9fa;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.filters-container {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
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

.classroom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.classroom-card {
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
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
  margin-top: 20px;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.timetable-title {
  font-size: 18px;
  margin-bottom: 10px;
}

.time-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.time-slot {
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
  transition: background 0.3s;
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