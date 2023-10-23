const Instagram = artifacts.require("Instagram");

contract("Instagram", (accounts) => {
  let instagram;

  beforeEach(async () => {
    instagram = await Instagram.new();
  });

  it("should upload an image", async () => {
    const receipt = await instagram.uploadImage(
      "https://example.com/image.jpg",
      "Caption",
      { from: accounts[0] }
    );
    const event = receipt.logs[0].args;
    assert.equal(event.id.toNumber(), 1);
    assert.equal(event.url, "https://example.com/image.jpg");
    assert.equal(event.description, "Caption");
    assert.equal(event.author, accounts[0]);
  });

  it("should increase the imageCount with each image upload", async () => {
    await instagram.uploadImage("https://example.com/image1.jpg", "Caption 1", {
      from: accounts[0],
    });
    await instagram.uploadImage("https://example.com/image2.jpg", "Caption 2", {
      from: accounts[1],
    });
    const count = await instagram.imageCount();
    assert.equal(count.toNumber(), 2);
  });

  //   it("should not allow zero address to upload an image", async () => {
  //     try {
  //       await instagram.uploadImage("https://example.com/image.jpg", "Caption", {
  //         from: "0x0000000000000000000000000000000000000000",
  //       });
  //       assert.fail("Expected revert not received");
  //     } catch (error) {
  //       const revertFound = error.message.search("revert") >= 0;
  //       assert(revertFound, `Expected "revert", got ${error} instead`);
  //     }
  //   });

  it("should store image data correctly", async () => {
    await instagram.uploadImage("https://example.com/image.jpg", "Caption", {
      from: accounts[0],
    });
    const image = await instagram.images(1);
    assert.equal(image.id.toNumber(), 1);
    assert.equal(image.url, "https://example.com/image.jpg");
    assert.equal(image.caption, "Caption");
    assert.equal(image.author, accounts[0]);
  });

  //   it("should set totalTipped to zero on image upload", async () => {
  //     await instagram.uploadImage("https://example.com/image.jpg", "Caption", {
  //       from: accounts[0],
  //     });
  //     const image = await instagram.images(1);
  //     assert.equal(image.totalTipped.toNumber(), 0);
  //   });

  // ... More tests as mentioned earlier ...
});
