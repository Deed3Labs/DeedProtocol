// How to handle enums insolidity testing?
import { expect } from "chai";
import { ethers } from "hardhat";
import { SubdivisionNFT, DeedNFT } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("SubdivisionNFT", function () {
  // We define a fixture to reuse the same setup in every test.
  //   let contractOwner: SignerWithAddress;
  let subNFT: SubdivisionNFT;
  let deedNFT: DeedNFT;
  let contractOwner: SignerWithAddress;
  let deedOwner: SignerWithAddress;
  let subOwner: SignerWithAddress;

  beforeEach(async () => {
    [contractOwner, deedOwner, subOwner] = await ethers.getSigners();
    const subNFTFactory = await ethers.getContractFactory("SubdivisionNFT");
    const deedNFTFactory = await ethers.getContractFactory("DeedNFT");
    deedNFT = (await deedNFTFactory.connect(contractOwner).deploy()) as DeedNFT;
    await deedNFT.deployed();
    subNFT = (await subNFTFactory.deploy("uri", deedNFT.address)) as SubdivisionNFT;
    await subNFT.deployed();
    //This deed id will be 1
    await deedNFT.connect(contractOwner).mintAsset(deedOwner.address, "uri", "House", 0);
  });
  describe("mintSubdivision", function () {
    it.only("Should mint a subdivisionNFT to the designated address", async function () {
      //SubNFT minted with tokenID 1
      await subNFT.connect(deedOwner).mintSubdivision(subOwner.address, 1, 1);
      console.log(await subNFT.ownerOfSubdivision(1));
      //   expect(await subNFT.ownerOfSubdivision(1)).to.equal(subOwner.address);
    });
  });
});

//   });
