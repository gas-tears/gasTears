import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import AddAccountsForm from '../components/AddAccountsForm'
import useWalletConnect from 'hooks/useWalletConnect'


const Home: NextPage = () => {
  const { connectedWallets, getWallets } = useWalletConnect()

  return (
    <div className="search-page-container">
      <div className="search-page-top-bar">
        <div className="content-container">
          <button
            className="btn btn-primary btn-rounded"
            onClick={() => getWallets()}
          >Connect Wallet</button>
        </div>
      </div>
      <div className="search-page-main">
        <AddAccountsForm connectedWallets={connectedWallets} />
      </div>
    </div >
  )
}

export default Home
