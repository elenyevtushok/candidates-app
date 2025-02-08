db = db.getSiblingDB("candidates-app");
// Create the 'candidates' collection

db.createCollection("candidates"); 
db.candidates.insertMany([
	{
		name: "John",
		surname: "Doe",
		seniority: "junior",
		yearsExperience: 3,
		availability: true
	},
	{
		name: "Jane",
		surname: "Smith",
		seniority: "junior",
		yearsExperience: 1,
		availability: false
	},
	{
		name: "Marta",
		surname: "Perez",
		seniority: "senior",
		yearsExperience: 10,
		availability: true
	},
	{
		name: "Javier",
		surname: "Cervantez",
		seniority: "junior",
		yearsExperience: 2,
		availability: true
	}
]);