import * as express from 'express'
import User from './models/User'
import Whatsapp from './models/Whatsapp'
import { v4 as id } from 'uuid';
import cors from 'cors'

class Router {

    constructor(server: express.Express) {		
		const twilio = require('twilio');
		const client = twilio("ACdbd1ed045a9cfc9ca9cc6ac619422079", "1c57ddbbd2db9e8054b0284f8d6af6c3");
        const router = express.Router()
		
		const whatsapp = new Map<string, Whatsapp>();

        const users = new Map<string, User>();
        users[id()] = { name: "Drácula", age: "7", phone: "21999999999" }
        users[id()] = {  name: "Loki", age: "5", phone: "21999999999" }

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
		
		//Send message
        router.post('/whatsapp', cors(), (req: express.Request, res: express.Response) => {
            try {
				let whatsapp: Whatsapp = {} as Whatsapp;
				Object.assign(whatsapp, req.body)
                client.messages.create({
				from: 'whatsapp:+14155238886',
				body: whatsapp.body,
				to: 'whatsapp:'+whatsapp.to
				}).then(message => {
									console.log(message.sid);
									            res.json({
														message: `Success -> Send message`
													});
									})
            } catch (e) {
                res.status(400).send(JSON.stringify({ "error": "problem with posted data" }));
            }
        })

        router.options('*', cors());

        server.use('/', router)
    }
}

export default Router;