    import prisma from '../utils/prismaClient.js';

    export default class itemPedido {
        constructor(id, pedidoId, produtoId, quantidade, precoUnitario){
            this.id = id;
            this.pedidoId = pedidoId;
            this.produtoId = produtoId;
            this.quantidade = quantidade;
            this.precoUnitario = precoUnitario;
        }

    async criar() {

        //Regra de negócio 1
        if(this.quantidade <= 0 || this.quantidade > 99) {
            throw new Error ('A quantidade deve ser entre 1 e 99.');
        }
        //Regra de negócio 2
        const produto = await prisma.produto.findUnique({where: {id: this.produtoId}});
            if(!produto) throw new Error('Produto não encontrado.');
            if(!produto.disponivel) throw new Error('Produto indisponível no momento.');

        // Verificar status do pedido 3

        const pedido = await prisma.pedido.findUnique({where: {id: this.pedidoId}});
        if(!pedido) throw new Error('Pedido não encontrado');
        if(pedido.status !== 'ABERTO'){
            throw new Error('Não é possível adicionar items a um pedido PAGO ou CANCELADO.')
        }

        const registro = await prisma.itemPedido.create({
            data: {
                pedidoId: this.pedidoId,
                produtoId: this.produtoId,
                quantidade: this.quantidade,
                precoUnitario: produto.preco,
            },
        });

        await prisma.pedido.update({
            where:{ id: this.pedidoId },
            data:{ total: { increment: registro.quantidade * registro.precoUnitario}}
        })
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

            const itemAntigo = await prisma.itemPedido.findUnique({
                where: { id: this.id },
                include: { pedido: true }
            });
            
            if (itemAntigo.pedido.status !== 'ABERTO') {
                throw new Error ('Não é possível alterar itens de um pedido PAGO ou CANCELADO')
            }
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

            const itemExistente = await prisma.itemPedido.findUnique({
                where: {id: this.id},
                include: {pedido: true}
            });

            if(!itemExistente) throw new Error('Item não encontrado.');
            if(itemExistente.pedido.status !== 'ABERTO'){
                throw new Error('Não é possível remover itens de um pedido PAGO ou CANCELADO.')
            }

            await prisma.pedido.update({
                where: { id: itemExistente.pedidoId },
                data: { total: {decrement: itemExistente.quantidade * itemExistente.precoUnitario}}
            })
            return prisma.itemPedido.delete({
                where: { id: this.id },
            });
        }

    }
