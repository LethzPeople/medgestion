/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("col_turnos")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "col_pacientes",
    "help": "",
    "hidden": false,
    "id": "relation3335235934",
    "maxSelect": 0,
    "minSelect": 0,
    "name": "paciente",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "help": "",
    "hidden": false,
    "id": "date27834329",
    "max": "",
    "min": "",
    "name": "fecha",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text3152135767",
    "max": 0,
    "min": 0,
    "name": "hora",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "help": "",
    "hidden": false,
    "id": "number1267855334",
    "max": null,
    "min": null,
    "name": "duracion",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text435763302",
    "max": 0,
    "min": 0,
    "name": "motivo",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "help": "",
    "hidden": false,
    "id": "select643686883",
    "maxSelect": 0,
    "name": "estado",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "pendiente",
      "confirmado",
      "cancelado",
      "completado"
    ]
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "convertURLs": false,
    "help": "",
    "hidden": false,
    "id": "editor1702323080",
    "maxSize": 0,
    "name": "notas",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "editor"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("col_turnos")

  // remove field
  collection.fields.removeById("relation3335235934")

  // remove field
  collection.fields.removeById("date27834329")

  // remove field
  collection.fields.removeById("text3152135767")

  // remove field
  collection.fields.removeById("number1267855334")

  // remove field
  collection.fields.removeById("text435763302")

  // remove field
  collection.fields.removeById("select643686883")

  // remove field
  collection.fields.removeById("editor1702323080")

  return app.save(collection)
})
