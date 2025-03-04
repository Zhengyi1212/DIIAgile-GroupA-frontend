import {createApp} from 'vue';
import Router from 'vue-router';
import Login from '@/views/Login.vue';
import SignUp from '@/views/SignUp.vue';
import Mybookings from '@/views/Mybookings.vue';
import ClassRoomInformation from '@/views/ClassRoomInformation.vue';

createApp.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'login',
            component: Login
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
        }
    ]
});