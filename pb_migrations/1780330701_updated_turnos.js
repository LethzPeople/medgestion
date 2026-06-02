/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2403738966")

  // remove field
  collection.fields.removeById("relation3335235934")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2403738966")

  // add field
  collection.fields.addAt(1, new Field({
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
  }))

  return app.save(collection)
})
