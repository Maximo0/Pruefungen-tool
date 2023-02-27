migrate((db) => {
  const collection = new Collection({
    "id": "z5nla8zfyph9ej6",
    "created": "2023-02-16 13:12:55.660Z",
    "updated": "2023-02-16 13:12:55.660Z",
    "name": "kategorie",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "vb9uzbtl",
        "name": "name",
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
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("z5nla8zfyph9ej6");

  return dao.deleteCollection(collection);
})
