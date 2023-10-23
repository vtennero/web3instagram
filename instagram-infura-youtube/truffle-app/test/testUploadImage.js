const Instagram = artifacts.require("Instagram");

contract("Instagram", (accounts) => {
  let instance;

  before(async () => {
    instance = await Instagram.deployed();
  });

  it("should upload an image", async () => {
    // Assuming the imageCount starts at 0.
    const initialImageCount = await instance.imageCount();
    assert.equal(
      initialImageCount.toNumber(),
      0,
      "Initial image count should be 0"
    );

    // Upload image
    const imgUrl = "https://example.com/my-image.png";
    const caption = "This is a test caption";
    await instance.uploadImage(imgUrl, caption, { from: accounts[0] });

    // Check if imageCount has increased
    const newImageCount = await instance.imageCount();
    assert.equal(newImageCount.toNumber(), 1, "Image count did not increase");

    // Retrieve the uploaded image from the contract
    const image = await instance.images(newImageCount);
    assert.equal(image.id.toNumber(), 1, "Image ID is incorrect");
    assert.equal(image.url, imgUrl, "Image URL is incorrect");
    assert.equal(image.caption, caption, "Image caption is incorrect");
    assert.equal(
      image.totalTipped.toNumber(),
      0,
      "Image tip amount is incorrect"
    );
    assert.equal(image.author, accounts[0], "Image author is incorrect");
  });

  // Additional tests to consider:
  // - What happens if _imgUrl is empty?
  // - What happens if _caption is empty?
  // - What happens if the function is called from the zero address?
});
