import * as express from 'express';
import * as shell from 'shelljs';

import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.get('/app/:app', async function(req, res) {
    let pid = shell.cat(`${process.env.HOME}/.pm2/pids/${req.params.app}*.pid`);
    if(pid.stderr)
        return res.sendStatus(404)
    return res.sendStatus(200)
});

app.post('/update/:app', async (req, res) => {
    if(req.params.app == 'qbot') {
        res.sendStatus(200)
        return shell.exec(`pm2 stop qbot && cd ../q-bot && yarn update && pm2 start qbot`, {silent: true});
    } else
        return res.sendStatus(404)
});

app.use((req, res) => {
    res.sendStatus(404);
});

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});