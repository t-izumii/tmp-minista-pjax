import type { PageProps, Metadata } from "minista"
import { Head } from "minista"
import "./index.scss"
import Kv from "../components/Top/kv"

export const metadata: Metadata = {
  url: "/",
  title: "Home",
  description: "test",
}

export default function ({ url, title, description, children }: PageProps) {
  return (
    <>
      <Head></Head>
      <Kv></Kv>
      <h1 className="mt-[1rem] text-blue-500 font-bold">page Index</h1>
    </>
  )
}
