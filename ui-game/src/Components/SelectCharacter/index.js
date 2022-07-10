import React, {useEffect, useState} from "react";
import './SelectCharacter.css';
import {ethers} from "ethers";
import {DragonQuestAddress} from "../../Contracts/DragonQuestAddress";
import DragonQuestABI from "../../Contracts/DragonQuestABI";
import {transformCharacterData} from "../../utils";
import LoadingIndicator from "../LoadingIndicator";

const SelectCharacter = ({setCharacterNFT}) => {
    const [characters, setCharacters] = useState([])
    const [gameContract, setGameContract] = useState(null)
    const [mintingCharacter, setMintingCharacter] = useState(false)

    const mintCharacterNFTAction = async (characterId) => {
        try {
            if (gameContract) {
                setMintingCharacter(true)
                const mintTxn = await gameContract.mintCharacterNFT(characterId);
                await mintTxn.wait();

                setMintingCharacter(false)
            }
        } catch (error) {
            console.error('Error Minting NFT', error);
            setMintingCharacter(false)
        }
    };
    const renderCharacters = () =>
        characters.map((character, index) => (
            <div className="character-item" key={character.name}>
                <div className="name-container">
                    <p>{character.name}</p>
                </div>
                <img src={character.imageURI} alt={character.name}/>
                <button
                    type="button"
                    className="character-mint-button"
                    onClick={() => mintCharacterNFTAction(index)}
                >{`Mint ${character.name}`}</button>
            </div>
        ));

    useEffect(() => {
        const {ethereum} = window

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const gameContract = new ethers.Contract(
                DragonQuestAddress,
                DragonQuestABI,
                signer
            )

            setGameContract(gameContract);
        } else {
            console.log('Eth Contract not found.')
        }
    }, [])
    useEffect(() => {
        const getCharacters = async () => {
            try {
                const charactersTransaction = await gameContract.getAllDefaultCharacters();

                const characters = charactersTransaction.map((characterData) =>
                    transformCharacterData(characterData)
                );

                setCharacters(characters);
            } catch (error) {
                console.error('Something went wrong fetching characters:', error);
            }
        };

        const onCharacterMint = async (sender, tokenId, characterIndex) => {
            console.log(
                `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
            );

            if (gameContract) {
                const characterNFT = await gameContract.checkIfUserHasNFT();
                setCharacterNFT(transformCharacterData(characterNFT));
            }
        };

        if (gameContract) {
            getCharacters();
            gameContract.on('CharacterNFTMinted', onCharacterMint)
        }

        return () => {
            if (gameContract) {
                gameContract.off('CharacterNFTMinted', onCharacterMint)
            }
        }
    }, [gameContract]);

    return (
        <div className={'select-character-container'}>
            <h2>Awaken the Luminary!</h2>
            {characters.length > 0 && (
                <div className={'character-grid'}>
                    {renderCharacters()}
                </div>
            )}
            {mintingCharacter && (
                <div className={'loading'}>
                    <div className={'indicator'}>
                        <LoadingIndicator/>
                        <p>Minting In Progress. . .</p>
                    </div>
                    <img
                        src="https://media2.giphy.com/media/61tYloUgq1eOk/giphy.gif?cid=ecf05e47dg95zbpabxhmhaksvoy8h526f96k4em0ndvx078s&rid=giphy.gif&ct=g"
                        alt="Minting loading indicator"
                    />
                </div>
            )}
        </div>
    )
}

export default SelectCharacter
