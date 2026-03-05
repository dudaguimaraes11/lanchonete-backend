import prisma from '../utils/prismaClient.js';

// Cliente
export default class Cliente {
    constructor({ id = null, nome = null, telefone = null, email = null, cpf = null, cep = null, logradouro = null, bairro = null, localidade = null, uf = null, ativo = true } = {}) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.cpf = cpf ? String(cpf) : null;
        this.cep = cep;
        this.logradouro = logradouro;
        this.bairro = bairro;
        this.localidade = localidade;
        this.uf = uf;
        this.ativo = ativo;
    }

async validacao(isUpdate = false) {
    if (!this.cpf || this.cpf.length !== 11) {
            throw new Error('Cpf deve ter 11 digitos')
    }
    if (!this.cep || this.cep.length !== 8) {
        throw new Error('Cep deve ter 8 digitos');
    }
    const cpfExistente = await prisma.cliente.findMany({
        where: {
            cpf: this.cpf,
            ...(isUpdate && { id: { not: this.id } }),
        },
    });
    if (cpfExistente.length > 0) {
        throw new Error('este cpf ja foi cadastrado');
    }
    const telExistente = await prisma.cliente.findMany({
        where: {
            telefone: this.telefone,
            ...(isUpdate && {id: {not: this.id}})
        }
    })
    if (telExistente.length > 0) {
        throw new Error('este telefone ja foi cadastrado');
    }
    if (!this.logradouro || !this.localidade || !this.uf) {
        throw new Error('dados de endereço insuficiente. Por favor verifique o cep')
    }
    }


    async criar() {
        return prisma.cliente.create({
            data: {
                nome: this.nome,
                telefone: this.telefone,
                email: this.email,
                cpf: this.cpf,
                cep: this.cep,
                logradouro: this.logradouro,
                bairro: this.bairro,
                localidade: this.localidade,
                uf: this.uf,
                ativo: this.ativo
            },
        });
    }

    async atualizar() {
        return prisma.cliente.update({
            where: { id: this.id },
            data: { nome: this.nome, telefone: this.telefone, email: this.email, cpf: this.cpf, cep: this.cep, logradouro: this.logradouro, bairro: this.bairro, localidade: this.localidade, uf: this.uf, ativo: this.ativo},
        });
    }

   async deletar() {
    if (!this.id) throw new Error('id necessario para deletar');

    const pedidoAberto = await prisma.pedido.findFirst({
        where: {
            clienteId: this.id,
            status: "ABERTO"
        }
    });

    if (pedidoAberto) {
        throw new Error('Não é possível deletar um cliente que possui um pedido em aberto');
    }

    return prisma.cliente.delete({
        where: { id: this.id }
    });
}

    // GetAll
    static async buscarTodos(filtros = {}) {
        const where = {};

        // Filtra por nome (case insensitive)
        if (filtros.nome) where.nome = { contains: filtros.nome, mode: 'insensitive' };

        // Filtra por CPF
        if (filtros.cpf) where.cpf = filtros.cpf;

        // Filtra por ativo (true or false)
        if (filtros.ativo !== undefined) where.ativo = filtros.ativo === 'true';


        return prisma.cliente.findMany({ where });
    }

    // GetById
    static async buscarPorId(id) {
        const data = await prisma.cliente.findUnique({ where: { id } });
        if (!data) return null;
        return new Cliente(data);
    }
}
