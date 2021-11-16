<template>
    <span class="header-container">
        <span class="left-header">
            <button @click="this.$emit('toggle-tutorial')" :class="{'selected': isTutorialVisible}"> Instructions </button>
            <span style="opacity: 60%">Hold<b>SHIFT</b> to draw rectangles around all scientific Figures, Tables and their correspoding Captions.</span>
        </span>
        <span class="right-header">
            <span v-if="annotationsEmpty()" style="vertical-align: middle">
                <span>Nothing found</span>
                <input type="checkbox" v-model="acceptEmpty"/>
            </span>
            <span v-if="orphansOrChildless()">
                <span>Elements with no parent/child</span>
                <input type="checkbox" v-model="acceptOrphans"/>
            </span>
            <form method='post' id='mturk_form' v-bind:action="turkSubmitTo">
                <input type="hidden" name="assignmentId" :value="assignmentId">
                <input type="hidden" name="appVersion" :value="appVersion"/>
                <input type="hidden" name="secondCounter" :value="counter"/>
                <input type="hidden" name="canvasHeight" :value="annotationStore.canvasHeight"/>
                <input type="hidden" name="canvasWidth" :value="annotationStore.canvasWidth"/>
                <input type="hidden" name="annotations" :value="JSON.stringify(annotationStore.annotations)"/>
                <input type="submit" id="submitButton" ref="submitButton" value="Submit" :disabled="!submitEnabled()" class="r6o-btn"/>
            </form>
            <!-- Icon made by https://www.flaticon.com/authors/muhammad-ali -->
            <button id="feedbackButton" title="Submit with feedback" :disabled="!submitEnabled()" @click="showModal = true" class="r6o-btn">
                <img src="../assets/feedback.png" alt="Feedback"/>
            </button>
            <transition name="modal">
                <feedback-popup v-if="showModal" @close="showModal=false" @submit="submitForm()">
                </feedback-popup>
            </transition>
        </span>
    </span>
</template>

<script lang="ts">
import AnnotationStore from '@/services/annotationStore';
import FeedbackPopup from './FeedbackPopup.vue';
import { Options, Vue } from "vue-class-component";
import { Prop } from 'vue-property-decorator';

@Options({
    components: {
        FeedbackPopup
    }
})
export default class AppHeader extends Vue {
    @Prop()
    private annotationStore: AnnotationStore;
    @Prop()
    private isTutorialVisible: boolean;
    @Prop()
    private isImageLoaded: boolean;

    private counter = 0;
    private urlParams = new URLSearchParams(window.location.search);
    // Injected from package.json
    private appVersion = process.env.VUE_APP_VERSION;
    // Placeholder value for the MTurk assignment id
    private assignmentId = 'ASSIGNMENT_ID_NOT_AVAILABLE';
    // Placeholder value for the MTurk submit link
    private turkSubmitTo = 'https://webhook.site/9c353bcf-91aa-4d88-96f3-93c351b9562f';
    

    private acceptEmpty: boolean = false;
    private acceptOrphans: boolean = false;
    private showModal = false;

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
        if (submitParam) {
            this.turkSubmitTo = submitParam + '/mturk/externalSubmit';
        }
    }

    annotationsEmpty() {
        return this.annotationStore.annotations.length == 0;
    }

    orphansOrChildless() {
        return this.annotationStore.nrOrphans != 0 || this.annotationStore.freeParents.length != 0;
    }

    submitEnabled() {
        return this.assignmentId != 'ASSIGNMENT_ID_NOT_AVAILABLE'
        && this.isImageLoaded
        && (!this.annotationsEmpty() || this.acceptEmpty)
        && (!this.orphansOrChildless() || this.acceptOrphans);
    }

    submitForm() {
        (this.$refs.submitButton as any).click();
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

    .header-container span * {
        display: inline-block;
        margin-left: 4px;
        vertical-align: middle;
    }

    .right-header {
        vertical-align: middle;
        height: 100%;
    }

    input[type=checkbox]{
        height: auto;
    }

    img {
        margin: 0;
        padding: 0;
        height: 80%;
        filter: brightness(0) invert(1);
    }

    #feedbackButton {
        border-left: hidden;
        padding: 0 2px 2px 0;
        margin-left: 0;
        border-radius: 0 5px 5px 0;
        height: 100%;
        min-width: 0;
        border-left: 1px solid rgb(110, 171, 233)
    }

    #submitButton {
        border-radius: 5px 0 0 5px;
        height: 100%;
        vertical-align: top;   
    }

    form {
        height: 100%;
    }

</style>