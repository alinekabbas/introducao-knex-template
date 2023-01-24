import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//Prática 1
app.get("/bands", async (req: Request, res: Response) =>{
    try {
        const result = await db.raw(`SELECT * FROM bands`)

        res.status(200).send(result)
        
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//Prática 2
app.post("/bands", async (req: Request, res: Response) =>{
    try {
        const id = req.body.id
        const name = req.body.name

        if(!id || !name){
            res.status(400)
            throw new Error("id ou nome inválido");
        }

        if(typeof id !== "string"){
            res.status(400)
            throw new Error("id deve ser um texto");
        }

        if(typeof name !== "string"){
            res.status(400)
            throw new Error("nome deve ser um texto");
        }

        await db.raw(`
            INSERT INTO bands(id, name)
            VALUES("${id}", "${name}");
        `)

        res.status(200).send("Banda cadastrada com sucesso")
        
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//Prática 3

app.put("/bands/:id", async (req: Request, res: Response) =>{
    try {
        const id = req.params.id

        const newId = req.body.id
        const newName = req.body.name

        if (newId !== undefined) {

            if (typeof newId !== "string") {
                res.status(400)
                throw new Error("'id' deve ser string")
            }

			if (newId.length < 1) {
                res.status(400)
                throw new Error("'id' deve possuir no mínimo 1 caractere")
            }
        }

        if (newName !== undefined) {

            if (typeof newName !== "string") {
                res.status(400)
                throw new Error("'name' deve ser string")
            }

            if (newName.length < 2) {
                res.status(400)
                throw new Error("'name' deve possuir no mínimo 2 caracteres")
            }
        }

        const [ band ] = await db.raw(`
			SELECT * FROM bands
			WHERE id = "${id}";
		`)

        if(band){
            await db.raw(`
            UPDATE bands
            SET
                id = "${newId || band.id}",
                name = "${newName || band.name}"
            WHERE id = "${id}";
        `)
        }else {
            res.status(404)
            throw new Error("'id' não encontrada")
        }

        res.status(200).send({ message: "Atualização realizada com sucesso" })
        
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//Fixação

app.get("/songs", async (req: Request, res: Response) =>{
    try {
        const result = await db.raw(`SELECT * FROM songs`)

        res.status(200).send(result)
        
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


app.post("/songs", async (req: Request, res: Response) =>{
    try {
        const id = req.body.id
        const name = req.body.name
        const band_id = req.body.band_id

        if(!id || !name || !band_id){
            res.status(400)
            throw new Error("id ou nome inválido");
        }

        if(typeof id !== "string"){
            res.status(400)
            throw new Error("id deve ser um texto");
        }

        if(typeof name !== "string"){
            res.status(400)
            throw new Error("nome deve ser um texto");
        }

        if(typeof band_id !== "string"){
            res.status(400)
            throw new Error("id deve ser um texto");
        }

        await db.raw(`
            INSERT INTO songs(id, name, band_id)
            VALUES("${id}", "${name}", "${band_id}");
        `)

        res.status(200).send("Música cadastrada com sucesso")
        
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


app.put("/songs/:id", async (req: Request, res: Response) =>{
    try {
        const id = req.params.id

        const newId = req.body.id
        const newName = req.body.name
        const newIdBands = req.body.band_id

        if (newId !== undefined) {

            if (typeof newId !== "string") {
                res.status(400)
                throw new Error("'id' deve ser string")
            }

			if (newId.length < 1) {
                res.status(400)
                throw new Error("'id' deve possuir no mínimo 1 caractere")
            }
        }

        if (newName !== undefined) {

            if (typeof newName !== "string") {
                res.status(400)
                throw new Error("'name' deve ser string")
            }

            if (newName.length < 2) {
                res.status(400)
                throw new Error("'name' deve possuir no mínimo 2 caracteres")
            }
        }

        if (newIdBands !== undefined) {

            if (typeof newIdBands !== "string") {
                res.status(400)
                throw new Error("'id' deve ser string")
            }

			if (newIdBands.length < 1) {
                res.status(400)
                throw new Error("'id' deve possuir no mínimo 1 caractere")
            }
        }

        const [ song ] = await db.raw(`
			SELECT * FROM songs
			WHERE id = "${id}";
		`)

        if(song){
            await db.raw(`
            UPDATE songs
            SET
                id = "${newId || song.id}",
                name = "${newName || song.name}",
                band_id = "${newIdBands || song.band_id}"
            WHERE id = "${id}";
        `)
        }else {
            res.status(404)
            throw new Error("'id' não encontrada")
        }

        res.status(200).send({ message: "Atualização realizada com sucesso" })
        
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})





