<template>
    <div class="sidebar h-100 py-4 px-2">
        <div class="link-container" v-if="authStore.can(abilities.statistics.show)">
            <router-link @click="toggleMobileSidebar" to="/statistics" class="link text-decoration-none px-4 py-2 w-100 d-inline-block color-main">
                <font-awesome-icon icon="fa-solid fa-chart-line" />
                <span class="px-2">الأحصائيات</span>
            </router-link>
        </div>

        <div class="link-container" v-if="authStore.can(abilities.users.index)">
            <router-link @click="toggleMobileSidebar" to="/users" class="link text-decoration-none px-4 py-2 w-100 d-inline-block color-main">
                <font-awesome-icon icon="fa-solid fa-users" />
                <span class="px-2">المستخدمين</span>
            </router-link>
        </div>

        <div class="link-container" v-if="authStore.can(abilities.imports.index) || authStore.can(abilities.imports.fullIndex)">
            <router-link @click="toggleMobileSidebar" to="/imports" class="link text-decoration-none px-4 py-2 w-100 d-inline-block color-main">
                <font-awesome-icon icon="fa-solid fa-sack-dollar" />
                <span class="px-2">الإيرادات</span>
            </router-link>
        </div>

        <div class="link-container"  v-if="authStore.can(abilities.exports.index) || authStore.can(abilities.exports.fullIndex)">
            <router-link @click="toggleMobileSidebar" to="/exports" class="link text-decoration-none px-4 py-2 w-100 d-inline-block color-main">
                <font-awesome-icon icon="fa-solid fa-hand-holding-dollar" />
                <span class="px-2">المصروفات</span>
            </router-link>
        </div>

        <div class="link-container">
            <router-link @click="toggleMobileSidebar" to="/settings" class="link text-decoration-none px-4 py-2 w-100 d-inline-block color-main">
                <font-awesome-icon icon="fa-solid fa-gear" />
                <span class="px-2">إعدادات الحساب</span>
            </router-link>
        </div>

        <div class="link-container">
            <div class="text-center mt-5 px-2" >
                <button class="btn btn-danger w-100" @click="logout">
                    <loading-component width="20px" v-if="loggingOut"></loading-component>
                    <span v-else>
                        <font-awesome-icon icon="fa-solid fa-power-off" />
                        خروج
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .sidebar {
        border-left: 1px solid #aaa;

        .link {
            font-size: 1em;
            margin-bottom: 10px;
            border-radius: 10px;
            transition: 0.3s all ease-in-out;
            color: #333 !important;

            &.router-link-active {
                background-color: #135da2dc;
                color: #fff !important
            }

            &:hover {
                background-color: #135da2dc;
                color: #fff !important
            }

        }
    }

    @media (max-width: 991px) {
        .sidebar {
            border-left: none;

            .link {
                font-size: 1em;
                color: #fff !important
            }
        }
    }
</style>

<script>
import { useAuthStore } from '../stores/auth';
import LoadingComponent from './LoadingComponent.vue';
import availableAbilities from '../extras/availableAbilities';

export default {
    components: { LoadingComponent },
    name: "Sidebar",
    props: ['toggleMobileSidebar'],
    data: () => ({
        authStore: useAuthStore(),
        abilities: availableAbilities,
        loggingOut: false,
    }), //end of data

    methods: {
        logout() {
            this.loggingOut = true
            this.authStore.logout()
            .finally(() => { this.loggingOut = false })
        }, // end of logout
    }, //end of methods

}
</script>