<template>
  <el-container>
    <el-header>
      <naviBarAndButton :username="username" :role="role"></naviBarAndButton>
    </el-header>

    <el-main>
      <main class="main-content">
        <div class="filters-container">
          <!-- Filter controls remain the same -->
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
              <option v-for="floor in floorOptions" :key="floor">{{ floor }}</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Capacity:</label>
            <input v-model.number="selectedCapacity" type="number" class="styled-input"
              placeholder="Enter min capacity">
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

          <div class="date-selector">
            <button v-for="offset in 7" :key="offset" @click="selectedDate = getFormattedDate(offset - 1)"
              :class="{ active: selectedDate === getFormattedDate(offset - 1) }">
              {{ getFormattedDate(offset - 1) }}
            </button>
          </div>
        </div>

        <!-- Content Container -->
        <div class="content-container">
          <!-- Pagination Controls -->
          <div class="pagination-controls">
            <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
            <span>Page {{ currentPage }} / {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
          </div>

          <!-- Classroom Grid -->
          <div class="classroom-grid">
            <div 
              v-for="room in paginatedRooms" 
              :key="room.classroom_name + room.date" 
              class="classroom-card"
              :class="{ selected: selectedRoom && selectedRoom.classroom_name === room.classroom_name }"
              @click="selectRoom(room)"
            >
              <div class="card-header">
                <h3 class="room-name">{{ room.classroom_name }}</h3>
                <span class="capacity-badge">{{ room.capacity }} people</span>
              </div>
              <div class="card-body">
                <div class="room-info">
                  <span class="info-item">🏢 {{ room.building }}</span>
                  <span class="info-item">📍 {{ room.floor + " floor" }}</span>
                  <span class="info-item">🖥️ {{ room.device || 'Multimedia Equipment' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Time Spans Section - Now full width and aligned -->
        <div v-if="selectedRoom" class="time-spans-container">
          <div class="time-spans-section">
            <h2>Time Spans for {{ selectedRoom.classroom_name }} on {{ selectedRoom.date }}</h2>
            <div class="time-grid">
              <div 
                v-for="timeSpan in timeSpans" 
                :key="timeSpan.start_time" 
                class="time-slot"
                :class="{ available: timeSpan.is_available, booked: !timeSpan.is_available }"
                @click="handleTimeSlotClick(timeSpan)"
              >
                <span>{{ formatTimeSpan(timeSpan.start_time) }}</span>
                <span>{{ timeSpan.is_available ? "Available" : "Booked" }}</span>
              </div>
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
      username: '',
      role: '',
      email : '',
      rooms: [
      ],
      currentPage: 1,
      roomsPerPage: 12,
      selectedCampus: '',
      selectedBuilding: '',
      selectedFloor: '',
      selectedCapacity: '',
      selectedEquipment: '',
      selectedRoom: null,
      bookedSlots: {},
      selectedDate: new Date().toISOString().split('T')[0],
      timeSpans: [

      ],
    };
  },

  computed: {
    buildingOptions() {
      return [...new Set(this.rooms.map(room => room.building))];
    },

    filteredRooms() {
      return this.rooms.filter((room) => {
        return (
          (!this.selectedDate || room.date === this.selectedDate) &&
          (!this.selectedBuilding || room.building === this.selectedBuilding) &&
          (!this.selectedFloor || room.floor === Number(this.selectedFloor)) &&
          (!this.selectedCapacity || room.capacity >= this.selectedCapacity) &&
          (!this.selectedEquipment || room.device === this.selectedEquipment)
        );
      });
    },

    floorOptions() {
      const floors = new Set();
      this.rooms.forEach(room => {
        if (!this.selectedBuilding || room.building === this.selectedBuilding) {
          floors.add(room.floor);
        }
      });
      return Array.from(floors).sort();
    },

    equipmentOptions() {
      return [...new Set(this.rooms.map(room => room.device))];
    },

    totalPages() {
      return Math.max(1, Math.ceil(this.filteredRooms.length / this.roomsPerPage));
    },

    paginatedRooms() {
      const start = (this.currentPage - 1) * this.roomsPerPage;
      return this.filteredRooms.slice(start, start + this.roomsPerPage);
    }
  },

  mounted() {
    this.getInfor();
    this.getClassroomInformationFromDB()
  },

  methods: {


    async getClassroomInformationFromDB() {
      try {
        // Construct the URL with the role query parameter
        const url = `http://127.0.0.1:5000/classrooms?role=${encodeURIComponent(this.role)}`;

        // Send the GET request
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Parse the JSON response
        const data = await response.json();
        console.log("Response Data:", data);

        // Check if the request was successful
        if (data.success) {
          // Update the rooms variable with the retrieved classrooms
          this.rooms = data.classrooms;
          alert("Get classrooms successful!");
        } else {
          // Handle failure case
          alert("Classroom information retrieval failure: " + data.message);
        }
      } catch (error) {
        // Handle any errors that occur during the request
        console.error("Request Error:", error);
        alert("Failed to get classroom information!");
      } finally {
        // This block runs regardless of success or failure
        console.log("Request completed.");
      }
    },


    getFormattedDate(offset) {
      const date = new Date();
      date.setDate(date.getDate() + offset);
      return date.toISOString().split('T')[0];
    },

    getInfor() {
      const token = localStorage.getItem("token");
      const userInfo = this.parseToken(token);
      this.username = userInfo.username;
      this.role = userInfo.role;
      this.email = userInfo.email
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


    handleTimeSlotClick(slot) {
      if (!this.selectedRoom) return;

      if (this.role === "Admin") {
        // Admin 角色，提供 "修改教室" 和 "预约" 两个选项
        ElMessageBox({
          title: "Admin Actions",
          message: `You have selected <b>${this.selectedRoom.classroom_name}</b> on <b>${this.selectedDate}</b> at <b>${slot.start_time}</b>. 
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
          `Do you want to book <b>${this.selectedRoom.classroom_name}</b> on <b>${this.selectedDate}</b> at <b>${slot.start_time}</b>?`,
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

    async confirmBooking(slot) {
      if (!slot.is_available) {
        alert("This time slot is already booked.");
        return;
      }

      //const userEmail = prompt("Please enter your email to confirm the booking:");
     // if (!userEmail) {
       // alert("Email is required to confirm the booking.");
       // return;
     // }

      try {
        const url = "http://127.0.0.1:5000/classrooms";
        console.log(`${this.selectedRoom.date} ${slot.start_time}`)
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            classroom_name: this.selectedRoom.classroom_name,
            time: `${this.selectedRoom.date}T${slot.start_time}`, 
            // Combine date and start_time
            email: this.email,
            request_type : "booking"
          }),
        });

        const data = await response.json();
        console.log("Booking Response:", data);

        if (data.success) {
          alert("Booking confirmed successfully!");
          // Update the time slot's availability in the frontend
          slot.is_available = false;
        } else {
          alert("Failed to confirm booking: " + data.message);
        }
      } catch (error) {
        console.error("Request Error:", error);
        alert("Failed to confirm booking!");
      }
    },

    formatTimeSpan(startTime) {
      const start = new Date(`1970-01-01T${startTime}Z`); // Parse start time
      const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours

      // Convert times to HH:MM:SS format, ensuring midnight crossover is handled
      const formatTime = (date) => date.toISOString().slice(11, 19);

      return `${formatTime(start)} - ${formatTime(end)}`;
    },


    async selectRoom(room) {
      this.selectedRoom = room; // Store the selected room
      try {
        // Send a POST request to the backend
        const url = "http://127.0.0.1:5000/classrooms";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            classroom_name: room.classroom_name,
            date: room.date,
            request_type: "get_classroom"
          }),
        });

        const data = await response.json();
        console.log("Time Spans Response:", data);

        if (data.success) {
          this.timeSpans = data.time_spans; // Store the time spans
        } else {
          alert("Failed to fetch time spans: " + data.message);
        }
      } catch (error) {
        console.error("Request Error:", error);
        alert("Failed to fetch time spans!");
      }
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

    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    }
  },

};
</script>



<style scoped>
.el-main {
  padding-top: 10px;
  background: #f0f2f5;
  margin-top: 30px; /* Light grey background for the entire page */
 
}

.main-content {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  min-height: 80vh;
  box-sizing: border-box;
}

.filters-container {
  position: sticky;
  top: 0;
  background: #fff;
  padding: 15px;
  z-index: 100;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  
  border-radius: 20px;
}

.content-container {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.classroom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  width: 100%;
  padding: 10px 0;
}

.classroom-card {
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.classroom-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.classroom-card.selected {
  background-color: #f0f7ff;
  border-color: #0073e6;
  box-shadow: 0 4px 12px rgba(0, 115, 230, 0.2);
  transform: translateY(-3px);
  position: relative;
  z-index: 1;
}

.classroom-card.selected::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid #0073e6;
  border-radius: 8px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 115, 230, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 115, 230, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 115, 230, 0);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.room-name {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.capacity-badge {
  background: #0073e6;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.room-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
}

.info-item {
  color: #555;
}

.time-spans-container {
  width: 100%;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.time-spans-section {
  width: 100%;
}

.time-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.time-slot {
  padding: 12px;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  font-weight: 500;
}

.time-slot.available {
  background: #e6f7e6;
  color: #1a7321;
  border: 1px solid #b7e0b7;
}

.time-slot.booked {
  background: #ffe6e6;
  color: #73211a;
  border: 1px solid #e0b7b7;
  cursor: not-allowed;
}

.time-slot:hover:not(.booked) {
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin: 20px 0;
}

.pagination-controls button {
  padding: 8px 16px;
  background: #0073e6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.pagination-controls button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.pagination-controls button:hover:not(:disabled) {
  background: #005bb5;
}

.date-selector {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.date-selector button {
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: #f8f9fa;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.date-selector button.active {
  background: #0073e6;
  color: white;
  border-color: #0073e6;
}

.date-selector button:hover {
  background: #e6f0fa;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .classroom-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
  
  .time-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  
  .filters-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: flex-start;
    border-radius: 15px; /* Rounded group */
  }
}
</style>