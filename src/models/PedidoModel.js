import prisma from '../utils/prismaClient.js';

// Pedido
export default class Pedido {
    constructor({
        id = null,
        pedidoId = null,
        produtoId = null,
        quantidade = null,
        precoUnitario = null,
    } = {}) {
        this.id = id;
        this.pedidoId = pedidoId;
        this.produtoId = produtoId;
        this.quantidade = quantidade;
        this.precoUnitario = precoUnitario;
    }

    async criar() {
        return prisma.pedido.create({
            data: {
                nome: this.nome,
                pedidoId: this.pedidoId,
                quantidade: this.quantidade,
                precoUnitario: this.precoUnitario,
            },
        });
    }

    async atualizar() {
        return prisma.pedido.update({
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
}
