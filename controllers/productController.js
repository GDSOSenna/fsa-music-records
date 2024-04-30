//Importa o banco de dados

const database = require('../services/database')

//Extrai os dados do banco de dados que está relacionado com a escrita SQL abaixo

exports.getAllProducts = async(req,res) => {
    try{
        const result = await database.pool.query(`
        SELECT p.id, p.name, p.description, p.price, p.currency, 
        p.quantity, p.cd_id, p.dvd_id, p.vinil_id, p.gender_id, p.updated_date,
    
        (SELECT ROW_TO_JSON(cd_obj) FROM (
            SELECT id, name FROM cd WHERE id = p.cd_id
        ) cd_obj) AS cd,
        
        (SELECT ROW_TO_JSON(dvd_obj) FROM (
            SELECT id, name FROM dvd WHERE id = p.dvd_id
        ) dvd_obj) AS dvd,
        
        (SELECT ROW_TO_JSON(vinil_obj) FROM (
            SELECT id, name FROM vinil WHERE id = p.vinil_id
        ) vinil_obj) AS vinil
    
    FROM product p
        `)

        return res.status(200).json(result.rows)
    } catch(error){
        return res.status(500).json({ error: error.message})
    }
}

//Extrai os dados do banco de dados que está relacionado com a escrita SQL abaixo pelo ID do produto

exports.getProductById = async(req, res) => {
    try{

        const result = await database.pool.query({
            text: `SELECT p.id, p.name, p.description, p.price, p.currency, 
            p.quantity, p.cd_id, p.dvd_id, p.vinil_id, p.gender_id, p.updated_date,
        
            (SELECT ROW_TO_JSON(cd_obj) FROM (
                SELECT id, name FROM cd WHERE id = p.cd_id
            ) cd_obj) AS cd,
            
            (SELECT ROW_TO_JSON(dvd_obj) FROM (
                SELECT id, name FROM dvd WHERE id = p.dvd_id
            ) dvd_obj) AS dvd,
            
            (SELECT ROW_TO_JSON(vinil_obj) FROM (
                SELECT id, name FROM vinil WHERE id = p.vinil_id
            ) vinil_obj) AS vinil
        
        FROM product p
        WHERE p.id = $1`,
            values: [req.params.id]
        })

        if(result.rowCount == 0){
            return res.status(404).json({error: "Product ID not found"})
        }
        
        return res.status(200).json(result.rows[0])
    } catch(error) {
        return res.status(500).json({ error: error.message})
    }
}

//Cria um novo produto e adiciona os dados no banco

exports.createProduct = async(req,res) => {
    try{

        if(!req.body.name){
            return res.status(422).json({ error: 'Name is required'})
        }

        if(!req.body.price){
            return res.status(422).json({ error: 'Price is required'})
        }

        const existsResult = await database.pool.query({
            text: 'SELECT EXISTS (SELECT * FROM product WHERE name = $1)',
            values: [req.body.name]
        })

        if(existsResult.rows[0].exists){
            return res.status(409).json({error: `Product ${req.body.name} already exists`})
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
            INSERT INTO product 
            (name, description, price, currency, quantity, active, cd_id, vinil_id, dvd_id, gender_id) 
            VALUES
            (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
            ) RETURNING *`,
            values: [
                req.body.name,
                req.body.description ? req.body.description : null,
                req.body.price,
                req.body.currency ? req.body.currency : 'BRL',
                req.body.quantity ? req.body.quantity : 0,
                'active' in req.body ? req.body.active : true,
                req.body.cd_id,
                req.body.vinil_id,
                req.body.dvd_id,
                req.body.gender_id
            ]
        })

        return res.status(201).json(result.rows[0])
    } catch (error){
        return res.status(500).json({ error: error.message})
    }
}

//Atualiza algum produto a partir do ID

exports.updateProduct = async(req,res) => {
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
            text: `UPDATE product 
            SET 
            name = $1,
            description = $2,
            price = $3,
            currency = $4,
            quantity = $5,
            active = $6,
            cd_id = $7, 
            dvd_id = $8,
            vinil_id = $9,
            gender_id = $10
            WHERE id = $11 RETURNING *`,
            values: [
                req.body.name,
                req.body.description ? req.body.description : null,
                req.body.price,
                req.body.currency ? req.body.currency : 'BRL',
                req.body.quantity ? req.body.quantity : 0,
                'active' in req.body ? req.body.active : true,
                req.body.cd_id,
                req.body.vinil_id,
                req.body.dvd_id,
                req.body.gender_id = req.body.gender_id,
                req.params.id
            ]
        })

        if(result.rowCount == 0){
            return res.status(404).json({error: 'Product not found'})
        }

        return res.status(200).json(result.rows[0])
    } catch(error) {
        return res.status(500).json({ error: error.message})
    }
}

//Deleta algum produto pelo ID

exports.deleteProduct= async(req, res) => {
    try{
        const result = await database.pool.query({
            text: `DELETE FROM product WHERE id = $1`,
            values: [req.params.id]
        })

        if(result.rowCount == 0){
            return res.status(404).json({error: 'Product ID not found'})
        }

        return res.status(204).send()
    }   catch(error){
        return res.status(500).json({ error: error.message})
    }
}

exports.getProductByType = async(req,res) => {
    try{
        const existsResult = await database.pool.query({
            text: 'SELECT EXISTS(SELECT * FROM Gender WHERE id = $1)',
            values: [req.params.genderId]
        })

        if(!existsResult.rows[0].exists){
            return res.status(404).json({error: 'Gender ID not found'})
        }

        const result = await database.pool.query({
            text: `SELECT p.id, p.name, p.description, p.price, p.currency, 
            p.quantity, p.cd_id, p.dvd_id, p.vinil_id, p.gender_id, p.updated_date,
        
            (SELECT ROW_TO_JSON(cd_obj) FROM (
                SELECT id, name FROM cd WHERE id = p.cd_id
            ) cd_obj) AS cd,
            
            (SELECT ROW_TO_JSON(dvd_obj) FROM (
                SELECT id, name FROM dvd WHERE id = p.dvd_id
            ) dvd_obj) AS dvd,
            
            (SELECT ROW_TO_JSON(vinil_obj) FROM (
                SELECT id, name FROM vinil WHERE id = p.vinil_id
            ) vinil_obj) AS vinil
        
        FROM product p
        WHERE p.gender_id = $1`,
            values: [req.params.genderId]
        })
        
        return res.status(200).json(result.rows)
    } catch(error) {
        return res.status(500).json({ error: error.message})
    }
}