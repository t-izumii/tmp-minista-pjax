class SimplePjax {
  constructor() {}

  init(): void {
    console.log("init")

    // **イベントリスナー設定内容**
    // **`click` イベント: ページ全体のリンククリック監視**
    document.addEventListener("click", (event) => {
      this.#_watchLinks(event)
    })

    // **イベント: ブラウザ戻る/進むボタン対応**
    window.addEventListener("popstate", () => {
      this.#_loadPage(window.location.href)
    })

    // **イベント: ページ離脱時のクリーンアップ**
    //todo:何を処理したら良いか
    window.addEventListener("beforeunload", () => {})
  }

  #_watchLinks(event) {
    const target = event.target as HTMLElement
    const link = target.closest("a") as HTMLAnchorElement

    // 除外dataが付与されている
    if (link.dataset.nopjax) {
      console.log("除外クラスが付与")
      return false
    }

    //同一ドメインじゃない場合に除外する
    if (link.hostname !== window.location.hostname) {
      console.log("別ドメイン")
      return false
    }

    //ターゲットブランク時に除外
    if (link.getAttribute("target") == "_blank") {
      console.log("別タブです")
      return false
    }

    //特殊キーを押している場合
    // if(){

    // }

    if (link) {
      console.log("リンクがクリックされました:", link.href)
      console.log("PJAXで処理します:", link.href)
      event.preventDefault()
      this.#_loadPage(link.href)
    }
  }

  async #_loadPage(url) {
    console.log("ページを読み込みます:", url)

    try {
      const response = await fetch(url)
      const html = await response.text()
      console.log("ページ取得成功")

      const parser = new DOMParser()
      const newDoc = parser.parseFromString(html, "text/html")
      const newContent = newDoc.querySelector("[data-pjax-container]")

      if (newContent) {
        const currentContent = document.querySelector("[data-pjax-container]")

        if (currentContent) {
          currentContent.innerHTML = newContent.innerHTML
          console.log("ページ更新完了")
          window.history.pushState({}, "", url)
          const newTitle = newDoc.querySelector("title")

          if (newTitle) {
            document.title = newTitle.textContent || document.title
          }
        }
      }
    } catch (error) {
      console.error("ページ読み込みエラー:", error)
      window.location.href = url
    }
  }
}

export default SimplePjax
