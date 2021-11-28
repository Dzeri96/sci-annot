<template>
    <div id="tooltip-container">
        <div id="arrow-up"></div>
        <div id="tooltip-content">
            <h2>Read the instructions first!</h2>
            <p/>
            They contain essential information for completing the HIT.
        </div>
    </div>
</template>

<style scoped>
    #tooltip-container {
        position: absolute;
        top: calc(100% + 1em);
        left: 1em;
        z-index: 1;
        color: white;
        filter: drop-shadow(0px 0px 7px rgba(0,0,0,0.45));
    }

    #tooltip-content {
        padding: 2em;
        background-color: rgb(68, 131, 196); 
        
    }

    h2 {
        margin: 0;
    }

    #arrow-up {
        position: relative;
        left: 1em;
        width: 0; 
        height: 0; 
        border-left: 1em solid transparent;
        border-right: 1em solid transparent;
        border-bottom: 1em solid rgb(68, 131, 196);
    }
</style>