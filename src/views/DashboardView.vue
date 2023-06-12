<template>
    <div class="dashboard-view h-100 w-100 overflow-hidden">
        <DashboardLayout :openMobileSidebar="mobileSidebarOpened">
            <template v-slot:dashboardHeader>
                <Header :openSidebarMobile="toggleMobileSidebar" />
            </template>
            <template v-slot:dashboardSidebar>
                <Sidebar :toggleMobileSidebar="toggleMobileSidebar"></Sidebar>
            </template>
            <template v-slot:dashboardBody>
                <router-view v-slot="{ Component }">
                    <transition name="page">
                        <component :is="Component" />
                    </transition>
                </router-view>
            </template>
        </DashboardLayout>
    </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import DashboardLayout from '../layouts/DashboardLayout.vue';
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';

export default {
    name: 'DashboardView',
    data: () => ({
        authStore: useAuthStore(),
        mobileSidebarOpened: false,
    }), //End of data

    methods: {
        toggleMobileSidebar() {this.mobileSidebarOpened = ! this.mobileSidebarOpened}, //end of openMobileSidebar
    }, //end of methods

    components: {
        DashboardLayout, Header, Sidebar
    }, // End of components
}
</script>
