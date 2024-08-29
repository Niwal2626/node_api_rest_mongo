const express= require('express')
const router = express.Router()
const Book = require('../models/book.model')


//MIDDLEWARE
const getBook = async(req,res,next)=>{
    let book;
    const{id} = req.params;

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        return res.status(404).json({
            message: 'El Id del libro no es válido'
        })
    }
    try{
        book=await Book.findById(id)
        if(!book){
            return res.status(404).json({
                message: 'El libro no fue encontrado'
            })
        }
    }catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
    res.book = book;
    next()
}

//obtener los TODOS  libros [GET]
router.get('/',async(req,res)=>{
    try{
        const books = await Book.find();
        console.log('GET ALL', books);
        if(books.length === 0){
            return res.status(204).json([])
        }
        res.json(books)

    }catch (error){
        res.status(500).json({message:error.message})

    }
})
//CREAR UN NUEVO LIBRO(recurso)   [POST]

router.post('/' ,async(req,res)=>{
    const{title,autor,genre,publication_date}= req?.body//el ? es por si no viene 
    if(!title||!autor||!genre||!publication_date){
        return res.status(400).json({
            message:'Los campos titulo,autor,genero,fecha son obligatorios'
        })
    }
    const book= new Book(
        {
            title,
            autor,
            genre,
            publication_date
        }
    )
    try{
        const newBook = await book.save();
        console.log((newBook))
        res.status(201).json(newBook)
    }catch(error){
        res.status(400).json({
            message: error.message
        })
    }
})
//GET INDIVIDUAL
router.get('/:id',getBook,async(req,res)=>{
    res.json(res.book);
});
//PUT
router.put('/:id',getBook,async(req,res)=>{
    try{
        const book = res.book
        book.title= req.body.title || book.title;
        book.autor= req.body.autor || book.autor;
        book.genre= req.body.genre || book.genre;
        book.publication_date= req.body.publication_date || book.publication_date;

        const updatedBook=await book.save()
        res.json(updatedBook)
    }catch(error){
        res.status(400).json({
            message: error.message
        })
    }
})
//[PATCH]
router.patch('/:id',getBook,async(req,res)=>{
    if(!req.body.title && !req.body.autor && !req.body.genre && !req.body.publication_date){
        res.status(400).json({
            message: "Almenos uno de estos campos debe ser enviado: Titulo, Autor, Genero, Fecha de publicación"
        })
    }
    try{
        const book = res.book
        book.title= req.body.title || book.title;
        book.autor= req.body.autor || book.autor;
        book.genre= req.body.genre || book.genre;
        book.publication_date= req.body.publication_date || book.publication_date;

        const updatedBook=await book.save()
        res.json(updatedBook)
    }catch(error){
        res.status(400).json({
            message: error.message
        })
    }
})
//DELETE
router.delete('/:id',getBook,async(req,res)=>{
    try {
       const book = res.book
       await book.deleteOne({
        _id:book._id
       });
        res.json({
            message: `El libro ${book.title} fue eliminado correctamente`
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
        
    }
});
module.exports=router