# Github webhook function for Misskey

Githubからの各種通知をMisskeyのに投稿します。

これをserverless対応しました
https://github.com/tamaina/misskey-github-notifier

## 必要なもの
1. このリポジトリのフォーク
2. 通知用のMisskeyアカウント
3. VercelなどのServerless Function環境

動作確認をしているのはVercelです

## How to Use
1. リポジトリをフォークします
2. Vercelにデプロイします
3. Misskeyアカウントを作成し、 APIトークンを発行します
4. 環境変数に以下を設定します

|変数名|中身|備考|
|----|----|----|
|instance|https://misskey.systems|別のインスタンスも可能。 末尾に / を含めてはならない|
|MISSKEY_TOKEN|XXXXXXXX|次で発行するトークン|


5. 通知したいリポジトリのGitHubのWebhooksにフックを追加します
6. フックのSettingsで デプロイしたURL/api/notify を指定します
7. Content type を Application/jsonにします
8. Which events would you like to trigger this webhook? を Send me everything.にチェックします

