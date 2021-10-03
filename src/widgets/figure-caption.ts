import {Annotation, AnnotationStore, classPurpose, parentPurpose} from '../components/ImageView'

export type AnnoBody = {
    "type": string,
    "value": string,
    "purpose": string
}

export default class FigCapWidget {

    constructor(
        private annotationStore: AnnotationStore
    ) {}

    public figCapWidget = (args: any) => {
        console.log('Args: ' + JSON.stringify(args));
        //console.log(args);
    
        let bodies: AnnoBody[] = args.annotation.bodies;
        let classBody = bodies.find(bod => bod.purpose == classPurpose)
        let parentBody = bodies.find(bod => bod.purpose == parentPurpose);
        let currentClass = classBody?.value;
        let currentParent = parentBody?.value;
    
        var setClass = function (evt: any) {
            if (currentClass) {
                classBody.value = evt.target.dataset.tag;
                args.onUpdateBody(currentClass, {
                    type: 'TextualBody',
                    purpose: classPurpose,
                    value: evt.target.dataset.tag
                });
                console.log(classBody)
            } else {
                args.onAppendBody({
                    type: 'TextualBody',
                    purpose: classPurpose,
                    value: evt.target.dataset.tag
                });
            }
        }

        var setParent = function (evt: any) {
            if (currentParent) {
                parentBody.value = evt.target.dataset.tag;
                args.onUpdateBody(currentParent, {
                    type: 'TextualBody',
                    purpose: parentPurpose,
                    value: evt.target.dataset.tag
                });
                console.log(classBody)
            } else {
                args.onAppendBody({
                    type: 'TextualBody',
                    purpose: parentPurpose,
                    value: evt.target.dataset.tag
                });
            }
        }
    
        var createButton = function (label: string, tag:string, type: 'class'|'parent') {
            var button = document.createElement('button');
            let current = type == 'class' ? currentClass : currentParent;

            if (tag == current)
                button.className = 'selected';
    
            button.dataset.tag = tag;
            //button.style.backgroundColor = value;
            let callBack = type == 'class' ? setClass : setParent;
            button.addEventListener('click', callBack);
            button.textContent = label;
            return button;
        }
    
        var root = document.createElement('div');
        var container = document.createElement('div');
        root.appendChild(container);
        container.className = 'fig-cap-widget';
    
        var button1 = createButton('Figure', 'Figure', 'class');
        var button2 = createButton('Table', 'Table', 'class');
        var button3 = createButton('Caption','Caption', 'class');
    
        container.appendChild(button1);
        container.appendChild(button2);
        container.appendChild(button3);
    
        if(currentClass == 'CAPTION') {
            let container3 = document.createElement('div');
            container3.className = 'fig-cap-widget'
            let container2 = document.createElement('span');
            container2.className = 'fig-cap-widget';
            container2.id = 'container2'
            container3.appendChild(container2);
            let potentialParentIDs = this.annotationStore.getFreeParentIds();
            // Show the current parent button only on the child widget
            if(currentParent && potentialParentIDs.indexOf(currentParent) == -1) {
                potentialParentIDs.push(currentParent);
            }
            for (const potentialParentId of potentialParentIDs) {
                let newButton = createButton(
                    this.annotationStore.getFriendlyName(potentialParentId),
                    potentialParentId,
                    'parent'
                );
                container2.append(newButton);
                
            }
            root.appendChild(container3);
        }
    
        return root;
    }
}

export function figCapFormatter(annotation: any) {
    var highlightBody = annotation.bodies.find(function (b: any) {
        return b.purpose == classPurpose;
    });

    if (highlightBody)
        return highlightBody.value;
}

