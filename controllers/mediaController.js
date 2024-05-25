//Importa o banco de dados

const database = require('../services/database')

//Extrai os dados do banco de dados que está relacionado com a escrita SQL abaixo

exports.getAllMedias = async(req,res) => {
    try{
        const result = await database.pool.query(`
        SELECT p.id, p.name, p.description, p.price, p.currency, 
        p.quantity, p.gender_id, p.artist_id, p.updated_date, type_id,
    
        (SELECT ROW_TO_JSON(gender_obj) FROM (
            SELECT id, name FROM gender WHERE id = p.gender_id
        ) gender_obj) AS gender,

        (SELECT ROW_TO_JSON(artist_obj) FROM (
            SELECT id, name FROM artist WHERE id = p.artist_id
        ) artist_obj) AS artist,

        (SELECT ROW_TO_JSON(type_obj) FROM (
            SELECT id, name FROM type WHERE id = p.type_id
        ) type_obj) AS type
    
    FROM media p
        `)

        return res.status(200).json(result.rows)
    } catch(error){
        return res.status(500).json({ error: error.message})
    }
}

//Extrai os dados do banco de dados que está relacionado com a escrita SQL abaixo pelo ID do produto

exports.getMediaById = async(req, res) => {
    try{

        const result = await database.pool.query({
            text: `SELECT p.id, p.name, p.description, p.gender_id, p.artist_id, p.price, p.currency, 
            p.quantity, p.updated_date, type_id,
        
            (SELECT ROW_TO_JSON(gender_obj) FROM (
                SELECT id, name FROM gender WHERE id = p.gender_id
            ) gender_obj) AS gender,
    
            (SELECT ROW_TO_JSON(artist_obj) FROM (
                SELECT id, name FROM artist WHERE id = p.artist_id
            ) artist_obj) AS artist,

            (SELECT ROW_TO_JSON(type_obj) FROM (
                SELECT id, name FROM type WHERE id = p.type_id
            ) type_obj) AS type
        
        FROM media p
        WHERE p.id = $1`,
            values: [req.params.id]
        })

        if(result.rowCount == 0){
            return res.status(404).json({error: "media ID not found"})
        }
        
        return res.status(200).json(result.rows[0])
    } catch(error) {
        return res.status(500).json({ error: error.message})
    }
}

//Extrai os dados do banco de dados que está relacionado com a escrita SQL abaixo pelo gênero do produto

exports.getMediaByType = async(req,res) => {
    try{
        const existsResult = await database.pool.query({
            text: 'SELECT EXISTS(SELECT * FROM Gender WHERE id = $1)',
            values: [req.params.genderId]
        })

        if(!existsResult.rows[0].exists){
            return res.status(404).json({error: 'Gender ID not found'})
        }

        const result = await database.pool.query({
            text: `SELECT p.id, p.name, p.description, p.gender_id, p.artist_id, p.price, p.currency, 
            p.quantity, p.updated_date, type_id,
        
            (SELECT ROW_TO_JSON(gender_obj) FROM (
                SELECT id, name FROM gender WHERE id = p.gender_id
            ) gender_obj) AS gender,
    
            (SELECT ROW_TO_JSON(artist_obj) FROM (
                SELECT id, name FROM artist WHERE id = p.artist_id
            ) artist_obj) AS artist,

            (SELECT ROW_TO_JSON(type_obj) FROM (
                SELECT id, name FROM type WHERE id = p.type_id
            ) type_obj) AS type
        
        FROM media p
        WHERE p.gender_id = $1`,
            values: [req.params.genderId]
        })
        
        return res.status(200).json(result.rows)
    } catch(error) {
        return res.status(500).json({ error: error.message})
    }
}

//Cria um novo produto e adiciona os dados no banco

exports.createMedia = async(req,res) => {
    try{

        if(!req.body.name){
            return res.status(422).json({ error: 'Name is required'})
        }

        if(!req.body.price){
            return res.status(422).json({ error: 'Price is required'})
        }

        const existsResult = await database.pool.query({
            text: 'SELECT EXISTS (SELECT * FROM media WHERE name = $1)',
            values: [req.body.name]
        })

        if(existsResult.rows[0].exists){
            return res.status(409).json({error: `media ${req.body.name} already exists`})
        }

        if(!req.body.gender_id){
            return res.status(422).json({ error: 'Gender ID is required'})
        } else{
            const existsResult = await database.pool.query({
                text: 'SELECT EXISTS(SELECT * FROM Gender WHERE id = $1)',
                values: [req.body.gender_id]
            })

            if(!existsResult.rows[0].exists){
                return res.status(422).json({error: 'Gender ID not found'})
            }
        }

        const result = await database.pool.query({
            text: `
            INSERT INTO media 
            (name, description, gender_id, artist_id, price, currency, quantity, type_id) 
            VALUES
            (
                $1, $2, $3, $4, $5, $6, $7, $8
            ) RETURNING *`,
            values: [
                req.body.name,
                req.body.description ? req.body.description : null,
                req.body.gender_id,
                req.body.artist_id,
                req.body.price,
                req.body.currency ? req.body.currency : 'USD',
                req.body.quantity ? req.body.quantity : 0,
                req.body.type_id

            ]
        })

        return res.status(201).json(result.rows[0])
    } catch (error){
        return res.status(500).json({ error: error.message})
    }
}

//Atualiza algum produto a partir do ID

exports.updateMedia = async(req,res) => {
    try{
        if(!req.body.name || !req.body.price || !req.body.gender_id ){
            return res.status(422).json({error: 'All fields are required'})
        }

        const existsResult = await database.pool.query({
            text: `SELECT EXISTS (SELECT * FROM gender WHERE id = $1)`,
            values: [req.body.gender_id]
        })

        if(!existsResult.rows[0].exists){
            return res.status(422).json({error: "Gender ID not found"})
        }

        const result = await database.pool.query({
            text: `UPDATE media 
            SET 
            name = $1,
            description = $2,
            gender_id = $3,
            artist_id = $4,
            price = $5,
            currency = $6,
            quantity = $7,
            type_id = $8
            WHERE id = $9 RETURNING *`,
            values: [
                req.body.name,
                req.body.description ? req.body.description : null,
                req.body.gender_id,
                req.body.artist_id,
                req.body.price,
                req.body.currency ? req.body.currency : 'USD',
                req.body.quantity ? req.body.quantity : 0,
                req.body.type_id,
                req.params.id
            ]
        })

        if(result.rowCount == 0){
            return res.status(404).json({error: 'media not found'})
        }

        return res.status(200).json(result.rows[0])
    } catch(error) {
        return res.status(500).json({ error: error.message})
    }
}

//Deleta algum produto pelo ID

exports.deleteMedia= async(req, res) => {
    try{
        const result = await database.pool.query({
            text: `DELETE FROM media WHERE id = $1`,
            values: [req.params.id]
        })

        if(result.rowCount == 0){
            return res.status(404).json({error: 'media ID not found'})
        }

        return res.status(204).send()
    }   catch(error){
        return res.status(500).json({ error: error.message})
    }
}