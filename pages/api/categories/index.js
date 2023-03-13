const apiLinks = [
  "http://127.0.0.1:8090/api/collections/kategorie/records",
  "http://127.0.0.1:8090/api/collections/bereich/records",
  "http://127.0.0.1:8090/api/collections/semester/records",
];

async function getData(link) {
  const res = await fetch(link);
  const data = await res.json();
  return data.items;
}

export default async function handler(req, res) {
  const categories = await getData(apiLinks[0]);
  const bereich = await getData(apiLinks[1]);
  const semester = await getData(apiLinks[2]);

  res.status(200).json({ categories, bereich, semester });
}
