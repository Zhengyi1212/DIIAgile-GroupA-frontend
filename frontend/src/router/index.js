import { createRouter, createWebHistory } from 'vue-router';

import SignUp from '@/views/SignUp.vue';
import MyBookings from '@/views/MyBookingsView.vue';
import ClassRoomInformation from '@/views/ClassRoomInformation.vue';
import LoginView from '@/views/LoginView.vue';
import ProfileView from '@/views/ProfileView.vue';

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
        path: '/classrooms',
        component: ClassRoomInformation
    },
    {
        path: '/profile',
        component: ProfileView
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
