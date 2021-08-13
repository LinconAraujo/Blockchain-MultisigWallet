import React from "react";

const TransferList = ({ transfers, approveTransfer }) => {
  return (
    <>
      <h2>Transfers</h2>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Amount</th>
            <th>To</th>
            <th>Approvals</th>
            <th>sent</th>
          </tr>
        </thead>
        <tbody>
          {transfers.map((transfer) => (
            <tr key={transfer.id}>
              <td>{transfer.id}</td>
              <td>{transfer.amount}</td>
              <td>{transfer.to}</td>
              <td>
                {transfer.approvals}&nbsp;
                <button onClick={() => approveTransfer(transfer.id)}>
                  Approve
                </button>
              </td>
              <td>{transfer.sent ? "yes" : "no"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default TransferList;
