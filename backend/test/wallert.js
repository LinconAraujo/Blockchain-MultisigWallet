const { assert } = require("chai");

describe("Contract: Wallet", () => {
  let accounts;
  let wallet;
  let signers;

  beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    const Wallet = await ethers.getContractFactory("Wallet");
    signers = await ethers.getSigners();

    const accountsToUse = [accounts[0], accounts[1], accounts[2]];
    wallet = await Wallet.deploy(accountsToUse, 2);
    await wallet.deployed();

    web3.eth.sendTransaction({
      from: accounts[0],
      to: wallet.address,
      value: 1000,
    });
  });

  it("Should have correct approvers and quorum", async () => {
    const approvers = await wallet.getApprovers();
    const quorum = await wallet.quorum();

    assert(approvers.length === 3);
    assert(quorum.toNumber() === 2);
  });

  it("Should create transfers", async () => {
    await wallet.createTransfer(100, accounts[5], { from: accounts[0] });
    const transfers = await wallet.getTransfers();

    assert(transfers.length === 1);
    assert(transfers[0].id.toNumber() === 0);
    assert(transfers[0].amount.toNumber() === 100);
    assert(transfers[0].to === accounts[5]);
    assert(transfers[0].approvals.toNumber() === 0);
    assert(transfers[0].sent === false);
  });

  it("Should NOT create transfers if sender is not approved", async () => {
    try {
      await wallet.createTransfer(100, accounts[5], { from: accounts[4] });
    } catch (error) {
      assert.include(
        error.message,
        "Contract with a Signer cannot override from",
        "Contract with a Signer cannot override from"
      );
    }
  });

  it("Should increment approvals", async () => {
    await wallet.createTransfer(100, accounts[5], { from: accounts[0] });
    await wallet.approveTransfer(0, { from: accounts[0] });

    const transfers = await wallet.getTransfers();
    const balance = await web3.eth.getBalance(wallet.address);

    assert(transfers[0].approvals.toNumber() === 1);
    assert(transfers[0].sent === false);
    assert(balance === "1000");
  });

  it("Should send transfer if quorum reached", async () => {
    const balanceBefore = web3.utils.toBN(
      await web3.eth.getBalance(accounts[6])
    );

    await wallet.createTransfer(100, accounts[6], { from: accounts[0] });
    await wallet.approveTransfer(0, { from: accounts[0] });
    await wallet.connect(signers[1]).approveTransfer(0, { from: accounts[1] });

    const balanceAfter = web3.utils.toBN(
      await web3.eth.getBalance(accounts[6])
    );

    assert(balanceAfter.sub(balanceBefore).toNumber() === 100);
  });

  it("Should NOT approve transfer if sender is not approved", async () => {
    await wallet.createTransfer(100, accounts[6], { from: accounts[0] });

    try {
      await wallet.approveTransfer(0, { from: accounts[4] });
    } catch (error) {
      assert.include(
        error.message,
        "Contract with a Signer cannot override from",
        "Contract with a Signer cannot override from"
      );
    }
  });

  it("Should NOT approve transfer if transfer is already sent", async () => {
    await wallet.createTransfer(100, accounts[6], { from: accounts[0] });

    const signers = await ethers.getSigners();
    await wallet.approveTransfer(0, { from: accounts[0] });
    await wallet.connect(signers[1]).approveTransfer(0, { from: accounts[1] });

    try {
      await wallet
        .connect(signers[2])
        .approveTransfer(0, { from: accounts[2] });
    } catch (error) {
      assert.include(
        error.message,
        "Transfer has already been sent",
        "Transfer has already been sent"
      );
    }
  });

  it("Should NOT approve transfer twice", async () => {
    await wallet.createTransfer(100, accounts[6], { from: accounts[0] });
    await wallet.approveTransfer(0, { from: accounts[0] });
    try {
      await wallet.approveTransfer(0, { from: accounts[0] });
    } catch (error) {
      assert.include(
        error.message,
        "Cannot approve transfer twice",
        "Cannot approve transfer twice"
      );
    }
  });
});
