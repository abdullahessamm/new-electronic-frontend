<template>
    <div class="dashboard-layout w-100 h-100 overflow-hidden">
        <div class="dashboard-header w-100">
            <slot name="dashboardHeader"></slot>
        </div>
        <div class="dashboard-body w-100 position-relative d-flex flex-row">
            <div class="dashboard-sidebar d-none d-lg-block overflow-y-auto">
                <slot name="dashboardSidebar"></slot>
            </div>
            <transition name="sidebar">
                <div class="dashboard-mobile-sidebar d-block d-lg-none w-100 h-100 position-absolute top-0 bg-color-main z-3 overflow-y-auto" v-if="openMobileSidebar">
                    <slot name="dashboardSidebar"></slot>
                </div>
            </transition>
            <div class="dashboard-page w-100 overflow-y-auto">
                <slot name="dashboardBody"></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .dashboard-sidebar { width: 260px }
</style>

<script>
import Header from '../components/Header.vue'

export default {
    name: "DashboardLayout",
    props: ['openMobileSidebar'],

    mounted() {
        let headerOffsetHeight = document.querySelector('.dashboard-header').offsetHeight
        document.querySelector('.dashboard-body').style.height = `calc(100% - ${headerOffsetHeight}px)`
    }, //end of mounted

    components: {
        Header
    },
}
</script>