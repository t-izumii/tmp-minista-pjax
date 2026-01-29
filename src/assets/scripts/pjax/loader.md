# loader.ts 仕様書

## 🎯 目的
ページコンテンツの取得・解析・処理を一元管理し、安全で高速なコンテンツロードを実現する

## 📋 実装要件

### メインクラス設計
**クラス名**: `ContentLoader`
**役割**: HTTP通信によるページ取得とHTML解析処理

### コンストラクタ要件
**引数**: `options: PJAXOptions`
**初期化内容**:
- オプション設定の保存
- AbortController の初期化

### プライベートプロパティ
- `options`: PJAX設定オプション
- `abortController`: 現在の通信制御インスタンス

## 🚀 公開メソッド仕様

### loadPage メソッド (中核機能)
**メソッド名**: `loadPage`
**引数**: `url: string`
**戻り値**: `Promise<PageContent>`
**目的**: 指定URLからページコンテンツを取得し構造化データとして返す

**処理フロー**:
1. 進行中リクエストの中止処理
2. 新しいAbortController生成
3. タイムアウト付きHTTPリクエスト実行
4. レスポンス検証(ステータス、Content-Type)
5. HTML文字列の取得
6. DOMParser によるHTML解析
7. コンテンツ抽出(タイトル、本文、スクリプト等)
8. 相対パスの絶対パス変換
9. PageContent オブジェクトの生成

**エラーハンドリング**:
- ネットワークエラー → NETWORK_ERROR
- タイムアウト → TIMEOUT_ERROR  
- HTML解析エラー → PARSE_ERROR
- コンテナ未発見 → CONTAINER_NOT_FOUND

### abort メソッド
**メソッド名**: `abort`
**引数**: なし
**戻り値**: `void`
**目的**: 進行中のHTTPリクエストを中止

### destroy メソッド
**メソッド名**: `destroy`
**引数**: なし
**戻り値**: `void`
**目的**: インスタンスのクリーンアップとリソース解放

## 🔧 プライベートメソッド仕様

### fetchPage メソッド
**目的**: 実際のHTTP通信を実行
**検証項目**:
- HTTPステータスコード
- Content-Type ヘッダー
- レスポンスボディの存在

**ヘッダー設定**:
- Accept: 'text/html,application/xhtml+xml'
- X-PJAX: 'true' (サーバー識別用)
- X-Requested-With: 'XMLHttpRequest'

### parsePageContent メソッド
**目的**: HTML文字列をPageContentオブジェクトに変換
**抽出対象**:
- ページタイトル (title要素またはh1要素)
- メインコンテンツ (data-pjax-container内)
- ページ固有スクリプト (data-pjax属性付き)
- ページ固有スタイル (data-pjax属性付き)

### resolveRelativePaths メソッド
**目的**: 相対パスを絶対パスに変換
**対象要素**:
- img要素のsrc属性
- a要素のhref属性  
- link要素のhref属性
- その他のリソース参照

## 📋 実装優先度

### Phase 1 (必須 - 基本機能)
1. クラス基本構造とコンストラクタ
2. `loadPage` メソッド (シンプル版)
3. `fetchPage` メソッド
4. `parsePageContent` メソッド (基本版)
5. `abort`, `destroy` メソッド

### Phase 2 (推奨 - 機能向上)
1. 詳細なエラーハンドリング
2. タイムアウト処理強化
3. `resolveRelativePaths` メソッド
4. レスポンス検証の強化
5. プリフライトチェック

### Phase 3 (オプション - 高度機能)
1. スクリプト・スタイル抽出機能
2. コンテンツ圧縮対応
3. プログレッシブローディング
4. キャッシュヘッダー対応

## 🚨 セキュリティ要件

### HTML サニタイズ
- script タグの除去
- 危険なイベントハンドラ属性の除去
- iframe 制限の実装

### リクエスト制限  
- 同一ドメインのみ許可
- HTTPS プロトコル優先
- リクエスト頻度制限

### エラー情報の制御
- 詳細なエラー情報の外部非公開
- ログレベルによる情報制御

## 🛠️ Ministaフレームワーク対応

### 開発環境設定
- Cache-Control: no-cache ヘッダー
- 開発サーバー用のポート設定
- HMR (Hot Module Replacement) 対応

### 本番環境最適化
- 圧縮対応 (gzip, brotli)
- CDN対応のURL処理
- バージョン管理対応

---
*ファイル優先度: 🔴 最高 (router.tsの直接依存)*
*依存関係: types.ts, utils.ts*
*推定作業時間: 2-3時間*
*テスト要件: HTTP通信・HTML解析の結合テスト必須*