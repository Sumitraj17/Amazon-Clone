const { expect } = require("chai");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const ID = 1;
const NAME = "Shoes";
const CATEGORY = "Clothing";
const IMAGE = "URL";
const COST = tokens(1);
const RATING = 4;
const STOCK = 5;

describe("Dappazon", () => {
  beforeEach(async () => {
    [deployer, buyer] = await ethers.getSigners();

    const Dappazon = await ethers.getContractFactory("Dappazon");
    dappazon = await Dappazon.deploy();
  });

  describe("Deployment", () => {
    it("Sets the owner", async () => {
      expect(await dappazon.owner()).to.equal(deployer.address);
    });
  });

  describe("Listing", () => {
    let transaction;

    beforeEach(async () => {
      transaction = await dappazon
        .connect(deployer)
        .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);

      await transaction.wait();
    });
    it("Return Item attributes", async () => {
      const items = await dappazon.items(1);
      expect(await items.id).to.equal(ID);
    });

    it("Emit event",async()=>{
      expect(transaction).to.emit(dappazon,"List");
    })
  });

  describe("Buying", async ()=>{
    let transaction;

    beforeEach(async()=>{
      transaction = await dappazon
        .connect(deployer)
        .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);

      await transaction.wait();

      transaction = await dappazon.connect(buyer).buy(ID,{ value:COST})
    })
    it("Update the Balance",async()=>{
      const res = await ethers.provider.getBalance(dappazon.address)
      console.log(res);
      expect(res).to.equal(COST);
    })
  })
});
