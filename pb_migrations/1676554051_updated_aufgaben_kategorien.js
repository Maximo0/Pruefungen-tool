migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0b4s8kjjn0h4wlk")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "5bijgugn",
    "name": "aufgaben_id",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "fmf42r1zd06kf8u",
      "cascadeDelete": false,
      "maxSelect": 1,
      "displayFields": [
        "id",
        "name"
      ]
    }
  }))

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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0b4s8kjjn0h4wlk")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "5bijgugn",
    "name": "aufgaben_id",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "fmf42r1zd06kf8u",
      "cascadeDelete": false,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

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
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
})
