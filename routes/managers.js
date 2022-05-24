const express = require('express')
const {Router} = require('express')
const dbConn = require('../database')

const router = Router()
const urlencodedParser = express.urlencoded({extended: false})

// получение списка пользователей
router.get("/managers", function(req, res) {
  dbConn.query("SELECT * FROM manager", function(err, data) {
    if(err) return res.send(err.message)
    res.render("managers/list", {
        title: 'Менеджеры',
        manager: data,
        isManagers: true,
    })
  })
})

// возвращаем форму для добавления данных
router.get("/managers/create", function(req, res) {
  res.render("managers/create", {
    title: 'Добавление менеджера'
  })
})

// получаем отправленные данные и добавляем их в БД 
router.post("/managers/create", urlencodedParser, function (req, res) {
  if(!req.body) return res.sendStatus(400)

  const surname = req.body.Surname
  const name = req.body.Name
  const patronymic = req.body.Patronymic
  const phone = req.body.Phone

  dbConn.query(`INSERT INTO manager (Surname, Name, Patronymic, Phone) VALUES (?,?,?,?)`, 
  [surname, name, patronymic, phone], function(err, data) {
    if(err) return res.send(err.message)
    res.redirect("/managers")
  })
})

// получем id редактируемого пользователя, получаем его из бд и отправлям с формой редактирования
router.get("/managers/edit/:id", function(req, res) {
  const id = req.params.id

  dbConn.query("SELECT * FROM manager WHERE ID_Manager=?", [id], function(err, data) {
    if (err) return res.send(err.message)
    res.render("managers/edit", {
        title: 'Изменение менеджера',
        manager: data[0],
    })
  })
})

// получаем отредактированные данные и отправляем их в БД
router.post("/managers/edit", urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)

  const id = req.body.ID_Manager
  const surname = req.body.Surname
  const name = req.body.Name
  const patronymic = req.body.Patronymic
  const phone = req.body.Phone

  dbConn.query("UPDATE manager SET Surname=?, Name=?, Patronymic=?, Phone=? WHERE ID_Manager=?", 
  [surname, name, patronymic, phone, id], function(err, data) {
    if (err) return res.send(err.message)
    res.redirect("/managers")
  })
})

router.get("/managers/delete/:id", function(req, res) {       
  const id = req.params.id

  dbConn.query("DELETE FROM manager WHERE ID_Manager=?", [id], function(err, data) {
    if (err) return res.send(err.message)
    res.redirect("/managers")
  })

  dbConn.query("SELECT COUNT(*) FROM manager", function(err, data) {
    if (err) return res.send(err.message)

    let id_increment = Object.values(data[0])  // Scope is larger than function

    if (id_increment == 0) {
      dbConn.query("ALTER TABLE manager AUTO_INCREMENT=1;", function(err, data) {
        if(err) return res.send(err.message)
      })
    }
  })
})


module.exports = router