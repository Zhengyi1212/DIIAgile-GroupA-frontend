import {createApp} from 'vue';
import Router from 'vue-router';
import Login from '@/views/LoginView.vue';
import SignUp from '@/views/SignUp.vue';
import Mybookings from '@/views/Mybookings.vue';
import ClassRoomInformation from '@/views/ClassRoomInformation.vue';
import LoginView from '@/views/LoginView.vue';
import ProfileView from '@/views/ProfileView.vue';

createApp.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'login',
            component: LoginView
        },
        {
            path: '/signup',    
            component:SignUp
        },
        {
            path: '/mybookings',
            component: Mybookings
        },
        {
            path: '/classrooms',
            component: ClassRoomInformation
        },
        {
            path: 'profile',
            component: ProfileView
        },
    ]
});