migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0b4s8kjjn0h4wlk")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cywppdak",
    "name": "kategorie_id",
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
  const collection = dao.findCollectionByNameOrId("0b4s8kjjn0h4wlk")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cywppdak",
    "name": "kategorie_id",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "z5nla8zfyph9ej6",
      "cascadeDelete": false,
      "maxSelect": 1,
      "displayFields": [
        "id",
        "name"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
