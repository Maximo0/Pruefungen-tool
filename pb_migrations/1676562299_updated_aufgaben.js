migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("fmf42r1zd06kf8u")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "t2uzt364",
    "name": "semester",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "w3e2zuudp1a7ghg",
      "cascadeDelete": false,
      "maxSelect": 1,
      "displayFields": [
        "semester",
        "jahr",
        "id"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("fmf42r1zd06kf8u")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "t2uzt364",
    "name": "semester",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "w3e2zuudp1a7ghg",
      "cascadeDelete": false,
      "maxSelect": 1,
      "displayFields": [
        "semester",
        "jahr",
        "id"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
