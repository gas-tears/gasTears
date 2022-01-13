import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import WalletConnectProvider from 'components/WalletConnectContext'


function MyApp({ Component, pageProps }: AppProps) {
  return (<>
    <Head>
      <title>Gas Usage Tracker</title>
      <meta name="description" content="Keep track of all the gas that you spent through your blockchain exploration" />
      <link rel="icon" href="/favicon.ico" />
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
    </Head>
    <WalletConnectProvider>
      <Component {...pageProps} />
    </WalletConnectProvider>
  </>)
}

export default MyApp
