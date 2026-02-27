import prisma from '../utils/prismaClient.js';

// Cliente
export default class cliente {
    constructor({ id = null, nome = null, telefone = null, email = null, cpf = null, cep = null, logradouro = null, bairro = null, localidade = null, uf = null, ativo = true } = {}) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.cpf = cpf;
        this.cep = cep;
        this.logradouro = logradouro;
        this.bairro = bairro;
        this.localidade = localidade;
        this.uf = uf;
        this.ativo = true;
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
        return prisma.cliente.delete({ where: { id: this.id } });
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
        return new ExemploModel(data);
    }
}
