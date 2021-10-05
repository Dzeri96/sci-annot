let OpenSeadragon = require('openseadragon');
let Annotorious = require('@recogito/annotorious-openseadragon');
import '@recogito/annotorious-openseadragon/dist/annotorious.min.css';
import FigCapWidget from '../widgets/figure-caption';
import { Options, Vue } from "vue-class-component";
import AnnotationStore from '@/services/annotationStore';


@Options({
    props: {
        annotationStore: AnnotationStore
    }
})
export default class ImageView extends Vue {
    annotationStore!: AnnotationStore;

    mounted() {
        let viewer = OpenSeadragon({
            id: 'imview',
            tileSources: {
                type: 'image',
                url: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg',
            },
            showNavigator: true,
            zoomPerSecond: 0,
            imageSmoothingEnabled: false,
            animationTime: 0,
            navigatorPosition: 'BOTTOM_RIGHT',
            maxZoomLevel: 10,
            showZoomControl: false,
            showFullPageControl: false
        });

        let figCapWidget = new FigCapWidget(this.annotationStore);
        let figCapWidgetFunc = figCapWidget.figCapWidget;

        let annoConfig = {
            widgets: [figCapWidgetFunc],
            formatter: figCapWidget.figCapFormatter
        }
        let anno = Annotorious(viewer, annoConfig);
        anno.setDrawingTool('rect');
        //console.log(anno.listDrawingTools());
        anno.setVisible(true)

        anno.on('createAnnotation', this.annotationStore.addAnnotation);

        anno.on('deleteAnnotation', this.annotationStore.removeAnnotation);

        anno.on('updateAnnotation', this.annotationStore.updateAnnotation);

    }
}