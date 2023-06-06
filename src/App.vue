<template>
  <div class="app h-100">
    <LoadingPage text="جاري التحميل..." v-if="isLoading"/>
  </div>
</template>

<script>
import LoadingPageVue from './pages/LoadingPage.vue';
import { useAuthStore } from './stores/auth';

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
    LoadingPage: LoadingPageVue
  }, // end of components
}
</script>