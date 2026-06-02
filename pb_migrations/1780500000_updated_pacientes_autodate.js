/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pacientes")

  // Eliminar campos created/updated si ya existen (evitar duplicados)
  try { collection.fields.removeById("autodate2990389176") } catch(_) {}
  try { collection.fields.removeById("autodate3332085495") } catch(_) {}

  // Agregar campo created (solo se setea al crear)
  collection.fields.addAt(collection.fields.length, new Field({
    "hidden": false,
    "id": "autodate2990389176",
    "name": "created",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // Agregar campo updated (se setea al crear y al actualizar)
  collection.fields.addAt(collection.fields.length, new Field({
    "hidden": false,
    "id": "autodate3332085495",
    "name": "updated",
    "onCreate": true,
    "onUpdate": true,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pacientes")
  try { collection.fields.removeById("autodate2990389176") } catch(_) {}
  try { collection.fields.removeById("autodate3332085495") } catch(_) {}
  return app.save(collection)
})
