import type { NextPage } from 'next'
import AddAccountsForm from '../components/AddAccountsForm'
import { WalletConnectContext } from "components/WalletConnectContext"
import { useContext } from "react"
import ContentContainer from 'components/layouts/ContentContainer'
import PageContainer from 'components/layouts/PageContainer'
import Button from 'components/Button/Button'
import SendTip from 'components/SendTip'
import GasTears from "../public/gastears.svg"

const Home: NextPage = () => {
  const { getWallets, connectedWallets } = useContext(WalletConnectContext)

  return (
    <PageContainer isFirstPage>
      <ContentContainer>
        <div className="searchPageTopBar">
          <div className="logo">
            <h1>GasTears</h1>
          </div>
          <Button
            primary
            rounded
            onClick={() => getWallets()}
            disabled={connectedWallets.length > 0}
          >
            {connectedWallets.length > 0 ? "Connected" : "Connect Wallet"}
          </Button>
        </div>
      </ContentContainer>
      <div className="searchPageLogoArea">
        <GasTears className="logoSvg" />
      </div>
      <div className="searchPageMainArea">
        <AddAccountsForm />
      </div>
      <SendTip />
    </PageContainer>
  )
}

export default Home
