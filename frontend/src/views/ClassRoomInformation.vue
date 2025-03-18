<template>
  <el-container>
    <el-header>
      <naviBarAndButton :username="username" :role="role"></naviBarAndButton>
    </el-header>


    <el-main>
      <main class="main-content">
        <!-- 过滤区域 -->
        <div class="filters-container">
          <div class="filter-group">
            <label>Building:</label>
            <select v-model="selectedBuilding" class="styled-select">
              <option value="">All Buildings</option>
              <option v-for="building in buildingOptions" :key="building">{{ building }}</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Floor:</label>
            <select v-model="selectedFloor" class="styled-select">
              <option value="">All Floors</option>
              <option v-for="floor in filteredFloors" :key="floor">{{ floor }}</option>
            </select>
          </div>
          <div class="filter-group">
<<<<<<< HEAD

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
=======
            <label>Min Capacity:</label>
            <input v-model.number="selectedCapacity" type="number" class="styled-input" placeholder="Enter min capacity">
          </div>
          <div class="filter-group">
            <label>Equipment:</label>
            <select v-model="selectedEquipment" class="styled-select">
              <option value="">Any</option>
              <option v-for="equip in equipmentOptions" :key="equip">{{ equip }}</option>
            </select>
          </div>
        </div>

        <!-- 日期选择 -->
