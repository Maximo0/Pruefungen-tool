migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("z5nla8zfyph9ej6")

  collection.listRule = ""
  collection.viewRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("z5nla8zfyph9ej6")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
