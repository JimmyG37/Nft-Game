import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    try {
      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
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
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Stop Global Warming ⚔️</p>
          <p className="sub-text">
            Team up to protect the Global from Warming!
          </p>
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
        </div>
        <div className="footer-container"></div>
      </div>
    </div>
  );
}

export default App;
