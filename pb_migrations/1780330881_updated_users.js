/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // add field
  collection.fields.addAt(0, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_4080049865",
    "help": "",
    "hidden": false,
    "id": "relation2535159889",
    "maxSelect": 0,
    "minSelect": 0,
    "name": "pacientes",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // remove field
  collection.fields.removeById("relation2535159889")

  return app.save(collection)
})
