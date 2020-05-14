import * as express from 'express';
import * as shell from 'shelljs';

import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.get('/app/:app', async function(req, res) {
    let pid = shell.exec(`pm2 pid ${req.params.app}`, {silent: true});
    if(pid.stdout == '0' || pid.stdout == '\n' || pid.stdout.startsWith("[PM2]"))
        return res.sendStatus(404)
    else
        return res.sendStatus(200)
});

app.use((req, res) => {
    res.sendStatus(404);
});

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});