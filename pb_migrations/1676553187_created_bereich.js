migrate((db) => {
  const collection = new Collection({
    "id": "k7p3probolb54x5",
    "created": "2023-02-16 13:13:07.949Z",
    "updated": "2023-02-16 13:13:07.949Z",
    "name": "bereich",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "hbjx0tpb",
        "name": "name",
        "type": "text",
        "required": false,
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
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("k7p3probolb54x5");

  return dao.deleteCollection(collection);
})
