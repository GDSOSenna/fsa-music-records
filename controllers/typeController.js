//Importa o banco de dados

const database = require('../services/database')

//Extrai os dados do banco de dados que está relacionado com a escrita SQL abaixo

exports.getAllType = async(req,res) => {
    try{
        const result = await database.pool.query(`
        SELECT g.id, g.name, g.description, g.created_date
    
        FROM type g
        `)

        return res.status(200).json(result.rows)
    } catch(error){
        return res.status(500).json({ error: error.message})
    }
}

//Extrai os dados do banco de dados que está relacionado com a escrita SQL abaixo pelo ID do gênero

exports.getTypeById = async(req, res) => {
    try{

        const result = await database.pool.query({
            text: `SELECT g.id, g.name, g.description, g.created_date
        
        FROM type g
        WHERE g.id = $1`,
            values: [req.params.id]
        })

        if(result.rowCount == 0){
            return res.status(404).json({error: "Type ID not found"})
        }
        
        return res.status(200).json(result.rows[0])
    } catch(error) {
        return res.status(500).json({ error: error.message})
    }
}

//Cria um novo genêro e adiciona os dados no banco

exports.createType = async(req,res) => {
    try{

        if(!req.body.name){
            return res.status(422).json({ error: 'Name is required'})
        }

        const existsResult = await database.pool.query({
            text: 'SELECT EXISTS (SELECT * FROM type WHERE name = $1)',
            values: [req.body.name]
        })

        if(existsResult.rows[0].exists){
            return res.status(409).json({error: `Type ${req.body.name} already exists`})
        }

        const result = await database.pool.query({
            text: `
            INSERT INTO type 
            (name, description)
            VALUES
            ($1, $2) RETURNING *`,
            values: [
                req.body.name,
                req.body.description
            ]
        })

        return res.status(201).json(result.rows[0])
    } catch (error){
        return res.status(500).json({ error: error.message})
    }
}

//Atualiza algum genêro a partir do ID

exports.updateType = async(req,res) => {
    try{
        if(!req.body.name){
            return res.status(422).json({error: 'Name is required'})
        }

        const existsResult = await database.pool.query({
            text: `SELECT EXISTS (SELECT * FROM type WHERE id = $1)`,
            values: [req.params.id]
        })

        if(!existsResult.rows[0].exists){
            return res.status(422).json({error: "Type ID not found"})
        }

        const result = await database.pool.query({
            text: `UPDATE type 
            SET 
            name = $1,
            description = $2
            WHERE id = $3 RETURNING *`,
            values: [
                req.body.name,
                req.body.description,
                req.params.id
            ]
        })

        if(result.rowCount == 0){
            return res.status(404).json({error: 'Type not found'})
        }

        return res.status(200).json(result.rows[0])
    } catch(error) {
        return res.status(500).json({ error: error.message})
    }
}

//Deleta algum gênero pelo ID

exports.deleteType= async(req, res) => {
    try{
        const result = await database.pool.query({
            text: `DELETE FROM type WHERE id = $1`,
            values: [req.params.id]
        })

        if(result.rowCount == 0){
            return res.status(404).json({error: 'Type ID not found'})
        }

        return res.status(204).send()
    }   catch(error){
        return res.status(500).json({ error: error.message})
    }
}