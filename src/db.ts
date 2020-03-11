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
  recipes: [
    {
      id: 'ce0hqpo',
      name: 'Fondue Savoyarde',
      time: 60,
      tags: ['facile', 'plat-principal', 'vegetarien', 'sans-gluten', 'plats-au-fromage'],
      description:
        "Coupez les 3 fromages en petits dés.\nFrottez le caquelon avec la gousse d'ail et laissez-la dedans.\nVersez 25 cl de vin blanc et faites chauffer.\nDans un petit récipient, versez le vin blanc restant (5 cl), la Maïzena et la noix de muscade. Remuez et réservez.\nLorsque le vin 'frétille', versez le fromage (en plusieurs fois) sans cesser de remuer (avec une spatule en bois) sur feu doux/moyen.\nLorsque le fromage est bien fondu, versez le verre vin/Maïzena/muscade et continuez de remuer doucement.\nLa préparation commence à être onctueuse et mousseuse, toujours un peu liquide. Poivrez et versez le kirsch. C'est prêt à servir!\nLe jaune d'oeuf est à mettre dans le caquelon lorsqu'il ne reste plus de liquide, afin d erécupérer le reste du fromage au fond.",
      ingredients: [
        { name: 'Comté', quantity: '400g' },
        { name: 'Beaufort', quantity: '400g' },
        { name: 'Emmental', quantity: '200g' },
        { name: 'Vin blanc sec', quantity: '30cl' },
        { name: 'Muscade', quantity: '1 cuillère à café' },
        { name: 'Maïzena', quantity: '1 cuillère à café' },
        { name: 'Kirsch', quantity: '1 verre de liqueur' },
        { name: 'Ail', quantity: '1 gousse' },
        { name: 'Poivre', quantity: '1 pincée' },
        { name: 'Oeuf (jaune)', quantity: '1' },
      ],
    },
    {
      id: 'rm1yqtb',
      name: 'Ravioli aux 2 fromages',
      time: 48,
      tags: [
        'facile',
        'plat-principal',
        'vegetarien',
        'sans-gluten',
        'plats-au-fromage',
        'bouchees-et-raviolis',
        'raviolis',
      ],
      description:
        "Préparation de la farce.\nEcraser le chèvre frais à la fourchette, ajouter le parmesan, l'oeuf, la ciboulette ciselée et mélanger le tout. Saler et poivrer.\nRéserver au frais.\nPréparation de la pâte. Mélanger les oeufs, la farine et le sel jusqu'à l'obtention d'une pâte homogène.\nSi la pâte ne se lie pas, ajouter un peu d'eau.\nFormer une boule avec la pâte, envelopper dans un film et laisser reposer 30 minutes.\nPréparation des ravioli.\nCouper la boule de pâte en trois morceaux.\nEtaler, dans la longueur, les boules de pâtes à l'aide d'un rouleau à pâtisserie. Fariner si besoin puis passer au laminoir, à un cran de plus en plus serré. Etaler la bande de pâte obtenue et la couper au milieu.\nDéposer des petits tas de farce sur la moitié de la pâte, en les espaçant de façon régulière. A l'aide d'un pinceau, badigeonner le pourtour des tas de farce avec un peu d'eau.\nCouvrir avec la seconde moitié de pâte et bien souder les bords.\nA l'aide d'un emporte-pièce, découper les ravioli.\nPlonger les ravioli dans une casserole d'eau bouillante salée.\nLaisser cuire 2-3 minutes, le temps que les ravioli remontent à la surface.",
      ingredients: [
        { name: 'Chèvre frais', quantity: '300g' },
        { name: 'Parmesan râpé', quantity: '100g' },
        { name: 'Oeuf', quantity: '4' },
        { name: 'Ciboulette', quantity: '1 botte' },
        { name: 'Poivre', quantity: '' },
        { name: 'Farine', quantity: '300g' },
        { name: "Huile d'olive", quantity: '1 cuillère à soupe' },
      ],
    },

    {
      id: 'qn2yq5r',
      name: 'Pâtes en sauce aux 4 fromages',
      time: 20,
      tags: [
        'tres-facile',
        'plat-principal',
        'vegetarien',
        'plats-au-fromage',
        'pates-riz-semoule',
        'pates-en-sauce',
      ],
      description:
        "Faire cuire les pâtes selon les indications.\nDans une casserole, mettre les fromages et le beurre à fondre à feu doux.\nSaler, poivrer et ajouter de l'origan et de la muscade râpée.\nMélanger, verser sur les pâtes et servir.",
      ingredients: [
        { name: 'Pâtes', quantity: '400g' },
        { name: 'Parmesan', quantity: '100g' },
        { name: 'Mozzarella', quantity: '100g' },
        { name: 'Chèvre', quantity: '100g' },
        { name: 'Gorgonzola doux', quantity: '50g' },
        { name: 'Muscade', quantity: '' },
        { name: 'Origan', quantity: '1 cuillère à café' },
        { name: 'Beurre', quantity: '25g' },
        { name: 'Poivre', quantity: '' },
        { name: 'Sel', quantity: '' },
      ],
    },
    {
      id: 'cn3yqzp',
      name: 'Pâte à crêpes',
      time: 30,
      tags: ['dessert', 'vegetarien', 'crepe', 'pate-a-crepes', 'facile'],
      description:
        "Mettre la farine dans une terrine et former un puits.\nY déposer les oeufs entiers, le sucre, l'huile et le beurre.\nMélanger délicatement avec un fouet en ajoutant au fur et à mesure le lait. La pâte ainsi obtenue doit avoir une consistance d'un liquide légèrement épais.\nParfumer de rhum.\nFaire chauffer une poêle antiadhésive et la huiler très légèrement. Y verser une louche de pâte, la répartir dans la poêle puis attendre qu'elle soit cuite d'un côté avant de la retourner. Cuire ainsi toutes les crêpes à feu doux.",
      ingredients: [
        { name: 'Farine', quantity: '300g' },
        { name: 'Oeufs entiers', quantity: '3' },
        { name: 'Sucre', quantity: '3 cuillères à soupe' },
        { name: 'Huile', quantity: '2 cuillères à soupe' },
        { name: 'Beurre fondu', quantity: '50g' },
        { name: 'Lait', quantity: '60cl' },
        { name: 'Rhum', quantity: '5cl' },
      ],
    },
    {
      id: 'w64yqkl',
      name: 'Gâteau au chocolat fondant rapide',
      time: 40,
      tags: ['facile', 'dessert', 'vegetarien', 'gateau', 'gateau-au-chocolat'],
      description:
        "Préchauffez votre four à 180°C (thermostat 6).\nDans une casserole, faites fondre le chocolat et le beurre coupé en morceaux à feu très doux.\nDans un saladier, ajoutez le sucre, les oeufs, la farine. Mélangez.\nAjoutez le mélange chocolat/beurre. Mélangez bien.\nBeurrez et farinez votre moule puis y versez la pâte à gâteau.\nFaites cuire au four environ 20 minutes.\nA la sortie du four le gâteau ne paraît pas assez cuit. C'est normal, laissez-le refroidir puis démoulez- le.",
      ingredients: [
        { name: 'Chocolat à pâtisser noir', quantity: '200g' },
        { name: 'Beurre', quantity: '100g + une noix pour le moule' },
        { name: 'Oeufs', quantity: '3' },
        { name: 'Farine', quantity: '50g' },
        { name: 'Sucre en poudre', quantity: '100g' },
      ],
    },
  ],
};

export async function read(file: string): Promise<Data> {
  return fse.readJSON(file);
}

export async function write(file: string, data: Data): Promise<void> {
  return fse.writeJSON(file, data);
}
