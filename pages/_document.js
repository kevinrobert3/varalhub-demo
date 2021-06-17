import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en">
        <Head >
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1f4c94" />
    
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}


export default MyDocument;