import * as model from '../models/filmeModel.js';

// Get all - Get
export const getAll = async (req, res) => {
    try {
        const filme = await model.findAll(req.query);

        if (!filme || filme.length === 0) {
            return res.status(200).json({
                message: 'Nenhum filme encontrado.',
            });
        }
        res.json(filme);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar filmes.' });
    }
};

// Get by Id - Get
export const getById = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const data = await model.findById(id);
        if (!data) {
            return res.status(404).json({ error: 'Filme não encontrado.' });
        }
        res.json({ data });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar filme.' });
    }
};

// Create - Post
export const create = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: 'Corpo da requisição vazio. Envie os dados do exemplo!',
            });
        }

        const { titulo, descricao, duracao, genero, nota, disponibilidade } = req.body;

        // Regras de negócio

        // Nome: mínimo 3 caracteres
        if (!titulo || typeof titulo !== 'string' || titulo.trim().length < 3) {
            return res.status(400).json({
                error: 'O título é obrigatório e deve ter no mínimo 3 caracteres.',
            });
        }

        // Descrição: mínimo 10 caracteres
        if (!descricao || typeof descricao !== 'string' || descricao.trim().length < 10) {
            return res.status(400).json({
                error: 'A descrição é obrigatória e deve ter no mínimo 10 caracteres.',
            });
        }

        // Duração: número inteiro positivo
        const tempo = parseInt(duracao);
        if (isNaN(tempo) || tempo <= 0) {
            return res.status(400).json({
                error: 'A duração precisa ser um número inteiro e positivo.',
            });
        }

        // Superior a 300 minutos não podem ser cadastrados
        if (tempo > 300) {
            return res.status(400).json({
                error: 'Filmes com duração superior a 300 minutos não podem ser cadastrados.',
            });
        }

        // Gênero deve ser um dos valores específicos
        const todosGeneros = [
            'Ação',
            'Drama',
            'Comédia',
            'Terror',
            'Romance',
            'Animação',
            'Ficção Científica',
            'Suspense',
        ];

        if (!genero || !todosGeneros.includes(genero)) {
            return res.status(400).json({
                error: `O gênero deve ser um desses: ${todosGeneros.join('; ')}.`,
            });
        }

        // Nota deve estar entre 0 e 10
        const avaliacao = parseFloat(nota);
        if (isNaN(avaliacao) || avaliacao < 0 || avaliacao > 10) {
            return res.status(400).json({
                error: 'A nota (nota) precisa estar entre 0 e 10.',
            });
        }

        // Não é permitido cadastrar filmes com título duplicado
        const existe = await model.findByTitle(titulo);
        if (existe) {
            return res.status(409).json({
                error: 'Não é permitido cadastrar filmes com título duplicado.',
            });
        }

        // Todo filme deve ser criado com available = true
        const data = await model.create({
            titulo,
            descricao,
            duracao: parseInt(duracao),
            genero,
            nota: parseFloat(nota),
            disponibilidade: true,
        });

        res.status(201).json({
            message: 'Filme cadastrado com sucesso!',
            data,
        });
    } catch (error) {
        console.error('Erro ao criar:', error);
        res.status(500).json({ error: 'Erro interno no servidor ao salvar o filme.' });
    }
};

// Update - Put
export const update = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: 'Corpo da requisição vazio. Envie os dados do exemplo!',
            });
        }

        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        const exists = await model.findById(id);
        if (!exists) {
            return res.status(404).json({ error: 'Filme não encontrado para atualizar.' });
        }

        const { titulo, descricao, duracao, genero, nota, disponibilidade } = req.body;

        // Regras de negócio

        //Filmes com available = false não podem ser atualizados
        if (exists.disponibilidade === false) {
            return res.status(400).json({
                error: 'Filmes com available igual a falso não podem ser atualizados.',
            });
        }

        // Nome: mínimo 3 caracteres
        if (!titulo || typeof titulo !== 'string' || titulo.trim().length < 3) {
            return res.status(400).json({
                error: 'O título é obrigatório e deve ter no mínimo 3 caracteres.',
            });
        }

        // Descrição: mínimo 10 caracteres
        if (!descricao || typeof descricao !== 'string' || descricao.trim().length < 10) {
            return res.status(400).json({
                error: 'A descrição é obrigatória e deve ter no mínimo 10 caracteres.',
            });
        }

        // Duração: número inteiro positivo
        if (duracao !== undefined) {
            const tempo = parseInt(duracao);
            if (isNaN(tempo) || tempo <= 0) {
                return res
                    .status(400)
                    .json({ error: 'A duração deve ser um número inteiro e positivo.' });
            }
            // Superior a 300 minutos não podem ser cadastrados
            if (tempo > 300) {
                return res.status(400).json({
                    error: 'Filmes com duração maior que 300 minutos não podem ser cadastrados.',
                });
            }
        }

        // Gênero deve ser um dos valores específicos
        const todosGeneros = [
            'Ação',
            'Drama',
            'Comédia',
            'Terror',
            'Romance',
            'Animação',
            'Ficção Científica',
            'Suspense',
        ];

        if (!genero || !todosGeneros.includes(genero)) {
            return res.status(400).json({
                error: `O gênero deve ser um desses: ${todosGeneros.join('; ')}.`,
            });
        }

        // Nota deve estar entre 0 e 10
        if (nota !== undefined) {
            const avaliacao = parseFloat(nota);
            if (isNaN(avaliacao) || avaliacao < 0 || avaliacao > 10) {
                return res.status(400).json({
                    error: 'A nota (nota) deve estar entre 0 e 10.',
                });
            }
        }

        // Não é permitido cadastrar filmes com título duplicado
        if (titulo) {
            const outro = await model.findByTitle(titulo);
            if (outro && outro.id !== parseInt(id)) {
                return res.status(409).json({
                    error: 'Não é permitido cadastrar filmes com título duplicado.',
                });
            }
        }

        const data = await model.update({
            titulo,
            descricao,
            duracao: parseInt(duracao),
            genero,
            nota: parseFloat(nota),
            disponibilidade: true,
        });
        res.json({
            message: `Filme "${data.titulo}" atualizado com sucesso!`,
            data,
        });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        res.status(500).json({
            error: 'Erro interno no servidor ao atualizar o filme.',
        });
    }
};

// Remove - Delete
export const remove = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        const exists = await model.findById(id);
        if (!exists) {
            return res.status(404).json({ error: 'Filme não encontrado para deletar.' });
        }

        // Filmes com rating ≥ 9 não podem ser deletados
        if (exists.nota >= 9) {
            return res.status(400).json({
                error: 'Filmes com nota maior ou igual a 9 não podem ser deletados.',
            });
        }

        await model.remove(id);
        res.json({
            message: `O filme "${exists.titulo}" foi deletado com sucesso!`,
            deletado: exists,
        });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        res.status(500).json({ error: 'Erro ao deletar filme' });
    }
};
