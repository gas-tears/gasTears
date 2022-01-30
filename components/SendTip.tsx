import React, { useContext, useState } from 'react'
import { ChainHexes } from 'types'
import { WalletConnectContext } from './WalletConnectContext'

export default function SendTip() {
    const {
        changeNetwork,
        sendTip,
        connectedChain
    } = useContext(WalletConnectContext)

    const [tipValue, setTipValue] = useState("")
    const [isManualTip, setIsManualTip] = useState(false)

    const tipOptions = autoTipOptions[chainAutoTipSize[connectedChain]] || autoTipOptions["small"]

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
                        {tipOptions.map((option) => (
                            <button
                                className='btn btnAutoTip btnSmall'
                                onClick={() => sendTip(parseFloat(option))}
                                key={option}
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
                    onChange={(e) => changeNetwork(e.target.value as ChainHexes)}
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

type TipSizes = "small" | "medium" | "large"

type AutoTipOptions = {
    [S in TipSizes]: string[]
}

type ChainAutoTipSize = {
    [C in ChainHexes]: TipSizes
}

const autoTipOptions: AutoTipOptions = {
    small: ["0.01", "0.1", "1"],
    medium: ["0.1", "1", "10"],
    large: ["1", "10", "100"],
}

const chainAutoTipSize: ChainAutoTipSize = {
    "0x1": "small",
    "0xa86a": "medium",
    "0xfa": "large",
    "0x38": "medium",
    "0x89": "large",
}

const options = [
    { value: "0x1", label: "ETH" },
    { value: "0xa86a", label: "AVAX" },
    { value: "0xfa", label: "FTM" },
    { value: "0x38", label: "BNB" },
    { value: "0x89", label: "MATIC" },
]
