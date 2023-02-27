migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("4tmy50g181tg18x");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "4tmy50g181tg18x",
    "created": "2023-02-16 12:37:12.087Z",
    "updated": "2023-02-16 12:37:46.960Z",
    "name": "bereich",
    "type": "base",
    "system": false,
    "schema": [
      {
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
