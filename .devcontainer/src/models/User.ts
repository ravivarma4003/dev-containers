export abstract class User {
    constructor(protected name: string) {}

    getName(): string {
        return this.name;
    }

    toString(): string {
        return this.name;
    }
}
