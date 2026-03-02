import prisma from '../utils/prismaClient.js';

// Produto
export default class Produto {
    constructor({
        id = null,
        nome = null,
        descricao = null,
        categoria = null,
        preco = null,
        disponivel = true,
    } = {}) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.categoria = categoria;
        this.preco = preco;
        this.disponivel = disponivel;
    }

    validarPreco() {
        if (this.preco <= 0) {
            throw new Error('O preco do produto deve ser maior que 0');
        }
    }

    async criar() {
        this.validarPreco();
        return prisma.produto.create({
            data: {
                nome: this.nome,
                descricao: this.descricao,
                categoria: this.categoria,
                preco: this.preco,
                ativo: this.ativo,
            },
        });
    }

    async atualizar() {
        this.validarPreco();
        return prisma.produto.update({
            where: { id: this.id },
            data: {
                nome: this.nome,
                descricao: this.descricao,
                categoria: this.categoria,
                preco: this.preco,
                ativo: this.ativo,
            },
        });
    }

    async deletar() {
        const pedidosVinculados = await prisma.pedido.findMany({
            where: {
                produtos: {
                    some: { id: this.id },
                },
                status: 'ABERO',
            },
        });

        if (pedidosVinculados.length > 0) {
             throw new Error(
                'Não é possível deletar o produto porque ele está vinculado a um pedido ABERTO',
            );
        }


        return prisma.produtos.delete({ where: { id: this.id } });
    }

    // GetAll
    static async buscarTodos(filtros = {}) {
        const where = {};

        // Filtra por nome (case insensitive)
        if (filtros.nome) where.nome = { contains: filtros.nome, mode: 'insensitive' };

        // Filtra por categoria
        if (filtros.categoria) where.categoria = filtros.categoria;

        // Filtra por preço minímo
        if (filtros.precoMin !== undefined) {
            where.preco = { ...where.preco, gte: Number(filtros.precoMin) };
        }

        // Filtra por preço máximo
        if (filtros.precoMax !== undefined) {
            where.preco = { ...where.preco, lte: Number(filtros.precoMax) };
        }

        // Filtra por disponibilidade
        if (filtros.disponivel !== undefined) where.disponivel = filtros.disponivel === 'true';

        return prisma.produto.findMany({ where });
    }

    // GetById
    static async buscarPorId(id) {
        const data = await prisma.produto.findUnique({ where: { id } });
        if (!data) return null;
        return new Produto(data);
    }
}
