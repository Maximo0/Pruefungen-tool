migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("fmf42r1zd06kf8u")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xhdztqk6",
    "name": "bereich",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "k7p3probolb54x5",
      "cascadeDelete": false,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  // add
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
      "displayFields": []
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "da7cldgm",
    "name": "name",
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
  const collection = dao.findCollectionByNameOrId("fmf42r1zd06kf8u")

  // remove
  collection.schema.removeField("xhdztqk6")

  // remove
  collection.schema.removeField("t2uzt364")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "da7cldgm",
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

  return dao.saveCollection(collection)
})
