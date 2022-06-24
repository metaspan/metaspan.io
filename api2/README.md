# Simple caching server and api

### Dependencies

PM2 or forever

### Usage

```
git clone <repo>
cd repo/api2
npm install
pm2 start updater.js
pm2 logs 0 # ctrl-c
pm2 start server.js
pm2 logs 1 # ctrl-c
```

### Monitoring

`pm2 logs`
