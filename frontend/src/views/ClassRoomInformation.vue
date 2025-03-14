<template>
  <el-container>
    <el-header>
      <naviBarAndButton :username="username" :role="role">
      </naviBarAndButton>
    </el-header>
    <el-main>
      <main class="main-content">
        <!-- Filter Area -->
        <div class="filters-container">
          <div class="filter-group">
            <label>Campus:</label>
            <select v-model="selectedCampus" class="styled-select">
              <option value="">All Campuses</option>
              <option v-for="campus in campuses" :key="campus.id" :value="campus.id">
                {{ campus.name }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label>Building:</label>
            <select v-model="selectedBuilding" class="styled-select">
              <option value="">All Buildings</option>
              <option v-for="building in filteredBuildings" :key="building">
                {{ building }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label>Floor:</label>
            <select v-model="selectedFloor" class="styled-select">
              <option value="">All Floors</option>
              <option v-for="floor in filteredFloors" :key="floor">
                {{ floor }}
              </option>
            </select>
          </div>
          <div class="filter-group">
  <label>Min Capacity:</label>
  <input v-model.number="selectedCapacity" type="number" class="styled-input" placeholder="Enter min capacity">
</div>

<div class="filter-group">
  <label>Equipment:</label>
  <select v-model="selectedEquipment" class="styled-select">
    <option value="">Any</option>
    <option v-for="equip in equipmentOptions" :key="equip">
      {{ equip }}
    </option>
  </select>
</div>

        </div>

        <!-- Date Selector -->
        <div class="date-selector">
          <button v-for="offset in 7" :key="offset" @click="selectedDate = getFormattedDate(offset - 1)"
            :class="{ active: selectedDate === getFormattedDate(offset - 1) }">
            {{ getFormattedDate(offset - 1) }}
          </button>
        </div>

        <div class="content-container">
          <!-- Classroom List -->
          <div class="pagination-controls">
            <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
            <span>Page {{ currentPage }} / {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
          </div>
          <div class="classroom-grid">
            <div v-for="room in paginatedRooms" :key="room.id" class="classroom-card"
              :class="{ selected: selectedRoom?.id === room.id }" @click="selectRoom(room)">
              <div class="card-header">
                <h3 class="room-name">{{ room.name }}</h3>
                <span class="capacity-badge">{{ room.capacity }} people</span>
              </div>
              <div class="card-body">
                <div class="room-info">
                  <span class="info-item">🖥️ {{ room.equipment || 'Multimedia Equipment' }}</span>
                  <span class="info-item">📍 {{ room.building }} {{ room.floor }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Timetable -->
        <div v-if="selectedRoom" class="timetable-container">
          <h3 class="timetable-title">{{ selectedRoom.name }} Reservation Timetable</h3>
          <div class="time-grid">
            <div v-for="slot in timeSlots" :key="slot" class="time-slot"
              :class="{ available: isSlotAvailable(slot), booked: !isSlotAvailable(slot) }"
              @click="bookSlot(slot)">
              <span class="slot-time">{{ slot }}</span>
              <span v-if="isSlotAvailable(slot)" class="slot-status">Available</span>
              <span v-else class="slot-status">Booked</span>
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
        { id: '1', name: 'Xiaoxiang Campus' },
        { id: '2', name: 'North Campus' }
      ],
      buildings: {
        '1': ['Building A', 'Building B','Building C', 'Building D'],
        '2': []
      },
      rooms: [
      { id: 'A101', name: 'A101', capacity: 50, building: 'Building A', floor: '1st Floor', equipment: 'Projector' },
    { id: 'A102', name: 'A102', capacity: 40, building: 'Building A', floor: '1st Floor', equipment: 'Whiteboard' },
    { id: 'A201', name: 'A201', capacity: 60, building: 'Building A', floor: '2nd Floor', equipment: 'Computer' },
    { id: 'A202', name: 'A202', capacity: 55, building: 'Building A', floor: '2nd Floor', equipment: 'Projector' },
    { id: 'A301', name: 'A301', capacity: 70, building: 'Building A', floor: '3rd Floor', equipment: 'Smartboard' },
    { id: 'A302', name: 'A302', capacity: 65, building: 'Building A', floor: '3rd Floor', equipment: 'Whiteboard' },
    { id: 'A401', name: 'A401', capacity: 80, building: 'Building A', floor: '4th Floor', equipment: 'Projector' },
    { id: 'A402', name: 'A402', capacity: 75, building: 'Building A', floor: '4th Floor', equipment: 'Computer' },

    // Building B
    { id: 'B101', name: 'B101', capacity: 50, building: 'Building B', floor: '1st Floor', equipment: 'Projector' },
    { id: 'B102', name: 'B102', capacity: 45, building: 'Building B', floor: '1st Floor', equipment: 'Whiteboard' },
    { id: 'B201', name: 'B201', capacity: 60, building: 'Building B', floor: '2nd Floor', equipment: 'Computer' },
    { id: 'B202', name: 'B202', capacity: 50, building: 'Building B', floor: '2nd Floor', equipment: 'Projector' },
    { id: 'B301', name: 'B301', capacity: 70, building: 'Building B', floor: '3rd Floor', equipment: 'Smartboard' },
    { id: 'B302', name: 'B302', capacity: 65, building: 'Building B', floor: '3rd Floor', equipment: 'Projector' },
    { id: 'B401', name: 'B401', capacity: 80, building: 'Building B', floor: '4th Floor', equipment: 'Computer' },
    { id: 'B402', name: 'B402', capacity: 75, building: 'Building B', floor: '4th Floor', equipment: 'Whiteboard' },

    // Building C
    { id: 'C101', name: 'C101', capacity: 55, building: 'Building C', floor: '1st Floor', equipment: 'Projector' },
    { id: 'C102', name: 'C102', capacity: 50, building: 'Building C', floor: '1st Floor', equipment: 'Smartboard' },
    { id: 'C201', name: 'C201', capacity: 65, building: 'Building C', floor: '2nd Floor', equipment: 'Computer' },
    { id: 'C202', name: 'C202', capacity: 60, building: 'Building C', floor: '2nd Floor', equipment: 'Whiteboard' },
    { id: 'C301', name: 'C301', capacity: 75, building: 'Building C', floor: '3rd Floor', equipment: 'Projector' },
    { id: 'C302', name: 'C302', capacity: 70, building: 'Building C', floor: '3rd Floor', equipment: 'Smartboard' },
    { id: 'C401', name: 'C401', capacity: 85, building: 'Building C', floor: '4th Floor', equipment: 'Computer' },
    { id: 'C402', name: 'C402', capacity: 80, building: 'Building C', floor: '4th Floor', equipment: 'Whiteboard' },

    // Building D
    { id: 'D101', name: 'D101', capacity: 60, building: 'Building D', floor: '1st Floor', equipment: 'Projector' },
    { id: 'D102', name: 'D102', capacity: 55, building: 'Building D', floor: '1st Floor', equipment: 'Whiteboard' },
    { id: 'D201', name: 'D201', capacity: 70, building: 'Building D', floor: '2nd Floor', equipment: 'Computer' },
    { id: 'D202', name: 'D202', capacity: 65, building: 'Building D', floor: '2nd Floor', equipment: 'Smartboard' },
    { id: 'D301', name: 'D301', capacity: 85, building: 'Building D', floor: '3rd Floor', equipment: 'Projector' },
    { id: 'D302', name: 'D302', capacity: 80, building: 'Building D', floor: '3rd Floor', equipment: 'Computer' },
    { id: 'D401', name: 'D401', capacity: 90, building: 'Building D', floor: '4th Floor', equipment: 'Smartboard' },
    { id: 'D402', name: 'D402', capacity: 85, building: 'Building D', floor: '4th Floor', equipment: 'Whiteboard' }
      ],
      currentPage: 1,
      roomsPerPage: 12,
      selectedCampus: '',
      selectedBuilding: '',
      selectedFloor: '',
      selectedCapacity: '',
    selectedEquipment: '',
      selectedRoom: null,
      timeSlots: ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00','19:00-21:00'],
      bookedSlots: {},
      selectedDate: new Date().toISOString().split('T')[0]
    };
  },
  computed: {
    capacityOptions() {
    // 生成唯一的容量选项
    return [...new Set(this.rooms.map(room => room.capacity))].sort((a, b) => a - b);
  },
  equipmentOptions() {
    // 生成唯一的设备选项
    return [...new Set(this.rooms.map(room => room.equipment))];
  },
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
        (!this.selectedFloor || room.floor === this.selectedFloor) &&
        (!this.selectedCapacity || room.capacity >= this.selectedCapacity) &&
        (!this.selectedEquipment || room.equipment === this.selectedEquipment)
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
  },
  mounted() {
    this.getInfor();
  },
  watch: {
    filteredRooms() {
      this.currentPage = 1;
    }
  }
};
</script>





<style scoped>
.el-main {
  padding-top: 60px; /* 调整这个值以确保内容不会与导航栏重叠 */
}
.styled-input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  width: 100px;
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
