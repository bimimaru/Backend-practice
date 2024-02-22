import pg from 'pg';

export const getDatabase = async (): Promise<pg.Client> => {
    const db = new pg.Client({
        host: 'localhost',
        port: 5432,
        database: 'ecommerce_exercise',
        user: 'numiao',
        password: 'numiao'
    })

    await db.connect()

    return db
}