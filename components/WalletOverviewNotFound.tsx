import React from 'react';

type Props = {
    address: string
}

const WalletOverviewNotFound: React.FC<Props> = ({
    address
}) => {
    return (
        <div className='walletOverviewSection'>
            <h2 className="walletOverviewName">{address}</h2>
            <div className="walletOverviewWrapper tilePrimary">
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: "center",
                        opacity: 0.5,
                        fontStyle: "italic"
                    }}
                >No information was found for this address</div>
            </div>
        </div>
    );
};

export default WalletOverviewNotFound;
