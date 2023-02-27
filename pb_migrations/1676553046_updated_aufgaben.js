migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s60qq45qfdeo7xo")

  // remove
  collection.schema.removeField("uivwaway")

  // remove
  collection.schema.removeField("jtdn6v7d")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s60qq45qfdeo7xo")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "uivwaway",
    "name": "bereich",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "4tmy50g181tg18x",
      "cascadeDelete": false,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jtdn6v7d",
    "name": "semester",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "rg0bozyrsk1zm3a",
      "cascadeDelete": false,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
})
