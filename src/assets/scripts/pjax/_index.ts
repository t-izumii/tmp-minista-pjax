class SimplePJAX {
  // 初期化
  init() {
    console.log("PJAX初期化しました")

    this.start()
  }

  // 動作開始
  start() {
    console.log("PJAX動作開始")
    this.watchLinks()
  }

  watchLinks() {
    // ページ全体のクリックを監視
    document.addEventListener("click", (event) => {
      // クリックされた要素を取得
      const target = event.target as HTMLElement

      // aタグ（リンク）かチェック
      const link = target.closest("a") as HTMLAnchorElement

      //todo: ドメインで条件追加
      //todo:　除外条件を追加
      if (link) {
        console.log("リンクがクリックされました:", link.href)

        console.log("PJAXで処理します:", link.href)
        event.preventDefault()
        this.loadPage(link.href)
      }
    })
  }

  async loadPage(url: string) {
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

export default SimplePJAX
