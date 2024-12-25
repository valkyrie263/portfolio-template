# ポートフォリオサイト テンプレート

このリポジトリは、Remix と Cloudflare Pages を使用して構築されたポートフォリオサイトのテンプレートです。

## 特徴

- **多言語対応 (日本語/英語):** ユーザーはボタン一つで表示言語を切り替えることができます。
- **ダークモード対応:** ユーザーのシステム設定または手動設定に基づいて、ダークモードとライトモードを切り替えます。
- **印刷最適化:** 印刷用に最適化されたスタイルが適用され、不要な要素が非表示になります。
- **vCard 生成:** ユーザー情報を入力することで、vCard ファイルを動的に生成し、ダウンロードできます。
- **レスポンシブデザイン:**  様々なデバイスサイズで適切に表示されます。
- **コンポーネントベース:**  再利用可能なコンポーネントを使用して、コードの保守性と拡張性を向上させています。
- **型安全:** TypeScript を使用して、型安全性と開発者エクスペリエンスを向上させています。

## 使用技術

- **フレームワーク:** [Remix](https://remix.run/)
- **デプロイ:** [Cloudflare Pages](https://pages.cloudflare.com/)
- **スタイリング:** [Tailwind CSS](https://tailwindcss.com/)
- **アイコン:** [Lucide React](https://lucide.dev/icons)
- **言語:** TypeScript

## セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/valkyrie263/portfolio-template
cd portfolio-template
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. Cloudflare の設定 (オプション)

Cloudflare Pages にデプロイする場合は、[Cloudflare のドキュメント](https://developers.cloudflare.com/pages) に従って、アカウントの作成とプロジェクトの設定を行ってください。

### 4. 環境変数の設定 (オプション)

必要に応じて、`.env` ファイルを作成し、環境変数を設定してください。

### 5. プロフィールデータの編集

`_index.tsx` 内の `profile` オブジェクトを編集して、自身の情報を入力してください。

### 6. スキルデータの編集 (オプション)

`_index.tsx` 内の `profile.skills` 配列を編集して、自身のスキル情報を入力してください。
アイコンは、[Lucide React](https://lucide.dev/icons) から選択できます。

### 7. 資格データの編集 (オプション)

`_index.tsx` 内の `profile.certifications` 配列を編集して、自身の資格情報を入力してください。

### 8. 興味データの編集 (オプション)

`_index.tsx` 内の `profile.interests` オブジェクトを編集して、自身の興味・関心を入力してください。

### 9. アバター画像の設定 (オプション)

`public/static` フォルダ内にアバター画像を配置し、`_index.tsx` 内の `profile.avatar` のパスを更新してください。

## 開発

開発サーバーを起動するには、以下のコマンドを実行します。

```bash
npm run dev
```

ブラウザで `http://localhost:8788` を開くと、アプリケーションが起動します。

## ビルド

本番用にアプリケーションをビルドするには、以下のコマンドを実行します。

```bash
npm run build
```

## デプロイ

Cloudflare Pages にデプロイするには、以下のコマンドを実行します。

```bash
npm run deploy
```

## 型生成

`wrangler.toml` 内の Cloudflare バインディングの型を生成するには、以下のコマンドを実行します。

```bash
npm run typegen
```

`wrangler.toml` を変更した場合は、型を再生成する必要があります。

## その他のコマンド

- `npm run start`: ビルドされたアプリケーションをローカルでプレビューします。
- `npm run typecheck`: TypeScript の型チェックを実行します。

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細については、[LICENSE](LICENSE) ファイルを参照してください。

## 貢献

バグの報告や機能の提案など、どのような貢献も歓迎します。プルリクエストを送信する前に、[CONTRIBUTING.md](CONTRIBUTING.md) を確認してください。

## 連絡先

プロジェクトに関する質問や問題がある場合は、[Issues](<https://github.com/valkyrie263/portfolio-template/issues>) でお知らせください。

## クレジット

このプロジェクトは、以下のライブラリとリソースに依存しています。

- [Remix](https://remix.run/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/icons)

## 謝辞

このプロジェクトにご関心をお寄せいただきありがとうございます。