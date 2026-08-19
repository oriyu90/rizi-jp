# サービスカード追加ルール

ホーム画面のサービス一覧は `content.js` の `projects` 配列から自動生成されます。

## 追加形式

```js
{
  name: 'サービス名',
  url: 'https://example.pages.dev/',
  repository: 'https://github.com/oriyu90/example',
  releaseDate: '2026.08.19',
  releaseVersion: 'v1.0.0',
  releaseSource: 'github-release',
  code: 'EX',
  description: {
    ja: '26文字ほどの短い説明。',
    en: 'A short English description.',
    zh: '简短的中文说明。',
    pt: 'Uma descrição curta.'
  },
  platforms: ['Web', 'macOS'],
  color: 'lime'
}
```

## 各項目

- `name`: 画面に表示する正式名称
- `url`: 公式サイトの完全なURL
- `repository`: Release情報の根拠となるGitHubリポジトリURL
- `releaseDate`: 初回GitHub Releaseの公開日。`YYYY.MM.DD`形式で記入する
- `releaseVersion`: 初回GitHub Releaseのタグ名。Releaseがない場合は空文字にする
- `releaseSource`: 通常は `github-release`。Releaseがなくリポジトリ作成日を代用した場合だけ `repository-created`
- `code`: 丸いアイコン内に表示する英数字2文字
- `description`: 何ができるかが伝わる短文を、日本語・英語・中文・ポルトガル語で記入する
- `platforms`: `Web` / `Windows` / `macOS` / `Linux` / `Android` から該当するもの
- `color`: `lime` / `blue` / `green` / `paper` のいずれか

`releaseDate`、`releaseVersion`、`releaseSource` はカード上には表示されません。`releaseDate` があるPROJECTは、`content.js`によって `RELEASE` 種別のお知らせへ自動反映されます。PROJECTを追加したあとに、同じ内容のRELEASEお知らせを手作業で重複登録しないでください。

## 並び順

`name` のアルファベット順に並べてください。日本語名のサービスは公式英語表記を基準にします。

## 確認事項

1. URLを新しいタブで開けるか
2. 2文字コードが他のサービスと重複していないか
3. 説明がカード上で3行以内に収まるか
4. 対応環境が公式サイトの記載と一致しているか
5. `repository` が正しいGitHubリポジトリを指しているか
6. `releaseDate` と `releaseVersion` がGitHubの初回Releaseと一致しているか
7. RELEASEフィルターに自動生成されたお知らせが1件だけ表示されるか
8. PC幅とスマートフォン幅の両方で、検索・1行折り畳み・展開・カードのポップアップを確認する
