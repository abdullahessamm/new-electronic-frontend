<template>
    <div class="footer w-100 text-center position-fixed bottom-0 pt-3 pb-3" :style="{
        borderTop: `1px solid ${separatorColor}`,
        color,
        backgroundColor,
    }">
        <span> Made with <font-awesome-icon icon="fa-solid fa-heart" :style="{
            color: heartColor ?? '#e31b23'
        }"/> by <a target="__blank" :style="{color}" href="https://github.com/abdullahessamm"> Abdullah Essam </a> </span>
    </div>
</template>

<script>
export default {
    name: "Footer",
    props: ['color', 'backgroundColor', 'separatorColor', 'heartColor']
}
</script>