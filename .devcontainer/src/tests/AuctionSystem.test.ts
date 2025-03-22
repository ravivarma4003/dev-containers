import { AuctionSystem } from "../services/AuctionSystem";

describe("AuctionSystem", () => {
    let auctionSystem: AuctionSystem;

    beforeEach(() => {
        auctionSystem = new AuctionSystem();
    });

    test("Test Case 1", () => {
        // ADD_BUYER("buyer1")
        const buyer1 = auctionSystem.addBuyer("buyer1");
        expect(buyer1).toBeDefined();
        expect(buyer1.getName()).toBe("buyer1");

        // ADD_BUYER("buyer2")
        const buyer2 = auctionSystem.addBuyer("buyer2");
        expect(buyer2).toBeDefined();
        expect(buyer2.getName()).toBe("buyer2");

        // ADD_BUYER("buyer3")
        const buyer3 = auctionSystem.addBuyer("buyer3");
        expect(buyer3).toBeDefined();
        expect(buyer3.getName()).toBe("buyer3");

        // ADD_SELLER("seller1")
        const seller1 = auctionSystem.addSeller("seller1");
        expect(seller1).toBeDefined();
        expect(seller1.getName()).toBe("seller1");

        // CREATE_AUCTION ("A1", "10", "50", "1", "seller1")
        const auction = auctionSystem.createAuction("A1", 10, 50, 1, "seller1");
        expect(auction).toBeDefined();
        expect(auction?.getId()).toBe("A1");
        expect(auction?.getLowestBidLimit()).toBe(10);
        expect(auction?.getHighestBidLimit()).toBe(50);
        expect(auction?.getParticipationCost()).toBe(1);
        expect(auction?.getSeller().getName()).toBe("seller1");

        // CREATE_BID("buyer1", "A1", "17")
        const bid1 = auctionSystem.createBid("buyer1", "A1", 17);
        expect(bid1).toBe(true);

        // CREATE_BID("buyer2", "A1", "15")
        const bid2 = auctionSystem.createBid("buyer2", "A1", 15);
        expect(bid2).toBe(true);

        // UPDATE_BID("buyer2", "A1", "19")
        const updateBid = auctionSystem.updateBid("buyer2", "A1", 19);
        expect(updateBid).toBe(true);

        // CREATE_BID("buyer3", "A1", "19")
        const bid3 = auctionSystem.createBid("buyer3", "A1", 19);
        expect(bid3).toBe(true);

        // CLOSE_AUCTION("A1") // Should give Buyer1 as winner
        const winner = auctionSystem.closeAuction("A1");
        expect(winner).toBeDefined();
        expect(winner?.getName()).toBe("buyer1");

        // GET_PROFIT("seller1", "A1") // (17 + (3 * 0.2 * 1) - 30) = -12.4
        const profit = auctionSystem.getProfit("seller1", "A1");
        expect(profit).toBeCloseTo(-12.4, 1);
    });

    test("Preferred Buyer Bonus", () => {
        // Setup sellers and auctions
        auctionSystem.addSeller("seller1");
        auctionSystem.createAuction("A1", 10, 100, 1, "seller1");
        auctionSystem.createAuction("A2", 10, 100, 1, "seller1");
        auctionSystem.createAuction("A3", 10, 100, 1, "seller1");
        
        // Create buyers
        const buyer1 = auctionSystem.addBuyer("buyer1");
        const buyer2 = auctionSystem.addBuyer("buyer2");
        
        // Make buyer1 a preferred buyer by participating in 3 auctions
        auctionSystem.createBid("buyer1", "A1", 50);
        auctionSystem.createBid("buyer1", "A2", 60);
        auctionSystem.createBid("buyer1", "A3", 70);
        
        // Verify buyer1 is now a preferred buyer
        expect(buyer1.getIsPreferred()).toBe(true);
        
        // Create a new auction with a tie between a preferred and non-preferred buyer
        auctionSystem.createAuction("A4", 10, 100, 1, "seller1");
        
        // Both buyers bid the same amount
        auctionSystem.createBid("buyer1", "A4", 80); // preferred buyer
        auctionSystem.createBid("buyer2", "A4", 80); // non-preferred buyer
        
        // Close the auction - the preferred buyer should win
        const winner = auctionSystem.closeAuction("A4");
        
        // Since both bids are the same and not unique, the highest unique bid logic
        // would normally result in no winner. But with the bonus implementation,
        // the preferred buyer should win in case of a tie.
        
        // The preferred buyer should win
        expect(winner).not.toBeNull();
        expect(winner?.getName()).toBe("buyer1");
    });
});
