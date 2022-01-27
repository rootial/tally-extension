import { AccountTotal } from "@tallyho/tally-background/redux-slices/selectors"
import React, { ReactElement, ReactNode, useState } from "react"
import SharedButton from "../Shared/SharedButton"
import SharedPanelSwitcher from "../Shared/SharedPanelSwitcher"
import SignTransactionDetailPanel from "./SignTransactionDetailPanel"
import SignTransactionNetworkAccountInfoTopBar from "./SignTransactionNetworkAccountInfoTopBar"

export default function SignTransactionContainer({
  signerAccountTotal,
  title,
  infoBlock,
  confirmButtonLabel,
  handleConfirm,
  handleReject,
}: {
  signerAccountTotal: AccountTotal
  title: ReactNode
  infoBlock: ReactNode
  confirmButtonLabel: ReactNode
  handleConfirm: () => void
  handleReject: () => void
}): ReactElement {
  const [panelNumber, setPanelNumber] = useState(0)

  return (
    <section>
      <SignTransactionNetworkAccountInfoTopBar
        accountTotal={signerAccountTotal}
      />
      <h1 className="serif_header title">{title}</h1>
      <div className="primary_info_card standard_width">{infoBlock}</div>
      <SharedPanelSwitcher
        setPanelNumber={setPanelNumber}
        panelNumber={panelNumber}
        panelNames={["Details"]}
      />
      {panelNumber === 0 ? <SignTransactionDetailPanel /> : null}
      <div className="footer_actions">
        <SharedButton
          iconSize="large"
          size="large"
          type="secondary"
          onClick={handleReject}
        >
          Reject
        </SharedButton>
        {signerAccountTotal.signingMethod ? (
          <SharedButton
            type="primary"
            iconSize="large"
            size="large"
            onClick={handleConfirm}
            showLoadingOnClick
          >
            {confirmButtonLabel}
          </SharedButton>
        ) : (
          <span className="no-signing">Read-only accounts cannot sign</span>
        )}
      </div>
      <style jsx>
        {`
          section {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: var(--green-95);
            z-index: 5;
          }
          .title {
            color: var(--trophy-gold);
            font-size: 36px;
            font-weight: 500;
            line-height: 42px;
            text-align: center;
          }
          .primary_info_card {
            display: block;
            height: fit-content;
            border-radius: 16px;
            background-color: var(--hunter-green);
            margin: 16px 0px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .footer_actions {
            position: fixed;
            bottom: 0px;
            display: flex;
            width: 100%;
            padding: 0px 16px;
            box-sizing: border-box;
            align-items: center;
            height: 80px;
            justify-content: space-between;
            box-shadow: 0 0 5px rgba(0, 20, 19, 0.5);
            background-color: var(--green-95);
          }
        `}
      </style>
    </section>
  )
}