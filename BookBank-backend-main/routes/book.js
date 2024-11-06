const express = require('express');
const router = express.Router();
const Book = require('..models/book')

/********************************* Find all books ***********************/

router.post("/findBooks",async(req,res)=>{
    const {tag,keyword} = req.body;
    try {
        // const book = await Boo;
    } catch (error) {
        
    }
})