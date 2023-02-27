migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4tmy50g181tg18x")

  // remove
  collection.schema.removeField("6yuabom3")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "uxmlfkzn",
    "name": "bereichname",
    "type": "text",
    "required": true,
    "unique": true,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4tmy50g181tg18x")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "6yuabom3",
    "name": "bereichname",
    "type": "select",
    "required": true,
    "unique": true,
    "options": {
      "maxSelect": 1,
      "values": [
        "FIAE GA1",
        "FISI GA1",
        "GA2"
      ]
    }
  }))

  // remove
  collection.schema.removeField("uxmlfkzn")

  return dao.saveCollection(collection)
})
