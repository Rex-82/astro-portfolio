export interface Repository {
	name: string;
	description: string | null;
	fork: boolean;
	html_url: string;
	homepage: string | null;
	topics: string[];
	updated_at: string;
	language: string | null;
}
