import React from 'react';
import Icon, { Socials } from "components/Icon/Icon"
import classname from "classnames"
type Props = {
    show?: Socials[],
    orientation?: "horizontal" | "vertical"
}

const SocialsLinks = ({
    show = ["discord", "twitter", "reddit", "tiktok"],
    orientation = "horizontal"
}) => {
    return (
        <div className={classname('socialLinkWrapper', orientation)}>
            {show.map((social) => (
                <a key={social} href={Links[social as Socials]} target="_blank" rel="noreferrer" >
                    <Icon name={social as Socials} width={20} height={20} />
                </a>
            ))}
        </div>
    )
};

type LinksMap = {
    [s in Socials]: string
}

const Links: LinksMap = {
    discord: "https://discord.gg/GeTFsyZJnN",
    reddit: "https://www.reddit.com/r/GasTears/",
    twitter: "https://twitter.com/GasTears",
    tiktok: "https://vm.tiktok.com/ZMLYfY5jo/"
}

export default SocialsLinks;
