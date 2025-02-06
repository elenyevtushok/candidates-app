export interface Candidate {
	name: string;
	surname: string;
	seniority: "junior" | "senior";
	yearsExperience: number;
	availability: boolean;
}