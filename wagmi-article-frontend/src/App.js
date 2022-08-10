import { useState, useEffect } from "react";
import { ethers, utils } from "ethers";
import abi from "./contracts/Wave.json";
import Profile from "./Profile";
import "./App.css";
import {
  WagmiConfig,
  createClient,
  defaultChains,
  configureChains,
} from "wagmi";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

const alchemyId = process.env.ALCHEMY_ID;

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  alchemyProvider({ alchemyId }),
  publicProvider(),
]);

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

const App = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [userName, setUserName] = useState("");
  const [displayedUserName, setDisplayedUserName] = useState("initial name");
  const [error, setError] = useState(null);
  const contractAddress = "0x17c5A76a5D6db7740821425aFa029B3494DeecaB";
  const contractABI = abi.abi;

  const handleInput = (name) => {
    setUserName(name.target.value);
  };

  const handleChild = (status) => {
    console.log(status);
    status ? setIsWalletConnected(true) : setIsWalletConnected(false);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const waveContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const txn = await waveContract.setName(
        utils.formatBytes32String(userName)
      );
      console.log("setting user name");
      await txn.wait();
      console.log("user name set", txn.hash);
      setDisplayedUserName(userName);
    }
  };

  let userInteraction;
  if (isWalletConnected === true) {
    userInteraction = (
      <div>
        <input onChange={handleInput} type="text" />
        <button onClick={handleClick}>Wave</button>
        <p> {displayedUserName} waved!</p>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Wagmi Project</h1>

      {userInteraction}
      <WagmiConfig client={client}>
        <Profile handleChild={handleChild} />
      </WagmiConfig>
    </div>
  );
};

export default App;
