import fse from 'fs-extra';

export interface Recipe {
  id: string;
  name: string;
  time: number | null;
  tags: Array<string>;
  ingredients: Array<{
    name: string;
    quantity: string;
  }>;
  description: string;
}

export interface Data {
  recipes: Array<Recipe>;
}

export const DEFAULT_CONTENT: Data = {
  recipes: [],
};

export async function read(file: string): Promise<Data> {
  return fse.readJSON(file);
}

export async function write(file: string, data: Data): Promise<void> {
  return fse.writeJSON(file, data);
}
