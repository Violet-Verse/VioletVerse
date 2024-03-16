import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { CssBaseline } from "@nextui-org/react";
import Script from "next/script";

// import Segment Snippet
import * as snippet from "@segment/snippet";
const { ANALYTICS_WRITE_KEY, NODE_ENV } = process.env;

function renderSnippet() {
    const opts = {
        apiKey: ANALYTICS_WRITE_KEY,
        // note: the page option only covers SSR tracking.
        // Page.js is used to track other events using `window.analytics.page()`
        page: true,
    };

    if (NODE_ENV === "development") {
        return snippet.max(opts);
    }

    return snippet.min(opts);
}

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return {
            ...initialProps,
            styles: React.Children.toArray([initialProps.styles]),
        };
    }

    render() {
        return (
            <Html lang="en">
                <Head>
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3918344970480538"
     crossorigin="anonymous"></script>
                    {CssBaseline.flush()}
                    {/* Segment Analytics Injection  */}
                    <script
                        id="segment-script"
                        dangerouslySetInnerHTML={{ __html: renderSnippet() }}
                    />
                    {/* Google Analytics */}
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-1GV06YH6SV');
        `}
                    </Script>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
