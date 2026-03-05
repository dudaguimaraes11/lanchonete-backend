import prisma from '../utils/prismaClient.js';

export default class Pedido {
    constructor({
        id = null,
        clienteId = null,
        total = 0,
        status = 'ABERTO',
        criadoEm = new Date(),
    } = {}) {
        this.id = id;
        this.clienteId = clienteId;
        this.total = total;
        this.status = status;
        this.criadoEm = criadoEm;
    }

    async criar() {
        return prisma.pedido.create({
            data: {
                clienteId: this.clienteId,
                total: 0,
                status: 'ABERTO',
                criadoEm: this.criadoEm || new Date(),
            },
        });
    }

    async recalcularTotal() {
        if (!this.id) throw new Error('ID do pedido é necessário para recalcular.');

        const itens = await prisma.itemPedido.findMany({
            where: { pedidoId: this.id },
        });

        const novoTotal = itens.reduce((soma, item) => {
            return soma + (Number(item.preco) * item.quantidade);
        }, 0);

        return prisma.pedido.update({
            where: { id: this.id },
            data: { total: novoTotal },
        });
    }

    async cancelar() {
        const pedidoAtual = await prisma.pedido.findUnique({ where: { id: this.id } });

        if (pedidoAtual.status !== 'ABERTO') {
            throw new Error('Apenas pedidos ABERTO podem ser cancelados.');
        }

        return prisma.pedido.update({
            where: { id: this.id },
            data: { status: 'CANCELADO' },
        });
    }

    static async validarAdicaoItem(pedidoId) {
        const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } });

        if (pedido.status === 'PAGO' || pedido.status === 'CANCELADO') {
            throw new Error(`Não é permitido adicionar itens a um pedido ${pedido.status}.`);
        }
        return true;
    }

    static async buscarPorId(id) {
        const data = await prisma.pedido.findUnique({ where: { id } });
        if (!data) return null;
        return new Pedido(data);
    }

    async deletar() {
        if (!this.id) throw new Error('id necessario para deletar.');
        return prisma.pedido.delete({
            where: { id: this.id },
        });
    }
     static async buscarTodos(filtros = {}) {
        const pedidos = await prisma.pedido.findMany({
            where: filtros
        });
        
        return pedidos.map(p => new Pedido(p));
    }
    async atualizar() {
        if (!this.id) throw new Error('ID necessário para atualização.');
        return prisma.pedido.update({
            where: { id: this.id },
            data: {
                clienteId: this.clienteId,
                total: this.total,
                status: this.status,
                criadoEm: this.criadoEm
            },
        });
    }
}