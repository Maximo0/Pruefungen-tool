migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("fmf42r1zd06kf8u")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xhdztqk6",
    "name": "bereich",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "k7p3probolb54x5",
      "cascadeDelete": false,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

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
        "semster",
        "jahr",
        "id"
      ]
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "uzyagzb9",
    "name": "kategorien",
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

  // update
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
        "semster",
        "jahr",
        "id"
      ]
    }
  }))

  // update
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
})
