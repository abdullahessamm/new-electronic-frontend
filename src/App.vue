<template>
  <div class="app h-100">
    <LoadingPage text="جاري التحميل..." class="color-main" v-if="isLoading"/>
    <transition-group name="page">
      <LoginView v-if="(! isLoading) && (! authStore.isLoggedIn)"/>
      <DashboardView v-if="(! isLoading) && (authStore.isLoggedIn)"/>
    </transition-group>
  </div>
  <div class="n-modal" v-if="modalOpened">
    <div class="n-modal-dialog">
      <div class="header">
        <h5 style="display: flex; align-items: center;">
          <font-awesome-icon icon="fa-solid fa-triangle-exclamation" style="font-size: 20pt;" />
          <span style="margin-right: 5px;">مهم للغاية!</span>
        </h5>
      </div>
      <div class="body">
        <p>برجاء الاتصال بالمطور على هذا الرقم <b>01151316180</b> للأهمية. <br />شكراً.</p>
      </div>
      <div class="footer">
        <button @click="modalOpened = false">اغلاق</button>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.n-modal {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: start;
  padding: 20px 10px;
  z-index: 9999999;
  width: 100vw;
  height: 100vh;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.267);
}

.n-modal .n-modal-dialog {
  background-color: #fff;
  width: 500px;
  max-width: 90%;
  padding: 20px 10px;
  border-radius: 20px;
}

.n-modal .n-modal-dialog .header {
  color: rgb(192, 0, 0);
}

.n-modal .n-modal-dialog .body {
  padding: 15px 3px;
}

.n-modal .n-modal-dialog .footer button {
  background-color: rgb(192, 0, 0);
  color: #fff;
  border: none;
  padding: 3px 17px;
  border-radius: 500px;
  font-size: 12pt
}
</style>

<script>
import LoadingPage from './pages/LoadingPage.vue';
import { useAuthStore } from './stores/auth';
import LoginView from './views/LoginView.vue';
import DashboardView from './views/DashboardView.vue';

export default {
  name: "App",
  
  data: () => ({
    isLoading: true,
    authStore: useAuthStore(),
    currentView: 'login',
    modalOpened: false,
  }), //end of data

  mounted () {
    if (localStorage.getItem('token'))
      this.authStore.initialize(localStorage.getItem('token'))
      .catch(err => {
        if (err.response.status === 401)
          localStorage.removeItem('token')
      })
      .finally(() => this.isLoading = false)

    else
      this.isLoading = false
    
  }, //end of mounted hook

  components: {
    LoadingPage, LoginView, DashboardView
  }, // end of components
}
</script>