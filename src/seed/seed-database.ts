import { initialData } from "./seed";
import prisma from "../lib/prisma";

async function main() {
  await prisma.user.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const { categories, products, users } = initialData;
  await prisma.user.createMany({ data: users });

  const categoriesData = categories.map((name) => ({ name }));

  await prisma.category.createMany({ data: categoriesData });

  const categoriesDb = await prisma.category.findMany();

  const categoriesMap = categoriesDb.reduce((map, category) => {
    map[category.name.toLowerCase()] = category.id;
    return map;
  }, {} as Record<string, string>);

  products.forEach(async (product) => {
    const { type, images, ...rest } = product;
    const productDb = await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoriesMap[type],
      },
    });

    const imagesData = images.map((image) => ({
      url: image,
      productId: productDb.id,
    }));

    await prisma.productImage.createMany({
      data: imagesData,
    });
  });
  console.log(categoriesMap);

  console.log("Seed executed successfully!");
}

(() => {
  if (process.env.NODE_ENV === "production") return;
  main();
})();
