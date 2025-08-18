import '../styles/globals.css'
import GlobalHeader from '../components/GlobalHeader'

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalHeader />
      <Component {...pageProps} />
    </>
  )
}