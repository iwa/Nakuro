import * as express from 'express';
import * as shell from 'shelljs';

import * as dotenv from 'dotenv';
dotenv.config();

import * as crypto from 'crypto';
const key = process.env.HASH_TOKEN;

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json())

app.get('/app/:app', async function(req, res) {
    let pid = shell.cat(`${process.env.HOME}/.pm2/pids/${req.params.app}*.pid`);
    if(pid.stderr)
        return res.sendStatus(403)
    return res.sendStatus(200)
});

app.post('/update/:app', async (req, res) => {
    let pid = shell.cat(`${process.env.HOME}/.pm2/pids/${req.params.app}*.pid`);
    if(pid.stderr || req.params.app === 'api')
        return res.sendStatus(403);
    let GHKey = req.header('X-Hub-Signature');
    let body = JSON.stringify(req.body)
    let hash = `sha1=${crypto.createHmac('sha1', key).update(body).digest('hex')}`
    if(GHKey === hash) {
        let action = req.body.action
        if(action === 'released') {
            res.sendStatus(200);
            return shell.exec(`cd ../${req.params.app} && yarn update && pm2 restart ${req.params.app}`, {silent: false});
        }
    }
    return res.sendStatus(403);
});

app.use((req, res) => {
    res.sendStatus(404);
});

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});