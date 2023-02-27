migrate((db) => {
  const collection = new Collection({
    "id": "rg0bozyrsk1zm3a",
    "created": "2023-02-16 12:39:25.132Z",
    "updated": "2023-02-16 12:39:25.132Z",
    "name": "semester",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "zib7aqrr",
        "name": "semester",
        "type": "select",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "Winter",
            "Sommer"
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
  const collection = dao.findCollectionByNameOrId("rg0bozyrsk1zm3a");

  return dao.deleteCollection(collection);
})
