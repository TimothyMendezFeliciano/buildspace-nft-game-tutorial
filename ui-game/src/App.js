import React, {useEffect, useState} from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import DragonQuestDragon from './assets/DragonQuestDragon.gif';
import SelectCharacter from "./Components/SelectCharacter";
import {DragonQuestAddress} from "./Contracts/DragonQuestAddress";
import {ethers} from 'ethers';
import DragonQuestABI from "./Contracts/DragonQuestABI";
import {transformCharacterData} from "./utils";
// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

    const [currentAccount, setCurrentAccount] = useState(null)
    const [characterNFT, setCharacterNFT] = useState(null)

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

    const renderContent = () => {
        if(!currentAccount) {
            return (
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
            )
        } else if (currentAccount && !characterNFT) {
            return <SelectCharacter setCharacterNFT={setCharacterNFT} />
        }
    };

    const connectWalletAction = async () => {
      const { ethereum } = window;

      if(!ethereum) return;
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });
      setCurrentAccount(accounts[0]);
    }

    const checkNetwork = async () => {
        try {
            if(window.ethereum.networkVersion !== '4') {
                alert('Please connect to Rinkeby!')
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        checkWalletConnect()
    }, [])

    useEffect(() => {
        const fetchNFTMetadata = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const gameContract = new ethers.Contract(
                DragonQuestAddress,
                DragonQuestABI,
                signer
            )

            const transaction = await gameContract.checkIfUserHasNFT();
            if(transaction.name) {
                setCharacterNFT(transformCharacterData(transaction));
            }
        };

        if(currentAccount) {
            fetchNFTMetadata()
        }
    }, [currentAccount])

    return (
        <div className="App">
            <div className="container">
                <div className="header-container">
                    <p className="header gradient-text">⚔️Dragon Quest Dracovian Boss ⚔️</p>
                    <p className="sub-text">Inspired by the Dragon Quest video games.</p>
                    {renderContent()}
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
                <div className={'footer-container'}>
                    <p className={'sub-text'}>{currentAccount}</p>
                </div>
            </div>
        </div>
    );
};

export default App;
