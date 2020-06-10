import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as firebaseHelper from 'firebase-functions-helper';

admin.initializeApp({
    credential: admin.credential.cert(require('../../Key.json')),    
    databaseURL: "https://cell-online-7828.firebaseio.com"
});

const db=admin.firestore();

const app=express();
const main=express();

const collectionPhone="phones";

main.use("/api", app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({extended: false}));

export const api = functions.https.onRequest(main);

app.post('/phones',async (req,res)=>{
    try{
        const newPhone=await firebaseHelper.firestore.createNewDocument(db,collectionPhone,req.body);
        res.status(201).send(`Phone was added to store with id ${newPhone.id}`)
    }
    catch(err){
        res.status(400).send(`Anfirebase  error has ocurred ${err}`)
    }
});

app.get('/phones/:id',(req,res)=>{
    firebaseHelper.firestore.getDocument(db,collectionPhone,req.params.id)
        .then(doc=>res.status(200).send(doc))
        .catch(err=>res.status(400).send(`An error has ocurred ${err}`))
});

app.patch('/phones/:id',async(req,res)=>{
    try{        
        const docUpdated = await firebaseHelper.firestore.updateDocument(db, collectionPhone, req.params.id, req.body);
        res.status(200).send(`Phone with id ${docUpdated}`);
    }
    catch(err){
        res.status(400).send(`An error has ocurred ${err}`);
    }
});

app.delete('/phones/:id',async(req,res)=>{
    try{        
        const docDeleted = await firebaseHelper.firestore.deleteDocument(db, collectionPhone, req.params.id);
        res.status(200).send(`Person was deleted ${docDeleted}`);
    }
    catch(err){
        res.status(400).send(`An error has ocurred ${err}`);
    }
})

app.get('/phones', (req, res) =>{     
    firebaseHelper.firestore.backup(db, collectionPhone)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).send(`An error has ocurred ${err}`));
});
export { app };