>>>>>>> 9eafd85a59cbd574a269f9e7407185475f96bf94
        <div class="date-selector">
          <button v-for="offset in 7" :key="offset" @click="selectedDate = getFormattedDate(offset - 1)"
            :class="{ active: selectedDate === getFormattedDate(offset - 1) }">
            {{ getFormattedDate(offset - 1) }}
          </button>
        </div>

        <!-- 教室列表 -->
        <div class="content-container">
          <div class="pagination-controls">
            <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
            <span>Page {{ currentPage }} / {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
          </div>
          <div class="classroom-grid">
            <div v-for="room in paginatedRooms" :key="room.id" class="classroom-card" @click="selectRoom(room)">
              <div class="card-header">
                <h3 class="room-name">{{ room.name }}</h3>
                <span class="capacity-badge">{{ room.capacity }} people</span>
              </div>
              <div class="card-body">
                <div class="room-info">
                  <span class="info-item">🏢 {{ room.building }}</span>
                  <span class="info-item">📍 {{ room.floor }}</span>
                  <span class="info-item">🖥️ {{ room.equipment || 'Multimedia Equipment' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 时间表 -->
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
import { ElMessageBox, ElMessage } from "element-plus";
export default {
  name: 'ClassRoomInformation',
  components: {
    naviBarAndButton: NaviBarAndButton
  },
  data() {
    return {
<<<<<<< HEAD
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
=======
      username: 'TestUser',
      role: 'student',
>>>>>>> 9eafd85a59cbd574a269f9e7407185475f96bf94
      selectedBuilding: '',
      selectedFloor: '',
      selectedCapacity: '',
      selectedEquipment: '',
      currentPage: 1,
      roomsPerPage: 12,
      rooms: [],
      selectedRoom: null,
<<<<<<< HEAD
      timeSlots: ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00','19:00-21:00'],
=======
>>>>>>> 9eafd85a59cbd574a269f9e7407185475f96bf94
      bookedSlots: {},
      selectedDate: new Date().toISOString().split('T')[0],
      timeSlots: ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00', '19:00-21:00'],
    };
  },
  computed: {
    buildingOptions() {
      return [...new Set(this.rooms.map(room => room.building))];
    },
    filteredFloors() {
      const floors = new Set();
      this.rooms.forEach(room => {
        if (!this.selectedBuilding || room.building === this.selectedBuilding) {
          floors.add(room.floor);
        }
      });
      return Array.from(floors);
    },
    equipmentOptions() {
      return [...new Set(this.rooms.map(room => room.equipment))];
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
      return this.filteredRooms.slice(start, start + this.roomsPerPage);
    }
  },
  
  methods: {
    getFormattedDate(offset) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toISOString().split('T')[0];
  },
    getInfor() {
<<<<<<< HEAD
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
=======
      this.username = "test_user";
      this.role = "student";
    },
    loadStaticRooms() {
      this.rooms = [
      { id: '107', name: '107', building: 'Foreign Building', capacity: 50, floor: '1st Floor', equipment: 'Projector' },
      { id: '106', name: '108', building: 'Foreign Building', capacity: 50, floor: '1st Floor', equipment: 'Projector' },
        { id: 'A207', name: 'A207', building: 'Building A', capacity: 50, floor: '2nd Floor', equipment: 'Projector' },
        { id: 'A208', name: 'A208', building: 'Building A', capacity: 40, floor: '2nd Floor', equipment: 'Whiteboard' },
        { id: 'A310', name: 'A310', building: 'Building A', capacity: 60, floor: '3rd Floor', equipment: 'Computer' },
        { id: 'A410', name: 'A410', building: 'Building A', capacity: 55, floor: '3rd Floor', equipment: 'Projector' },
        { id: '635', name: '635', building: 'Foreign Building', capacity: 70, floor: '6th Floor', equipment: 'Smartboard' },
        { id: '610', name: '610', building: 'Foreign Building', capacity: 65, floor: '6th Floor', equipment: 'Whiteboard' }
      ];
>>>>>>> 9eafd85a59cbd574a269f9e7407185475f96bf94
    },
    loadStaticBookings() {
      this.bookedSlots = {
        "A101": {
          "2025-03-20": ["08:00-10:00", "14:00-16:00"],
          "2025-03-21": ["10:00-12:00"]
        },
        "A102": {
          "2025-03-20": ["10:00-12:00"]
        }
      };
    },
    isSlotAvailable(slot) {
  if (!this.selectedRoom) return false;

  // 将时间段转换为日期对象进行比较
  const slotStartTime = new Date(`${this.selectedDate}T${slot.split('-')[0]}:00`);
  const slotEndTime = new Date(`${this.selectedDate}T${slot.split('-')[1]}:00`);

  // 检查该时间段是否与禁用的时间段重叠
  if (this.selectedRoom.disabledTimes) {
    for (const disableTime of this.selectedRoom.disabledTimes) {
      // 判断禁用时间段是否与当前时间段有重叠
      if (
        (slotStartTime >= disableTime && slotStartTime < disableTime.getTime() + 2 * 60 * 60 * 1000) ||
        (slotEndTime > disableTime && slotEndTime <= disableTime.getTime() + 2 * 60 * 60 * 1000)
      ) {
        return false; // 如果时间段与禁用时间段重叠，则不可预定
      }
    }
  }

  // 检查该时间段是否已经被预定
  return !(
    this.bookedSlots[this.selectedRoom.id] &&
    this.bookedSlots[this.selectedRoom.id][this.selectedDate] &&
    this.bookedSlots[this.selectedRoom.id][this.selectedDate].includes(slot)
  );
},

  bookSlot(slot) {
  if (!this.selectedRoom) return;

  if (this.role === "student") {
    // Admin 角色，提供 "修改教室" 和 "预约" 两个选项
    ElMessageBox({
      title: "Admin Actions",
      message: `You have selected <b>${this.selectedRoom.name}</b> on <b>${this.selectedDate}</b> at <b>${slot}</b>. 
                <br/>Would you like to modify this room or proceed with booking?`,
      dangerouslyUseHTMLString: true,
      showCancelButton: true,
      confirmButtonText: "Modify Room",
      cancelButtonText: "Reserve",
      customClass: "custom-message-box",
    })
      .then(() => {
        // 选择 "Modify Room" 进入教室修改模式
        this.modifyRoom();
      })
      .catch(() => {
        // 选择 "Reserve" 进行预约
        this.confirmBooking(slot);
      });
  } else {
    // 普通用户，直接弹出预约确认
    ElMessageBox.confirm(
      `Do you want to book <b>${this.selectedRoom.name}</b> on <b>${this.selectedDate}</b> at <b>${slot}</b>?`,
      "Confirm Booking",
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "Yes, Book it!",
        cancelButtonText: "Cancel",
        type: "info",
        customClass: "custom-message-box",
        center: true
      }
    )
      .then(() => {
        this.confirmBooking(slot);
      })
      .catch(() => {
        // 用户取消预约
      });
  }
},

confirmBooking(slot) {
  if (!this.selectedRoom) return;

  if (!this.bookedSlots[this.selectedRoom.id]) {
    this.bookedSlots[this.selectedRoom.id] = {};
  }
  if (!this.bookedSlots[this.selectedRoom.id][this.selectedDate]) {
    this.bookedSlots[this.selectedRoom.id][this.selectedDate] = [];
  }

  if (!this.isSlotAvailable(slot)) {
    ElMessage({
      message: "This slot is already booked.",
      type: "warning",
      duration: 2000,
    });
    return;
  }

  this.bookedSlots[this.selectedRoom.id][this.selectedDate].push(slot);

  // 显示预约成功消息
  ElMessage({
    message: `Successfully booked <b>${this.selectedRoom.name}</b> on <b>${this.selectedDate}</b> at <b>${slot}</b>`,
    type: "success",
    dangerouslyUseHTMLString: true,
    duration: 3000
  });
},

modifyRoom() {
  // 保存当前房间的信息，以便在点击取消时恢复
  const originalRoom = { ...this.selectedRoom };

  ElMessageBox({
    title: "Modify Room Information",
    message: `
      <div>
        <label>New Capacity:</label>
        <input id="newCapacity" type="number" value="${this.selectedRoom.capacity}" placeholder="Enter new capacity" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 5px;">
        <label style="margin-top: 10px; display: block;">New Equipment:</label>
        <input id="newEquipment" type="text" value="${this.selectedRoom.equipment}" placeholder="Enter new equipment" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 5px;">
        
        <label style="margin-top: 10px;">Disable Bookings Between:</label>
        <div>
          <!-- 选择禁用的起始日期和时间 -->
          <input id="disableStartDate" type="date" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 5px;">
          <select id="disableStartTime" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 5px;">
            <option value="">Select Start Time</option>
            <option value="08:00">08:00</option>
            <option value="10:00">10:00</option>
            <option value="14:00">14:00</option>
            <option value="16:00">16:00</option>
            <option value="19:00">19:00</option>
          </select>
          
          <!-- 选择禁用的结束日期和时间 -->
          <input id="disableEndDate" type="date" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 5px;">
          <select id="disableEndTime" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 5px;">
            <option value="">Select End Time</option>
            <option value="10:00">10:00</option>
            <option value="12:00">12:00</option>
            <option value="16:00">16:00</option>
            <option value="18:00">18:00</option>
            <option value="21:00">21:00</option>
          </select>
        </div>
      </div>
    `,
    dangerouslyUseHTMLString: true,
    showCancelButton: true,
    confirmButtonText: "Save Changes",
    cancelButtonText: "Cancel",
    customClass: "custom-message-box",
    beforeClose: (action, instance, done) => {
      const newCapacity = document.getElementById("newCapacity") ? document.getElementById("newCapacity").value.trim() : '';
      const newEquipment = document.getElementById("newEquipment") ? document.getElementById("newEquipment").value.trim() : '';
      const disableStartDate = document.getElementById("disableStartDate") ? document.getElementById("disableStartDate").value : '';
      const disableStartTime = document.getElementById("disableStartTime") ? document.getElementById("disableStartTime").value : '';
      const disableEndDate = document.getElementById("disableEndDate") ? document.getElementById("disableEndDate").value : '';
      const disableEndTime = document.getElementById("disableEndTime") ? document.getElementById("disableEndTime").value : '';

      // 如果点击的是确认按钮（即保存更改）
      if (action === "confirm") {
        // 检查容量是否有效
        if (newCapacity && !/^[1-9][0-9]*$/.test(newCapacity)) {
          ElMessage({ type: "warning", message: "Capacity must be a positive number!" });
          done(); // 确保弹窗关闭
          return;
        }

        // 更新房间信息
        if (newCapacity) {
          this.selectedRoom.capacity = parseInt(newCapacity);
        }
        if (newEquipment) {
          this.selectedRoom.equipment = newEquipment;
        }

        // 如果设置了“禁用预定时间”，更新房间的预定信息
        if (disableStartDate && disableStartTime && disableEndDate && disableEndTime) {
          const disableStartDateTime = new Date(`${disableStartDate}T${disableStartTime}:00`);
          const disableEndDateTime = new Date(`${disableEndDate}T${disableEndTime}:00`);

          if (!this.selectedRoom.disabledTimes) {
            this.selectedRoom.disabledTimes = [];
          }

          // 禁用从选择的开始时间到结束时间的所有时间段
          for (let currentDate = disableStartDateTime; currentDate <= disableEndDateTime; currentDate.setHours(currentDate.getHours() + 2)) {
            this.selectedRoom.disabledTimes.push(new Date(currentDate));
          }

          ElMessage({ type: "success", message: `Bookings disabled from ${disableStartDateTime.toLocaleString()} to ${disableEndDateTime.toLocaleString()}.` });
        }

        ElMessage({ type: "success", message: "Room information updated successfully." });
      } else {
        // 如果点击了取消按钮，恢复原来的房间信息
        this.selectedRoom = originalRoom;
      }

      // 确保无论点击什么按钮，done() 都被调用
      done();
    }
  }).catch((error) => {
    // 处理取消操作的拒绝情况
    if (error === "cancel") {
      console.log("用户取消了操作。");
    } else {
      console.error("意外错误: ", error);
    }
  });
},



modifyRoomEquipment() {
  ElMessageBox.prompt(
    "Modify Room Equipment",
    "Enter new equipment details:",
    {
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
    }
  )
    .then(({ value }) => {
      this.selectedRoom.equipment = value;
      ElMessage({
        type: "success",
        message: `Room equipment updated to "${value}".`
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "Equipment modification canceled."
      });
    });
},

    selectRoom(room) {
    this.selectedRoom = room;
  },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    }
  },
  mounted() {
    this.getInfor();
    this.loadStaticRooms();
    this.loadStaticBookings();
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
::v-deep(.custom-message-box) {
  margin-top: 100px !important;  /* 让弹窗往下移动 */
}

<<<<<<< HEAD
=======
::v-deep(.el-message-box) {
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

::v-deep(.el-message-box__title) {
  font-size: 18px;
  font-weight: bold;
}

::v-deep(.el-message-box__content) {
  font-size: 16px;
}

>>>>>>> 9eafd85a59cbd574a269f9e7407185475f96bf94
</style>
