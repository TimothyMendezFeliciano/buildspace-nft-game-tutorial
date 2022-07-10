// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.1;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./libraries/Base64.sol";

contract DragonQuest is ERC721 {

    struct Dragon {
        string name;
        string imageURI;
        uint hp;
        uint maxHp;
        uint attackDamage;
    }

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

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    CharacterAttributes[] defaultCharacters;
    mapping(uint256 => CharacterAttributes) public nftHolderAttributes;
    mapping(address => uint256) public nftHolders;
    Dragon public dragon;
    event CharacterNFTMinted(address sender, uint256 tokenId, uint256 characterIndex);
    event AttackComplete(address sender, uint newBossHp, uint newPlayerHp);

    constructor(
        string[] memory characterNames,
        string[] memory characterImageURIs,
        uint[] memory characterHp,
        uint[] memory characterAttackDmg,
        uint[] memory characterWisdom,
        uint[] memory characterDefence,
        string memory bossName,
        string memory bossImageURI,
        uint bossHp,
        uint bossAttackDamage
    ) ERC721("Heroes", "HERO") {

        dragon = Dragon({
        name : bossName,
        imageURI : bossImageURI,
        hp : bossHp,
        maxHp : bossHp,
        attackDamage : bossAttackDamage
        });

        console.log("Done initializing boss %s w/ HP %s, img %s", dragon.name, dragon.hp, dragon.imageURI);

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

        _tokenIds.increment();
    }

    function mintCharacterNFT(uint _characterIndex) external {
        uint256 newItemId = _tokenIds.current();

        _safeMint(msg.sender, newItemId);

        nftHolderAttributes[newItemId] = CharacterAttributes({
        characterIndex : _characterIndex,
        name : defaultCharacters[_characterIndex].name,
        imageURI : defaultCharacters[_characterIndex].imageURI,
        hp : defaultCharacters[_characterIndex].hp,
        maxHp : defaultCharacters[_characterIndex].maxHp,
        attackDamage : defaultCharacters[_characterIndex].attackDamage,
        wisdom : defaultCharacters[_characterIndex].wisdom,
        defence : defaultCharacters[_characterIndex].defence
        });

        console.log("Minted NFT w/ tokenId %s and characterIndex %s", newItemId, _characterIndex);

        nftHolders[msg.sender] = newItemId;

        _tokenIds.increment();
        emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenId];

        string memory strHp = Strings.toString(charAttributes.hp);
        string memory strMaxHp = Strings.toString(charAttributes.maxHp);
        string memory strAttackDamage = Strings.toString(charAttributes.attackDamage);
        string memory strWisdom = Strings.toString(charAttributes.wisdom);
        string memory strDefence = Strings.toString(charAttributes.defence);

        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "', charAttributes.name,
                ' -- NFT #: ', Strings.toString(_tokenId),
                '", "description": "Join the world of Dragon Quest Chainslayers", "image": "ipfs://',
                charAttributes.imageURI,
                '", "attributes": [ { "trait_type": "Health Points", "value": ', strHp, ', "max_value":', strMaxHp, '}, { "trait_type": "Attack Damage", "value": ',
                strAttackDamage, '}, {"trait_type": "Wisdom", "value": ', strWisdom, '}, {"trait_type": "Defence", "value": ', strDefence, '} ]}'
            )
        );

        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }

    function attackBoss() public {
        uint nftTokenIdOfPlayer = nftHolders[msg.sender];
        CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];
        console.log("\nPlayer w/ character %s about to attack. Has %s HP and %s AD", player.name, player.hp, player.attackDamage);
        console.log("Boss %s has %s HP and %s AD", dragon.name, dragon.hp, dragon.attackDamage);

        require(
            player.hp > 0,
            "Error: character must "
        );

        require(
            dragon.hp > 0,
            "Error: boss must have HP to attack character"
        );

        if(dragon.hp < player.attackDamage) {
            dragon.hp = 0;
        } else {
            dragon.hp = dragon.hp - (player.attackDamage * player.wisdom);
        }

        if(player.hp < dragon.attackDamage) {
            player.hp = 0;
        } else {
            player.hp = player.hp - (dragon.attackDamage - player.defence);
        }

        console.log("Player attacked boss. New boss hp: %s", dragon.hp);
        console.log("Boss attacked player. New player hp: %s\n", player.hp);
        emit AttackComplete(msg.sender, dragon.hp, player.hp);
    }

    function checkIfUserHasNFT() public view returns (CharacterAttributes memory) {
        uint256 userNftTokenId = nftHolders[msg.sender];
        if(userNftTokenId > 0) {
            return nftHolderAttributes[userNftTokenId];
        } else {
            CharacterAttributes memory emptyStruct;
            return emptyStruct;
        }
    }

    function getAllDefaultCharacters() public view returns (CharacterAttributes[] memory) {
        return defaultCharacters;
    }

    function getDragon() public view returns (Dragon memory) {
        return dragon;
    }
}
