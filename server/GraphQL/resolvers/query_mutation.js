const Libro = require('../../modelli/libro');
const Autore = require('../../modelli/autore');
const merge = require('./merge');
const mongoose = require('mongoose')
const {neo4jgraphql} = require ('@neo4j/graphql')

module.exports ={
    Query:{
        tutti_libri: async() => {
            neo4jgraphql
            try {
               const libri = await Libro.find();
               return libri.map(libro =>{
               return merge.trasformalibro(libro);
                   
               });
            } catch (err) {
                throw err;
            }
    
        },
        
        autori: async () => {
            try {
                neo4jgraphql
                const autore = await Autore.find();
                return autore.map(autore => {
                    return {
                        ...autore._doc,
                        _id: autore._doc._id.toString(),
                        libri_scritti: merge.libri.bind(this, autore._doc.libri_scritti)
                    };
                });
            } catch (err) {
                throw err;
            }
    
        },
        
    },

    Mutation :{  
        aggiungi_libro: async(parent, args, context,info) =>{
            neo4jgraphql
            try {
                const autore_non_inserito = await Autore.findOne({ nome: args.libroinput.scrittore });
                if (!autore_non_inserito) {
                    throw new Error('autore non inserito')
                }
    
    
    
            } catch (err) {
                throw err;
            }
            const libro = new Libro({
                titolo: args.libroinput.titolo,
                descrizione: args.libroinput.descrizione,
                scrittore: await Autore.findOne({ nome: args.libroinput.scrittore })
            });
            let librocreato;
            try {
                const result = await libro.save();
                librocreato = merge.trasformalibro(result)
                const scrittore = await Autore.findOne({ nome: args.libroinput.scrittore })
                scrittore.libri_scritti.push(libro);
                await scrittore.save();
                return librocreato;
            } catch (err) {
                throw err;
            }
    
        },
        
       
       
            
        
        aggiungi_autore: async (parent, args, context, info) => {
            neo4jgraphql
            try {
                const autore_già_inserito = await Autore.findOne({ nome: args.autoreinput.nome });
                if (autore_già_inserito) {
                    throw new Error('autore già inserito');
                }
                const autore = new Autore({
                    nome: args.autoreinput.nome
                });
                const result = await autore.save();
                return { ...result._doc, _id: result._doc._id.toString() };
    
    
            } catch (err) {
                throw err;
            }
    
        },
        aggiungi_autore :() => neo4jgraphql
        
        
        
}
}