# router.ts 仕様書

## 🎯 目的
PJAXシステムの中核となるルーティング制御を担当し、ナビゲーション処理全体を統括管理する

## 📋 実装要件

### メインクラス設計
**クラス名**: `PJAXRouter`
**役割**: PJAX ナビゲーション処理の中央制御塔

### コンストラクタ要件
**引数**: `options: PJAXOptions`
**初期化処理**:
- ContentLoader インスタンスの生成
- PageCache インスタンスの生成 
- HistoryManager インスタンスの生成
- 現在URL の記録
- ナビゲーション状態の初期化

### プライベートプロパティ
- `options`: PJAX設定オプション
- `loader`: コンテンツローダーインスタンス
- `cache`: ページキャッシュインスタンス  
- `history`: 履歴管理インスタンス
- `isNavigating`: ナビゲーション実行中フラグ
- `currentUrl`: 現在のURL文字列

## 🚀 公開メソッド仕様

### navigate メソッド (中核機能)
**メソッド名**: `navigate`
**引数**: `url: string`
**戻り値**: `Promise<NavigationResult>`
**目的**: 指定URLへのPJAXナビゲーションを実行

**処理フロー**:
1. 重複ナビゲーションのチェック
2. URL正規化とバリデーション
3. 同一URL遷移のスキップ処理
4. ナビゲーション開始イベント発火
5. 現在ページのキャッシュ保存
6. コンテンツ取得 (キャッシュ優先)
7. ページ更新処理
8. 履歴状態更新
9. パフォーマンス計測とログ出力
10. 完了/エラーイベント発火

**エラーハンドリング**:
- タイムアウトエラー
- ネットワークエラー  
- URLバリデーションエラー
- コンテナ未発見エラー
```

### handlePopState メソッド
**メソッド名**: `handlePopState`
**引数**: `event: PopStateEvent`
**戻り値**: `Promise<void>`
**目的**: ブラウザの戻る/進むボタン動作を処理

**処理フロー**:
1. popstateイベントの状態チェック
2. PJAX状態でない場合はページリロード
3. キャッシュからの復元を試行
4. 失敗時は通常ナビゲーションにフォールバック

### updatePage メソッド
**メソッド名**: `updatePage` (private)
**引数**: `pageContent: PageContent`
**戻り値**: `Promise<void>`
**目的**: DOMを新しいページコンテンツで更新

**処理内容**:
1. 更新対象コンテナの存在チェック
2. 更新前イベント発火
3. DOMコンテンツの置換
4. ページタイトルの更新
5. ページ固有スクリプトの実行
6. 更新後イベント発火
7. スクロール位置の初期化
```

### updatePage メソッド
```typescript
private async updatePage(pageContent: PageContent): Promise<void> {
  logger.debug('Updating page content')
  
  // コンテナの存在チェック
  const container = document.querySelector(this.options.container)
  if (!container) {
    throw createPJAXError(
      `Container not found: ${this.options.container}`,
      'CONTAINER_NOT_FOUND'
    )
  }
  
  try {
    // 更新前イベントを発火
    dispatchCustomEvent('pjax:beforeUpdate', { 
      url: pageContent.url,
      content: pageContent.content 
    })
    
    // コンテンツを更新
    container.innerHTML = pageContent.content
    
    // タイトルを更新
    if (pageContent.title) {
      document.title = pageContent.title
    }
    
    // ページ固有のスクリプトを実行（必要に応じて）
    if (pageContent.scripts && pageContent.scripts.length > 0) {
      await this.executePageScripts(pageContent.scripts)
    }
    
    // 更新後イベントを発火
    dispatchCustomEvent('pjax:afterUpdate', { 
      url: pageContent.url,
      container 
    })
    
    // スクロール位置をトップに
    window.scrollTo(0, 0)
    
    logger.debug('Page content updated successfully')
    
  } catch (error) {
    logger.error('Failed to update page content:', error)
    throw createPJAXError(
      'Failed to update page content',
      'PARSE_ERROR',
      pageContent.url
    )
  }
}
```

### handlePopState メソッド
```typescript
async handlePopState(event: PopStateEvent): Promise<void> {
  const url = window.location.href
  logger.debug('Handling popstate event:', url)
  
  // PJAX の状態かチェック
  if (!event.state || !event.state.pjax) {
    logger.debug('Non-PJAX popstate, reloading page')
    window.location.reload()
    return
  }
  
  try {
    // キャッシュから復元を試行
    if (this.options.cache && this.cache.has(url)) {
      const pageContent = this.cache.get(url)!
      await this.updatePage(pageContent)
      this.currentUrl = url
      
      // popstate ナビゲーションイベントを発火
      const navigationEvent: NavigationEvent = {
        from: this.currentUrl,
        to: url,
        timestamp: Date.now(),
        type: 'popstate'
      }
      dispatchCustomEvent('pjax:popstate', navigationEvent)
      
    } else {
      // キャッシュにない場合は通常のナビゲーション
      await this.navigate(url)
    }
    
  } catch (error) {
    logger.error('PopState handling failed:', error)
    // フォールバック: ページリロード
    window.location.reload()
  }
}
```

