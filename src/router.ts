import * as express from 'express'
import User from './models/User'
import { v4 as id } from 'uuid';
import cors from 'cors'

class Router {

    constructor(server: express.Express) {
        const router = express.Router()

        const users = new Map<string, User>();
        users[id()] = { name: "Isabel", age: "28", lastFedDate: new Date() }
        users[id()] = {  name: "Cássio", age: "29", lastFedDate: new Date() }

        router.get('/', (req: express.Request, res: express.Response) => {
            res.json({
                message: `Nothing to see here, [url]/users instead.`
            })
        })

        //get all users
        router.get('/users', cors(), (req: express.Request, res: express.Response) => {
            res.json({
                users
            })
        })

        //create new user
        router.post('/users', cors(), (req: express.Request, res: express.Response) => {
            try {
                let user: User = {} as User;
                Object.assign(user, req.body)
                const newID = id();
                users[newID] = user;
                res.json({
                    id: newID
                })
            } catch (e) {
                res.status(400).send(JSON.stringify({ "error": "problem with posted data" }));
            }
        })

        //get user by id
        router.get('/users/:id', cors(), (req: express.Request, res: express.Response) => {
            if (!!users[req.params.id]) {
                res.json({
                    user: users[req.params.id]
                })
            } else {
                res.status(404).send(JSON.stringify({ "error": "no such user" }));
            }
        })

        //update user
        router.put('/users/:id', cors(), (req: express.Request, res: express.Response) => {
            try {
                if (!!users[req.params.id]) {
                    let user: User = {} as User;
                    Object.assign(user, req.body)
                    users[req.params.id] = user;
                    res.json({
                        user: users[req.params.id]
                    })
                } else {
                    res.status(404).send(JSON.stringify({ "error": "no such user" }));
                }
            } catch (e) {
                res.status(400).send(JSON.stringify({ "error": "problem with posted data" }));
            }
        })

        //delete user
        router.delete('/users/:id', cors(), (req: express.Request, res: express.Response) => {
            if (!!users[req.params.id]) {
                delete users[req.params.id]
                res.json({
                    id: req.params.id
                })
            } else {
                res.status(404).send(JSON.stringify({ "error": "no such user" }));
            }
        });

        router.options('*', cors());

        server.use('/', router)
    }
}

export default Router;