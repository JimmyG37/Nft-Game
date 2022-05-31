import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "./constants";
import "./App.css";
import SelectCharacter from "./Components/SelectCharacter";
import Arena from "./Components/Arena";
import MyEpicGame from "./MyEpicGame.json";
import LoadingIndicator from "./Components/LoadingIndicator";

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    try {
      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        setIsLoading(false);
        return;
      } else {
        console.log("We have the ethereum object", ethereum);

        // Check if we're authorized to access the users wallet
        const accounts = await ethereum.request({ method: "eth_accounts" });

        // User can have multiple authorized accounts, grab the first one.
        if (accounts.lenght !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setCurrentAccount(account);
        } else {
          console.log("No authorized account found :(");
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    }

    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://media0.giphy.com/media/l0HlMURBbyUqF0XQI/giphy.gif?cid=ecf05e47dxkq7f6j793xtge6pr11a1tqwjsbbbbi5uetd5f2&rid=giphy.gif&ct=g"
            alt="Global Warming Gif"
          />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
          </button>
        </div>
      );
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    } else if (currentAccount && characterNFT) {
      return (
        <Arena
          characterNFT={characterNFT}
          setCharacterNFT={setCharacterNFT}
          currentAccount={currentAccount}
        />
      );
    }
  };

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      // Request access to account.
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    // The function we will call that interacts with the smart contract
    const fetchNFTMetadata = async () => {
      console.log("Checking for Character NFT on address:", currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        MyEpicGame.abi,
        signer
      );

      const txn = await gameContract.checkIfUserHasNFT();
      if (txn.name) {
        console.log("User has character NFT");
        setCharacterNFT(transformCharacterData(txn));
      } else {
        console.log("No character NFT found");
      }

      setIsLoading(false);
    };

    // We only want to run this if we have an connected wallet
    if (currentAccount) {
      console.log("CurrentAccount:", currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Stop Global Warming ⚔️</p>
          <p className="sub-text">
            Team up to protect the Global from Warming!
          </p>
          {renderContent()}
        </div>
        <div className="footer-container"></div>
      </div>
    </div>
  );
}

export default App;
