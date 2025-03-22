import { Buyer } from "./Buyer";
import { Seller } from "./Seller";

export class Auction {
    private bids: Map<Buyer, number> = new Map();
    private isClosed: boolean = false;
    private winner: Buyer | null = null;
    private winningBid: number = 0;

    constructor(
        private id: string,
        private lowestBidLimit: number,
        private highestBidLimit: number,
        private participationCost: number,
        private seller: Seller
    ) {
        seller.addAuction(id);
    }

    getId(): string {
        return this.id;
    }

    getLowestBidLimit(): number {
        return this.lowestBidLimit;
    }

    getHighestBidLimit(): number {
        return this.highestBidLimit;
    }

    getParticipationCost(): number {
        return this.participationCost;
    }

    getSeller(): Seller {
        return this.seller;
    }

    getIsClosed(): boolean {
        return this.isClosed;
    }

    getWinner(): Buyer | null {
        return this.winner;
    }

    getWinningBid(): number {
        return this.winningBid;
    }

    getBidders(): Buyer[] {
        return Array.from(this.bids.keys());
    }

    getBidCount(): number {
        return this.bids.size;
    }

    createBid(buyer: Buyer, amount: number): boolean {
        if (this.isClosed) {
            console.log("Auction is closed. Cannot place bid.");
            return false;
        }

        if (amount < this.lowestBidLimit || amount > this.highestBidLimit) {
            console.log("Bid amount outside the limits. Cannot place bid.");
            return false;
        }

        if (!this.bids.has(buyer)) {
            buyer.participateInAuction(this.id);
        }

        this.bids.set(buyer, amount);
        return true;
    }

    updateBid(buyer: Buyer, amount: number): boolean {
        if (this.isClosed) {
            console.log("Auction is closed. Cannot update bid.");
            return false;
        }

        if (!this.bids.has(buyer)) {
            console.log("Buyer has not placed a bid yet. Cannot update.");
            return false;
        }

        if (amount < this.lowestBidLimit || amount > this.highestBidLimit) {
            console.log("Bid amount outside the limits. Cannot update bid.");
            return false;
        }

        this.bids.set(buyer, amount);
        return true;
    }

    withdrawBid(buyer: Buyer): boolean {
        if (this.isClosed) {
            console.log("Auction is closed. Cannot withdraw bid.");
            return false;
        }

        if (!this.bids.has(buyer)) {
            console.log("Buyer has not placed a bid yet. Cannot withdraw.");
            return false;
        }

        this.bids.delete(buyer);
        buyer.withdrawFromAuction(this.id);
        return true;
    }

    closeAuction(): Buyer | null {
        if (this.isClosed) {
            console.log("Auction is already closed.");
            return this.winner;
        }

        this.isClosed = true;

        // Find the highest unique bid
        const bidCounts = new Map<number, number>();
        const bidders = new Map<number, Buyer[]>();
        const preferredBidders = new Map<number, Buyer[]>();
        const nonPreferredBidders = new Map<number, Buyer[]>();

        // Count occurrences of each bid amount and track bidders
        for (const [buyer, amount] of this.bids.entries()) {
            bidCounts.set(amount, (bidCounts.get(amount) || 0) + 1);
            
            if (!bidders.has(amount)) {
                bidders.set(amount, []);
                preferredBidders.set(amount, []);
                nonPreferredBidders.set(amount, []);
            }
            
            bidders.get(amount)!.push(buyer);
            
            // Separate preferred and non-preferred bidders
            if (buyer.getIsPreferred()) {
                preferredBidders.get(amount)!.push(buyer);
            } else {
                nonPreferredBidders.get(amount)!.push(buyer);
            }
        }

        // Find unique bids (count = 1)
        const uniqueBids = Array.from(bidCounts.entries())
            .filter(([_, count]) => count === 1)
            .map(([amount, _]) => amount);

        if (uniqueBids.length > 0) {
            // If there are unique bids, find the highest one
            const highestUniqueBid = Math.max(...uniqueBids);
            this.winningBid = highestUniqueBid;
            
            // Get the buyer with the highest unique bid
            this.winner = bidders.get(highestUniqueBid)![0];
            
            return this.winner;
        }

        // BONUS: If there are no unique bids, check for preferred buyers
        // Get all bid amounts in descending order
        const allBids = Array.from(bidCounts.keys()).sort((a, b) => b - a);
        
        for (const bidAmount of allBids) {
            // Check if there's exactly one preferred buyer at this bid amount
            if (preferredBidders.get(bidAmount)!.length === 1 && nonPreferredBidders.get(bidAmount)!.length > 0) {
                // A preferred buyer wins in case of a tie
                this.winningBid = bidAmount;
                this.winner = preferredBidders.get(bidAmount)![0];
                return this.winner;
            }
            
            // If there are multiple preferred buyers or no preferred buyers at this amount,
            // continue to the next highest bid amount
        }

        console.log("No winner found based on highest unique bid or preferred buyer rules.");
        return null;
    }

    calculateProfit(): number {
        // Calculate participation revenue: number of bidders * participation cost * 0.2
        const participationRevenue = this.getBidCount() * this.participationCost * 0.2;
        
        if (!this.winner) {
            // If no winner, profit is only from participation cost
            return participationRevenue;
        }
        
        // Calculate average of bid limits
        const avgBidLimit = (this.lowestBidLimit + this.highestBidLimit) / 2;
        
        // Calculate profit/loss according to the formula:
        // profit/loss = winning auction price + participation cost-share - average of bid limits
        const profit = this.winningBid + participationRevenue - avgBidLimit;
        
        return profit;
    }
}
