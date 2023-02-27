migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0b4s8kjjn0h4wlk")

  collection.listRule = ""
  collection.viewRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0b4s8kjjn0h4wlk")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
