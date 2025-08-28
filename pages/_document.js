import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6681408087619836"
               crossOrigin="anonymous"></script>
        <script async custom-element="amp-auto-ads"
                src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js">
        </script>
      </Head>
      <body>
        <amp-auto-ads type="adsense"
                data-ad-client="ca-pub-6681408087619836">
        </amp-auto-ads>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}