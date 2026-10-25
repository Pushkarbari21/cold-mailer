import multer from 'multer'

const storage = multer.memoryStorage()

export const upload = multer({
    storage, 
    limits:{
        //1024->1kb
        fileSize:10*1024*1024 //10MB
    }
})