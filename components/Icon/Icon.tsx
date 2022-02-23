import AvaxLogo from "./svg/avax-logo.svg"
import BnbLogo from "./svg/bnb-logo.svg"
import EthLogo from "./svg/eth-logo.svg"
import FtmLogo from "./svg/ftm-logo.svg"
import MaticLogo from "./svg/matic-logo.svg"
import DiscordLogo from "./svg/discord-logo.svg"
import RedditLogo from "./svg/reddit-logo.svg"
import TikTokLogo from "./svg/tiktok-logo.svg"
import TwitterLogo from "./svg/twitter-logo.svg"
import HooLogo from "./svg/hoo-logo.svg"


import React from 'react';
import { Chains } from "types"

export type Socials = "discord" | "reddit" | "tiktok" | "twitter"

export type IconName = Chains | "blockChain" | Socials

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
    "blockChain": MaticLogo,
    "discord": DiscordLogo,
    "reddit": RedditLogo,
    "tiktok": TikTokLogo,
    "twitter": TwitterLogo,
    "hoo-token": HooLogo,
}

export default Icon;
