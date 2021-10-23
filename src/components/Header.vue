<template>
    <span class="header-container">
        <span class="left-header">
            <button @click="this.$emit('toggle-tutorial')" :class="{'button-selected': isTutorialVisible}"> TUT </button>
        </span>
        <div class="right-header">
           <span v-if="annotationStore">Len: {{annotationStore.freeParents.length}} {{isTutorialVisible}}</span>
            <form method='post' id='mturk_form' v-bind:action="turkSubmitTo">
                <input type="hidden" name="assignmentId" :value="assignmentId">
                <input type="hidden" name="appVersion" :value="appVersion"/>
                <input type="hidden" name="secondCounter" :value="counter"/>
                <input type="hidden" name="annotations" :value="JSON.stringify(annotationStore.annotations)"/>
                <input type="submit" id="submitButton" value="Submit"/>
            </form>
            <button id="submitButton" @click="submit">Test</button>
        </div>
    </span>
</template>

<script lang="ts">
import AnnotationStore from '@/services/annotationStore';
import { Vue } from "vue-class-component";
import { Prop } from 'vue-property-decorator';

export default class AppHeader extends Vue {
    @Prop()
    private annotationStore: AnnotationStore;
    @Prop()
    private isTutorialVisible: boolean;

    private counter = 0;
    private urlParams = new URLSearchParams(window.location.search);
    // Injected from package.json
    private appVersion = process.env.VUE_APP_VERSION;
    // Placeholder value for the MTurk assignment id
    private assignmentId = 'NO_ID';
    // Placeholder value for the MTurk submit link
    private turkSubmitTo = 'https://webhook.site/9c353bcf-91aa-4d88-96f3-93c351b9562f';

    private submit() {
        let result = {
            version: this.appVersion,
            timeSec: this.counter,
            annotations: this.annotationStore.annotations 
        }
        console.log('Result: ' + JSON.stringify(result));
    }

    mounted() {
        // Start counter
        setInterval(() => {
        this.counter++
        }, 1000)

        // Get version
        console.log(`App version: ${this.appVersion}`);

        // Get assignment id from URL params
        let idParam = this.urlParams.get('assignmentId');
        if (idParam) this.assignmentId = idParam;

        // Get submit link from URL params
        let submitParam = this.urlParams.get('turkSubmitTo');
        if (submitParam) this.turkSubmitTo = submitParam;
    }
}

</script>

<style scoped>
    .header-container {
        display: flex;
        padding: 0px 4px 4px 4px;
        margin: 0;
        padding: 4px;
        border: white;
        border-style: solid;
        border-width: 2px 0px 2px 0px;
    }

    .left-header {
        flex-grow: 1;
    }

    .right-header * {
        display: inline-block;
        margin-left: 4px;
    }

</style>