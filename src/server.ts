import {
  TumauServer,
  Chemin,
  compose,
  createServer as createTumauServer,
  RouterPackage,
  Route,
  TumauResponse,
  JsonResponse,
  HttpError,
  InvalidResponseToHttpError,
  JsonPackage,
  CorsPackage,
  RouterConsumer,
  CheminParam,
} from 'tumau';
import { read, write, Recipe } from './db';
import { ZodValidator } from './ZodValidator';
import z from 'zod';
import cuid from 'cuid';
import { CuidSlugParam } from './CuidSlugParam';
import { slugify } from './slugify';

const ROUTES = {
  home: Chemin.create(),
  recipes: Chemin.create('recipes'),
  recipe: Chemin.create('recipe'),
  recipesByTag: Chemin.create('tag', CheminParam.string('tag')),
  tags: Chemin.create('tags'),
  recipeById: Chemin.create('recipe', CuidSlugParam('id')),
  ingredients: Chemin.create('ingredients'),
};

interface RecipeListItem {
  id: string;
  name: string;
  time: number | null;
  description: string;
}

type RecipeList = Array<RecipeListItem>;

function recipeList(items: Array<Recipe>): RecipeList {
  return items.map(
    (recipe): RecipeListItem => ({
      id: recipe.id,
      name: recipe.name,
      time: recipe.time,
      description: recipe.description
        .split('\n')
        .slice(0, 3)
        .join('\n'),
    })
  );
}

const ingredientValidator = z.object({
  name: z.string(),
  quantity: z.string(),
});

const newRecipeValidator = ZodValidator(
  z.object({
    name: z.string(),
    time: z.number().nullable(),
    description: z.string(),
    ingredients: z.array(ingredientValidator).optional(),
    tags: z.array(z.string()).optional(),
  })
);

const updateRecipeValidator = ZodValidator(
  z.object({
    name: z.string().optional(),
    time: z
      .number()
      .nullable()
      .optional(),
    tags: z.array(z.string()).optional(),
    ingredients: z.array(ingredientValidator).optional(),
    description: z.string().optional(),
  })
);

export function createServer(filePath: string, helpContent: string): TumauServer {
  const server = createTumauServer({
    handleErrors: false,
    mainMiddleware: compose(
      CorsPackage({
        allowHeaders: ['content-type'],
      }),
      JsonPackage(),
      InvalidResponseToHttpError,
      RouterPackage([
        Route.GET(ROUTES.home, () => {
          return TumauResponse.withHtml(helpContent);
        }),
        Route.GET(ROUTES.recipes, async _ctx => {
          const data = await read(filePath);
          return JsonResponse.withJson(recipeList(data.recipes));
        }),
        Route.POST(ROUTES.recipe, newRecipeValidator.validate, async tools => {
          const {
            name,
            time = null,
            description,
            ingredients = [],
            tags = [],
          } = newRecipeValidator.getValue(tools);
          const data = await read(filePath);
          const id = cuid.slug();
          const recipe: Recipe = {
            id,
            name,
            time,
            tags: tags.map(slugify),
            description,
            ingredients,
          };
          data.recipes.push(recipe);
          await write(filePath, data);
          return JsonResponse.withJson(recipe);
        }),
        Route.GET(ROUTES.recipeById, async ctx => {
          const id = ctx.getOrFail(RouterConsumer).getOrFail(ROUTES.recipeById).id;
          const data = await read(filePath);
          const recipe = data.recipes.find(t => t.id === id);
          if (!recipe) {
            throw new HttpError.NotFound();
          }
          return JsonResponse.withJson(recipe);
        }),
        Route.PUT(ROUTES.recipeById, updateRecipeValidator.validate, async ctx => {
          const id = ctx.getOrFail(RouterConsumer).getOrFail(ROUTES.recipeById).id;
          const data = await read(filePath);
          const recipe = data.recipes.find(t => t.id === id);
          if (!recipe) {
            throw new HttpError.NotFound();
          }
          const updated = updateRecipeValidator.getValue(ctx);
          if (updated.name !== undefined) {
            recipe.name = updated.name;
          }
          if (updated.time !== undefined) {
            recipe.time = updated.time;
          }
          if (updated.description !== undefined) {
            recipe.description = updated.description;
          }
          if (updated.ingredients !== undefined) {
            recipe.ingredients = updated.ingredients;
          }
          if (updated.tags !== undefined) {
            recipe.tags = updated.tags.map(slugify);
          }
          await write(filePath, data);
          return JsonResponse.withJson(recipe);
        }),
        Route.DELETE(ROUTES.recipeById, async ctx => {
          const id = ctx.getOrFail(RouterConsumer).getOrFail(ROUTES.recipeById).id;
          const data = await read(filePath);
          const recipeIndex = data.recipes.findIndex(t => t.id === id);
          if (recipeIndex === -1) {
            throw new HttpError.NotFound();
          }
          data.recipes.splice(recipeIndex, 1);
          await write(filePath, data);
          return JsonResponse.noContent();
        }),
        Route.GET(ROUTES.tags, async _ctx => {
          const data = await read(filePath);
          const tags: Set<string> = new Set();
          data.recipes.forEach(recipe => {
            recipe.tags.forEach(tag => {
              tags.add(tag);
            });
          });
          return JsonResponse.withJson(Array.from(tags));
        }),
        Route.GET(ROUTES.recipesByTag, async ctx => {
          const tag = ctx.getOrFail(RouterConsumer).getOrFail(ROUTES.recipesByTag).tag;
          const data = await read(filePath);
          const recipes = data.recipes.filter(recipe => {
            return recipe.tags.indexOf(tag) >= 0;
          });
          return JsonResponse.withJson(recipeList(recipes));
        }),
        Route.all(null, () => {
          throw new HttpError.NotFound();
        }),
      ])
    ),
  });

  return server;
}
