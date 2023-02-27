migrate((db) => {
  const collection = new Collection({
    "id": "w3e2zuudp1a7ghg",
    "created": "2023-02-16 13:14:23.326Z",
    "updated": "2023-02-16 13:14:23.326Z",
    "name": "semester",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ju3zl7u3",
        "name": "semster",
        "type": "select",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "Sommer",
            "Winter"
          ]
        }
      },
      {
        "system": false,
        "id": "mibdrls1",
        "name": "jahr",
        "type": "number",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null
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
  const collection = dao.findCollectionByNameOrId("w3e2zuudp1a7ghg");

  return dao.deleteCollection(collection);
})
