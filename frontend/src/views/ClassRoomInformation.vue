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
            <button v-for="offset in 7" :key="offset" @click="handleDateChange(offset - 1)"
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
            <div v-for="room in paginatedRooms" :key="room.classroom_name + room.date" class="classroom-card"
              :class="{ selected: selectedRoom && selectedRoom.classroom_name === room.classroom_name }"
              @click="selectRoom(room)" @contextmenu.prevent="handleRightClick(room, $event)">

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
              <div v-for="timeSpan in timeSpans" :key="timeSpan.start_time" class="time-slot" :class="{
                'available': timeSpan.is_available,
                'booked': !timeSpan.is_available,
                'clickable': timeSpan.is_available
              }" @click="timeSpan.is_available ? handleTimeSlotClick(timeSpan) : null">
                <span>{{ formatTimeSpan(timeSpan.start_time) }}</span>
                <span>{{ timeSpan.is_available ? "Available" : "Booked" }}</span>
              </div>
            </div>
          </div>
        </div>

      </main>
      <!-- Right-click context menu -->
      <ul v-if="contextMenuVisible" class="context-menu" :style="contextMenuStyle" @click.stop>
        <li @click="handleModifyClick">🛠 Modify Room</li>
      </ul>
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
      email: '',
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
      contextMenuVisible: false,
      contextMenuStyle: { top: '0px', left: '0px' },
      contextMenuRoom: null

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
    document.addEventListener("click", this.hideContextMenu);
    this.adjustRoomsPerPage();
    window.addEventListener("resize", this.adjustRoomsPerPage);
  },

  methods: {
    handleDateChange(offset) {
      this.selectedDate = this.getFormattedDate(offset);
      if (this.selectedRoom) {
        const updatedRoom = this.filteredRooms.find(
          r => r.classroom_name === this.selectedRoom.classroom_name &&
            r.date === this.selectedDate
        );
        if (updatedRoom) {
          this.scrollToRoom(updatedRoom);        // 自动跳到分页
          this.selectRoom(updatedRoom);          // 自动刷新时间段
        } else {
          this.selectedRoom = null;
          this.timeSpans = [];
        }
      }
    },
    scrollToRoom(room) {
      const index = this.filteredRooms.findIndex(
        r => r.classroom_name === room.classroom_name && r.date === room.date
      );
      if (index !== -1) {
        this.currentPage = Math.floor(index / this.roomsPerPage) + 1;
      }
    },


    adjustRoomsPerPage() {
      if (window.innerWidth <= 800) {
        this.roomsPerPage = 2;
      } else {
        this.roomsPerPage = 12;
      }

    },
    handleRightClick(room, event) {
      if (this.role !== 'Admin') return;
      this.contextMenuRoom = room;
      this.contextMenuStyle = {
        top: `${event.clientY}px`,
        left: `${event.clientX}px`
      };
      this.contextMenuVisible = true;
    },

    handleModifyClick() {
      this.selectedRoom = this.contextMenuRoom;
      this.contextMenuVisible = false;
      this.modifyRoom();
    },

    hideContextMenu() {
      this.contextMenuVisible = false;
    },


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
        .catch(() => { });

    },

    async confirmBooking(slot) {
      if (!slot.is_available) {
        alert("This time slot is already booked.");
        return;
      }

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

            email: this.email,
            request_type: "booking"
          }),
        });

        const data = await response.json();
        console.log("Booking Response:", data);

        if (data.success) {
          alert("Booking confirmed successfully! An email is send to your mailbox.");
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

    // get the information of selected room from backend
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
          this.timeSpans = Array.isArray(data.time_spans) ? data.time_spans.filter(ts => ts && ts.start_time) : [];

        } else {
          alert("Failed to fetch time spans: " + data.message);
        }
      } catch (error) {
        console.error("Request Error:", error);
        alert("Failed to fetch time spans!");
      }
    },
    async refreshRoomsAndReselect(classroomName, date) {
      await this.getClassroomInformationFromDB();
      const updatedRoom = this.filteredRooms.find(
        r => r.classroom_name === classroomName && r.date === date
      );
      if (updatedRoom) {
        this.scrollToRoom(updatedRoom);
        this.selectRoom(updatedRoom);
      } else {
        this.selectedRoom = null;
      }
    },



    modifyRoom() {
      const originalRoom = { ...this.selectedRoom };

      ElMessageBox({
        title: "Modify Room Information",
        message: `
      <div>
        <label>New Capacity:</label>
        <input id="newCapacity" type="number" value="${this.selectedRoom.capacity}" placeholder="Enter new capacity" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 5px;">
        <label style="margin-top: 10px; display: block;">New Equipment:</label>
        <input id="newEquipment" type="text" value="${this.selectedRoom.device || ''}" placeholder="Enter new equipment" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 5px;">
        <label style="margin-top: 10px;">Disable Bookings Between:</label>
        <div>
          <input id="disableStartDate" type="date" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 5px;">
          <select id="disableStartTime" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 5px;">
            <option value="">Select Start Time</option>
            <option value="08:00">08:00</option>
            <option value="10:00">10:00</option>
            <option value="14:00">14:00</option>
            <option value="16:00">16:00</option>
            <option value="19:00">19:00</option>
          </select>
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
        beforeClose: async (action, instance, done) => {
          const newCapacity = document.getElementById("newCapacity")?.value.trim();
          const newEquipment = document.getElementById("newEquipment")?.value.trim();
          const disableStartDate = document.getElementById("disableStartDate")?.value;
          const disableStartTime = document.getElementById("disableStartTime")?.value;
          const disableEndDate = document.getElementById("disableEndDate")?.value;
          const disableEndTime = document.getElementById("disableEndTime")?.value;

          if (action === "confirm") {
            if (newCapacity && !/^[1-9][0-9]*$/.test(newCapacity)) {
              ElMessage({ type: "warning", message: "Capacity must not be a positive number or a decimal !" });
              done();
              return;
            }

            let disabledTimestamps = [];
            if (disableStartDate && disableStartTime && disableEndDate && disableEndTime) {
              disabledTimestamps = this.generateFixedTimeSlots(
                `${disableStartDate}T${disableStartTime}:00`,
                `${disableEndDate}T${disableEndTime}:00`
              );
            }


            try {
              const res = await fetch("http://127.0.0.1:5000/classroom_information/modify_room", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  classroom_name: this.selectedRoom.classroom_name,
                  new_capacity: newCapacity,
                  device: newEquipment,
                  admin_email: this.email,
                  disabled_slots: disabledTimestamps
                })
              });

              const data = await res.json();
              if (data.success) {
                ElMessage({ type: "success", message: "Room updated and this time spam disabled." });
                await this.refreshRoomsAndReselect(this.selectedRoom.classroom_name, this.selectedDate);
              } else {
                ElMessage({ type: "error", message: data.message || "Failed to modify room." });
              }
            } catch (err) {
              console.error("Fetch error:", err);
              ElMessage({ type: "error", message: "Server error while modifying room." });
            }
          } else {
            this.selectedRoom = originalRoom;
          }

          done();
        }
      }).catch((error) => {
        if (error === "cancel") {
          console.log("Cancel operation");
        } else {
          console.error("Error", error);
        }
      });
    },
    generateFixedTimeSlots(startStr, endStr) {
      const fixedTimes = ["08:00:00", "10:00:00", "14:00:00", "16:00:00", "19:00:00"];
      const result = [];

      const start = new Date(startStr);
      const end = new Date(endStr);

      const current = new Date(start);
      while (current <= end) {
        const dateStr = current.toISOString().split("T")[0]; // "2025-03-28"

        for (const time of fixedTimes) {
          const full = new Date(`${dateStr}T${time}`);
          if (full >= start && full < end) {
            result.push(`${dateStr} ${time}`);
          }
        }

        current.setDate(current.getDate() + 1);
      }

      return result;
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
  margin-top: 100px;
  /* Light grey background for the entire page */

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
  margin-right: -30px;
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

.context-menu {
  position: fixed;
  z-index: 9999;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 4px 0;
  min-width: 160px;
  list-style: none;
  margin: 0;
  user-select: none;
}

.context-menu li {
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.context-menu li:hover {
  background-color: #f0f0f0;
}

.time-slot.disabled-slot {
  background: #fdf3d6;
  color: #a67c00;
  border: 1px solid #f1d78a;
  cursor: not-allowed;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .content-container {

    margin-right: -15px;
  }

  .classroom-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
  }

  .time-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
  }

  .filters-container {
    flex-direction: column;
    align-items: stretch;
    padding: 10px;
    gap: 12px;
  }

  .filter-group {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .styled-select,
  .styled-input {
    width: 100%;
    padding: 8px;
    font-size: 14px;
    box-sizing: border-box;
  }

  .date-selector {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px;
  }

  .date-selector button {
    flex: 1 1 45%;
    min-width: 100px;
    padding: 8px;
    font-size: 12px;
  }

  .pagination-controls {
    flex-direction: column;
    gap: 10px;
  }

  .pagination-controls button {
    width: 100%;
    font-size: 14px;
  }

  .room-info {
    font-size: 13px;
    gap: 4px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .capacity-badge {
    font-size: 12px;
    padding: 3px 8px;
  }

  .time-slot {
    font-size: 12px;
    padding: 10px;
  }

  .room-name {
    font-size: 14px;
  }

  .main-content {

    padding: 10px;
  }

  .time-spans-container {
    width: 80%;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .time-spans-section {
    width: 80%;
  }



}
</style>