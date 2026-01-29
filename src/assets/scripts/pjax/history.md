# history.ts 仕様書

## 🎯 目的
ブラウザのHistory API を活用したナビゲーション履歴管理を提供し、戻る/進むボタンの完全対応を実現する

## 📋 実装要件

### メインクラス設計
**クラス名**: `HistoryManager`
**役割**: PJAX用ブラウザ履歴の統合管理

### コンストラクタ要件
**引数**: なし
**初期化内容**:
- 現在状態の初期化
- 初期化フラグの設定
- 現在ページのPJAX状態化

### プライベートプロパティ
- `currentState`: 現在のPJAX履歴状態
- `initialized`: 初期化完了フラグ

## 📝 履歴状態オブジェクト仕様

### PJAXHistoryState インターface
**必須プロパティ**:
- `pjax: boolean` - PJAX状態識別フラグ
- `url: string` - ページのURL
- `title: string` - ページタイトル
- `timestamp: number` - 状態作成時刻

**オプションプロパティ**:
- `scrollPosition: {x: number, y: number}` - スクロール位置
- 任意のカスタムデータ

## 🚀 公開メソッド仕様

### pushState メソッド
**メソッド名**: `pushState`
**引数**: `url: string, title?: string, state?: any`
**戻り値**: `void`
**目的**: 新しい履歴エントリを追加

**処理内容**:
1. PJAXHistoryState オブジェクト作成
2. 現在のスクロール位置を記録
3. カスタムデータのマージ
4. history.pushState() の実行
5. 内部状態の更新
6. エラー時のフォールバック処理

### replaceState メソッド
**メソッド名**: `replaceState`
**引数**: `url: string, title?: string, state?: any`
**戻り値**: `void`
**目的**: 現在の履歴エントリを置換

### getState メソッド
**メソッド名**: `getState`
**引数**: なし
**戻り値**: `PJAXHistoryState | null`
**目的**: 現在の履歴状態を取得 (ディープコピー)

### isPJAXState メソッド
**メソッド名**: `isPJAXState`
**引数**: `state: any`
**戻り値**: `state is PJAXHistoryState`
**目的**: オブジェクトがPJAX履歴状態かを判定

### handlePopStateEvent メソッド
**メソッド名**: `handlePopStateEvent`
**引数**: `event: PopStateEvent`
**戻り値**: 判定結果オブジェクト
**目的**: popstateイベントの解析と状態判定

**戻り値オブジェクト**:
- `isPJAX: boolean` - PJAX状態かどうか
- `state: PJAXHistoryState | null` - 状態データ
- `shouldReload: boolean` - ページリロードが必要か

## 🔧 スクロール位置管理

### スクロール位置記録
**メソッド名**: `getCurrentScrollPosition` (private)
**戻り値**: `{x: number, y: number}`
**取得対象**: window.scrollX/Y または pageXOffset/YOffset

### スクロール位置復元
**メソッド名**: `restoreScrollPosition`
**引数**: `state?: PJAXHistoryState`
**目的**: 履歴状態からスクロール位置を復元

**復元処理**:
- 状態にscrollPositionがある場合 → その位置に復元
- ない場合 → ページトップ(0, 0)に移動
- エラー時 → ページトップにフォールバック

## 🛠️ 状態管理メソッド

### initializeState メソッド (private)
**目的**: ページロード時の初期状態設定
**処理**: 現在ページをPJAX状態として履歴に登録

### updateCurrentState メソッド
**引数**: `data: Record<string, any>`
**目的**: 現在の履歴状態にデータを追加

### isStateURLSynced メソッド
**戻り値**: `boolean`
**目的**: 履歴状態のURLと現在URLの同期確認

## 🚀 ナビゲーション制御メソッド

### プログラム制御メソッド
**goBack**: `history.back()` の実行
**goForward**: `history.forward()` の実行  
**go**: `history.go(delta)` の実行

### ブラウザ対応チェック
**isSupported** (static): History API対応の確認

## 📋 実装優先度

### Phase 1 (必須 - 基本機能)
1. クラス基本構造とコンストラクタ
2. `pushState`, `replaceState` メソッド
3. `getState`, `isPJAXState` メソッド
4. `initializeState` メソッド

### Phase 2 (推奨 - 機能向上)
1. `handlePopStateEvent` メソッド
2. スクロール位置管理機能
3. `updateCurrentState` メソッド
4. 状態同期チェック機能

### Phase 3 (オプション - 高度機能)
1. プログラムナビゲーション制御
2. デバッグ・モニタリング機能
3. 状態検証機能
4. 履歴の整合性チェック

## 🚨 注意事項

### History API の制限
- `history.length` は読み取り専用
- 過去エントリへの直接アクセス不可
- ブラウザ間での動作差異

### セキュリティ考慮
- 状態オブジェクトへの機密情報保存禁止
- URLの検証必須
- XSS攻撃への対策

### パフォーマンス考慮
- 状態オブジェクトサイズの制限
- 頻繁な`replaceState`実行の回避
- スクロール位置取得の最適化

## 🛠️ 設計指針

### エラーハンドリング
- History API エラー時のフォールバック
- URL不正時の例外処理
- 状態データ破損時の復旧

### 拡張性
- カスタム状態データの対応
- 異なるナビゲーション戦略への対応
- 外部履歴管理システムとの連携

### デバッグサポート
- 履歴状態のダンプ機能
- 状態遷移のロギング
- 整合性チェック機能

---
*ファイル優先度: 🟡 中 (UX向上)*
*依存関係: utils.ts*
*推定作業時間: 1-1.5時間*
*テスト要件: popstateイベント・スクロール復元のE2Eテスト推奨*