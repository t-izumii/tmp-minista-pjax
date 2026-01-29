import "./index.scss"

export default function () {
  return (
    <>
      <header className="c-header">
        <h1>header</h1>
        <nav>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            {/* <li>
              <a href="/about" data-nopjax>
                除外data
              </a>
            </li>
            <li>
              <a href="/about" target="_blank">
                _blank
              </a>
            </li>
            <li>
              <a href="https:google.com" target="_blank">
                google
              </a>
            </li> */}
          </ul>
        </nav>
      </header>
    </>
  )
}
