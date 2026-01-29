# utils.ts 仕様書

## 🎯 目的
PJAXシステム全体で使用する共通ユーティリティ関数を提供し、コードの再利用性と保守性を向上させる

## 📋 実装要件

### URL検証・操作関数群

**関数名**: `isValidUrl`
**引数**: `url: string`
**戻り値**: `boolean`
**目的**: URL文字列が有効な形式かを検証
**動作**: URL constructorで検証し、エラーの場合はfalseを返す

**関数名**: `isSameDomain`
**引数**: `url: string`
**戻り値**: `boolean`
**目的**: 指定URLが現在のドメインと同一かを判定
**動作**: hostname比較で同一ドメインかチェック

**関数名**: `validateUrl`
**引数**: `url: string`
**戻り値**: `URLValidation`
**目的**: URLの総合的な妥当性を検証
**検証項目**:
- URL形式の妥当性
- 同一ドメインかどうか
- PJAX処理対象パスかどうか
- サポートされているプロトコルか

**関数名**: `normalizeUrl`
**引数**: `url: string`
**戻り値**: `string`
**目的**: 相対URLを絶対URLに正規化
**動作**: 現在のoriginを基準にして絶対URLを生成
```

### DOM操作・安全性関数群

**関数名**: `elementExists`
**引数**: `selector: string`
**戻り値**: `boolean`
**目的**: 指定セレクタの要素が存在するかチェック
**動作**: querySelector結果がnullでないかを判定

**関数名**: `safeQuerySelector`
**引数**: `selector: string`
**戻り値**: `Element | null`
**目的**: 安全な要素取得（セレクタエラー対応）
**動作**: try-catchでselectExceptionを捕捉し、nullを返す

**関数名**: `sanitizeHtml`
**引数**: `html: string`
**戻り値**: `string`
**目的**: HTMLコンテンツの基本的なサニタイズ
**処理内容**:
- scriptタグの除去
- 危険なイベントハンドラ属性の除去
- iframeタグの制限

**関数名**: `isElementInViewport`
**引数**: `element: Element`
**戻り値**: `boolean`
**目的**: 要素がビューポート内にあるかを判定
**動作**: getBoundingClientRectで座標を取得し判定
```

### パフォーマンス計測・制御関数群

**関数名**: `measureTime`
**引数**: `fn: () => Promise<T>, label: string`
**戻り値**: `Promise<{result: T, duration: number}>`
**目的**: 非同期処理の実行時間を計測
**動作**:
- performance.nowで開始・終了時刻を記録
- ログ出力とともに結果と実行時間を返す

**関数名**: `debounce`
**引数**: `func: T, delay: number`
**戻り値**: デバウンスされた関数
**目的**: 連続実行を防ぐ（最後の呼び出しのみ実行）
**用途**: 検索入力、リサイズイベント等

**関数名**: `throttle`
**引数**: `func: T, delay: number`
**戻り値**: スロットルされた関数
**目的**: 実行頻度を制限（指定間隔で最大1回実行）
**用途**: スクロールイベント、マウス移動等
```

### ログ管理クラス・関数群

**クラス名**: `Logger`
**目的**: レベル別ログ出力と制御機能を提供

**コンストラクタ**:
- `level: LogLevel` (デフォルト: 'info')
- `prefix: string` (デフォルト: '[PJAX]')

**メソッド**:
- `debug(message, ...args)`: デバッグレベルログ
- `info(message, ...args)`: 情報レベルログ
- `warn(message, ...args)`: 警告レベルログ
- `error(message, ...args)`: エラーレベルログ

**ログレベル制御**:
- 設定レベル以上のログのみ出力
- レベル順位: debug < info < warn < error

**エクスポート要件**:
- `logger`: デフォルトインスタンス
- `setLogLevel`: ログレベル設定関数
```

### イベント判定・送出関数群

**関数名**: `shouldHandleLink`
**引数**: `link: HTMLAnchorElement, event: MouseEvent`
**戻り値**: `boolean`
**目的**: リンクがPJAX処理対象かどうかを判定

**除外条件**:
- 外部ドメインリンク
- 特殊キー押下時 (Ctrl/Meta/Shift)
- target="_blank" 属性
- download 属性
- ハッシュリンク（同一ページ内）
- data-pjax-ignore 属性

