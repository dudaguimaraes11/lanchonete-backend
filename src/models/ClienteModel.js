import prisma from '../utils/prismaClient.js';

export default class ClienteModel {
    constructor({ id = null, nome = null, estatus = true, preco = null } = {}) {
        this.id = id;
        this.nome = nome;
        this.estatus = estatus;
        this.preco = preco;
    }

    async criar() {
        return prisma.cliente.create({
            data: {
                nome: this.nome,
                estatus: this.estatus,
                preco: this.preco,
            },
        });
    }

    async atualizar() {
        return prisma.cliente.update({
            where: { id: this.id },
            data: { nome: this.nome, estatus: this.estatus, preco: this.preco },
        });
    }

    async deletar() {
        return prisma.cliente.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) where.nome = { contains: filtros.nome, mode: 'insensitive' };
        if (filtros.estatus !== undefined) where.estatus = filtros.estatus === 'true';
        if (filtros.preco !== undefined) where.preco = parseFloat(filtros.preco);

        return prisma.cliente.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.cliente.findUnique({ where: { id } });
        if (!data) return null;
        return new ClienteModel(data);
    }
}
