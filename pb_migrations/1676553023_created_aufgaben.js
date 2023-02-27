migrate((db) => {
  const collection = new Collection({
    "id": "s60qq45qfdeo7xo",
    "created": "2023-02-16 13:10:23.915Z",
    "updated": "2023-02-16 13:10:23.915Z",
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
      },
      {
        "system": false,
        "id": "uivwaway",
        "name": "bereich",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "4tmy50g181tg18x",
          "cascadeDelete": false,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "jtdn6v7d",
        "name": "semester",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "rg0bozyrsk1zm3a",
          "cascadeDelete": false,
          "maxSelect": 1,
          "displayFields": []
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
  const collection = dao.findCollectionByNameOrId("s60qq45qfdeo7xo");

  return dao.deleteCollection(collection);
})
