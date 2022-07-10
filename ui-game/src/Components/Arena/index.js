import React, {useEffect, useState} from "react";
import {ethers} from "ethers";
import './Arena.css'
import {DragonQuestAddress} from "../../Contracts/DragonQuestAddress";
import DragonQuestABI from "../../Contracts/DragonQuestABI";
import {transformDracovianData} from "../../utils";
import LoadingIndicator from "../LoadingIndicator";

const renderDracovian = (dracovian, runAttackAction, attackState) => {
    return (
        <div className={'boss-container'}>
            <div className={`boss-content ${attackState}`}>
                <h2>🔥 {dracovian.name} 🔥</h2>
                <div className={'image-content'}>
                    <img src={dracovian.imageURI} alt={`Dragon ${dracovian.name}`}/>
                    <div className={'health-bar'}>
                        <progress value={dracovian.hp} max={dracovian.maxHp}/>
                        <p>{`${dracovian.hp} / ${dracovian.maxHp} HP`}</p>
                    </div>
                </div>
            </div>
            <div className={'attack-container'}>
                <button className={'cta-button'} onClick={runAttackAction}>
                    {`💥 Attack ${dracovian.name}`}
                </button>
            </div>
            {attackState === 'attacking' && (
                <div className={'loading-indicator'}>
                    <LoadingIndicator />
                    <p>Attacking ⚔️</p>
                </div>
            )}
        </div>
    )
}
const renderLuminary = (luminary) => {
    return (
        <div className={'players-container'}>
            <div className={'player-container'}>
                <h2>Your Chosen Hero</h2>
                <div className={'player'}>
                    <div className={'image-content'}>
                        <h2>{luminary.name}</h2>
                        <img src={luminary.imageURI}
                             alt={`Hero ${luminary.name}`}
                        />
                        <div className={'health-bar'}>
                            <progress value={luminary.hp} max={luminary.maxHp}/>
                            <p>{`${luminary.hp} / ${luminary.maxHp} HP`}</p>
                        </div>
                    </div>
                    <div className="stats">
                        <h4>{`⚔️ Attack Damage: ${luminary.attackDamage}`}</h4>
                        <h4>{`⚔️ Wisdom: ${luminary.wisdom}`}</h4>
                        <h4>{`⚔️ Defence: ${luminary.defence}`}</h4>
                    </div>
                </div>
            </div>
        </div>
    )
}
const Arena = ({luminary, setLuminary, currentAccount}) => {
    const [gameContract, setGameContract] = useState(null)
    const [dracovian, setDracovian] = useState(null)
    const [attackState, setAttackState] = useState('')

    const runAttackAction = async () => {
        try {
            if (gameContract) {
                setAttackState('attacking')
                const attackTransaction = await gameContract.attackBoss();
                await attackTransaction.wait()
                setAttackState('hit')
            }
        } catch (error) {
            console.error(`Error attacking boss ${error}`)
            setAttackState('')
        }
    }

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

            setGameContract(gameContract)
        }
    }, [])
    useEffect(() => {
        const fetchDracovian = async () => {
            const dracovianTransaction = await gameContract.getDragon();
            setDracovian(transformDracovianData(dracovianTransaction));
        }

        const onAttackComplete = (from, newBossHp, newPlayerHp) => {
            const bossHp = newBossHp.toNumber()
            const playerHp = newPlayerHp.toNumber()
            const sender = from.toString()

            console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

            if (currentAccount === sender.toLowerCase()) {
                setDracovian((prevState) => {
                    return {...prevState, hp: bossHp}
                })
                setLuminary((prevState) => {
                    return {...prevState, hp: playerHp}
                })
            } else {
                setDracovian((prevState) => {
                    return {...prevState, hp: bossHp}
                })
            }
        }

        if (gameContract) {
            fetchDracovian()
            gameContract.on('AttackComplete', onAttackComplete)
        }

        return () => {
            if(gameContract) {
                gameContract.off('AttackComplete', onAttackComplete)
            }
        }
    }, [gameContract])

    return (
        <div className={'arena-container'}>
            {dracovian && renderDracovian(dracovian, runAttackAction, attackState)}
            {luminary && renderLuminary(luminary)}
        </div>
    )
}

export default Arena
