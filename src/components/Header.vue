<template>
    <span v-if="!assignment" class="header-container">
        <span class="left-header">
            <button @click="toggleTutorial" :class="{'selected': isTutorialVisible, 'not-seen': !tutorialSeen}"> Instructions </button>
            <span style="opacity: 60%; margin-left: 1em">Hold<b>SHIFT</b> to draw rectangles around all scientific Figures, Tables and their correspoding Captions.</span>
        </span>
        <tutorial-tooltip v-if="!tutorialSeen"/>
        <span class="right-header">
            <span v-if="annotationsEmpty()" style="vertical-align: middle">
                <span>Nothing found</span>
                <input type="checkbox" v-model="acceptEmpty"/>
            </span>
            <span v-if="orphansOrChildless()">
                <span>Elements without reference/caption</span>
                <input type="checkbox" v-model="acceptOrphans"/>
            </span>
            <form method='post' id='mturk_form' v-bind:action="turkSubmitTo">
                <input type="hidden" name="assignmentId" :value="assignmentId">
                <input type="hidden" name="appVersion" :value="appVersion"/>
                <input type="hidden" name="secondCounter" :value="counter"/>
                <input type="hidden" name="canvasHeight" :value="annotationStore.canvasHeight"/>
                <input type="hidden" name="canvasWidth" :value="annotationStore.canvasWidth"/>
                <input type="hidden" name="annotations" :value="JSON.stringify(annotationStore.annotations)"/>
                <input v-if="comment" type="hidden" name="comment" :value="comment"/>
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
    <!-- Review mode -->
    <span v-else>
        <b>ID:</b> {{assignment.assignment_id}} <b>AppVersion:</b> {{assignment.answer.appVersion}} <b>Time:</b> {{assignment.answer.secondCounter}}s
        <span v-if="assignment.answer.comment"><b>Comment:</b> {{assignment.answer.comment}}</span>
    </span>
</template>

<script lang="ts">
import AnnotationStore from '@/services/annotationStore';
import FeedbackPopup from './FeedbackPopup.vue';
import { Options, Vue } from "vue-class-component";
import { Prop } from 'vue-property-decorator';
import TutorialTooltip from './TutorialTooltip.vue';

@Options({
    components: {
        FeedbackPopup,
        TutorialTooltip
    }
})
export default class AppHeader extends Vue {
    @Prop()
    private annotationStore: AnnotationStore;
    @Prop()
    private isTutorialVisible: boolean;
    @Prop()
    private isImageLoaded: boolean;
    @Prop()
    private assignment: any;

    private counter = 0;
    private urlParams = new URLSearchParams(window.location.search);
    // Injected from package.json
    private appVersion = process.env.VUE_APP_VERSION;
    private SEEN_TUTORIAL_KEY = `${this.appVersion}_seenTutorial`;
    // Placeholder value for the MTurk assignment id
    private assignmentId = 'ASSIGNMENT_ID_NOT_AVAILABLE';
    // Placeholder value for the MTurk submit link
    private turkSubmitTo = 'https://webhook.site/9c353bcf-91aa-4d88-96f3-93c351b9562f';
    // Parsed from query params, if it exists
    private comment = '';
    
    private acceptEmpty: boolean = false;
    private acceptOrphans: boolean = false;
    private showModal = false;
    private tutorialSeen = false;

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
        //if (this.assignmentId == 'ASSIGNMENT_ID_NOT_AVAILABLE') this.$emit('toggle-tutorial');
        this.tutorialSeen = !!localStorage.getItem(this.SEEN_TUTORIAL_KEY);

        // Get submit link from URL params
        let submitParam = this.urlParams.get('turkSubmitTo');
        if (submitParam) {
            this.turkSubmitTo = submitParam + '/mturk/externalSubmit';
        }

        let commentParam = this.urlParams.get('comment');
        if (commentParam) this.comment = commentParam;
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

    toggleTutorial() {
        this.$emit('toggle-tutorial');
        localStorage.setItem(this.SEEN_TUTORIAL_KEY, 'true');
        this.tutorialSeen = true;
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
        position: relative;
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
        -webkit-box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.2); 
        box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.2);
    }

    form {
        height: 100%;
    }

    .not-seen {
        box-shadow: 0 0 0 rgba(163,193,225, 0.4);
        animation: pulse 1s infinite;
    }

    @keyframes pulse {
        0% {
            -moz-box-shadow: 0 0 0 0 rgba(163,193,225, 0.9);
            box-shadow: 0 0 0 0 rgba(163,193,225, 0.9);
            background-color: rgba(163,193,225, 0.9);
        }
        40% {
            background-color: rgba(163,193,225, 0.2);
        }
        90% {
            -moz-box-shadow: 0 0 10px 30px rgba(163,193,225, 0);
            box-shadow: 0 0 10px 30px rgba(163,193,225, 0);
            background-color: rgba(163,193,225, 0);
            
        }
        100% {
            -moz-box-shadow: 0 0 0 0 rgba(163,193,225, 0);
            box-shadow: 0 0 0 0 rgba(163,193,225, 0);
            background-color: rgba(163,193,225, 0);
        }
    }

</style>