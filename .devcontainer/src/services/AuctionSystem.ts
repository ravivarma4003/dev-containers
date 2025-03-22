import { Auction } from "../models/Auction";
import { Buyer } from "../models/Buyer";
import { Seller } from "../models/Seller";

export class AuctionSystem {
    private buyers: Map<string, Buyer> = new Map();
    private sellers: Map<string, Seller> = new Map();
    private auctions: Map<string, Auction> = new Map();

    // Add a new buyer
    addBuyer(name: string): Buyer {
        if (this.buyers.has(name)) {
            console.log(`Buyer with name ${name} already exists.`);
            return this.buyers.get(name)!;
        }

        const buyer = new Buyer(name);
        this.buyers.set(name, buyer);
        return buyer;
    }

    // Add a new seller
    addSeller(name: string): Seller {
        if (this.sellers.has(name)) {
            console.log(`Seller with name ${name} already exists.`);
            return this.sellers.get(name)!;
        }

        const seller = new Seller(name);
        this.sellers.set(name, seller);
        return seller;
    }

    // Get a buyer by name
    getBuyer(name: string): Buyer | undefined {
        return this.buyers.get(name);
    }

    // Get a seller by name
    getSeller(name: string): Seller | undefined {
        return this.sellers.get(name);
    }

    // Get an auction by ID
    getAuction(id: string): Auction | undefined {
        return this.auctions.get(id);
    }

    // Create a new auction
    createAuction(
        id: string,
        lowestBidLimit: number,
        highestBidLimit: number,
        participationCost: number,
        sellerName: string
    ): Auction | null {
        if (this.auctions.has(id)) {
            console.log(`Auction with ID ${id} already exists.`);
            return null;
        }

        const seller = this.sellers.get(sellerName);
        if (!seller) {
            console.log(`Seller ${sellerName} not found.`);
            return null;
        }

        const auction = new Auction(
            id,
            lowestBidLimit,
            highestBidLimit,
            participationCost,
            seller
        );

        this.auctions.set(id, auction);
        return auction;
    }

    // Create or update a bid
    createBid(buyerName: string, auctionId: string, amount: number): boolean {
        const buyer = this.buyers.get(buyerName);
        if (!buyer) {
            console.log(`Buyer ${buyerName} not found.`);
            return false;
        }

        const auction = this.auctions.get(auctionId);
        if (!auction) {
            console.log(`Auction ${auctionId} not found.`);
            return false;
        }

        return auction.createBid(buyer, amount);
    }

    // Update a bid
    updateBid(buyerName: string, auctionId: string, amount: number): boolean {
        const buyer = this.buyers.get(buyerName);
        if (!buyer) {
            console.log(`Buyer ${buyerName} not found.`);
            return false;
        }

        const auction = this.auctions.get(auctionId);
        if (!auction) {
            console.log(`Auction ${auctionId} not found.`);
            return false;
        }

        return auction.updateBid(buyer, amount);
    }

    // Withdraw a bid
    withdrawBid(buyerName: string, auctionId: string): boolean {
        const buyer = this.buyers.get(buyerName);
        if (!buyer) {
            console.log(`Buyer ${buyerName} not found.`);
            return false;
        }

        const auction = this.auctions.get(auctionId);
        if (!auction) {
            console.log(`Auction ${auctionId} not found.`);
            return false;
        }

        return auction.withdrawBid(buyer);
    }

    // Close an auction and return the winning bid
    closeAuction(auctionId: string): Buyer | null {
        const auction = this.auctions.get(auctionId);
        if (!auction) {
            console.log(`Auction ${auctionId} not found.`);
            return null;
        }

        return auction.closeAuction();
    }

    // Get profit/loss for a seller in an auction
    getProfit(sellerName: string, auctionId: string): number | null {
        const seller = this.sellers.get(sellerName);
        if (!seller) {
            console.log(`Seller ${sellerName} not found.`);
            return null;
        }

        const auction = this.auctions.get(auctionId);
        if (!auction) {
            console.log(`Auction ${auctionId} not found.`);
            return null;
        }

        if (!seller.hasAuction(auctionId)) {
            console.log(`Auction ${auctionId} does not belong to seller ${sellerName}.`);
            return null;
        }

        if (!auction.getIsClosed()) {
            console.log(`Auction ${auctionId} is not closed yet.`);
            return null;
        }

        return auction.calculateProfit();
    }
}
