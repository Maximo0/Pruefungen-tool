migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w3e2zuudp1a7ghg")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ju3zl7u3",
    "name": "semester",
    "type": "select",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Sommer",
        "Winter"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w3e2zuudp1a7ghg")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ju3zl7u3",
    "name": "semster",
    "type": "select",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Sommer",
        "Winter"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
