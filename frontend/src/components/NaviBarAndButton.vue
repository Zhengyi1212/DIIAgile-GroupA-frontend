<template>
    <div class="header-container">
        <header class="header">
            <div class="header-top">
                <div class="brand-section">
                    <img src="../assets/dii-logo.png" alt="Project Icon" class="brand-logo" />
                    <h1 class="brand-title">DIICSU Room Book System</h1>
                </div>
                <div class="button-section">
                    <button @click="redirectToHome" class="nav-button">Home</button>
                    <button @click="redirectToClassrooms" class="nav-button">Classroom Information</button>
                    <button @click="redirectToMyBookings" class="nav-button">My Bookings</button>
                </div>


                <div class="profile-section" @mouseenter="showDropdown" @mouseleave="hideDropdown">
                    <img src="../assets/avatar.png" alt="Profile" class="profile-avatar" @click="toggleDropdown" />
                    <transition name="fade">
                        <div v-if="dropdownVisible" class="dropdown-menu">
                            <div class="dropdown-item profile-info">
                                <p>Username: {{ username }}</p>
                                <p>Role: {{ role }}</p>
                            </div>

                            <button @click="redirectToProfile" class="dropdown-item personal-info">Personal
                                Information</button>
                            <button @click="logout" class="dropdown-item exit-button">Exit</button>
                        </div>
                    </transition>
                </div>
            </div>
        </header>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dropdownVisible: false,

        };
    },

    props: {
        username: String,
        role: String,
    },

    methods: {
        toggleDropdown() {
            this.dropdownVisible = !this.dropdownVisible;
        },
        showDropdown() {
            this.dropdownVisible = true;
        },
        hideDropdown() {
            this.dropdownVisible = false;
        },
        redirectToProfile() {
            const token = localStorage.getItem("token");
            const userInfo = this.parseToken(token);
            this.$router.push({
                path: '/profile',
                query: {
                    username: userInfo.username,
                    role: userInfo.role
                }
            }
            );
        },

        redirectToHome() {
            const token = localStorage.getItem("token");
            const userInfo = this.parseToken(token);
            this.$router.push(
                {
                    path: '/home',
                    query: {
                        username: userInfo.username,
                        role: userInfo.role
                    }
                }
            );
        },
        redirectToClassrooms() {
            const token = localStorage.getItem("token");
            const userInfo = this.parseToken(token);
            this.$router.push({
                path: '/classrooms',
                query: {
                    username: userInfo.username,
                    role: userInfo.role
                }
            }
            );
        },
        redirectToMyBookings() {
            const token = localStorage.getItem("token");
            const userInfo = this.parseToken(token);
            this.$router.push({
                path: '/mybookings',
                query: {
                    username: userInfo.username,
                    role: userInfo.role
                }
            }
            );
        },


        logout() {
            localStorage.removeItem("token");
            this.$router.push("/login");
            alert("Log out successfully!");
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
    },
};
</script>

<style scoped>
.header-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
}

.header {
    width: 100%;
    background-color: #005792;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.brand-section {
    display: flex;
    align-items: center;
}

.brand-logo {
    width: 50px;
    height: 50px;
    margin-right: 1rem;
}

.brand-title {
    font-size: 1.5rem;
    color: white;
}

.profile-section {
    position: relative;
    margin-left: auto;
    /* Align profile section to the right */
    margin-right: 2.5rem;
    /* Add some space from the right edge */
}

.profile-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    cursor: pointer;
}

.dropdown-menu {
    position: absolute;
    top: 60px;
    /* Adjusted to position under the avatar */
    left: 40%;
    /* Center the dropdown menu horizontally */
    transform: translateX(-50%);
    /* Adjust horizontal centering */
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    width: 180px;
    /* Enlarge the dropdown menu */
}

.dropdown-item {
    padding: 0.5rem 1rem;
    cursor: pointer;
    text-align: left;
    width: 100%;
    border: none;
    background: none;
}

.dropdown-item:hover {
    background-color: #f1f1f1;
}

.personal-info {
    width: 100%;
    /* Full width of the dropdown menu */
    padding: 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    background-color: rgb(111, 161, 227);
    /* Blue color */
    color: white;
}

.personal-info:hover {
    background-color: #1c6adf;
    /* Darker blue on hover */
}

.exit-button {
    width: 100%;
    /* Full width of the dropdown menu */
    padding: 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    background-color: red;
    /* Red color */
    color: white;
}

.exit-button:hover {
    background-color: #5c2425;
    /* Darker red on hover */
}


.button-section {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-left: auto; /* Align to the right */
    margin-right: 2rem; /* Add some space from the right edge */
}
.nav-button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    height: 50px;
}

.nav-button:hover {
    background-color: #0056b3;
}
</style>
