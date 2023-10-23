import ContractABI from "./Instagram.json";
import Web3 from "web3";

export const address = "0x579117C8Fcf81d19ea27297235B280d31Edb95a9"; // local deployment

// export const address = "0x272A9c93386036a62379f2F57E3528d3E74f26dF"; // sepolia
// export const address = "0xF79D5Ee517eC8d12919C67492EF977FFf3161363"; // sepolia old

export const createContract = () => {
  const { ethereum } = window;
  if (ethereum) {
    const web3 = new Web3(ethereum);
    return new web3.eth.Contract(ContractABI.abi, address);
  }
};

export const modalStyles = {
  content: {
    height: "300px",
    width: "400px",
    margin: "auto",
    marginTop: "150px",
    display: "flex",
  },
  overlay: {
    backgroundColor: "rgb(0 0 0 / 74%)",
  },
};
