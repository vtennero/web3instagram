const Campaign = artifacts.require("Instagram");

contract("Instagram", (accounts) => {
  it("should deploy the contract", async () => {
    const instance = await Campaign.deployed();
    assert(instance.address !== "");
  });

  // Add more tests as needed
});
