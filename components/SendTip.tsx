import React, { useContext, useState } from 'react'
import { WalletConnectContext } from './WalletConnectContext'

export default function SendTip() {
    const {
        changeNetwork,
        sendTip,
        connectedChain
    } = useContext(WalletConnectContext)

    const [tipValue, setTipValue] = useState("")

    return (
        <div style={{ margin: "1rem" }}>
            <label htmlFor='tipValue' style={{ fontSize: "0.8rem" }}>Send me some tips</label><br />
            <div style={{ display: "flex" }}>

                <input
                    type="number"
                    value={tipValue}
                    onChange={(e) => setTipValue(e.target.value)}
                    id="tipValue"
                />
                <select
                    name="chainSelect"
                    id="chainSelect"
                    value={connectedChain}
                    onChange={(e) => changeNetwork(e.target.value)}
                >
                    {options.map(({ value, label }) => {
                        return <option key={value} value={value}>{label}</option>
                    })}
                </select>
                <button onClick={() => sendTip(parseFloat(tipValue))}>send</button>
            </div>
        </div>
    )
}


const options = [
    { value: "0x1", label: "ETH" },
    { value: "0xa86a", label: "AVAX" },
    { value: "0xfa", label: "FTM" },
    { value: "0x38", label: "BNB" },
    { value: "0x89", label: "MATIC" },
]
