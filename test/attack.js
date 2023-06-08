const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");
const { parseEther } = require("ethers/lib/utils");

describe("Attack", function () {
  it("Drain all the funds from the GoodContract using the BadContract", async function () {
    const goodContractFactory = await ethers.getContractFactory("GoodContract");
    const goodContract = await goodContractFactory.deploy();
    await goodContract.deployed();

    const badContractFactory = await ethers.getContractFactory("BadContract");
    const badContract = await badContractFactory.deploy(goodContract.address);
    await badContract.deployed();

    const [innocentAddress, maliciousAddress] = await ethers.getSigners();

    const tx1 = await goodContract
      .connect(innocentAddress)
      .addBalance({ value: parseEther("10") });

    await tx1.wait();

    const balanceGoodContractV1 = await ethers.provider.getBalance(
      goodContract.address
    );
    expect(balanceGoodContractV1).to.equal(parseEther("10"));

  
    const tx2 = await badContract
      .connect(maliciousAddress)
      .attack({ value: parseEther("2") });

    await tx2.wait();

    const balanceGoodContractV2 = await ethers.provider.getBalance(
      goodContract.address
    );
    expect(balanceGoodContractV2).to.equal(BigNumber.from("0"));

    const balanceBadContract = await ethers.provider.getBalance(
      badContract.address
    );
    expect(balanceBadContract).to.equal(parseEther("12"));
  });
});
