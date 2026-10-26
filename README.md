# Web Programming I Skill Map — Chapter 2: BACKEND

「Web Programming I」の受講生向けスキルマップです。Google アカウントでログインすると、自分の進捗に応じて学習コンテンツ（Notion ページ）が解放され、クラスメイトがどのコンテンツに取り組んでいるかも確認できます。

## 主な機能

- **Google ログイン**: Firebase Authentication（Google プロバイダ）でサインイン
- **スキルマップ表示**: コンテンツを下から上へ積み上げたリストで表示。初回表示時は最下部（タイトル）へ自動スクロール
- **進捗に応じた解放**: 到達済みのコンテンツのみ Notion へのリンクが有効になり、未到達の範囲より上にはスクロールできない
- **クリア表示**: クリア済みのコンテンツにフラグを表示。`Milestone` を含むコンテンツは評価課題として強調表示
- **クラスメイトの分布**: 右側のインジケーターに各コンテンツのクリア人数をゲージで表示。クリックでその位置へスクロール

## 技術スタック

- React 19 + TypeScript
- Vite 7
- Firebase Authentication / Firebase Hosting
- Google Apps Script（進捗データの取得、JSONP 経由）

## セットアップ

```bash
npm install
```

プロジェクトルートに `.env` を作成し、Firebase の設定値を記入します（`.env` は Git 管理対象外です）。

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## スクリプト

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 型チェック後、`dist/` に本番ビルドを出力 |
| `npm run preview` | ビルド結果をローカルで確認 |
| `npm run lint` | ESLint を実行 |

## デプロイ

Firebase Hosting（プロジェクト: `web-programming-map-2`）に `dist/` を公開します。

```bash
npm run build
firebase deploy --only hosting
```

## データ取得の仕組み

ログイン後、`src/hooks/useJsonp.ts` がユーザーのメールアドレスをクエリに付けて Google Apps Script の Web アプリへ JSONP リクエストを送ります。レスポンスは `Data[]`（`src/types/types.ts`）の配列で、先頭 2 要素は特別な意味を持ちます。

| インデックス | 用途 |
| --- | --- |
| `data[0].state` | 「Signed in as:」に表示するユーザー名 |
| `data[1].state` | 進捗（到達済みコンテンツ数）。リンクの有効化とスクロール制限に使用 |
| `data[2]` 以降 | 各コンテンツ（`label`, `notionUrl`, `quoteEn`, `quoteJa`, `state`, `clearedNum`） |

各コンテンツの `state` が `"initial"` 以外ならクリア表示、`clearedNum` はクラスメイトのクリア人数（インジケーターのゲージは 10 人で最大）です。

## ディレクトリ構成

```
src/
├── App.tsx                 # ログイン状態でLogin / Containerを切り替え
├── main.tsx
├── index.css               # リスト・インジケーター等のスタイル
├── components/
│   ├── Login.tsx           # Googleログイン画面
│   ├── Container.tsx       # スキルマップ本体（スクロール制御・アニメーション）
│   ├── ContentsList.tsx    # コンテンツ一覧
│   ├── Indicator.tsx       # 右側のスクロールインジケーター
│   ├── LoadingIcon.tsx
│   └── MouseIcon.tsx       # 「SCROLL UP」ガイド
├── firebase/firebase.ts    # Firebase初期化
├── hooks/useJsonp.ts       # GASからの進捗データ取得
└── types/
```
