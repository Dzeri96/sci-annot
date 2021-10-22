<template>
    <div id="imview"></div>
</template>

<script src='./ImageView.ts'/>

<style scoped>
@import '../widgets/figure-caption.css';

#imview {
    height: 100%;
    flex-grow: 3;
    background-color: rgba(212, 212, 212, 0.345);
    background-image:
        linear-gradient(rgba(255,255,255,.5) 2px, transparent 2px),
        linear-gradient(90deg, rgba(255,255,255,.5) 2px, transparent 2px),
        linear-gradient(rgba(255,255,255,.28) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.28) 1px, transparent 1px);
    background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
    background-position: -2px -20px, -2px -2px, -1px -1px, -1px -1px;
}
</style>