import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Light mode only - no dark mode */}
          <script dangerouslySetInnerHTML={{ __html: "(function(){try{var root=document.documentElement;var b=document.body;if(root)root.classList.remove('dark');if(b)b.classList.remove('dark');}catch(e){}})();" }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}


