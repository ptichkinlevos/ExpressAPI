const express = require('express')
const {Router} = require('express')
const dbConn = require('../database')

const router = Router()
const urlencodedParser = express.urlencoded({extended: false})

// получение списка пользователей
router.get("/clients", function(req, res) {
  dbConn.query("SELECT client.*, passport.* FROM client JOIN passport ON client.ID_Client = passport.ID_Client", function(err, data) {
    if(err) return res.send(err.message)
    console.log(data);
    res.render("clients/list", {
      title: 'Клиенты',
      client: data,
      isClients: true,
  })
  })
})

// возвращаем форму для добавления данных
router.get("/clients/create", function(req, res) {
  res.render("clients/create", {
    title: 'Добавление клиента'
  })
})

// получаем отправленные данные и добавляем их в БД 
router.post("/clients/create", urlencodedParser, function (req, res) {
  if(!req.body) return res.sendStatus(400)

  const surname = req.body.Surname
  const name = req.body.Name
  const patronymic = req.body.Patronymic
  const address = req.body.Address
  const phone = req.body.Phone
  const passport = req.body.Series_Number
  const age = req.body.Age
  const gender = req.body.Gender

  dbConn.query(`CALL InsertMulti(?, ?, ?, ? ,? ,? ,? ,?);`, 
  [surname, name, patronymic, address, phone, age, gender, passport], function(err, data) {
    if(err) return res.send(err.message)
    res.redirect("/clients")
  })
})

// получем id редактируемого пользователя, получаем его из бд и отправлям с формой редактирования
router.get("/clients/edit/:id", function(req, res) {
  const id = req.params.id

  dbConn.query("SELECT * FROM client WHERE ID_Client=?", [id], function(err, data) {
    if (err) return res.send(err.message)
    res.render("clients/edit", {
        title: 'Изменение клиента',
        client: data[0],
    })
  })
})

// получаем отредактированные данные и отправляем их в БД
router.post("/clients/edit", urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)

  const id = req.body.ID_Client
  const surname = req.body.Surname
  const name = req.body.Name
  const patronymic = req.body.Patronymic
  const address = req.body.Address
  const phone = req.body.Phone
  const age = req.body.Age
  const gender = req.body.Gender

  dbConn.query("UPDATE client SET Surname=?, Name=?, Patronymic=?, Address=?, Phone=?, Age=?, Gender=? WHERE ID_Client=?", 
  [surname, name, patronymic, address, phone, age, gender, id], function(err, data) {
    if (err) return res.send(err.message)
    res.redirect("/clients")
  })
})

router.get("/clients/delete/:id", function(req, res) {       
  const id = req.params.id

  dbConn.query("DELETE FROM client WHERE ID_Client=?", [id], function(err, data) {
    if (err) return res.send(err.message)
    res.redirect("/clients")
  })

  dbConn.query("SELECT COUNT(*) FROM client", function(err, data) {
    if (err) return res.send(err.message)

    let id_increment = Object.values(data[0])  // Scope is larger than function

    if (id_increment == 0) {
      dbConn.query("ALTER TABLE client AUTO_INCREMENT=1;", function(err, data) {
        if(err) return res.send(err.message)
      })
    }
  })
})


module.exports = router