migrate((db) => {
  const collection = new Collection({
    "id": "4tmy50g181tg18x",
    "created": "2023-02-16 12:37:12.087Z",
    "updated": "2023-02-16 12:37:12.087Z",
    "name": "bereich",
    "type": "base",
    "system": false,
    "schema": [
      {
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
      }
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("4tmy50g181tg18x");

  return dao.deleteCollection(collection);
})
