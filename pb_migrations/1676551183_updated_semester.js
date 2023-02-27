migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rg0bozyrsk1zm3a")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mrkypwqx",
    "name": "jahr",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rg0bozyrsk1zm3a")

  // remove
  collection.schema.removeField("mrkypwqx")

  return dao.saveCollection(collection)
})
