import {useCallback} from "react";
import './SelectCharacter.css'

const Luminary = ({luminary}) => {

    const renderLuminary = useCallback(() => (
        <div className="character-item" key={luminary.name}>
            <div className="name-container">
                <p>{luminary.name}</p>
            </div>
            <img src={`https://cloudflare-ipfs.com/ipfs/${luminary.imageURI}`} alt={luminary.name}/>
            <button
                type="button"
                className="character-mint-button"
            >{`Chosen ${luminary.name}`}</button>
        </div>
    ), [luminary])

    return (
        <div className={'select-character-container'}>
            <div className={'character-grid'}>
                {renderLuminary()}
            </div>
        </div>
    )
}

export default Luminary
