import React from "react";

const Header = ({ approvers, quorum }) => {
  return (
    <>
      <header>
        <ul>
          <li>
            <strong>Approvers:</strong>
            <ol>
              {approvers.map((approver) => (
                <li>{approver}</li>
              ))}
            </ol>
          </li>
          <li>
            <strong>Quorum:</strong> {quorum}
          </li>
        </ul>
      </header>
    </>
  );
};

export default Header;
