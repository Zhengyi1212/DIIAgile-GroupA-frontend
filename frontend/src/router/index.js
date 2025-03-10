import { createRouter, createWebHistory } from 'vue-router';

import SignUp from '@/views/SignUp.vue';
import MyBookings from '@/views/MyBookingsView.vue';

import LoginView from '@/views/LoginView.vue';
import ProfileView from '@/views/ProfileView.vue';
import HomePage from '@/views/HomePage.vue';
import ClassRoomInformation from '@/views/ClassRoomInformation.vue';

const routes = [
    { path: '/', redirect: '/login' },
    {
        path: '/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/signup',    
        component: SignUp
    },
    {
        path: '/mybookings',
        component: MyBookings
    },
    {
        path: '/home',
        component:HomePage
    },
    {
        path: '/profile',
        component: ProfileView
    },
    {
        path: '/classrooms',
        component: ClassRoomInformation
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
