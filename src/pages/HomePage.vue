<template>
    <div class="home-page w-100 h-100 d-flex justify-content-center align-items-center flex-column">
        <h2 class="color-main my-4"> لوحة تحكم نيو إلكترونيك </h2>
        <h4> مرحباً، {{ authStore.$state.user.f_name }} </h4>
        <div class="links w-100 my-5">
            <div class="container">
                <div class="row">
                    <div class="col-12 col-md-6 text-center" v-if="authStore.can(abilities.statistics.show)">
                        <router-link to="/statistics" class="hot-link text-decoration-none px-4 py-2 w-100 d-inline-block color-main">
                            <font-awesome-icon icon="fa-solid fa-chart-line" />
                            <span class="px-2">الأحصائيات</span>
                        </router-link>
                    </div>
                    <div class="col-12 col-md-6 text-center" v-if="authStore.can(abilities.users.index)">
                        <router-link to="/users" class="hot-link text-decoration-none px-4 py-2 w-100 d-inline-block color-main">
                            <font-awesome-icon icon="fa-solid fa-users" />
                            <span class="px-2">المستخدمين</span>
                        </router-link>
                    </div>

                    <div class="col-12 col-md-6 text-center" v-if="authStore.can(abilities.sparePartsPermits.index) || authStore.can(abilities.sparePartsPermits.fullIndex)">
                        <router-link to="/sparePartsPermits" class="hot-link text-decoration-none px-4 py-2 w-100 d-inline-block color-main">
                            <font-awesome-icon icon="fa-solid fa-toolbox" />
                            <span class="px-2">أذون قطع غيار</span>
                        </router-link>
                    </div>

                    <div class="col-12 col-md-6 text-center" v-if="authStore.can(abilities.imports.index) || authStore.can(abilities.imports.fullIndex)">
                        <router-link to="/imports" class="hot-link text-decoration-none px-4 py-2 w-100 d-inline-block color-main">
                            <font-awesome-icon icon="fa-solid fa-sack-dollar" />
                            <span class="px-2">الإيرادات</span>
                        </router-link>
                    </div>
                    <div class="col-12 col-md-6 text-center" v-if="authStore.can(abilities.exports.index) || authStore.can(abilities.exports.fullIndex)">
                        <router-link to="/exports" class="hot-link text-decoration-none px-4 py-2 w-100 d-inline-block color-main">
                            <font-awesome-icon icon="fa-solid fa-hand-holding-dollar" />
                            <span class="px-2">المصروفات</span>
                        </router-link>
                    </div>
                    <div class="col-12 col-md-6 text-center" v-if="authStore.can(abilities.exports.index) || authStore.can(abilities.exports.fullIndex)">
                        <router-link to="/settings" class="hot-link text-decoration-none px-4 py-2 w-100 d-inline-block color-main">
                            <font-awesome-icon icon="fa-solid fa-gear" />
                            <span class="px-2">إعدادات الحساب</span>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
        <Footer></Footer>
    </div>
</template>

<style lang="scss" scoped>
    .hot-link {
        font-size: 1.2em;
        border: 1px solid #135ea2;
        background-color: transparent;
        border-radius: 10px;
        max-width: 300px;
        margin: 10px 0;
        padding: 30px 0 !important;
        transition: all 0.3s ease-in-out;

        &:hover {
            background-color: #135ea2;
            color: #fff;
        }

    }

    @media (max-width: 425px) {
        .hot-link {
            font-size: 1.1em;
            padding: 10px 0 !important;
        }
    }
</style>

<script>
import Footer from '../components/Footer.vue'
import { useAuthStore } from '../stores/auth'
import availableAbilities from '../extras/availableAbilities';

export default {
    name: 'HomePage',
    data: () => ({
        authStore: useAuthStore(),
        abilities: availableAbilities
    }),

    components: {Footer}
}
</script>