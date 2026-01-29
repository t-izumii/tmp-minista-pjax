import type { GlobalProps } from "minista"
import { Head } from "minista"
import "./assets/styles/style.scss"
import Header from "./components/header"
import Footer from "./components/footer"

export default function ({ url, title, description, children }: GlobalProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="description" content={description} />
        <script type="module" src="/src/assets/scripts/index.ts" />
      </Head>
      <Header />
      <div data-pjax-container>
        {url === "/" ? (
          <div className="home">{children}</div>
        ) : (
          <div>{children}</div>
        )}
      </div>
      <Footer />
    </>
  )
}
