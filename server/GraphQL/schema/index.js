const { gql } = require("apollo-server")


module.exports = gql`
type Libro {
    titolo : String!
    descrizione : String
    autore: Autore @relationship(type:"STATO_SCRITTO_DA", direction : OUT ) 
}
type Autore {
    
    nome: String!
    libri_scritti: [Libro!] @relationship(type:"HA_SCRITTO", direction : OUT ) 
}
input Libroinput{
    titolo: String!
    descrizione: String!
    autore : String!
}
input Autoreinput{
    nome: String!
}

type Query {
    tutti_libri:[Libro] 
    autori:[Autore] 

}
type Mutation {
    aggiungi_libro(libroinput: Libroinput) :Libro 
    aggiungi_autore(autoreinput: Autoreinput) 
}



`