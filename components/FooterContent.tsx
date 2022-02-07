import React from 'react';
import ContentContainer from 'components/layouts/ContentContainer'
import RecaptchaTOS from 'components/RecaptchaTOS'
import SendTip from 'components/SendTip'
import SocialsLinks from 'components/SocialsLinks'

const FooterContent = () => {
    return (
        <ContentContainer>
            <div className="footerContent">
                <div className="tipAndCaptchaContainer">
                    <SendTip />
                    <RecaptchaTOS />
                </div>
                <div className='socialLinksContainer'>
                    <SocialsLinks />
                </div>
            </div>
        </ContentContainer>
    );
};

export default FooterContent;
