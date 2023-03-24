migrate((db) => {
  const collection = new Collection({
    "id": "zmrk8by9vy5lmfc",
    "created": "2023-03-23 15:21:36.068Z",
    "updated": "2023-03-23 15:21:36.068Z",
    "name": "pruefungen",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "p2gkvjo3",
        "name": "file",
        "type": "file",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "maxSize": 5242880,
          "mimeTypes": [],
          "thumbs": []
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
  const collection = dao.findCollectionByNameOrId("zmrk8by9vy5lmfc");

  return dao.deleteCollection(collection);
})
