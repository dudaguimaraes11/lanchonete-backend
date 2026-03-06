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
        if (this.preco === null || this.preco === undefined || this.preco <= 0) {
            throw new Error('O preço do produto deve ser maior que 0');
        }
    }

    validarDescricao() {
        if (this.descricao && this.descricao.length > 255) {
            throw new Error('A descrição deve ter no minimo 255 caracteres');
        }
    }

    validarCategoria() {
        const categorias = ['LANCHE', 'BEBIDA', 'SOBREMESA', 'COMBO'];

        if (!categorias.includes(this.categoria)) {
            throw new Error('Categoria invalida');
        }
    }

    async criar() {
        this.validarPreco();
        this.validarCategoria();
        this.validarDescricao();

        return prisma.produto.create({
            data: {
                nome: this.nome,
                descricao: this.descricao,
                categoria: this.categoria,
                preco: this.preco,
                disponivel: this.disponivel,
            },
        });
    }

    async atualizar() {
        this.validarPreco();
        this.validarCategoria();
        this.validarDescricao();

        return prisma.produto.update({
            where: { id: this.id },
            data: {
                nome: this.nome,
                descricao: this.descricao,
                categoria: this.categoria,
                preco: this.preco,
                disponivel: this.disponivel,
            },
        });
    }

    async deletar() {
        const pedidosVinculados = await prisma.pedido.findMany({
            where: {
                produtos: {
                    some: { id: this.id },
                },
                status: 'ABERTO',
            },
        });

        if (pedidosVinculados.length > 0) {
            throw new Error(
                'Não é possível deletar o produto porque ele está vinculado a um pedido ABERTO',
            );
        }

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
