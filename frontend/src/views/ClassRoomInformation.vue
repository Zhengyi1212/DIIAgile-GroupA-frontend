<template>
   <el-container>
      <el-header>
         <naviBarAndButton :username="username" :role="role">

         </naviBarAndButton>
      </el-header>
      <el-main>


      </el-main>
   </el-container>
</template>

<script>



import NaviBarAndButton from '@/components/NaviBarAndButton.vue';

export default {
   name :'ClassRoomInformation',
   data() {
      return{
      username:'',
      role:'',     
   };
      
   },
   components: {
      naviBarAndButton: NaviBarAndButton
   },

   mounted() {
    this.getInfor()
   },

   methods: {
    getInfor(){
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
   }
};

</script>