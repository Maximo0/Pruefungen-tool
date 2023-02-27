migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("1z5tocblpdvifzh");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "1z5tocblpdvifzh",
    "created": "2023-02-16 12:31:50.847Z",
    "updated": "2023-02-16 12:31:50.847Z",
    "name": "user",
    "type": "auth",
    "system": false,
    "schema": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "allowEmailAuth": true,
      "allowOAuth2Auth": true,
      "allowUsernameAuth": true,
      "exceptEmailDomains": null,
      "manageRule": null,
      "minPasswordLength": 8,
      "onlyEmailDomains": null,
      "requireEmail": false
    }
  });

  return Dao(db).saveCollection(collection);
})
