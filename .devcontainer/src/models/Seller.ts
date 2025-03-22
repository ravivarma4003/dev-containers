import { User } from "./User";

export class Seller extends User {
    private auctions: Set<string> = new Set();

    constructor(name: string) {
        super(name);
    }

    addAuction(auctionId: string): void {
        this.auctions.add(auctionId);
    }

    hasAuction(auctionId: string): boolean {
        return this.auctions.has(auctionId);
    }
}
