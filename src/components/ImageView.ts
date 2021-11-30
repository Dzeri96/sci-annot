let OpenSeadragon = require('openseadragon');
let Annotorious = require('@dzeri96/annotorious-openseadragon');
let placeholderPic = require('../assets/96d834586a304382bd623f81b83e3b62-09.webp');
import '@dzeri96/annotorious-openseadragon/dist/annotorious.min.css';
import FigCapWidget from '../widgets/figure-caption';
import { Options, Vue } from "vue-class-component";
import AnnotationStore from '@/services/annotationStore';
import Answer from '../models/Answer';
import ScrollEdges from './ScrollEdges.vue';


@Options({
    props: {
        annotationStore: AnnotationStore,
        answer: Answer
    },
    components: {
        ScrollEdges
    }
})
export default class ImageView extends Vue {
    private annotationStore!: AnnotationStore;
    private answer: Answer;
    private anno;
    private imLoaded = false;

    private pointerActive = true;
    private shiftButtonHeld = false;
    private middleMouseHeld = false;
    private editorOpen = false;
    private cursorInsideCanvas = true;

    // Used to update crosshair guide locations
    private hLineY = 50;
    private vLineX = 50;
    private imView: Element;
    private urlParams = new URLSearchParams(window.location.search);
    private widgetFocusObserver = new MutationObserver(this.focusWidget);
    private percentScroll = 0.01;
    private viewer;
    private currentlyDrawing = false;

    private handleEditorOpen = (mutationsList, observer) => {
        if(mutationsList && mutationsList[0].addedNodes.length) {
            let widget = document.getElementById('fig-cap-widget');
            widget.focus();

            let widgetFrame = document.getElementsByClassName('r6o-editor')[0];
            // Creates a change listener on the widget to keep it in focus
            this.widgetFocusObserver.observe(widgetFrame, {attributes: true, childList: false});
        }
    }

    private focusWidget(mutationsList, observer) {
        let widget = document.getElementById('fig-cap-widget');
            widget.focus();
    }

