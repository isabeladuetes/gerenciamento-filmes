import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Iniciando seed...');

    await prisma.filme.createMany({
        data: [
            {
                titulo: 'Interestelar',
                descricao: 'Exploração espacial em busca de um novo lar para a humanidade',
                duracao: 169,
                genero: 'Ficção Científica',
                nota: 8.6,
                disponibilidade: true,
            },
            {
                titulo: 'O Poderoso Chefão',
                descricao: 'A saga de uma família mafiosa italiana',
                duracao: 175,
                genero: 'Drama',
                nota: 9.2,
                disponibilidade: true,
            },
            {
                titulo: 'Vingadores: Ultimato',
                descricao: 'Os heróis se unem para enfrentar Thanos',
                duracao: 181,
                genero: 'Ação',
                nota: 8.4,
                disponibilidade: false,
            },
            {
                titulo: 'Parasita',
                descricao: 'Uma crítica social cheia de suspense',
                duracao: 132,
                genero: 'Suspense',
                nota: 8.5,
                disponibilidade: true,
            },
            {
                titulo: 'Cidade de Deus',
                descricao: 'A realidade do crime organizado no Rio de Janeiro',
                duracao: 130,
                genero: 'Drama',
                nota: 8.7,
                disponibilidade: true,
            },
            {
                titulo: 'Matrix',
                descricao: 'A humanidade vive em uma simulação criada por máquinas',
                duracao: 136,
                genero: 'Ficção Científica',
                nota: 8.7,
                disponibilidade: false,
            },
            {
                titulo: 'Gladiador',
                descricao: 'Um general romano busca vingança',
                duracao: 155,
                genero: 'Ação',
                nota: 8.5,
                disponibilidade: true,
            },
            {
                titulo: 'Whiplash',
                descricao: 'A obsessão pela perfeição na música',
                duracao: 106,
                genero: 'Drama',
                nota: 8.5,
                disponibilidade: true,
            },
            {
                titulo: 'Toy Story',
                descricao: 'Brinquedos ganham vida quando humanos não estão por perto',
                duracao: 81,
                genero: 'Animação',
                nota: 8.3,
                disponibilidade: true,
            },
            {
                titulo: 'O Senhor dos Anéis: A Sociedade do Anel',
                descricao: 'Uma jornada épica para destruir um anel poderoso',
                duracao: 178,
                genero: 'Fantasia',
                nota: 8.8,
                disponibilidade: false,
            },
        ],
    });

    console.log('✅ Seed concluído!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });