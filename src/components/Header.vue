<template>
    <span class="header-container">
        <div class="left-header">
            <button @click="this.$emit('toggle-tutorial')" :class="{'selected': isTutorialVisible}"> Instructions </button>
            <span style="opacity: 60%">Hold<b>SHIFT</b> to draw rectangles around all scientific Figures, Tables and their correspoding Captions.</span>
        </div>
        <div class="right-header">
            <span v-if="annotationsEmpty()">Nothing found<input type="checkbox" v-model="acceptEmpty"/></span>
            <span v-if="orphansOrChildless()">Elements with no parent/child<input type="checkbox" v-model="acceptOrphans"/></span>
            <form method='post' id='mturk_form' v-bind:action="turkSubmitTo">
                <input type="hidden" name="assignmentId" :value="assignmentId">
                <input type="hidden" name="appVersion" :value="appVersion"/>
                <input type="hidden" name="secondCounter" :value="counter"/>
                <input type="hidden" name="annotations" :value="JSON.stringify(annotationStore.annotations)"/>
                <input type="submit" id="submitButton" value="Submit" :disabled="!submitEnabled()"/>
            </form>
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

    private acceptEmpty: boolean;
    private acceptOrphans: boolean;

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

    annotationsEmpty() {
        return this.annotationStore.annotations.length == 0;
    }

    orphansOrChildless() {
        return this.annotationStore.nrOrphans != 0 || this.annotationStore.freeParents.length != 0;
    }

    submitEnabled() {
        return (!this.annotationsEmpty() || this.acceptEmpty) && (!this.orphansOrChildless() || this.acceptOrphans);
    }
}

</script>

<style scoped>
    .header-container {
        display: flex;
        margin: 0;
        border: white;
        border-style: solid;
        border-width: 2px 0px 2px 0px;
        height: 2em;
        padding: 0 4px 0 0;
    }

    .left-header {
        flex-grow: 1;
    }

    .header-container div * {
        display: inline-block;
        margin-left: 4px;
        height: 100%;
        vertical-align: center;
    }

    .right-header {
        justify-content: center;
        vertical-align: center;
    }

    input[type=checkbox] {
        height: auto;
    }

</style>