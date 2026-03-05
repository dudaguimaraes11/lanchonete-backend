import "dotenv/config";
import pkg from "@prisma/client";
// Atualizado para pegar os Enums corretos do schema: Categoria e Status
const { PrismaClient, Categoria, Status } = pkg;
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed...");

  // 🔥 Limpa tudo e reinicia os IDs corretamente
  // Nomes exatos das tabelas geradas no PostgreSQL de acordo com os @@map e modelos
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
        logradouro: "Praça da Sé",
        bairro: "Sé",
        localidade: "São Paulo",
        uf: "SP",
        ativo: true,
      },
      {
        nome: "Maria Santos",
        telefone: "21987654321",
        email: "maria@email.com",
        cpf: "12345678902",
        cep: "20040002",
        logradouro: "Avenida Rio Branco",
        bairro: "Centro",
        localidade: "Rio de Janeiro",
        uf: "RJ",
        ativo: true,
      },
      {
        nome: "Ana Costa",
        telefone: "11987654321",
        email: "ana@email.com",
        cpf: "12345678904",
        cep: "01001000",
        logradouro: "Praça da Sé",
        bairro: "Sé",
        localidade: "São Paulo",
        uf: "SP",
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
        preco: "18.50",
        disponivel: true,
      },
      {
        nome: "Refrigerante 2L",
        descricao: "Garrafa 2 litros",
        categoria: Categoria.BEBIDA,
        preco: "9.90",
        disponivel: true,
      },
      {
        nome: "Pudim de Leite",
        descricao: "Pudim caseiro",
        categoria: Categoria.SOBREMESA,
        preco: "7.50",
        disponivel: true,
      },
      {
        nome: "Combo Burger + Refri",
        descricao: "Hambúrguer + Refrigerante",
        categoria: Categoria.COMBO,
        preco: "25.00",
        disponivel: true,
      },
    ],
  });

  console.log("📦 Inserindo pedidos...");
  await prisma.pedido.createMany({
    data: [
      {
        clienteId: 1,
        total: "28.40",
        status: Status.ABERTO,
      },
      {
        clienteId: 2,
        total: "25.00",
        status: Status.PAGO,
      },
      {
        clienteId: 3,
        total: "15.00",
        status: Status.CANCELADO,
      },
    ],
  });

  console.log("📦 Inserindo itens dos pedidos...");
  await prisma.itemPedido.createMany({
    data: [
      // Pedido 1
      {
        pedidoId: 1,
        produtoId: 1,
        quantidade: 1,
        precoUnitario: "18.50",
      },
      {
        pedidoId: 1,
        produtoId: 2,
        quantidade: 1,
        precoUnitario: "9.90",
      },

      // Pedido 2
      {
        pedidoId: 2,
        produtoId: 4,
        quantidade: 1,
        precoUnitario: "25.00",
      },

      // Pedido 3
      {
        pedidoId: 3,
        produtoId: 3,
        quantidade: 2,
        precoUnitario: "7.50",
      },
    ],
  });

  console.log("✅ Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
