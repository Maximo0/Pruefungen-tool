migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w3e2zuudp1a7ghg")

  collection.updateRule = ""
  collection.deleteRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w3e2zuudp1a7ghg")

  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
