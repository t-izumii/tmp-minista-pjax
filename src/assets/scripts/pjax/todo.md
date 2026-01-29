# PJAX 実装 TODO リスト

## 📊 現在の実装状況

### ✅ 実装完了済み

- [x] `SimplePjax` クラスの基本構造
- [x] `init()` メソッドの骨格
- [x] `click` イベントリスナーの設定
- [x] `#_watchLinks()` メソッド（基本版）
- [x] `#_loadPage()` メソッド（基本版）
- [x] 基本的なDOM更新処理（コンテンツ置換、タイトル更新、URL変更）

### 🔄 実装中のコード問題

- [x] **コメントのTODO**: `//todo: ドメインで条件追加` (line 22)
- [x] **コメントのTODO**: `//todo: 除外条件を追加` (line 23)

## 🚀 優先度順 TODO リスト

### 🔴 Phase 1 - 緊急（現在のindex.tsの完成）

#### 1. リンク判定条件の強化 【最優先】

**ファイル**: `index.ts`
**メソッド**: `#_watchLinks()`
**内容**:

- [x] 同一ドメインチェックの実装
- [x] 除外条件の実装（target="\_blank", download属性, 特殊キー等）
- [x] data-pjax属性の確認（デフォルトで全て処理、data-pjax="false"で除外）

**実装例**:

```typescript
// data-pjax="false" の場合は除外
if (link.dataset.pjax === "false") {
  return false
}

// 同一ドメインチェック
if (link.hostname !== window.location.hostname) {
  return false
}

// 除外条件
if (event.ctrlKey || event.metaKey || event.shiftKey) {
  return false
}
if (link.target === "_blank") {
  return false
}
```

#### 2. popstate イベントの実装

**ファイル**: `index.ts`
**メソッド**: `init()`
**内容**:

- [x] ブラウザ戻る/進むボタンのイベントリスナー追加
- [x] popstate時の基本的な処理

**実装例**:

```typescript
window.addEventListener("popstate", (event) => {
  console.log("戻る/進むボタンが押されました")
  // 基本的なページリロード処理
  window.location.reload()
})
```

#### 3. beforeunload イベントの実装

**ファイル**: `index.ts`
**メソッド**: `init()`
**内容**:

- [ ] ページ離脱時のクリーンアップ処理

#### 4. エラーハンドリングの強化

**ファイル**: `index.ts`
**メソッド**: `#_loadPage()`
**内容**:

- [ ] より詳細なエラー分岐処理
- [ ] タイムアウト処理
- [ ] ネットワークエラーの詳細判定

### 🟡 Phase 2 - 重要（基盤となるファイル実装）

#### 5. types.ts の実装 【依存関係重要】

**ファイル**: `types.ts`
**内容**:

- [ ] `PJAXOptions` interface
- [ ] `PageContent` interface
- [ ] `DEFAULT_PJAX_OPTIONS` 定数

#### 6. utils.ts の基本関数実装

**ファイル**: `utils.ts`
**内容**:

- [ ] `isValidUrl` 関数
- [ ] `isSameDomain` 関数
- [ ] `shouldHandleLink` 関数

#### 7. index.ts のオプション対応

**ファイル**: `index.ts`
**内容**:

- [ ] コンストラクタでのオプション受け取り
- [ ] types.ts への依存関係追加

### 🟢 Phase 3 - 将来的改善

#### 8. router.ts の実装検討

**ファイル**: `router.ts`
**内容**:

- [ ] より高度なルーティング機能が必要になった時点で実装

#### 9. キャッシュ機能

**ファイル**: `cache.ts`
**内容**:

- [ ] パフォーマンス向上が必要になった時点で実装

## 🎯 今すぐ実装すべき項目（推奨順序）

### 1. **リンク判定条件の強化** ⭐⭐⭐

**理由**: 現在のコードに直接含まれているTODOコメント
**作業時間**: 15-30分

### 2. **popstate イベント実装** ⭐⭐⭐

**理由**: 基本的なSPA体験に必須
**作業時間**: 15-30分

### 3. **types.ts の基本型定義** ⭐⭐

**理由**: 他のファイルとの連携に必要
**作業時間**: 30-45分

### 4. **utils.ts の URL関連関数** ⭐⭐

**理由**: リンク判定の改善に活用可能
**作業時間**: 45-60分

## 🛠️ 実装のアドバイス

### 段階的アプローチ

1. **現在の index.ts を完成させる**（Phase 1）
2. **基盤ファイルを実装する**（Phase 2）
3. **高度な機能は後回し**（Phase 3）

### テストの重要性

- 各Phase完了時点で動作確認
- ブラウザでの実際のリンククリック確認
- 戻る/進むボタンの動作確認

### デバッグの継続

- console.log は当面残しておく
- 問題発生時の原因特定に有用

## 📋 チェックリスト

**Phase 1 完了の条件**:

- [ ] 全てのTODOコメントが解消されている
- [ ] リンククリックが適切に制御されている
- [ ] popstate イベントが実装されている
- [ ] エラーハンドリングが強化されている
- [ ] ブラウザでの基本動作が確認できている

**Phase 2 完了の条件**:

- [ ] types.ts が実装され、型安全性が確保されている
- [ ] utils.ts の基本関数が実装されている
- [ ] index.ts がオプション設定に対応している

---

**次のアクション**: リンク判定条件の強化（#\_watchLinks メソッドの改修）から始めることを推奨します。
