async function main() {
  const provider = ethers.provider;
  const dai = await ethers.getContractAt(
    ["function totalSupply() view returns (uint256)"],
    "0x6B175474E89094C44Da98b954EedeAC495271d0F"
  );
  const supply = await dai.totalSupply();
  console.log("DAI totalSupply:", supply.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });