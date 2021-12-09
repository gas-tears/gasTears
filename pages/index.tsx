import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import AddAccountsForm from '../components/AddAccountsForm'

const Home: NextPage = () => {
  return (
    <div className="search-page-container">
      <div className="search-page-top-bar">
        <div className="content-container">
          <button className="btn btn-primary btn-rounded">Connect Wallet</button>
        </div>
      </div>
      <div className="search-page-main">
        <AddAccountsForm />
      </div>
    </div >
  )
}

export default Home
