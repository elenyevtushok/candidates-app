export interface Paginated<T> {
	data: T[];
	meta: {
		total: number;
		lastPage: number;
		currentPage: number;
		perPage: number;
	};
}