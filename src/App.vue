<template>
  <div class="app h-100">
    <LoadingPage text="جاري التحميل..." class="color-main" v-if="isLoading"/>
    <transition-group name="page">
      <LoginView v-if="(! isLoading) && (! authStore.isLoggedIn)"/>
      <DashboardView v-if="(! isLoading) && (authStore.isLoggedIn)"/>
    </transition-group>
  </div>
</template>

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
    currentView: 'login'
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