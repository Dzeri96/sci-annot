import { AnnoBody } from "@/widgets/figure-caption";

export const classPurpose = 'img-cap-enum';
export const parentPurpose = 'parent'

export type Annotation = {
    type: string,
    body: AnnoBody[],
    target: {
        source: string,
        confirmsTo: string,
        value: string
    },
    "@context": string,
    id: string,
    opts: any
}

export class TwoWayMap {
    private reverseMap: { [key: string]: string };

    constructor(
        private map: { [key: string]: string }
    ) {
        this.reverseMap = {};
        for (const [key, value] of Object.values(map)) {
            this.reverseMap[value] = key;
        }
    }

    public get(key: string): string { return this.map[key]; }

    public revGet(key: string): string { return this.reverseMap[key]; }

    /**
     * Ensures that revGet() is an inverse function of get(),
     * meaning that there will never be a dangling pointer on either side,
     * or multiple occurrences of the same value per side. 
     * @param side1 
     * @param side2 
     */
    public set(side1: string, side2: string) {
        let oldSide2 = this.map[side1];
        // Delete the old side2
        if (oldSide2) {
            delete this.reverseMap[oldSide2];
        }

        let currentSide2 = this.reverseMap[side2];
        // Delete side1 that current side2 pointed to
        if (currentSide2) {
            delete this.map[this.reverseMap[currentSide2]];
        }

        this.map[side1] = side2;
        this.reverseMap[side2] = side1;
    }

    public unset(side1: string) {
        let side2 = this.map[side1];
        if (side2) {
            delete this.reverseMap[side2];
            delete this.map[side1];
        }
    }

    public revUnset(side2: string) {
        let side1 = this.reverseMap[side2];
        if (side1) {
            delete this.reverseMap[side2];
            delete this.map[side1];
        }
    }
}

export default class AnnotationStore {
    public annotations: Annotation[];
    // Map has form friendlyName <=> ID
    private friendlyIdMap: TwoWayMap;
    private indexParentMap: Map<string, number>;
    private freeParents: string[];

    constructor(
        private parentTypes: string[],
        private childTypes: string[]
    ) {
        this.annotations = [];
        this.friendlyIdMap = new TwoWayMap({});
        this.indexParentMap = new Map();
        this.freeParents = [];
        for (const className of [...this.parentTypes, ...this.childTypes]) {
            this.indexParentMap.set(className, 1);
        }
    }

    public getFriendlyName(id: string): string {
        let friendlyName = this.friendlyIdMap.revGet(id);
        if (friendlyName) {
            return friendlyName;
        } else {
            console.log(`Friendly name for id ${id} does not exist!`);
            return undefined;
        }
    }

    public generateFriendlyName(className: string): string {
        return className + ' ' + this.indexParentMap.get(className);
    }

    public getFreeParentIds(): string[] {
        return this.freeParents;
    }

    public getFreeParentsFriendly(): string[] {
        let resultArray = [];
        for (const parentId of this.freeParents) {
            let friendlyName = this.friendlyIdMap.revGet(parentId);
            if (friendlyName) {
                resultArray.push(friendlyName);
            } else {
                throw `ID ${parentId} has no friendly name!`;
            }
        }
        return resultArray;
    }

    public getAnnotationClass(anno: Annotation): string {
        let classBody = anno.body.find(bod => bod.purpose == classPurpose);
        if (classBody) {
            return classBody.value;
        } else {
            return undefined;
        }
    }

    private getAnnotationParentId(anno: Annotation): string {
        let parentBody = anno.body.find(bod => bod.purpose == parentPurpose);
        if (parentBody) {
            return parentBody.value;
        } else {
            // TODO: Maybe add orphan check
            console.log('Added child without parent!');
        }
    }

    public assignChildById(parentId: string) {
        let foundIndex = this.freeParents.indexOf(parentId);
        if (foundIndex != -1) {
            this.freeParents.splice(foundIndex, 1);
        } else {
            throw `Parent with id ${parentId} already has a child!`;
        }
    }

    public releaseChildById(parentId: string) {
        let foundIndex = this.freeParents.indexOf(parentId);
        if (foundIndex != -1) {
            this.freeParents.push(parentId);
        }
    }

    private refreshFreeParents() {
        let foundParents = [];
        let takenParents = new Set();

        for (const currAnno of this.annotations) {
            let currClass = this.getAnnotationClass(currAnno);
            if (this.parentTypes.indexOf(currClass) != -1) {
                foundParents.push(currAnno.id);
            } else {
                let parentId = this.getAnnotationParentId(currAnno);
                if (parentId) takenParents.add(parentId);
            }
        }

        this.freeParents = foundParents.filter(id => !takenParents.has(id));
    }

    public addAnnotation = (anno: Annotation) => {
        console.log(`Adding annotation ${anno.id}`);
        let annoClass = this.getAnnotationClass(anno);
        // Annotation has one of the parent classes.
        if (this.parentTypes.indexOf(annoClass) != -1) {
            this.freeParents.push(anno.id);
        } else {
            let parentId = this.getAnnotationParentId(anno);
            if (parentId) {
                this.assignChildById(parentId);
            }
        }

        let currentIndex = this.indexParentMap.get(annoClass);
        this.indexParentMap.set(annoClass, currentIndex + 1);
        let friendlyName = annoClass + ' ' + currentIndex;
        this.friendlyIdMap.set(friendlyName, anno.id);

        this.annotations.push(anno);
    }

    public removeAnnotation = (anno: Annotation) => {
        console.log(`Removing annotation ${anno.id}`);
        // Annotation has one of the parent classes
        let annoClass = this.getAnnotationClass(anno);
        if (this.parentTypes.indexOf(annoClass) != -1) {
            let parentIndex = this.freeParents.indexOf(anno.id);
            // Parent was free, remove it from the list
            if (parentIndex != -1) {
                this.freeParents.splice(parentIndex, 1);
            // Otherwise, find the child and remove its parent reference
            } else {
                for (const existingAnno of this.annotations) {
                    let indexToRemove = existingAnno.body.findIndex(
                        bod => {
                            return bod.purpose == parentPurpose && bod.value == anno.id
                        }
                    );
                    console.log(`Index: ${indexToRemove}`);
                    if (indexToRemove != -1) {
                        console.log(`Removing parent ref with index ${indexToRemove}`);
                        existingAnno.body.splice(indexToRemove, 1);
                    }
                }
            }
            // Annotation has one of the child classes
        } else {
            let parentBody = anno.body.find(bod => bod.purpose == parentPurpose);
            if (parentBody) {
                this.freeParents.push(parentBody.value);
            }
        }

        let indexToRemove = this.annotations.findIndex(ann => ann.id == anno.id);
        if (indexToRemove != -1) {
            this.annotations.splice(indexToRemove, 1);
        }
    }

    public updateAnnotation = (anno: Annotation) => {
        console.log(`Updating annotation ${anno.id}`);
        this.refreshFreeParents();
    }
}