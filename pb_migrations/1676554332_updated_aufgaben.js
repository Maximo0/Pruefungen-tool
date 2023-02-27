migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("fmf42r1zd06kf8u")

  collection.listRule = ""
  collection.viewRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("fmf42r1zd06kf8u")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
