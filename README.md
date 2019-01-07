rayriffy-linebot-thai-lotto
======================

## Deploying yourself

1. Clone repository

```
$ git clone https://github.com/rayriffy/rayriffy-linebot-thai-lotto
```

2. Edit `.firebaserc` change project id to yours instead

3. Add config variables

```
$ firebase functions:config:set line.access_token="YOUR_LINE_ACCESS_TOKEN"
```

4. Deploy

```
$ yarn run deploy
```
