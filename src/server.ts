import {
  TumauServer,
  Chemin,
  Middleware,
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
import { YupValidator } from './YupValidator';
import * as Yup from 'yup';
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

const ingredientYup = Yup.object().shape({
  name: Yup.string().required(),
  quantity: Yup.string().required(),
});

const newRecipeValidator = YupValidator(
  Yup.object().shape({
    name: Yup.string().required(),
    time: Yup.number(),
    tags: Yup.array()
      .of(Yup.string())
      .required(),
    ingredients: Yup.array()
      .of(ingredientYup)
      .required(),
    description: Yup.string().required(),
  })
);

const updateRecipeValidator = YupValidator(
  Yup.object().shape({
    name: Yup.string(),
    time: Yup.number(),
    tags: Yup.array().of(Yup.string()),
    ingredients: Yup.array().of(ingredientYup),
    description: Yup.string().required(),
  })
);

export function createServer(filePath: string, helpContent: string): TumauServer {
  const server = TumauServer.create({
    handleErrors: false,
    mainMiddleware: Middleware.compose(
      CorsPackage(),
      JsonPackage(),
      InvalidResponseToHttpError,
      RouterPackage([
        Route.GET(ROUTES.home, () => {
          return TumauResponse.withHtml(helpContent);
        }),
        Route.GET(ROUTES.recipes, async _tools => {
          const data = await read(filePath);
          return JsonResponse.withJson(recipeList(data.recipes));
        }),
        Route.POST(ROUTES.recipe, newRecipeValidator.validate, async tools => {
          const { name, time = null, description, ingredients, tags } = newRecipeValidator.getValue(
            tools
          );
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
        Route.GET(ROUTES.recipeById, async tools => {
          const id = tools.readContextOrFail(RouterConsumer).getOrFail(ROUTES.recipeById).id;
          const data = await read(filePath);
          const recipe = data.recipes.find(t => t.id === id);
          if (!recipe) {
            throw new HttpError.NotFound();
          }
          return JsonResponse.withJson(recipe);
        }),
        Route.PUT(ROUTES.recipeById, updateRecipeValidator.validate, async tools => {
          const id = tools.readContextOrFail(RouterConsumer).getOrFail(ROUTES.recipeById).id;
          const data = await read(filePath);
          const recipe = data.recipes.find(t => t.id === id);
          if (!recipe) {
            throw new HttpError.NotFound();
          }
          const updated = updateRecipeValidator.getValue(tools);
          if (updated.name) {
            recipe.name = updated.name;
          }
          if (updated.time) {
            recipe.time = updated.time;
          }
          if (updated.description) {
            recipe.description = updated.description;
          }
          if (updated.ingredients) {
            recipe.ingredients = updated.ingredients;
          }
          if (updated.tags) {
            recipe.tags = updated.tags.map(slugify);
          }
          await write(filePath, data);
          return JsonResponse.withJson(recipe);
        }),
        Route.DELETE(ROUTES.recipeById, async tools => {
          const id = tools.readContextOrFail(RouterConsumer).getOrFail(ROUTES.recipeById).id;
          const data = await read(filePath);
          const recipeIndex = data.recipes.findIndex(t => t.id === id);
          if (recipeIndex === -1) {
            throw new HttpError.NotFound();
          }
          data.recipes.splice(recipeIndex, 1);
          await write(filePath, data);
          return JsonResponse.noContent();
        }),
        Route.GET(ROUTES.tags, async _tools => {
          const data = await read(filePath);
          const tags: Set<string> = new Set();
          data.recipes.forEach(recipe => {
            recipe.tags.forEach(tag => {
              tags.add(tag);
            });
          });
          return JsonResponse.withJson(Array.from(tags));
        }),
        Route.GET(ROUTES.recipesByTag, async tools => {
          const tag = tools.readContextOrFail(RouterConsumer).getOrFail(ROUTES.recipesByTag).tag;
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
