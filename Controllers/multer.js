
import multer from "multer";

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
      cb(null,'public')
    },
    filename:(req,file,cb)=>{
     const filenames=file.originalname;
     cb(null,filenames)
    }
})

export const upload= multer({storage})