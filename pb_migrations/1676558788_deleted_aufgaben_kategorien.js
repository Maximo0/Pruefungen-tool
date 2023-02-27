migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("0b4s8kjjn0h4wlk");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "0b4s8kjjn0h4wlk",
    "created": "2023-02-16 13:11:50.345Z",
    "updated": "2023-02-16 13:31:46.629Z",
    "name": "aufgaben_kategorien",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "5bijgugn",
        "name": "aufgaben_id",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "fmf42r1zd06kf8u",
          "cascadeDelete": false,
          "maxSelect": 1,
          "displayFields": [
            "id",
            "name"
          ]
        }
      },
      {
        "system": false,
        "id": "cywppdak",
        "name": "kategorie_id",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "z5nla8zfyph9ej6",
          "cascadeDelete": false,
          "maxSelect": null,
          "displayFields": [
            "id",
            "name"
          ]
        }
      }
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
