migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("fmf42r1zd06kf8u")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "uzyagzb9",
    "name": "field",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "z5nla8zfyph9ej6",
      "cascadeDelete": false,
      "maxSelect": null,
      "displayFields": [
        "id",
        "name"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("fmf42r1zd06kf8u")

  // remove
  collection.schema.removeField("uzyagzb9")

  return dao.saveCollection(collection)
})
