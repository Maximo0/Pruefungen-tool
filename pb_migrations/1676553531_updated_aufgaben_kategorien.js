migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0b4s8kjjn0h4wlk")

  // remove
  collection.schema.removeField("zyub9ow8")

  // add
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

  // add
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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0b4s8kjjn0h4wlk")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zyub9ow8",
    "name": "field",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // remove
  collection.schema.removeField("5bijgugn")

  // remove
  collection.schema.removeField("cywppdak")

  return dao.saveCollection(collection)
})
