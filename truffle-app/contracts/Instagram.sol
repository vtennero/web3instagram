pragma solidity ^0.8.17;

contract Instagram {
	struct Image {
		uint256 id;
		string url;
		string caption;
		uint256 totalTipped;
		address payable author;
		address[] tipperAddresses;
	}

	uint256 public imageCount = 0;

	mapping(uint256 => Image) public images;

	event ImageCreated(
		uint256 id,
		string url,
		string caption,
		uint256 totalTipped,
		address payable author
	);

	event ImageTipped(
		uint256 id,
		string url,
		string caption,
		uint256 currentTip,
		uint256 totalTipped,
		address payable author
	);

	function uploadImage(string memory _imgUrl, string memory _caption) public {
		require(bytes(_imgUrl).length > 0);
		require(bytes(_caption).length > 0);
		require(msg.sender != address(0), "Invalid Wallet Address");

		imageCount++;

		images[imageCount] = Image(
			imageCount,
			_imgUrl,
			_caption,
			0,
			payable(msg.sender), //owner
			new address[](0)
		);

		emit ImageCreated(
			imageCount,
			_imgUrl,
			_caption,
			0,
			payable(msg.sender)
		);
	}

	function tipImageOwner(uint256 _id) public payable {
		Image memory _image = images[_id]; // create local copy of image

		require(_id > 0 && _id <= imageCount, "Invalid Image ID");
		require(0< msg.value, "A Tip must be greater than 0");
		require(msg.sender != _image.author, "Owner cant tip their own image");

		// transfer ether to author
		payable(address(_image.author)).transfer(msg.value);

		// Tip
		_image.totalTipped = _image.totalTipped + msg.value;
		// _image.tipperAddresses.push(msg.sender);
		images[_id] = _image;

		emit ImageTipped(
			_image.id,
			_image.url,
			_image.caption,
			msg.value,
			_image.totalTipped,
			_image.author
		);}
}
