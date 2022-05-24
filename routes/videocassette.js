const express = require('express')
const {Router} = require('express')
const dbConn = require('../database')

const router = Router()
const urlencodedParser = express.urlencoded({extended: false})

// получение списка пользователей
router.get("/videocassette", function(req, res) {
  dbConn.query("SELECT * FROM videocassette", function(err, data) {
    if(err) return res.send(err.message)
    res.render("videocassette/list", {
        title: 'Видеокассеты',
        videocassette: data,
        isVideocassette: true,
    })
  })
})

// возвращаем форму для добавления данных
router.get("/videocassette/create", function(req, res) {
  res.render("videocassette/create", {
    title: 'Добавление видеокассеты'
  })
})

// получаем отправленные данные и добавляем их в БД 
router.post("/videocassette/create", urlencodedParser, function (req, res) {
  if(!req.body) return res.sendStatus(400)

  const title = req.body.Title
  const genre = req.body.Genre
  const country = req.body.Country
  const year = req.body.Year
  const director = req.body.Director
  const availability = req.body.Availability
  const limitation = req.body.Limitation
  const price_day = req.body.Price_Day
  const deposit = req.body.Deposit

  dbConn.query(`INSERT INTO videocassette 
  (Title, Genre, Country, Year, Director, Availability, Limitation, Price_Day, Deposit) VALUES (?,?,?,?,?,?,?,?,?)`, 
  [title, genre, country, year, director, availability, limitation, price_day, deposit], function(err, data) {
    if(err) return res.send(err.message)
    res.redirect("/videocassette")
  })
})

// получем id редактируемого пользователя, получаем его из бд и отправлям с формой редактирования
router.get("/videocassette/edit/:id", function(req, res) {
  const id = req.params.id

  dbConn.query("SELECT * FROM videocassette WHERE ID_Videocassette=?", [id], function(err, data) {
    if (err) return res.send(err.message)
    res.render("videocassette/edit", {
        title: 'Изменение видеокассеты',
        videocassette: data[0],
    })
  })
})

// получаем отредактированные данные и отправляем их в БД
router.post("/videocassette/edit", urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)

  const id = req.body.ID_Videocassette
  const title = req.body.Title
  const genre = req.body.Genre
  const country = req.body.Country
  const year = req.body.Year
  const director = req.body.Director
  const availability = req.body.Availability
  const limitation = req.body.Limitation
  const price_day = req.body.Price_Day
  const deposit = req.body.Deposit

  dbConn.query(`UPDATE videocassette SET 
  Title=?, Genre=?, Country=?, Year=?, Director=?, Availability=?, Limitation=?, Price_Day=?, Deposit=? WHERE ID_Videocassette=?`, 
  [title, genre, country, year, director, availability, limitation, price_day, deposit, id], function(err, data) {
    if (err) return res.send(err.message)
    res.redirect("/videocassette")
  })
})

router.get("/videocassette/delete/:id", function(req, res) {       
  const id = req.params.id

  dbConn.query("DELETE FROM videocassette WHERE ID_Videocassette=?", [id], function(err, data) {
    if (err) return res.send(err.message)
    res.redirect("/videocassette")
  })

  dbConn.query("SELECT COUNT(*) FROM videocassette", function(err, data) {
    if (err) return res.send(err.message)

    let id_increment = Object.values(data[0])  // Scope is larger than function

    if (id_increment == 0) {
      dbConn.query("ALTER TABLE videocassette AUTO_INCREMENT=1;", function(err, data) {
        if(err) return res.send(err.message)
      })
    }
  })
})


module.exports = router