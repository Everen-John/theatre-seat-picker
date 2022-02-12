export default async function handler(req, res) {
	console.log(req.body)
	let results = await fetch(
		`${process.env.SERVER_URL}/cinema?statusChange=${req.body.statusChange}`,
		{
			method: "POST", // *GET, POST, PUT, DELETE, etc.
			mode: "cors", // no-cors, *cors, same-origin
			cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
			credentials: "same-origin", // include, *same-origin, omit
			headers: {
				"Content-Type": "application/json",
				// 'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: JSON.stringify({
				seatCellsInput: req.body.seats,
				personInput: req.body.yourData,
			}),
			redirect: "follow", // manual, *follow, error
			referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url), // body data type must match "Content-Type" header
		}
	).then((results) => results.json())
	res.status(200).json({ ...results })
}
