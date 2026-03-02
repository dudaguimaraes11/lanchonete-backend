import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Resetando tabelas Cliente e Produto...');

    // Remove registros existentes (respeitando relações)
    await prisma.itemPedido.deleteMany();
    await prisma.pedido.deleteMany();
    await prisma.produto.deleteMany();
    await prisma.cliente.deleteMany();

    console.log('📦 Inserindo clientes...');

    await prisma.cliente.createMany({
        data: [
            {
                nome: 'João Silva',
                telefone: '11999990000',
                email: 'joao.silva@email.com',
                cpf: '12345678901',
            },
            {
                nome: 'Maria Oliveira',
                telefone: '11988880000',
                email: 'maria.oliveira@email.com',
                cpf: '10987654321',
            },
            {
                nome: 'Carlos Souza',
                telefone: '11977770000',
                email: 'carlos.souza@email.com',
                cpf: '11122233344',
            },
            {
                nome: 'Ana Pereira',
                telefone: '11966660000',
                email: 'ana.pereira@email.com',
                cpf: '55566677788',
            },
            {
                nome: 'Rafael Lima',
                telefone: '11955550000',
                email: 'rafael.lima@email.com',
                cpf: '99988877766',
            },
        ],
    });

    console.log('📦 Inserindo produtos...');

    await prisma.produto.createMany({
        data: [
            { nome: 'Hamburguer', categoria: 'LANCHE', preco: 25.0 },
            { nome: 'Coca-Cola', categoria: 'BEBIDA', preco: 8.5 },
            { nome: 'Sorvete', categoria: 'SOBREMESA', preco: 12.0 },
            { nome: 'Combo Família', categoria: 'COMBO', preco: 60.0 },
            { nome: 'Pizza Média', categoria: 'LANCHE', preco: 45.0 },
        ],
    });

    console.log('✅ Seed concluído!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
