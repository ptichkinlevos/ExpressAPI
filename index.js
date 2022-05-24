const express = require('express')
const exphbs = require('express-handlebars')

const clients = require('./routes/clients')
const managers = require('./routes/managers')
const videocassette = require('./routes/videocassette')
const contracts = require('./routes/contracts')

const port = process.env.port || 3000

const app = express()
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

let x = 5

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(clients)
app.use(managers)
app.use(videocassette)
app.use(contracts)

app.get('/', (req, res) => {
    res.render('index', {
      title: 'Главная страница',
      isIndex: true
    })
})

async function start() {
    try {
        app.listen(port, () => {
            console.log("Сервер: http://localhost:3000")
        })   
    } 
    catch (e) {
        console.log(e)
    } 
}

start()
