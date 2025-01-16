import multer, { StorageEngine } from "multer"
import path from "node:path"
import { v4 as uuidv4 } from "uuid"
import { Request } from "express"

const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: any, cb: any) => {
    console.log(req.body)
    cb(null, path.join(__dirname, "../public/uploads/"))
  },
  filename: (req: Request, file: any, cb: any) => {
    const id = uuidv4()
    let fileName = file.originalname.split(" ").join("-")

    if (fileName.endsWith(".mp3")) {
      fileName = `${id}.mp3`
    }

    req.body.id = id
    cb(null, fileName)
  },
})

const upload = multer({ storage })
export default upload
