migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zmrk8by9vy5lmfc")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "p2gkvjo3",
    "name": "file",
    "type": "file",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "maxSize": 10000000,
      "mimeTypes": [],
      "thumbs": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zmrk8by9vy5lmfc")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "p2gkvjo3",
    "name": "file",
    "type": "file",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "maxSize": 5242880,
      "mimeTypes": [],
      "thumbs": []
    }
  }))

  return dao.saveCollection(collection)
})