    mounted() {
        this.imView = this.$refs.imview as Element;
        let handleEditorOpenOrClosed = (mutationsList, observer) => {
            if(mutationsList && mutationsList[0].addedNodes.length) {
                this.editorOpen = true;
                let widget = document.getElementById('fig-cap-widget');
                widget.focus();
                this.changePointerState(false);
    
                let widgetFrame = document.getElementsByClassName('r6o-editor')[0];
                // Creates a change listener on the widget to keep it in focus
                this.widgetFocusObserver.observe(widgetFrame, {attributes: true, childList: false});
            } else if (mutationsList && mutationsList[0].removedNodes.length && !this.shiftButtonHeld) {
                this.editorOpen = false;
                this.changePointerState(true);
            }
        }

        let widgetOpenObserver = new MutationObserver(handleEditorOpenOrClosed);

        let imageUrl = this.urlParams.get('image') ?? placeholderPic;
        // Reference: https://openseadragon.github.io/docs/OpenSeadragon.html
        this.viewer = OpenSeadragon({
            id: 'imview',
            tileSources: {
                type: 'image',
                url: imageUrl,
                success: (obj) => {
                    this.imLoaded = true;
                    this.annotationStore.canvasHeight = obj.tileSource.height;
                    this.annotationStore.canvasWidth = obj.tileSource.width;
                    this.$emit('image-loaded');
                }
            },
            showNavigator: true,
            zoomPerSecond: 0,
            imageSmoothingEnabled: false,
            animationTime: 0,
            navigatorPosition: 'BOTTOM_RIGHT',
            maxZoomLevel: 10,
            minZoomImageRatio: 0.5,
            showZoomControl: false,
            showFullPageControl: false,
            showHomeControl: false,
            navigatorSizeRatio: 0.15,
            gestureSettingsMouse: {
                clickToZoom: false
            }
        });

        this.viewer.addHandler('open-failed', () => {
            this.imLoaded = true;
        })

        let dragPosition;
        this.viewer.addHandler('canvas-nonprimary-press', (e) => {
            if(e.button == 1) {
                dragPosition = e.position.clone();
                this.middleMouseHeld = true;
                this.changePointerState(false);
            }
        });

        this.viewer.addHandler('canvas-nonprimary-release', (e) => {
            if(e.button == 1) {
                this.middleMouseHeld = false;
                this.changePointerState(true);
            }
        });

        new OpenSeadragon.MouseTracker({
            element: this.viewer.canvas,
            moveHandler: (event) => {
                if (this.middleMouseHeld) {
                    var delta = event.position.minus(dragPosition);
                    this.viewer.viewport.panBy(this.viewer.viewport.deltaPointsFromPixels(delta.negate()));
                    dragPosition = event.position.clone();
                }
            }
        });

        let figCapWidget = new FigCapWidget(this.annotationStore);
        let figCapWidgetFunc = figCapWidget.figCapWidget;

        let annoConfig = {
            widgets: [
                {widget: figCapWidgetFunc, force: 'plainjs'}
            ],
            formatter: figCapWidget.figCapFormatter,
            invertDrawingMode: true
        }
        this.anno = Annotorious(this.viewer, annoConfig);
        this.anno.setDrawingTool('rect');
        this.anno.setVisible(true);
        
        this.imView.addEventListener('mouseenter', (evt) => {
            this.cursorInsideCanvas = true;
            this.changePointerState(true);
        });

        this.imView.addEventListener('mouseleave', (evt) => {
            this.cursorInsideCanvas = false;
            this.changePointerState(false);
        })
        widgetOpenObserver.observe(this.imView.childNodes[5], {attributes: false, childList: true});

        this.anno.on('createAnnotation', (annot) => {
            this.annotationStore.addAnnotation(annot);
            this.reRenderAnnotations();
        });

        this.anno.on('deleteAnnotation', (annot) => {
            this.annotationStore.removeAnnotation(annot);
            this.reRenderAnnotations();
        });

        this.anno.on('updateAnnotation', (annot, oldAnnot) => {
            this.annotationStore.updateAnnotation(annot);
            this.reRenderAnnotations();
        });

        this.anno.on('startSelection', () => {
            this.currentlyDrawing = true;
            this.changePointerState(false);
        });

        this.anno.on('endSelection', () => {
            // Dirty hack to allow for the widget to draw with proper coordinates 
            setTimeout(() => {
                this.currentlyDrawing = false;
                this.changePointerState(true);
            }, 10);
        });

        this.anno.on('createSelection', () => {
            this.currentlyDrawing = false;
            this.changePointerState(true);
        });

        if (this.answer) {
            for (const annotation of this.answer.annotations) {
                this.annotationStore.addAnnotation(annotation);
            }
            this.reRenderAnnotations();
        }
        
        if (this.pointerActive) this.imView.addEventListener('mousemove', this.updateGuideLocation);

        document.addEventListener('mousemove', this.updateGuideLocation);
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if(event.key == 'Shift') {
                this.shiftButtonHeld = true;
                this.changePointerState(false);
            } else if (event.code == 'Space') {
                let widgetFooterArray = document.getElementsByClassName('r6o-footer');
                if (widgetFooterArray.length) {
                    // The number of buttons changes - always get the last one
                    let lastIndex = widgetFooterArray[0].childNodes.length - 1;
                    let okButton = widgetFooterArray[0].childNodes[lastIndex] as HTMLButtonElement;
                    okButton.click();
                } 
            }
        });

        document.addEventListener('keyup', (event: KeyboardEvent) => {
            if(event.key == 'Shift') {
                this.shiftButtonHeld = false;
                this.changePointerState(true);
            }
        });

        //(document.getElementById('contentDiv').querySelector('.openseadragon-canvas') as any).focus();
    }

    /**
     * Refresh the annotations shown on screen
     */
    reRenderAnnotations() {
        this.anno.setAnnotations(this.annotationStore.annotations);
    }

    private updateGuideLocation(e) {
        // @ts-ignore
        var rect = this.imView.getBoundingClientRect();
        this.vLineX = Math.max(e.clientX-2 - rect.left, 0);
        this.hLineY = Math.max(e.clientY-2 - rect.top, 0);
    }

    private changePointerState(newState: boolean) {
        this.pointerActive = 
            newState &&
            !this.editorOpen &&
            !this.shiftButtonHeld &&
            !this.middleMouseHeld &&
            this.cursorInsideCanvas &&
            !this.currentlyDrawing;

        if(!this.pointerActive) {
            this.imView.removeEventListener('mousemove', this.updateGuideLocation);
        } else {
            this.imView.addEventListener('mousemove', this.updateGuideLocation);
        }
    }
    
    private scroll(activeSides: string[]) {
        if(this.currentlyDrawing) {
            let xDelta = 0;
            let yDelta = 0;

            if (activeSides.includes('left-edge')) xDelta += -this.percentScroll;
            if (activeSides.includes('top-edge')) yDelta += -this.percentScroll;
            if (activeSides.includes('right-edge')) xDelta += this.percentScroll;
            if (activeSides.includes('bottom-edge')) yDelta += this.percentScroll;

            this.viewer.viewport.panBy(new OpenSeadragon.Point(xDelta, yDelta), false);
        }
    }

    private mouseEnter() {
        // @ts-ignore
        if(this.$refs.scrollEdges) this.$refs.scrollEdges.frameEnter();
    }

    private mouseLeave() {
        // @ts-ignore
        if(this.$refs.scrollEdges) this.$refs.scrollEdges.frameLeave();
    }
}