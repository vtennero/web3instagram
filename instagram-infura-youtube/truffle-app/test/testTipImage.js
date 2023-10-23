const Instagram = artifacts.require("Instagram");

contract("Instagram", (accounts) => {
  let instance;

  beforeEach(async () => {
    instance = await Instagram.new(); // Using 'new' here so each test gets a fresh contract instance
  });

  it("should allow tipping an image", async () => {
    const imgUrl = "https://example.com/my-image.png";
    const caption = "This is a test caption";

    await instance.uploadImage(imgUrl, caption, { from: accounts[2] });

    // Tip the image
    let tipAmount = web3.utils.toWei("1", "ether");
    await instance.tipImageOwner(1, { from: accounts[1], value: tipAmount });

    // Get the updated image
    const image = await instance.images(1);

    assert.equal(
      image.totalTipped,
      tipAmount,
      "Image tip amount did not increase correctly"
    );
  });

  it("should transfer tip amount to image owner", async () => {
    const imgUrl = "https://example.com/my-image.png";
    const caption = "This is another test caption";

    await instance.uploadImage(imgUrl, caption, { from: accounts[2] });

    let initialBalance = await web3.eth.getBalance(accounts[2]);
    let tipAmount = web3.utils.toWei("1", "ether");

    await instance.tipImageOwner(1, { from: accounts[1], value: tipAmount });

    let newBalance = await web3.eth.getBalance(accounts[2]);
    assert(
      BigInt(newBalance) > BigInt(initialBalance),
      "Image owner did not receive the tip"
    );
  });

  it("should not allow the owner to tip their own image", async () => {
    const imgUrl = "https://example.com/my-image.png";
    const caption = "Yet another test caption";

    await instance.uploadImage(imgUrl, caption, { from: accounts[2] });

    try {
      await instance.tipImageOwner(1, {
        from: accounts[2],
        value: web3.utils.toWei("1", "ether"),
      });
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(error.toString().includes("revert"), error.toString());
    }
  });

  it("should not allow tipping zero amount", async () => {
    const imgUrl = "https://example.com/my-image.png";
    const caption = "Caption for the test";

    await instance.uploadImage(imgUrl, caption, { from: accounts[2] });

    try {
      await instance.tipImageOwner(1, { from: accounts[1], value: 0 });
      assert.fail("Expected revert not received");
    } catch (error) {
      assert(error.toString().includes("revert"), error.toString());
    }
  });
});
