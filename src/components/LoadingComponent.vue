<template>
    <span class="spinner-border" :style="{
        borderWidth: '0.15em',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
        animationDuration: duration,
        color,
        width,
        height: width
    }">
        <span class="visually-hidden">Loading...</span>
    </span>
</template>

<script>
export default {
    name: 'LoadingComponent',
    props: ['color', 'width','duration'],
}
</script>