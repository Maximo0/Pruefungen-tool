migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("s60qq45qfdeo7xo");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "s60qq45qfdeo7xo",
    "created": "2023-02-16 13:10:23.915Z",
    "updated": "2023-02-16 13:10:46.766Z",
    "name": "aufgaben",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "tyx3idof",
        "name": "name",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
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
})
