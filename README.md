# ミニ・インベーダー（ブラウザゲーム）

シンプルな `HTML + CSS + JavaScript` だけで動くインベーダーゲームです。

## 遊び方（ローカル実行）

1. このプロジェクトを置いたフォルダに移動します。
   ```bash
   cd <このリポジトリのパス>
   ```

2. ローカルサーバーを起動します。
   ```bash
   python3 -m http.server 4173
   ```

3. ブラウザで次を開きます。
   - <http://localhost:4173>

## 操作

- `←` / `→`: 移動
- `スペース`: 発射
- `リスタート` ボタン: 最初からやり直し

## よくあるエラーと対処

### `cd: no such file or directory: /workspace/codex_trial`
`/workspace/codex_trial` は開発コンテナ内のパスです。あなたのMacでは存在しません。

- まず Finder / ターミナルで、このプロジェクトを保存した場所を確認してください。
- その実際のパスで `cd` してください。

例:
```bash
cd ~/Desktop/New\ project/codex_trial
```

### `OSError: [Errno 48] Address already in use`
ポート `4173` がすでに使用中です。別ポートで起動してください。

例:
```bash
python3 -m http.server 8000
```

この場合はブラウザで <http://localhost:8000> を開きます。

## 補足

`index.html` をダブルクリックで直接開く方法でも動くことがありますが、
ブラウザや設定差を避けるために、上記のローカルサーバー起動を推奨します。
