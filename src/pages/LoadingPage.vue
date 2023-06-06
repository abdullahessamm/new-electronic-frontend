<template>
    <div class="loading-page w-100 h-100 d-flex flex-column justify-content-center align-items-center">
        <LoadingComponent :color="color" duration="550ms" width="60px"/>
        <span v-if="text" :style="{color}" class="mt-3"> {{ text }} </span>
    </div>
</template>

<script>
import LoadingComponent from '../components/LoadingComponent.vue'
export default {
    name: 'LoadingPage',
    props: ['color', 'text'],
    components: {
        LoadingComponent
    },
}
</script>