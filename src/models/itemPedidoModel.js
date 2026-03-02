import prisma from '../utils/prismaClient.js';

export default class itemPedidoModel {
    constructor(id, pedidoId, produtoId, quantidade, precoUnitario){
        this.id = id;
        this.pedidoId = pedidoId;
        this.produtoId = produtoId;
        this.quantidade = quantidade;
        this.precoUnitario = precoUnitario;
    }

async criar() {

    //Regra de negócio 1
    if(this.quantidade <= 0) {
        throw new Error ('A quantidade deve ser maior que 0.');
    }
    //Regra de negócio 2
    const produto = await prisma.produto.findUnique({
        where: {id: this.produtoId}
    });

    if (!produto) {
        throw new Error('Produto não encontrado');
    }

    const registro = await prisma.itemPedido.create({
        data: {
            pedidoId: this.pedidoId,
            produtoId: this.produtoId,
            quantidade: this.quantidade,
            precoUnitario: produto.preco,
        },
    });
        this.id = registro.id;
        this.precoUnitario = registro.precoUnitario;
        return registro;

    };

     async buscarPorId() {
        if (!this.id) throw new Error('ID não definido para busca.');

        const registro = await prisma.itemPedido.findUnique({
            where: { id: this.id },
        });

        if (!registro) return null;
        this.pedidoId = registro.pedidoId;
        this.produtoId = registro.produtoId;
        this.quantidade = registro.quantidade;
        this.precoUnitario = registro.precoUnitario;
        return this;
    };

    async buscarTodos() {
        return prisma.itemPedido.findMany();
    };

    async atualizar() {
        if (!this.id) throw new Error('ID não definido para atualização.');
        if (this.quantidade <=0){
            throw new Error('A quantidade deve ser maior que 0.')
        }

        return prisma.itemPedido.update({
            where: { id: this.id },
            data: {
                pedidoId: this.pedidoId,
                produtoId: this.produtoId,
                quantidade: this.quantidade,
            },
        });
    }

    async deletar() {
        if (!this.id) throw new Error('ID não definido para exclusão.');
        return prisma.itemPedido.delete({
            where: { id: this.id },
        });
    }
    
}
