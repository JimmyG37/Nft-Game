const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
  const gameContract = await gameContractFactory.deploy(
    ["Yahaha!", "Guy", "Sticks"],
    [
      "https://i.imgur.com/SLJGBcM.png",
      "https://i.imgur.com/vta4Xm3.png",
      "https://i.imgur.com/xviyD0A.png",
    ],
    [100, 200, 300],
    [100, 50, 25],
    "Global Warming",
    "https://i.imgur.com/8NnFgub.png",
    1000,
    50
  );
  await gameContract.deployed();

  console.log("Contract deployed to: ", gameContract.address);
  let txn;
  // We only have 3 characters.
  // an NFT w/ the character at index2 of our array.
  txn = await gameContract.mintCharacterNFT(2);
  await txn.wait();

  txn = await gameContract.attackBoss();
  await txn.wait();

  txn = await gameContract.attackBoss();
  await txn.wait();
  // Get the value of the NFT's URI.
  let returnedTokenUri = await gameContract.tokenURI(1);
  console.log("Token URI:", returnedTokenUri);
};
const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
