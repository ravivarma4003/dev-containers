import { Router, Request, Response } from "express";
import { AuctionSystem } from "../services/AuctionSystem";

const router = Router();
const auctionSystem = new AuctionSystem();

// Add a buyer
router.post("/buyers", (req: Request, res: Response) => {
    const { name } = req.body;
    
    if (!name) {
        return res.status(400).json({ error: "Buyer name is required" });
    }
    
    const buyer = auctionSystem.addBuyer(name);
    res.status(201).json({ message: "Buyer added successfully", buyer: buyer.getName() });
});

// Add a seller
router.post("/sellers", (req: Request, res: Response) => {
    const { name } = req.body;
    
    if (!name) {
        return res.status(400).json({ error: "Seller name is required" });
    }
    
    const seller = auctionSystem.addSeller(name);
    res.status(201).json({ message: "Seller added successfully", seller: seller.getName() });
});

// Create an auction
router.post("/auctions", (req: Request, res: Response) => {
    const { id, lowestBidLimit, highestBidLimit, participationCost, seller } = req.body;
    
    if (!id || !lowestBidLimit || !highestBidLimit || !participationCost || !seller) {
        return res.status(400).json({ error: "All auction details are required" });
    }
    
    const auction = auctionSystem.createAuction(
        id,
        Number(lowestBidLimit),
        Number(highestBidLimit),
        Number(participationCost),
        seller
    );
    
    if (!auction) {
        return res.status(400).json({ error: "Failed to create auction" });
    }
    
    res.status(201).json({ 
        message: "Auction created successfully", 
        auction: {
            id: auction.getId(),
            lowestBidLimit: auction.getLowestBidLimit(),
            highestBidLimit: auction.getHighestBidLimit(),
            participationCost: auction.getParticipationCost(),
            seller: auction.getSeller().getName()
        }
    });
});

// Create a bid
router.post("/bids", (req: Request, res: Response) => {
    const { buyer, auction, amount } = req.body;
    
    if (!buyer || !auction || !amount) {
        return res.status(400).json({ error: "Buyer, auction, and amount are required" });
    }
    
    const success = auctionSystem.createBid(buyer, auction, Number(amount));
    
    if (!success) {
        return res.status(400).json({ error: "Failed to create bid" });
    }
    
    res.status(201).json({ message: "Bid created successfully" });
});

// Update a bid
router.put("/bids", (req: Request, res: Response) => {
    const { buyer, auction, amount } = req.body;
    
    if (!buyer || !auction || !amount) {
        return res.status(400).json({ error: "Buyer, auction, and amount are required" });
    }
    
    const success = auctionSystem.updateBid(buyer, auction, Number(amount));
    
    if (!success) {
        return res.status(400).json({ error: "Failed to update bid" });
    }
    
    res.status(200).json({ message: "Bid updated successfully" });
});

// Withdraw a bid
router.delete("/bids", (req: Request, res: Response) => {
    const { buyer, auction } = req.body;
    
    if (!buyer || !auction) {
        return res.status(400).json({ error: "Buyer and auction are required" });
    }
    
    const success = auctionSystem.withdrawBid(buyer, auction);
    
    if (!success) {
        return res.status(400).json({ error: "Failed to withdraw bid" });
    }
    
    res.status(200).json({ message: "Bid withdrawn successfully" });
});

// Close an auction
router.post("/auctions/:id/close", (req: Request, res: Response) => {
    const { id } = req.params;
    
    const winner = auctionSystem.closeAuction(id);
    
    if (winner) {
        const auction = auctionSystem.getAuction(id);
        res.status(200).json({ 
            message: "Auction closed successfully", 
            winner: winner.getName(),
            winningBid: auction?.getWinningBid()
        });
    } else {
        res.status(200).json({ 
            message: "Auction closed successfully", 
            winner: "No winner"
        });
    }
});

// Get profit/loss for a seller in an auction
router.get("/profit/:seller/:auction", (req: Request, res: Response) => {
    const { seller, auction } = req.params;
    
    const profit = auctionSystem.getProfit(seller, auction);
    
    if (profit === null) {
        return res.status(400).json({ error: "Failed to get profit" });
    }
    
    res.status(200).json({ 
        seller,
        auction,
        profit
    });
});

export default router;
