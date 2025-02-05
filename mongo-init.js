db = db.getSiblingDB("candidates-app");
// Create the 'candidates' collection

db.createCollection("candidates"); 
db.candidates.insertMany([
	{
		name: "John Doe",
		email: "john.doe@example.com",
		position: "Frontend Developer",
		skills: ["JavaScript", "Angular", "TypeScript"]
	},
	{
		name: "Jane Smith",
		email: "jane.smith@example.com",
		position: "Backend Developer",
		skills: ["Java", "Spring Boot", "MongoDB"]
	}
]);