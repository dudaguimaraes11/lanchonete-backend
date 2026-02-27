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

    async criar() {
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
        return prisma.produto.delete({ where: { id: this.id } });
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
