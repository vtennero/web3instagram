import { createContext, useContext, useState, useEffect } from "react";
import { address, createContract } from "../utils/constants";
import { useAccount } from "wagmi";
import truncateEthAddress from "truncate-eth-address";
import { toast } from "react-toastify";
import Web3 from "web3";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [userAddress, setUserAddress] = useState("");

  const { address } = useAccount();

  useEffect(() => {
    getAllImages();
  }, []);

  useEffect(() => {
    if (!address) return;

    setUserAddress(truncateEthAddress(address));
  }, [address]);

  const getAllImages = async () => {
    console.log("getting images");
    const contract = createContract();
    const imageCount = await contract.methods.imageCount().call();
    console.log("ImageCount: ");
    console.log(imageCount);

    let newPosts = [];
    for (let index = 1; index <= imageCount; index++) {
      const image = await contract.methods.images(index).call();
      console.log("image.url");
      console.log(image.url);

      newPosts.push({
        id: image.id,
        url: image.url,
        caption: image.caption,
        totalTipped: image.totalTipped,
        author: image.author,
      });
    }

    setPosts(newPosts.reverse());
  };
  const uploadImage = async (imgUrl, caption) => {
    if (!address) return;
    const contract = createContract();
    console.log("Context JS: upload image");
    console.log(imgUrl);
    console.log(caption);
    console.log(address);
    console.log(
      "address should be: 0xE0C22D1E25FE30165190851eF58B3896a1208E2f"
    );
    const data = contract.methods.uploadImage(imgUrl, caption).send({
      from: address,
      gas: 3000000,
    });
    console.log("data");
    console.log(data);

    await toast.promise(data, {
      pending: "Uploading image... This can take a minute ⏳",
      success: "Image uploaded successfully! 🎉",
      error: "Something went wrong. Please try again later.",
    });

    getAllImages();
  };

  const tipOwner = async (imageId) => {
    const { ethereum } = window;
    if (ethereum) {
      const contract = createContract();
      const amount = Web3.utils.toWei("0.01", "ether");

      const tx = contract.methods.tipImageOwner(imageId).send({
        from: address,
        gas: 3000000,
        value: amount,
        gasLimit: null,
      });

      toast.promise(tx, {
        pending: "Sending tip... 🤑",
        success: "Tip sent! 💸",
        error: "Error sending tip 😢",
      });
    }
  };

  // const tipOwner = async (imageId) => {
  //   const { ethereum } = window;

  //   if (ethereum) {
  //     const contract = createContract();
  //     const amount = Web3.utils.toWei("0.01", "ether");

  //     try {
  //       const tx = contract.methods.tipImageOwner(imageId).send({
  //         from: address,
  //         gas: 3000000,
  //         value: amount,
  //         gasLimit: null,
  //       });

  //       toast.promise(tx, {
  //         pending: "Tipping This can take a minute ⏳",
  //         success: "Tip successful! 🎉",
  //         error: "Something went wrong. Please try again later.",
  //       });
  //     } catch (error) {
  //       console.log(error.messsage);
  //     }
  //   }
  // };
  return (
    <AppContext.Provider value={{ userAddress, posts, uploadImage, tipOwner }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
