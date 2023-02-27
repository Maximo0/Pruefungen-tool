migrate((db) => {
  const collection = new Collection({
    "id": "fmf42r1zd06kf8u",
    "created": "2023-02-16 13:12:02.119Z",
    "updated": "2023-02-16 13:12:02.119Z",
    "name": "aufgaben",
    "type": "base",
    "system": false,
    "schema": [
      {
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
  const collection = dao.findCollectionByNameOrId("fmf42r1zd06kf8u");

  return dao.deleteCollection(collection);
})
