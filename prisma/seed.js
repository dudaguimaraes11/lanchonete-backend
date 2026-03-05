import "dotenv/config";
import pkg from "@prisma/client";
const { PrismaClient, Categoria, Status } = pkg;

import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Iniciando seed...');

  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "item_pedido", "pedido", "cliente", "Produto"
    RESTART IDENTITY CASCADE;
  `);

  console.log("📦 Inserindo clientes...");
  await prisma.cliente.createMany({
    data: [
      {
        nome: "João Silva",
        telefone: "11987654321",
        email: "joao@email.com",
        cpf: "12345678901",
        cep: "01001000",
        ativo: true,
      },
      {
        nome: "Maria Santos",
        telefone: "21987654321",
        email: "maria@email.com",
        cpf: "12345678902",
        cep: "20040002",
        ativo: true,
      },
      {
        nome: "Ana Costa",
        telefone: "11987654322",
        email: "ana@email.com",
        cpf: "12345678904",
        cep: "01001000",
        ativo: true,
      },
    ],
  });

  console.log("📦 Inserindo produtos...");
  await prisma.produto.createMany({
    data: [
      {
        nome: "Hambúrguer Clássico",
        descricao: "Hambúrguer com queijo, alface e tomate",
        categoria: Categoria.LANCHE,
        preco: 18.5,
        disponivel: true,
      },
      {
        nome: "Refrigerante 2L",
        descricao: "Garrafa de 2 litros",
        categoria: Categoria.BEBIDA,
        preco: 9.9,
        disponivel: true,
      },
      {
        nome: "Pudim de Leite",
        descricao: "Pudim caseiro",
        categoria: Categoria.SOBREMESA,
        preco: 7.5,
        disponivel: true,
      },
      {
        nome: "Combo Burger + Refri",
        descricao: "Hambúrguer + Refrigerante",
        categoria: Categoria.COMBO,
        preco: 25.0,
        disponivel: true,
      },
    ],
  });

  console.log("📦 Inserindo pedidos...");
  await prisma.pedido.createMany({
    data: [
      {
        clienteId: 1,
        total: 28.4,
        status: Status.ABERTO,
      },
      {
        clienteId: 2,
        total: 25.0,
        status: Status.PAGO,
      },
      {
        clienteId: 3,
        total: 15.0,
        status: Status.CANCELADO,
      },
    ],
  });

  console.log("📦 Inserindo itens dos pedidos...");
  await prisma.itemPedido.createMany({
    data: [
      {
        pedidoId: 1,
        produtoId: 1,
        quantidade: 1,
        precoUnitario: 18.5,
      },
      {
        pedidoId: 1,
        produtoId: 2,
        quantidade: 1,
        precoUnitario: 9.9,
      },
      {
        pedidoId: 2,
        produtoId: 4,
        quantidade: 1,
        precoUnitario: 25.0,
      },
      {
        pedidoId: 3,
        produtoId: 3,
        quantidade: 2,
        precoUnitario: 7.5,
      },
    ],
  });

    console.log('✅ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
