const express = require('express')
const {Router} = require('express')
const dbConn = require('../database')

const router = Router()
const urlencodedParser = express.urlencoded({extended: false})

// получение списка пользователей
router.get("/contracts/:id", function(req, res) {
    const id = req.params.id

    dbConn.query("SELECT COUNT(*) FROM videocassette", function(err, data_all) {
      if (err) return res.send(err.message)
  
      dbConn.query("SELECT * FROM videocassette WHERE ID_Videocassette=?", [id], function(err, data) {
        if(err) return res.send(err.message)

        let size_table = Object.values(data_all[0])  // Scope is larger than function
        if (id == size_table) {
          return res.render("contracts/list", {
            title: 'Видеокассеты',
            contract: data[0],
            isNext: false,
            isPrevious: true,
            isContracts: true,
          })
        }
        
        if (id == 1) {
          return res.render("contracts/list", {
            title: 'Видеокассеты',
            contract: data[0],
            isNext: true,
            isPrevious: false,
            isContracts: true,
          })
        }

        res.render("contracts/list", {
          title: 'Видеокассеты',
          contract: data[0],
          isNext: true,
          isPrevious: true,
          isContracts: true,
        })
    })
    })

    // dbConn.query("SELECT * FROM videocassette WHERE ID_Videocassette=?", [id+1], function(err, data) {
    //     if(err) return res.send(err.message)

    //     if (!data[0]) {
    //       return res.render("contracts/list", {
    //         title: 'Видеокассеты',
    //         contract: data[0],
    //         isEmpty: false,
    //         isContracts: true,
    //       })
    //     }

    //     res.render("contracts/list", {
    //       title: 'Видеокассеты',
    //       contract: data[0],
    //       isEmpty: true,
    //       isContracts: true,
    //     })
    // })
})

// возвращаем форму для добавления данных
router.get("/contracts/create", function(req, res) {
  res.render("contracts/create", {
    title: 'Добавление видеокассеты'
  })
})

// получаем отправленные данные и добавляем их в БД 
router.post("/contracts/create", urlencodedParser, function (req, res) {
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

  dbConn.query(`INSERT INTO contracts
  (Title, Genre, Country, Year, Director, Availability, Limitation, Price_Day, Deposit) VALUES (?,?,?,?,?,?,?,?,?)`, 
  [title, genre, country, year, director, availability, limitation, price_day, deposit], function(err, data) {
    if(err) return res.send(err.message)
    res.redirect("/contracts")
  })
})

// получем id редактируемого пользователя, получаем его из бд и отправлям с формой редактирования
router.get("/contracts/edit/:id", function(req, res) {
  const id = req.params.id

  dbConn.query("SELECT * FROM contract WHERE ID_Contract=?", [id], function(err, data) {
    if (err) return res.send(err.message)
    res.render("contracts/edit", {
        title: 'Изменение видеокассеты',
        contract: data[0],
    })
  })
})

// получаем отредактированные данные и отправляем их в БД
router.post("/contracts/edit", urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)

  const id = req.body.ID_Contract
  const title = req.body.Title
  const genre = req.body.Genre
  const country = req.body.Country
  const year = req.body.Year
  const director = req.body.Director
  const availability = req.body.Availability
  const limitation = req.body.Limitation
  const price_day = req.body.Price_Day
  const deposit = req.body.Deposit

  dbConn.query(`UPDATE contract SET 
  Title=?, Genre=?, Country=?, Year=?, Director=?, Availability=?, Limitation=?, Price_Day=?, Deposit=? WHERE ID_Contract=?`, 
  [title, genre, country, year, director, availability, limitation, price_day, deposit, id], function(err, data) {
    if (err) return res.send(err.message)
    res.redirect("/contracts")
  })
})

router.get("/contracts/delete/:id", function(req, res) {       
  const id = req.params.id

  dbConn.query("DELETE FROM contract WHERE ID_Contract=?", [id], function(err, data) {
    if (err) return res.send(err.message)
    res.redirect("/contracts")
  })

  dbConn.query("SELECT COUNT(*) FROM contracts", function(err, data) {
    if (err) return res.send(err.message)

    let id_increment = Object.values(data[0])  // Scope is larger than function

    if (id_increment == 0) {
      dbConn.query("ALTER TABLE contracts AUTO_INCREMENT=1;", function(err, data) {
        if(err) return res.send(err.message)
      })
    }
  })
})


module.exports = router