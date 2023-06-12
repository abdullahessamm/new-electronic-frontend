<template>
    <nav class="navbar navbar-dark bg-color-main">
        <div class="container-fluid">
            <router-link to="/" class="navbar-brand text-white">نيو إلكترونيك</router-link>
            <div class="text-center text-white px-5 d-none d-md-block" v-if="loggingOut">
                <LoadingComponent width="25px" duration="400ms" />
            </div>
            <div class="nav-item dropdown d-none d-lg-block" v-else>
                <button class="btn text-white dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    {{ authStore.fullName }}
                </button>
                <ul class="dropdown-menu text-right">
                    <li>
                        <router-link class="dropdown-item color-main" to="/settings">
                            <font-awesome-icon icon="fa-solid fa-user-gear" /> إعدادات الحساب
                        </router-link>
                    </li>
                    <li>
                        <div class="text-center mt-2 px-2" >
                            <button class="btn btn-danger w-100" @click="logout">
                                <font-awesome-icon icon="fa-solid fa-power-off" />
                                خروج
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="nav-item d-block d-lg-none" @click="openSidebarMobile">
                <span class="navbar-toggler-icon"></span>
            </div>
        </div>
    </nav>
</template>

<script>
import { useAuthStore } from '../stores/auth';
import LoadingComponent from './LoadingComponent.vue';

export default {
    name: "Header",
    props: ['openSidebarMobile'],
    data: () => ({
        authStore: useAuthStore(),
        loggingOut: false,
    }), //end of data

    methods: {
        logout() {
            this.loggingOut = true
            this.authStore.logout()
            .finally(() => {
                this.loggingOut = false
            })
        }, // end of logout
    }, //end of methods

    components: {
        LoadingComponent
    }, // end of components
}
</script>