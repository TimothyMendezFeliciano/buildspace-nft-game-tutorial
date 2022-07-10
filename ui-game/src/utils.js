export const transformDracovianData = (dracovianData) => {
    return {
        name: dracovianData.name,
        imageURI: dracovianData.imageURI,
        hp: dracovianData.hp.toNumber(),
        maxHp: dracovianData.maxHp.toNumber(),
        attackDamage: dracovianData.attackDamage.toNumber()
    }
}

export const transformCharacterData = (characterData) => {
    return {
        name: characterData.name,
        imageURI: characterData.imageURI,
        hp: characterData.hp.toNumber(),
        maxHp: characterData.maxHp.toNumber(),
        attackDamage: characterData.attackDamage.toNumber(),
        wisdom: characterData.wisdom.toNumber(),
        defence: characterData.defence.toNumber()
    }
}
