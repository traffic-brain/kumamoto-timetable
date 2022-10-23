# 熊本時刻表ジェネレーター

# 開発環境

| software | version |
| -------- | ------- |
| node     | 16.17.1 |
| npm      | 8.15.0  |

# 開発方法

## ライブラリインストール
```shell
npm ci
```

## 開発中
jsやscssなど保存すると即時反映される
```shell
npm run dev
```

## デプロイ方法
```shell
rm -rf dist
npm run build
# git commit -m "適当に"
git push
npm run publish # github pagesへ反映
```
