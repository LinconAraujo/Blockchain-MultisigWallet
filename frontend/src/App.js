import React, { useEffect, useState } from "react";

import Header from "./components/Header";
import Transfer from "./components/Transfer";
import TransferList from "./components/Transfer/list";

import { getWallet, getWeb3 } from "./utils";

const App = () => {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [wallet, setWallet] = useState(undefined);
  const [approvers, setApprovers] = useState([]);
  const [quorum, setQuorum] = useState(undefined);
  const [transfers, setTransfers] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const wallet = await getWallet(web3);

      const approvers = await wallet.methods.getApprovers().call();
      const quorum = await wallet.methods.quorum().call();

      setWeb3(web3);
      setAccounts(accounts);
      setWallet(wallet);

      setApprovers(approvers);
      setQuorum(quorum);

      setLoading(true);
    };

    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      const transfers = await wallet.methods.getTransfers().call();
      setTransfers(transfers);

      setLoading(false);
    };

    !loading || init();
  }, [loading, wallet]);

  const createTransfer = (transfer) => {
    wallet.methods
      .createTransfer(transfer.amount, transfer.to)
      .send({ from: accounts[0] })
      .then(() => setLoading(true));
  };

  const approveTransfer = (transferId) => {
    wallet.methods
      .approveTransfer(transferId)
      .send({ from: accounts[0] })
      .then(() => {
        console.log("r");
        setLoading(true);
      });
  };

  if (
    typeof web3 === undefined ||
    typeof accounts === undefined ||
    typeof wallet === undefined ||
    approvers.length === 0 ||
    typeof quorum === undefined
  )
    return <div>Loading...</div>;

  return (
    <div className="App">
      <Header approvers={approvers} quorum={quorum}></Header>
      <Transfer createTransfer={createTransfer} />
      <TransferList transfers={transfers} approveTransfer={approveTransfer} />
    </div>
  );
};

export default App;
