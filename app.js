const {MongoClient} = require('mongodb')
const mongo = require('mongodb')
const MongoDBclient = new MongoClient('mongodb+srv://nikita:pass0000@cluster0.uemwqua.mongodb.net/')

const express = require('express')
const app = express()
const port = 3000


app.use(express.json());
app.post('/register', function (req, res){
    const register = async () =>{
        email = req.body.email
        name = req.body.name
        sname = req.body.sname
        years = req.body.years
        password = req.body.password
        password2 = req.body.password2
        if (!password2 || (password !== password2)){
            res.end("Check password 2 attribute. And that password 2 equals to the first one.")
        }
        result = {"email": email, "name": name, "sname": sname, "years": years, "password": password}
        try {
            await MongoDBclient.connect()
            collection = await MongoDBclient.db('node_project').collection('users')
            user = await collection.findOne({"email": email})
            if (user){
                res.end("User already exists")
            } else {
                await collection.insertOne(result)
                res.end("Success")
            }
            await MongoDBclient.close()
        } catch (e) {
            res.end("Unlikely")
        } finally {
            await MongoDBclient.close()
        }
    }
    register()
})


app.get('/login', function (req, res){
    const login = async () =>{
        email = req.body.email
        password = req.body.password
        try {
            await MongoDBclient.connect()
            collection = await MongoDBclient.db('node_project').collection('users')
            user = await collection.findOne({"email": email})
            if (user){
                res.end("Success")
            } else {
                res.end("No such user")
            }
            await MongoDBclient.close()
        } catch (e) {
            res.end("Unlikely")
        } finally {
            await MongoDBclient.close()
        }
    }
    login()
})

app.delete('/delete_user', function (req, res){
    const delete_user = async () =>{
        secret = '2b3bcas'
        user_secret = req.body.secret
        if (!(secret === user_secret)){
            res.end("Permission denied")
        }
        id = req.body.id
        try {
            await MongoDBclient.connect()
            collection = await MongoDBclient.db('node_project').collection('users')
            user = await collection.findOne({"_id": new mongo.ObjectId(id)})
            if (user){
                await collection.deleteOne({"_id": new mongo.ObjectId(id)})
                res.end("Success")
            } else {
                res.end("No such user")
            }
            await MongoDBclient.close()
        } catch (e) {
            res.end("Unlikely")
        } finally {
            await MongoDBclient.close()
        }
    }
    delete_user()
})


app.post('/update_user', function (req, res){
    const update = async () =>{
        id = req.body.id
        name = req.body.name
        sname = req.body.sname
        years = req.body.years
        if (!name || !id || !sname || !years){
            res.end("Missed some important attributes")
        }
        try {
            await MongoDBclient.connect()
            collection = await MongoDBclient.db('node_project').collection('users')
            user = await collection.findOne({"_id": new mongo.ObjectId(id)})
            if (user){
                await collection.updateOne({"_id": new mongo.ObjectId(id)}, {$set: {"name": name, "sname": sname, "years": years}})
                res.end("Success")
            } else {
                res.end("No such user")
            }
            await MongoDBclient.close()
        } catch (e) {
            res.end("Unlikely")
        } finally {
            await MongoDBclient.close()
        }
    }
    update()
})

app.post('/add_car', function (req, res){
    const add_car = async () =>{
        name = req.body.name
        year = req.body.year
        email = req.body.email
        if (!name || !email || !year){
            res.end("Missed some important attributes")
        }
        try {
            await MongoDBclient.connect()
            collection = await MongoDBclient.db('node_project').collection('users')
            cars = await MongoDBclient.db('node_project').collection('cars')
            user = await collection.findOne({"email": email})
            if (user){
                await cars.insertOne({"name": name, "year": year, "user_id": user._id})
                res.end("Success")
            } else {
                res.end("No such user")
            }
            await MongoDBclient.close()
        } catch (e) {
            res.end("Unlikely")
        } finally {
            await MongoDBclient.close()
        }
    }
    add_car()
})

app.delete('/delete_car', function (req, res){
    const add_car = async () =>{
        id = req.body.id
        if (!id){
            res.end("Missed some important attributes")
        }
        try {
            await MongoDBclient.connect()
            collection = await MongoDBclient.db('node_project').collection('users')
            cars = await MongoDBclient.db('node_project').collection('cars')
            car = await cars.findOne({"_id": new mongo.ObjectId(id)})
            if (car){
                await cars.deleteOne({"_id": new mongo.ObjectId(id)})
                res.end("Success")
            } else {
                res.end("No such user or car")
            }
            await MongoDBclient.close()
        } catch (e) {
            res.end("Unlikely")
        } finally {
            await MongoDBclient.close()
        }
    }
    add_car()
})


app.post('/update_car', function (req, res){
    const update_car = async () =>{
        id = req.body.id
        name = req.body.name
        year = req.body.year
        if (!id || !name || !year){
            res.end("Missed some important attributes")
        }
        try {
            await MongoDBclient.connect()
            collection = await MongoDBclient.db('node_project').collection('users')
            cars = await MongoDBclient.db('node_project').collection('cars')
            car = await cars.findOne({'_id': new mongo.ObjectId(id)})
            if (car){
                await cars.updateOne({'_id': new mongo.ObjectId(id)}, {$set: {"name": name, "year": year}})
                res.end("Success")
            } else {
                res.end("No such car")
            }
            await MongoDBclient.close()
        } catch (e) {
            res.end("EX: " + e)
        } finally {
            await MongoDBclient.close()
        }
    }
    update_car()
})


app.get('/show_cars', function (req, res){
    const show_cars = async () =>{
        try {
            await MongoDBclient.connect()
            cars = await MongoDBclient.db('node_project').collection('cars')
            massive = await cars.find()
            result = []
            for await (const i of massive) {
                result.push({"name": i.name, "year": i.year, "id": i._id, "user_id": i.user_id})
            }
            res.json({"result": result})
            await MongoDBclient.close()
        } catch (e) {
            res.end("Ex " + e)
        } finally {
            await MongoDBclient.close()
        }
    }
    show_cars()
})


app.get('/show_users', function (req, res){
    const show_users = async () =>{
        try {
            await MongoDBclient.connect()
            users = await MongoDBclient.db('node_project').collection('users')
            massive = await users.find()
            result = []
            for await (const i of massive) {
                result.push({"name": i.name, "email": i.email, "sname": i.sname, "id": i._id, "years": i.years})
            }
            res.json({"result": result})
            await MongoDBclient.close()
        } catch (e) {
            res.end("Ex " + e)
        } finally {
            await MongoDBclient.close()
        }
    }
    show_users()
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})