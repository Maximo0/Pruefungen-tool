const apiLinks = [
  `${process.env.PocketbaseIP}/api/collections/kategorie/records`,
  `${process.env.PocketbaseIP}/api/collections/bereich/records`,
  `${process.env.PocketbaseIP}/api/collections/semester/records`,
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
