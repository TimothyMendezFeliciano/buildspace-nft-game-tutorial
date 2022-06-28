// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract DragonQuest {

    struct CharacterAttributes {
        uint characterIndex;
        string name;
        string imageURI;
        uint hp;
        uint maxHp;
        uint attackDamage;
        uint wisdom;
        uint defence;
    }

    CharacterAttributes[] defaultCharacters;

    constructor(
        string[] memory characterNames,
        string[] memory characterImageURIs,
        uint[] memory characterHp,
        uint[] memory characterAttackDmg,
        uint[] memory characterWisdom,
        uint[] memory characterDefence
    ) {
        console.log("Prepare to destroy the Dark Lord.");
        for (uint i = 0; i < characterNames.length; i += 1) {
            defaultCharacters.push(CharacterAttributes({
            characterIndex : i,
            name : characterNames[i],
            imageURI : characterImageURIs[i],
            hp : characterHp[i],
            maxHp : characterHp[i],
            attackDamage : characterAttackDmg[i],
            wisdom : characterWisdom[i],
            defence : characterDefence[i]
            }));

            CharacterAttributes memory c = defaultCharacters[i];
            console.log("Done initializing %s w/ HP %s, img %s", c.name, c.hp, c.imageURI);
        }
    }
}
