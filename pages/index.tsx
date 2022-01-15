import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import AddAccountsForm from '../components/AddAccountsForm'
import useWalletConnect from 'hooks/useWalletConnect'
import { WalletConnectContext } from "components/WalletConnectContext"
import { useContext } from "react"
import ContentContainer from 'components/layouts/ContentContainer'
import PageContainer from 'components/layouts/PageContainer'
import Button from 'components/Button'
import SendTip from 'components/SendTip'

const Home: NextPage = () => {
  const { getWallets, connectedWallets } = useContext(WalletConnectContext)

  return (
    <PageContainer>
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
      <div className="searchPageMainArea">
        <AddAccountsForm />
      </div>
      <SendTip />
    </PageContainer>
  )
}

export default Home
