import AvaxLogo from "./svg/avax-logo.svg"
import BnbLogo from "./svg/bnb-logo.svg"
import EthLogo from "./svg/eth-logo.svg"
import FtmLogo from "./svg/ftm-logo.svg"
import MaticLogo from "./svg/matic-logo.svg"

import React from 'react';
import { Chains } from "types"

export type IconName = Chains | "blockChain"

type Props = {
    name: IconName
}

const Icon: React.FC<Props & React.SVGProps<SVGElement>> = ({
    name,
    ...props
}) => {
    const ReturnIcon = IconsMap[name]
    return <ReturnIcon {...props} />;
};


type IconsMapType = {
    [I in IconName]: any
}

const IconsMap: IconsMapType = {
    "avalanche-2": AvaxLogo,
    "binancecoin": BnbLogo,
    "ethereum": EthLogo,
    "fantom": FtmLogo,
    "matic-network": MaticLogo,
    "blockChain": MaticLogo
}

export default Icon;
