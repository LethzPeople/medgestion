/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "help": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_2636233399",
        "help": "",
        "hidden": false,
        "id": "relation3335235934",
        "maxSelect": 0,
        "minSelect": 0,
        "name": "paciente",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_2403738966",
    "indexes": [],
    "listRule": null,
    "name": "turnos",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2403738966");

  return app.delete(collection);
})
