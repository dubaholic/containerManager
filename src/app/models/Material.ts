export class Material {
    id: number;
    name: string;
    amount: number;
    client: string;
    positionX: number;
    positionY: number;
    
    constructor() { }
    get materialId(): number {return this.id; }
    get materialName(): string {return this.name; }
    get materialAmount(): string {return this.materialAmount; }
    get clientName(): string {return this.client; }
    get position(): number {return this.position; }
    set updatePositionX(positionX: number) {this.positionX = positionX;}
}