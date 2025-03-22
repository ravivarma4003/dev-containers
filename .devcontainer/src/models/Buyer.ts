import { User } from "./User";

export class Buyer extends User {
    private participatedAuctions: Set<string> = new Set();
    private isPreferred: boolean = false;

    constructor(name: string) {
        super(name);
    }

    participateInAuction(auctionId: string): void {
        this.participatedAuctions.add(auctionId);
        if (this.participatedAuctions.size > 2) {
            this.isPreferred = true;
        }
    }

    getIsPreferred(): boolean {
        return this.isPreferred;
    }

    withdrawFromAuction(auctionId: string): void {
        this.participatedAuctions.delete(auctionId);
    }
}
