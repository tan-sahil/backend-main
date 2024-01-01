import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)  
    // will create unique id later
    console.log("the file uploaded by the multer , ", file);
      cb(null, file.originalname)   // saving filw with the usernamed .. 
    }
  })
  
  const upload = multer({ storage })   // storage : storage 