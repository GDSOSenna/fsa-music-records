//Importa o banco de dados

const database = require('../services/database')

//Extrai os dados do banco de dados que está relacionado com a escrita SQL abaixo

exports.getAllGender = async(req,res) => {
    try{
        const result = await database.pool.query(`
        SELECT g.id, g.name, g.create_date
    
        FROM gender g
        `)

        return res.status(200).json(result.rows)
    } catch(error){
        return res.status(500).json({ error: error.message})
    }
}

//Extrai os dados do banco de dados que está relacionado com a escrita SQL abaixo pelo ID do gênero

exports.getGenderById = async(req, res) => {
    try{

        const result = await database.pool.query({
            text: `SELECT g.id, g.name, g.create_date
        
        FROM gender g
        WHERE g.id = $1`,
            values: [req.params.id]
        })

        if(result.rowCount == 0){
            return res.status(404).json({error: "Gender ID not found"})
        }
        
        return res.status(200).json(result.rows[0])
    } catch(error) {
        return res.status(500).json({ error: error.message})
    }
}

//Cria um novo genêro e adiciona os dados no banco

exports.createGender = async(req,res) => {
    try{

        if(!req.body.name){
            return res.status(422).json({ error: 'Name is required'})
        }

        const existsResult = await database.pool.query({
            text: 'SELECT EXISTS (SELECT * FROM gender WHERE name = $1)',
            values: [req.body.name]
        })

        if(existsResult.rows[0].exists){
            return res.status(409).json({error: `Gender ${req.body.name} already exists`})
        }

        const result = await database.pool.query({
            text: `
            INSERT INTO gender 
            (name)
            VALUES
            ($1) RETURNING *`,
            values: [
                req.body.name
            ]
        })

        return res.status(201).json(result.rows[0])
    } catch (error){
        return res.status(500).json({ error: error.message})
    }
}

//Atualiza algum genêro a partir do ID

exports.updateGender = async(req,res) => {
    try{
        if(!req.body.name){
            return res.status(422).json({error: 'Name is required'})
        }

        const existsResult = await database.pool.query({
            text: `SELECT EXISTS (SELECT * FROM gender WHERE id = $1)`,
            values: [req.params.id]
        })

        if(!existsResult.rows[0].exists){
            return res.status(422).json({error: "Gender ID not found"})
        }

        const result = await database.pool.query({
            text: `UPDATE gender 
            SET 
            name = $1
            WHERE id = $2 RETURNING *`,
            values: [
                req.body.name,
                req.params.id
            ]
        })

        if(result.rowCount == 0){
            return res.status(404).json({error: 'Gender not found'})
        }

        return res.status(200).json(result.rows[0])
    } catch(error) {
        return res.status(500).json({ error: error.message})
    }
}

//Deleta algum gênero pelo ID

exports.deleteGender= async(req, res) => {
    try{
        const result = await database.pool.query({
            text: `DELETE FROM gender WHERE id = $1`,
            values: [req.params.id]
        })

        if(result.rowCount == 0){
            return res.status(404).json({error: 'Gender ID not found'})
        }

        return res.status(204).send()
    }   catch(error){
        return res.status(500).json({ error: error.message})
    }
}