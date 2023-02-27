migrate((db) => {
  const collection = new Collection({
    "id": "0b4s8kjjn0h4wlk",
    "created": "2023-02-16 13:11:50.345Z",
    "updated": "2023-02-16 13:11:50.345Z",
    "name": "aufgaben_kategorien",
    "type": "base",
    "system": false,
    "schema": [
      {
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
  const collection = dao.findCollectionByNameOrId("0b4s8kjjn0h4wlk");

  return dao.deleteCollection(collection);
})
