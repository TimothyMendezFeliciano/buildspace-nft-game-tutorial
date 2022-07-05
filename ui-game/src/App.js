import React, {useEffect, useState} from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import DragonQuestDragon from './assets/DragonQuestDragon.gif';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

    const [currentAccount, setCurrentAccount] = useState(null)

    const checkWalletConnect = async () => {
        const {ethereum} = window;
        if (ethereum) {
            const accounts = await ethereum.request({method: 'eth_accounts'});
            if (accounts.length !== 0) {
                const account = accounts[0];
                setCurrentAccount(account);
            }
        }
        return !!ethereum;
    }

    const connectWalletAction = async () => {
      const { ethereum } = window;

      if(!ethereum) return;
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });
      setCurrentAccount(accounts[0]);
    }

    useEffect(() => {
        checkWalletConnect()
    }, [])

    return (
        <div className="App">
            <div className="container">
                <div className="header-container">
                    <p className="header gradient-text">⚔️Dragon Quest Dracovian Boss ⚔️</p>
                    <p className="sub-text">Inspired by the Dragon Quest video games.</p>
                    <div className="connect-wallet-container">
                        <img
                            src={DragonQuestDragon}
                            alt="Dragon Quest Gif"
                        />
                      <button
                          className={'cta-button connect-wallet-button'}
                      >
                        Connect Wallet
                      </button>
                    </div>
                </div>
                <div className="footer-container">
                    <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo}/>
                    <a
                        className="footer-text"
                        href={TWITTER_LINK}
                        target="_blank"
                        rel="noreferrer"
                    >{`built with @${TWITTER_HANDLE}`}</a>
                </div>
            </div>
        </div>
    );
};

export default App;
