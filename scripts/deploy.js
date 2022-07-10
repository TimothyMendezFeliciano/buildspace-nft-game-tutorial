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
        [
            'QmepbUNeyzj3r62yZDXurykwZVPfYEoCgwYhGeJsHpo1So',
            'QmZuhAMEq2jH96bU3ggA1Tm4djjzqYGWtXcygP8ZuVwhZf',
            'QmWsSD7hxxJzhffxd9tVSj3KefymqvJY12KGG1nvFWUrFv',
            'QmdfXeihY4rLWVKzbfbHQSYVj68qKvLuyT6iBPMD7UeFjk'
        ],
        [300, 200, 300, 200],
        [50, 20, 50, 30],
        [1, 3, 1, 2],
        [50, 20, 50, 30],
        'Tonberry',
        'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/563a768f-dc14-4c15-a3eb-6b8ed96ac390/d87lb3r-15d89164-da6d-4a1a-8bfc-d74ecddde0b2.png/v1/fill/w_530,h_475,strp/final_fantasy_tonberry_by_joeoiii_d87lb3r-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NDc1IiwicGF0aCI6IlwvZlwvNTYzYTc2OGYtZGMxNC00YzE1LWEzZWItNmI4ZWQ5NmFjMzkwXC9kODdsYjNyLTE1ZDg5MTY0LWRhNmQtNGExYS04YmZjLWQ3NGVjZGRkZTBiMi5wbmciLCJ3aWR0aCI6Ijw9NTMwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.73Km86BEvx-uBVQcKOuR3vodtLFci2KIRWDqiHGXYhI',
        1000,
        100
    );
    await gameContract.deployed()

    console.log('Contract deployed to: ', gameContract.address);
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
