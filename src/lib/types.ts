export type Room = {
	title: string;
	subtitle: string;
	description: string;
	submit_text: string;
	name_text: string;
};

export type Ingredient = {
	title: string;
	options: string[];
	type: 'checkbox' | 'radio';
	required: boolean;
};

export type User = {
	name: string;
	ingredients: Record<string, string[]>;
};
