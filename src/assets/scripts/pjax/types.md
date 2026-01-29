# types.ts 仕様書

## 🎯 目的
PJAXシステム全体で使用するTypeScript型定義を一元管理し、型安全性を確保する

## 📋 実装要件

### 基本設定インターface
**名前**: `PJAXOptions`
**目的**: PJAX動作の設定オプションを定義

**必須プロパティ**:
- `selector` (string): PJAX対象リンクのCSSセレクタ
- `container` (string): 更新対象コンテナのCSSセレクタ  
- `timeout` (number): HTTP通信タイムアウト時間（ミリ秒）
- `cache` (boolean): キャッシュ機能の有効/無効
- `cacheSize` (number): 最大キャッシュ保持数
- `debug` (boolean): デバッグ情報出力の有効/無効

### ページデータinterface  
**名前**: `PageContent`
**目的**: 取得したページの情報を構造化

**必須プロパティ**:
- `url` (string): ページの完全URL
- `title` (string): ページタイトル
- `content` (string): 更新対象のHTML文字列
- `timestamp` (number): データ取得時のタイムスタンプ

**オプションプロパティ**:
- `scripts` (string[]): ページ固有JavaScript
- `styles` (string[]): ページ固有CSS

### ナビゲーションイベント管理
**名前**: `NavigationEvent` 
**目的**: ページ遷移イベントの情報を記録

**プロパティ**:
- `from` (string): 遷移前URL
- `to` (string): 遷移先URL
- `timestamp` (number): イベント発生時刻
- `type` ('click' | 'popstate'): イベント種別

**名前**: `NavigationResult`
**目的**: ナビゲーション処理の結果を表現

**プロパティ**:
- `success` (boolean): 処理成功フラグ
- `url` (string): 実際の遷移先URL
- `duration` (number): 処理にかかった時間
- `cached` (boolean): キャッシュ使用フラグ
- `error` (Error, optional): エラー情報

### キャッシュ管理型
**名前**: `CacheEntry`
**目的**: キャッシュされた個別エントリのメタデータ

**プロパティ**:
- `content` (PageContent): キャッシュされたページデータ
- `expiry` (number): 有効期限タイムスタンプ
- `hitCount` (number): アクセス回数

**名前**: `CacheStats`
**目的**: キャッシュ全体の統計情報

**プロパティ**:
- `size` (number): 現在のエントリ数
- `maxSize` (number): 最大容量
- `hitRate` (number): ヒット率（0-1の範囲）
- `totalHits` (number): 総ヒット数
- `totalMisses` (number): 総ミス数

### エラー処理型
**名前**: `PJAXError` (class)
**目的**: PJAX固有のエラー情報を管理

**必須プロパティ**:
- `code` (string): エラー識別コード
- `message` (string): エラーメッセージ
- `name` (string): 固定値 'PJAXError'

**オプションプロパティ**:
- `url` (string): エラー発生時のURL  
- `statusCode` (number): HTTPステータスコード

**名前**: `PJAXErrorCode` (union type)
**値の選択肢**:
- 'NETWORK_ERROR': ネットワーク関連エラー
- 'TIMEOUT_ERROR': タイムアウトエラー
- 'PARSE_ERROR': HTML解析エラー
- 'CONTAINER_NOT_FOUND': 対象コンテナ未発見
- 'INVALID_URL': URL形式エラー

## 🔧 実装必須項目

### デフォルト設定定数
**名前**: `DEFAULT_PJAX_OPTIONS`
**型**: `PJAXOptions`
**推奨値**:
- selector: 'a[data-pjax]'
- container: '[data-pjax-container]'
- timeout: 5000
- cache: true
- cacheSize: 10
- debug: false

### 型ガード関数
**関数名**: `isPageContent`
**引数**: `obj: any`
**戻り値**: `obj is PageContent`
**動作**: オブジェクトがPageContent型かどうかを検証

**関数名**: `isPJAXError`  
**引数**: `error: any`
**戻り値**: `error is PJAXError`
**動作**: エラーがPJAXError型かどうかを検証

### ユーティリティ型
- `PartialPJAXOptions`: PJAXOptionsの部分型
- `EventHandler<T>`: イベントハンドラー関数の型
- `LogLevel`: ログレベル ('debug' | 'info' | 'warn' | 'error')

### URLバリデーション型
**名前**: `URLValidation`
**プロパティ**:
- `isValid` (boolean): URL形式の有効性
- `isSameDomain` (boolean): 同一ドメインかどうか
- `isSupported` (boolean): PJAX処理対象かどうか
- `reason` (string, optional): 無効な場合の理由

## 📈 実装優先度

**Phase 1 (必須 - 他ファイルの基盤)**:
1. PJAXOptions interface
2. PageContent interface
3. DEFAULT_PJAX_OPTIONS 定数

**Phase 2 (推奨 - 機能拡張用)**:
1. NavigationEvent, NavigationResult interface
2. PJAXError class と PJAXErrorCode type

**Phase 3 (オプション - 高度機能)**:
1. CacheEntry, CacheStats interface
2. 型ガード関数群
3. URLValidation interface

## 🚨 注意事項

### 命名規約
- interface名はPascalCase
- プロパティ名はcamelCase
- 型エイリアスはPascalCase

### エクスポート要件
- 全ての型・interface・classを名前付きエクスポート
- DEFAULT_PJAX_OPTIONS も名前付きエクスポート

### 相互依存の回避
- このファイルは他のpjaxファイルに依存してはいけない
- 純粋な型定義とユーティリティ関数のみ

---
*ファイル優先度: 🔴 最高 (全ファイルの依存基盤)*
*推定作業時間: 30分-1時間*
*テスト要件: 型ガード関数の単体テスト*