### cacheCurrentPage メソッド
```typescript
cacheCurrentPage(): void {
  if (!this.options.cache) return
  
  try {
    const container = document.querySelector(this.options.container)
    if (!container) return
    
    const pageContent: PageContent = {
      url: this.currentUrl,
      title: document.title,
      content: container.innerHTML,
      timestamp: Date.now()
    }
    
    this.cache.set(this.currentUrl, pageContent)
    logger.debug('Current page cached:', this.currentUrl)
    
  } catch (error) {
    logger.warn('Failed to cache current page:', error)
  }
}
```

### executePageScripts メソッド（オプション）
```typescript
private async executePageScripts(scripts: string[]): Promise<void> {
  logger.debug('Executing page scripts:', scripts.length)
  
  for (const scriptContent of scripts) {
    try {
      // 安全なスクリプト実行（eval の代替）
      const scriptElement = document.createElement('script')
      scriptElement.textContent = scriptContent
      document.head.appendChild(scriptElement)
      document.head.removeChild(scriptElement)
    } catch (error) {
      logger.warn('Failed to execute page script:', error)
    }
  }
}
```

### destroy メソッド
```typescript
destroy(): void {
  logger.debug('Destroying PJAXRouter')
  
  // リソースのクリーンアップ
  this.loader.destroy()
  this.cache.clear()
  this.history.destroy()
  
  // 状態のリセット
  this.isNavigating = false
  
  logger.debug('PJAXRouter destroyed')
}
```

### その他のメソッド

**メソッド名**: `cacheCurrentPage`
**引数**: なし
**戻り値**: `void`
**目的**: 現在表示中のページをキャッシュに保存

**メソッド名**: `destroy`
**引数**: なし
**戻り値**: `void`
**目的**: インスタンスのクリーンアップとリソース解放

### 状態取得メソッド

**メソッド名**: `isNavigationInProgress`
**戻り値**: `boolean`
**目的**: ナビゲーション実行中かどうかを取得

**メソッド名**: `getCurrentUrl`
**戻り値**: `string`
**目的**: 現在のURLを取得

**メソッド名**: `getCacheStats`
**戻り値**: `CacheStats`
**目的**: キャッシュ統計情報を取得

**メソッド名**: `getOptions`
**戻り値**: `PJAXOptions`
**目的**: 現在の設定を取得 (ディープコピー)
```

## 📋 実装優先度

### Phase 1 (必須 - 基本機能)
1. クラス基本構造とコンストラクタ
2. `navigate` メソッド (シンプル版)
3. `updatePage` メソッド (基本版)
4. `handlePopState` メソッド
5. `destroy` メソッド

### Phase 2 (推奨 - 機能充実)
1. キャッシュ連携機能
2. エラーハンドリング強化
3. カスタムイベント発火
4. `cacheCurrentPage` メソッド
5. パフォーマンス計測

### Phase 3 (オプション - 高度機能)
1. ページ固有スクリプト実行
2. アニメーション効果
3. 詳細なログ出力
4. A/Bテスト対応

## 🚀 設計指針

### イベント発火仕様
**発火タイミング**:
- 'pjax:start' - ナビゲーション開始時
- 'pjax:beforeUpdate' - DOM更新直前
- 'pjax:afterUpdate' - DOM更新直後
- 'pjax:end' - ナビゲーション完了時
- 'pjax:error' - エラー発生時
- 'pjax:popstate' - 履歴移動時

### エラーハンドリング戦略
- 継続可能エラー: キャッシュから復旧
- 致命的エラー: 通常ページ遷移にフォールバック
- タイムアウト: ユーザーに情報表示後フォールバック

### パフォーマンス考慣
- 重複ナビゲーションの防止
- 同一URL遷移のスキップ
- キャッシュヒット率の最大化
- DOM更新の最小化

---
*ファイル優先度: 🔴 最高 (PJAXシステムの中核)*
*依存関係: types.ts, utils.ts, loader.ts, cache.ts, history.ts*
*推定作業時間: 3-4時間*
*テスト要件: ナビゲーションフローの結合テスト必須*