**関数名**: `dispatchCustomEvent`
**引数**: `eventName: string, detail?: any, element?: EventTarget`
**戻り値**: `void`
**目的**: カスタムイベントの発火
**設定**:
- bubbles: true (バブルアップ有効)
- cancelable: true (キャンセル可能)
- detail: カスタムデータ付与
```

### エラー処理支援関数群

**関数名**: `createPJAXError`
**引数**: `message: string, code: PJAXErrorCode, url?: string, statusCode?: number`
**戻り値**: `PJAXError`
**目的**: PJAX固有エラーオブジェクトを生成
**動作**: PJAXErrorコンストラクタを呼び出し

**関数名**: `getErrorType`
**引数**: `error: Error`
**戻り値**: `PJAXErrorCode`
**目的**: 汎用エラーかPJAXエラーコードを推定
**判定ロジック**:
- TypeError + fetch文字 → NETWORK_ERROR
- AbortError + timeout文字 → TIMEOUT_ERROR  
- parse/DOM文字 → PARSE_ERROR
- その他 → NETWORK_ERROR

**関数名**: `getErrorMessage`
**引数**: `code: PJAXErrorCode`
**戻り値**: `string`
**目的**: エラーコードから日本語メッセージを生成
**メッセージマッピング**:
- NETWORK_ERROR: "ネットワークエラーが発生しました"
- TIMEOUT_ERROR: "リクエストがタイムアウトしました"
- PARSE_ERROR: "ページの解析に失敗しました"
- CONTAINER_NOT_FOUND: "更新対象のコンテナが見つかりません"
- INVALID_URL: "無効なURLです"
```

### その他のユーティリティ関数群

**関数名**: `generateId`
**引数**: `prefix?: string`
**戻り値**: `string`
**目的**: 一意なID文字列を生成
**フォーマット**: `{prefix}-{timestamp}-{random}`

**関数名**: `deepCopy`
**引数**: `obj: T`
**戻り値**: `T`
**目的**: オブジェクトのディープコピーを作成
**手法**: JSON.parse/stringifyでシリアル化
**制限**: 関数、Symbol等はコピー不可

**関数名**: `withTimeout`
**引数**: `promise: Promise<T>, timeoutMs: number, timeoutMessage?: string`
**戻り値**: `Promise<T>`
**目的**: Promiseにタイムアウト機能を付与
**動作**: Promise.raceで元PromiseとタイムアウトPromiseを競争

**関数名**: `checkBrowserSupport`
**引数**: なし
**戻り値**: `boolean`
**目的**: PJAXに必要なAPIのブラウザ対応をチェック
**チェック項目**:
- fetch API
- History API (history.pushState)
- DOMParser API
```

## 📋 実装優先度

### Phase 1 (必須 - 基本機能)
1. `isValidUrl` - URL形式検証
2. `isSameDomain` - ドメイン判定
3. `shouldHandleLink` - リンク判定
4. `safeQuerySelector` - 安全DOM操作
5. `createPJAXError` - エラー生成

### Phase 2 (推奨 - 機能向上)
1. `validateUrl` - 総合URL検証
2. `Logger`クラス - ログ管理
3. `getErrorType`, `getErrorMessage` - エラー処理
4. `dispatchCustomEvent` - イベント送出
5. `withTimeout` - タイムアウト処理

### Phase 3 (オプション - 高度機能)
1. `measureTime` - パフォーマンス計測
2. `debounce`, `throttle` - 実行制御
3. `sanitizeHtml` - HTMLサニタイズ
4. `generateId`, `deepCopy` - ユーティリティ
5. `checkBrowserSupport` - 対応チェック

## 🚀 注意事項

### エクスポート要件
- 全関数を名前付きエクスポート
- `logger`インスタンスもエクスポート

### パフォーマンス考慣
- URL検証はキャッシュを考慮
- DOM操作は最小限に抑える
- ログ出力はパフォーマンスに配慮

### セキュリティ考慮
- HTMLサニタイズは基本的なレベル
- XSS対策は他のレイヤーで実施
- eval()は使用しない

### テスト要件
- 特にURL検証関数群の単体テストが必須
- エッジケースを含む網羅的テスト

---
*ファイル優先度: 🔴 最高 (全ファイルから使用)*
*依存関係: types.ts*
*推定作業時間: 1.5-2.5時間*
*テスト要件: URL関連関数の単体テスト必須*