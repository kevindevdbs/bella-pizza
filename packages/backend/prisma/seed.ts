import {prisma} from "../src/lib/prisma"

async function main() {
  try {
    console.log("🌱 Iniciando seed do banco de dados...");

    // Limpar dados existentes (mantém usuários)
    await prisma.item.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});

    // Criar categorias
    const pizzaCategory = await prisma.category.create({
      data: { name: "Pizzas" },
    });

    const bebidasCategory = await prisma.category.create({
      data: { name: "Bebidas" },
    });

    const acompanhamentosCategory = await prisma.category.create({
      data: { name: "Acompanhamentos" },
    });

    const docesCategory = await prisma.category.create({
      data: { name: "Doces" },
    });

    const saladaCategory = await prisma.category.create({
      data: { name: "Saladas" },
    });

    console.log("✅ Categorias criadas");

    // Arrays com dados de produtos
    const pizzas = [
    { nome: "Margherita", sabores: ["Pequena", "Média", "Grande"] },
    { nome: "Pepperoni", sabores: ["Pequena", "Média", "Grande"] },
    { nome: "Frango com Catupiry", sabores: ["Pequena", "Média", "Grande"] },
    { nome: "4 Queijos", sabores: ["Pequena", "Média", "Grande"] },
    { nome: "Bacon", sabores: ["Pequena", "Média", "Grande"] },
    { nome: "Brócolis", sabores: ["Pequena", "Média", "Grande"] },
    { nome: "Calabresa", sabores: ["Pequena", "Média", "Grande"] },
    { nome: "Portuguesa", sabores: ["Pequena", "Média", "Grande"] },
    { nome: "Verde", sabores: ["Pequena", "Média", "Grande"] },
    { nome: "Toscana", sabores: ["Pequena", "Média", "Grande"] },
    { nome: "Moda da Casa", sabores: ["Pequena", "Média", "Grande"] },
    { nome: "Havaiana", sabores: ["Pequena", "Média", "Grande"] },
  ];

  const bebidas = [
    { nome: "Coca", tamanhos: ["350ml", "1L", "2L"] },
    { nome: "Guaraná", tamanhos: ["350ml", "1L", "2L"] },
    { nome: "Suco", tamanhos: ["350ml", "500ml", "1L"] },
    { nome: "Água", tamanhos: ["500ml", "1L"] },
    { nome: "Cerveja", tamanhos: ["350ml", "600ml"] },
    { nome: "Chopp", tamanhos: ["400ml", "600ml"] },
    { nome: "Vinho", tamanhos: ["garrafa"] },
    { nome: "Zero", tamanhos: ["350ml", "1L"] },
  ];

    // Criar pizzas (36 products)
    let pizzaCount = 0;
    for (const pizza of pizzas) {
      for (const tamanho of pizza.sabores) {
        const priceBase = tamanho === "Pequena" ? 2500 : tamanho === "Média" ? 3500 : 4500;

        await prisma.product.create({
          data: {
            name: `Pizza ${pizza.nome} ${tamanho}`,
            description: `Deliciosa Pizza ${pizza.nome} no tamanho ${tamanho}`,
            price: priceBase,
            imageUrl: `https://loremflickr.com/300/300?lock=pizza&random=${pizzaCount}`,
            categoryId: pizzaCategory.id,
            disabled: false,
          },
        });
        pizzaCount++;
      }
    }
    console.log(`✅ ${pizzaCount} pizzas criadas`);

    // Criar bebidas (17 products)
    let bebidaCount = 0;
    for (const bebida of bebidas) {
      for (const tamanho of bebida.tamanhos) {
        let priceBase = 500; // default

        if (bebida.nome === "Coca" || bebida.nome === "Guaraná") {
          priceBase = tamanho === "350ml" ? 500 : tamanho === "1L" ? 1000 : 1500;
        } else if (bebida.nome === "Suco") {
          priceBase = tamanho === "350ml" ? 600 : tamanho === "500ml" ? 800 : 1200;
        } else if (bebida.nome === "Água") {
          priceBase = tamanho === "500ml" ? 300 : 500;
        } else if (bebida.nome === "Cerveja") {
          priceBase = tamanho === "350ml" ? 800 : 1200;
        } else if (bebida.nome === "Chopp") {
          priceBase = tamanho === "400ml" ? 1000 : 1500;
        } else if (bebida.nome === "Vinho") {
          priceBase = 3500;
        } else if (bebida.nome === "Zero") {
          priceBase = tamanho === "350ml" ? 600 : 1200;
        }

        await prisma.product.create({
          data: {
            name: `${bebida.nome} ${tamanho}`,
            description: `Bebida ${bebida.nome} ${tamanho}`,
            price: priceBase,
            imageUrl: `https://loremflickr.com/300/300?lock=drink&random=${bebidaCount}`,
            categoryId: bebidasCategory.id,
            disabled: false,
          },
        });
        bebidaCount++;
      }
    }
    console.log(`✅ ${bebidaCount} bebidas criadas`);

    // Criar acompanhamentos (10 products)
    const acompanhamentos = [
      { nome: "Batata Frita", preco: 1200 },
      { nome: "Asas de Frango", preco: 1500 },
      { nome: "Coxinha", preco: 800 },
      { nome: "Bola de Queijo", preco: 900 },
      { nome: "Pastel", preco: 700 },
      { nome: "Calabresa", preco: 900 },
      { nome: "Linguiça", preco: 1000 },
      { nome: "Pão de Queijo", preco: 600 },
      { nome: "Batata com Cheddar", preco: 1400 },
      { nome: "Onion Rings", preco: 1100 },
    ];

    for (const acomp of acompanhamentos) {
      await prisma.product.create({
        data: {
          name: acomp.nome,
          description: `Delicioso ${acomp.nome}`,
          price: acomp.preco,
          imageUrl: `https://loremflickr.com/300/300?lock=food&random=${acomp.nome}`,
          categoryId: acompanhamentosCategory.id,
          disabled: false,
        },
      });
    }
    console.log(`✅ ${acompanhamentos.length} acompanhamentos criados`);

    // Criar doces (5 products)
    const doces = [
      { nome: "Sorvete", preco: 600 },
      { nome: "Brownie", preco: 700 },
      { nome: "Pudim", preco: 500 },
      { nome: "Brigadeiro", preco: 400 },
      { nome: "Pavê", preco: 800 },
    ];

    for (const doce of doces) {
      await prisma.product.create({
        data: {
          name: doce.nome,
          description: `Delicioso ${doce.nome}`,
          price: doce.preco,
          imageUrl: `https://loremflickr.com/300/300?lock=dessert&random=${doce.nome}`,
          categoryId: docesCategory.id,
          disabled: false,
        },
      });
    }
    console.log(`✅ ${doces.length} doces criados`);

    // Criar saladas (5 products)
    const saladas = [
      { nome: "Cesar", preco: 1800 },
      { nome: "Grega", preco: 1600 },
      { nome: "Verde", preco: 1400 },
      { nome: "Caprese", preco: 1500 },
      { nome: "Tropical", preco: 1700 },
    ];

    for (const salada of saladas) {
      await prisma.product.create({
        data: {
          name: salada.nome,
          description: `Deliciosa Salada ${salada.nome}`,
          price: salada.preco,
          imageUrl: `https://loremflickr.com/300/300?lock=salad&random=${salada.nome}`,
          categoryId: saladaCategory.id,
          disabled: false,
        },
      });
    }
    console.log(`✅ ${saladas.length} saladas criadas`);

  console.log("🎉 Seed concluído com sucesso!");
  console.log(`
📊 Total de produtos: ${pizzaCount + bebidaCount + acompanhamentos.length + doces.length + saladas.length}
   - Pizzas: ${pizzaCount}
   - Bebidas: ${bebidaCount}
   - Acompanhamentos: ${acompanhamentos.length}
   - Doces: ${doces.length}
   - Saladas: ${saladas.length}
    `);
  } catch (error) {
    console.error("❌ Erro no seed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
