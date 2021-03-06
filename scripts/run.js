const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory('DragonQuest');
    const gameContract = await gameContractFactory.deploy(
        // Names
        // Images
        // HP
        // Attack
        // Wisdom
        // Defence
        ['Warrior1', 'Mage1', 'Warrior2', 'Mage2'],
        ['https://www.pinpng.com/picture/xbhoJJ_final-fantasy-fighter-hd-by-final-fantasy-warrior/', 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/568b364a-1f61-4a93-b875-eeb2069ddf57/den5g99-ef5b8ac3-d77a-4654-9345-0d0bab9a6420.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzU2OGIzNjRhLTFmNjEtNGE5My1iODc1LWVlYjIwNjlkZGY1N1wvZGVuNWc5OS1lZjViOGFjMy1kNzdhLTQ2NTQtOTM0NS0wZDBiYWI5YTY0MjAucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.zT2RzpSsAJDMaV-zYwU1o2cZMSPTErGqkZW13BGni-k', 'https://art.pixilart.com/68191ec2944c292.png', 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/568b364a-1f61-4a93-b875-eeb2069ddf57/del00lh-069edafe-5413-4971-9b9a-13331e36fc31.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzU2OGIzNjRhLTFmNjEtNGE5My1iODc1LWVlYjIwNjlkZGY1N1wvZGVsMDBsaC0wNjllZGFmZS01NDEzLTQ5NzEtOWI5YS0xMzMzMWUzNmZjMzEucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.M2YbZd9EzGQb1YnxH-9anruXUfiHR4999cwbw__QU2g'],
        [300, 200, 300, 200],
        [50, 20, 50, 30],
        [1, 3, 1, 2],
        [50, 20, 50, 30]
    );
    await gameContract.deployed()

    console.log('Contract deployed to: ', gameContract.address);

    for (let i = 0; i < characters.length; i++) {
        let transaction;
        transaction = await gameContract.mintCharacterNFT(i);
        await transaction.wait();
        console.log(`Minted NFT #${i}`)
    }
    console.log('All heroes minted')
}

const runMain = async () => {
    try {
        await main();
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
}

runMain();
