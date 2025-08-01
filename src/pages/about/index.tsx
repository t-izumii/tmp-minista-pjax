import type { PageProps, Metadata } from "minista"
import { Head } from "minista"
import "./index.scss"

export const metadata: Metadata = {
  url: "/about",
  title: "about",
  description: "test",
}

export default function ({ url, title, description, children }: PageProps) {
  return (
    <>
      <Head></Head>
      <h1 className="mt-[1rem] text-blue-500 font-bold">page About</h1>
    </>
  )
}
