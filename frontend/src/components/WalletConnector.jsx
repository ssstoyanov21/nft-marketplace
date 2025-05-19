import { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { getProvider, getSigner } from "../utils/contracts";


export default function WalletConnector({ onConnect }) {
  const [address, setAddress] = useState(null);

  async function connect() {
    const web3Modal = new Web3Modal({ cacheProvider: true });
    const instance  = await web3Modal.connect();
    const provider  = new ethers.providers.Web3Provider(instance);
    const signer = getSigner(provider);
    const addr      = await signer.getAddress();

    setAddress(addr);
    onConnect(signer, addr);   // ──> предаваме и подписалия, и адрес
  }

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      connect();
    }
  }, []);

  return address
    ? <p>Свързан: {address}</p>
    : <button onClick={connect} className="btn">Свържи портфейл</button>;
}