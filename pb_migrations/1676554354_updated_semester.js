migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w3e2zuudp1a7ghg")

  collection.listRule = ""
  collection.viewRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w3e2zuudp1a7ghg")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
