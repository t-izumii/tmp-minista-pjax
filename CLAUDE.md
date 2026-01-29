# PJAX設計資料 - Minista SPA化プロジェクト

## プロジェクト概要
Ministaフレームワークを使用したReact/TypeScriptサイトにPJAX（Pushstate AJAX）を実装し、完全なSPA体験を提供する。

## 現在の構成分析

### フレームワーク
- **Minista**: 静的サイトジェネレーター（React/TypeScript）
- **React 18.3.1**: UIライブラリ
- **TypeScript**: 型安全な開発
- **Tailwind CSS**: スタイリング

### 現在のページ構造
```
src/pages/
├── index.tsx        # ホームページ (/)
└── about/
    └── index.tsx    # Aboutページ (/about)
```

### グローバルレイアウト
- `src/global.tsx`: 共通レイアウト（Header、Footer、メタデータ管理）
- 各ページは独立したコンポーネントとして実装
- 現在は従来のページ遷移方式

## PJAX設計アーキテクチャ

### 1. 基本設計方針

#### コアコンセプト
- **Progressive Enhancement**: 通常のリンクから段階的にPJAX化
- **History API**: ブラウザの戻る/進むボタン対応
- **DOM部分更新**: 必要な部分のみを更新してUX向上
- **SEO互換**: 従来のページ構造を維持

#### 技術スタック
```typescript
// 使用技術
- History API (pushState/popstate)
- Fetch API (コンテンツ取得)
- DOM Parser (HTMLパース)
- TypeScript (型安全性)
```

### 2. アーキテクチャ設計

#### ディレクトリ構造
```
src/assets/scripts/pjax/
├── index.ts           # メインエントリーポイント
├── router.ts          # ルーティング管理
├── loader.ts          # コンテンツローダー
├── history.ts         # History API管理
├── cache.ts           # ページキャッシュ
├── types.ts           # TypeScript型定義
└── utils.ts           # ユーティリティ関数
```

#### 主要クラス設計

```typescript
// PJAXRouter: メインルーター
class PJAXRouter {
  private cache: PageCache
  private loader: ContentLoader
  private history: HistoryManager
  
  public init(): void
  public navigate(url: string): Promise<void>
  public handlePopState(event: PopStateEvent): void
}

// ContentLoader: コンテンツ取得・解析
class ContentLoader {
  public async fetchPage(url: string): Promise<PageContent>
  public parsePage(html: string): PageContent
}

// PageCache: ページキャッシュ管理
class PageCache {
  public get(url: string): PageContent | null
  public set(url: string, content: PageContent): void
  public clear(): void
}
```

### 3. 実装戦略

#### Phase 1: 基本PJAX機能
1. **リンク監視**: `data-pjax`属性を持つリンクをPJAX化
2. **コンテンツ取得**: Fetch APIでページHTMLを取得
3. **DOM更新**: 指定されたコンテナ内容を置換
4. **URL更新**: History APIでURL変更

#### Phase 2: 高度な機能
1. **キャッシュシステム**: 既訪問ページのメモリキャッシュ
2. **ローディング状態**: プログレスバーやスピナー
3. **エラーハンドリング**: 通信エラー時のフォールバック
4. **SEOメタデータ**: title、description等の動的更新

#### Phase 3: UX改善
1. **アニメーション**: ページ遷移時のスムーズな効果
2. **プリロード**: マウスホバー時の先読み込み
3. **スクロール復元**: ページ戻り時のスクロール位置復元

### 4. 技術仕様

#### URLパターン対応
```typescript
// 対応するURLパターン
const supportedRoutes = [
  '/',           // ホーム
  '/about',      // About
  '/posts/*',    // 将来の投稿ページ
  // 動的ルートは除外（APIエンドポイント等）
]
```

#### DOM更新ターゲット
```typescript
// 更新対象のセレクタ
const updateTargets = {
  content: '[data-pjax-container]',  // メインコンテンツ
  title: 'title',                   // ページタイトル
  meta: 'meta[name="description"]', // メタ説明
  scripts: 'script[data-pjax]'      // ページ固有スクリプト
}
```

#### キャッシュ戦略
- **メモリキャッシュ**: 最新10ページをメモリ保持
- **有効期限**: 5分間のキャッシュ有効期限
- **無効化**: フォーム送信後などでキャッシュクリア

### 5. Ministaフレームワーク統合

#### グローバルレイアウト対応
```typescript
// global.tsxとの連携
- Header/Footerは固定（更新対象外）
- メインコンテンツ部分のみPJAX対象
- Reactコンポーネントの再マウント処理
```

#### メタデータ管理
```typescript
// Ministaのmetadata対応
- 各ページのexported metadataを動的取得
- title、descriptionの自動更新
- OGPメタタグの同期更新
```

### 6. 実装優先順位

#### High Priority
1. ✅ 基本的なPJAXルーティング実装
2. ✅ History API連携
3. ✅ エラーハンドリング

#### Medium Priority
1. ⭕ ページキャッシュシステム
2. ⭕ ローディング状態表示
3. ⭕ スクロール位置管理

#### Low Priority
1. 🔲 アニメーション効果
2. 🔲 プリロード機能
3. 🔲 Analytics連携

### 7. パフォーマンス考慮事項

#### 最適化ポイント
- **バンドルサイズ**: Tree Shakingでコード最小化
- **リクエスト削減**: 積極的なキャッシュ活用
- **DOM操作最適化**: 必要最小限の更新
- **メモリ管理**: 適切なキャッシュ容量制限

#### 測定指標
- **Initial Load**: 初期ページ読み込み時間
- **Navigation**: ページ遷移速度
- **Memory Usage**: メモリ使用量監視
- **Cache Hit Rate**: キャッシュ効率

### 8. 開発・テスト戦略

#### 開発環境
```bash
npm run dev    # 開発サーバー起動
npm run build  # 本番ビルド
npm run lint   # コード品質チェック
```

#### テストケース
1. **基本遷移**: 各ページ間の正常な遷移
2. **History操作**: 戻る/進むボタンの動作
3. **エラー処理**: 404、ネットワークエラー等
4. **キャッシュ**: キャッシュヒット/ミスの動作

### 9. 既知の課題と制約

#### 制約事項
- **JavaScript必須**: JS無効環境での段階的劣化
- **Minista依存**: フレームワーク固有の実装
- **SEO考慮**: 初期HTMLが重要

#### 回避策
- **Progressive Enhancement**: JS無効時は通常遷移
- **Robot.txt**: クローラー向けサイトマップ
- **Meta Refresh**: フォールバック機能

## 次のステップ

1. `src/assets/scripts/pjax/index.ts` の基本実装から開始
2. 段階的に機能を追加
3. 各ページでのテスト実施
4. パフォーマンス測定と最適化

---
*最終更新: 2025-08-01*
*担当: Claude Code*