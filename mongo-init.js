db = db.getSiblingDB("candidates-app");
// Create the 'candidates' collection

db.createCollection("candidates"); 
db.candidates.insertMany([
	{
		name: "John",
		surname: "Doe",
		seniority: "junior",
		years: 3,
		availability: true
	},
	{
		name: "Jane",
		surname: "Smith",
		seniority: "junior",
		years: 1,
		availability: false
	},
	{
		name: "Marta",
		surname: "Perez",
		seniority: "senior",
		years: 10,
		availability: true
	},
	{
		name: "Javier",
		surname: "Cervantez",
		seniority: "junior",
		years: 2,
		availability: true
	}
]);