/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("col_users")

  // add field: rol (odontologo | secretaria)
  collection.fields.addAt(8, new Field({
    "help": "",
    "hidden": false,
    "id": "select_rol_users",
    "maxSelect": 1,
    "name": "rol",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "odontologo",
      "secretaria"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("col_users")

  // remove field
  collection.fields.removeById("select_rol_users")

  return app.save(collection)
})
