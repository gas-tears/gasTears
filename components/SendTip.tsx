import React, { useContext, useState } from 'react'
import { WalletConnectContext } from './WalletConnectContext'

export default function SendTip() {
    const {
        changeNetwork,
        sendTip,
        connectedChain
    } = useContext(WalletConnectContext)

    const [tipValue, setTipValue] = useState("")
    const [isManualTip, setIsManualTip] = useState(false)

    return (
        <div className="tipJarWrapper">
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <label
                    className="tipJarLabel primaryTextGradient"
                    htmlFor='tipValue'
                >
                    Crypto tip jar
                </label>
                <span className="material-icons tipSwap" onClick={() => setIsManualTip(!isManualTip)}>
                    swap_horiz
                </span>
            </div>
            <div className="tipJarContent">
                {isManualTip ?
                    <div className="sendTipGroupSeparator">
                        <input
                            className="tipManualInput"
                            type="number"
                            value={tipValue}
                            onChange={(e) => setTipValue(e.target.value)}
                            id="tipValue"
                            placeholder='10'
                        />
                    </div>
                    :
                    <div className="buttonGroup sendTipGroupSeparator">
                        {autoTipOptions.map((option) => (
                            <button
                                className='btn btnAutoTip btnSmall'
                                onClick={() => sendTip(parseFloat(option))}
                            >
                                {option}
                            </button>
                        ))}
                    </div>}
                <select
                    name="chainSelect"
                    id="chainSelect"
                    className="tipChainSelect"
                    value={connectedChain}
                    onChange={(e) => changeNetwork(e.target.value)}
                >
                    {options.map(({ value, label }) => {
                        return <option key={value} value={value}>{label}</option>
                    })}
                </select>
                {isManualTip &&
                    <button
                        className="btn btnPrimary btnRounded btnSmall"
                        style={{ marginLeft: "1rem" }}
                        onClick={() => sendTip(parseFloat(tipValue))}
                        disabled={!tipValue || parseFloat(tipValue) <= 0}
                    >
                        send
                    </button>
                }
            </div>
        </div>
    )
}

const autoTipOptions = [
    "0.01",
    "0.1",
    '1'
]

const options = [
    { value: "0x1", label: "ETH" },
    { value: "0xa86a", label: "AVAX" },
    { value: "0xfa", label: "FTM" },
    { value: "0x38", label: "BNB" },
    { value: "0x89", label: "MATIC" },
]
