import multer, { StorageEngine } from "multer"
import path from "node:path"
import { Request } from "express"

const acceptImageFile = ["png", "jpeg", "jpg", "gif" , "webp"]
const acceptAudioFile = ["mpeg", "mp3"]

const fileInfo = (file: any) => {
  const fileName = file.originalname.split(" ").join("-")
  const fileType = fileName.split(".").at(-1)
  return { fileName, fileType }
}
const getFullDomain = (req: Request) => {
  return `${req.protocol}://${req.headers.host}`
} 

const trackStorage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: any, cb: any) => {
    cb(null, path.join(__dirname, "../public/uploads/track/"))
  },
  filename: (req: Request, file: any, cb: any) => {
    const { fileType } = fileInfo(file)
    let fileName: string

    if (acceptAudioFile.includes(fileType!)) {
      fileName = `${req.params.id}.mp3`
      req.body.trackUrl = `${getFullDomain(req)}/uploads/track/${fileName!}`
    }
    cb(null, fileName!)
  },
})

const trackImageStorage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: any, cb: any) => {
    cb(null, path.join(__dirname, "../public/uploads/track/image/"))
  },
  filename: (req: Request, file: any, cb: any) => {
    const { fileType } = fileInfo(file)
    let fileName: string
    if (acceptImageFile.includes(fileType!)) {
      fileName = `${req.params.id}.${fileType}`
      req.body.imageUrl = `${getFullDomain(req)}/uploads/track/image/${req.params.id}.${fileType}`
    }
    cb(null, fileName!)
  },
})

// const userImageStorage:StorageEngine = multer.diskStorage({
//   destination: (req: Request, file: any, cb: any) => {
//     console.log(req.body)
//     cb(null, path.join(__dirname, "../public/uploads/user/image"))
//   },
//   filename: (req: Request, file: any, cb: any) => {
//     let fileName = file.originalname.split(" ").join("-")

//     if (fileName.endsWith(".mp3")) {
//       fileName = `${id}.mp3`
//     }

//     req.body.id = id
//     cb(null, fileName)
//   },
// })
// export const userImageUpload = multer({ storage: userImageStorage })

export const trackUpload = multer({ storage: trackStorage })
export const trackImageUpload = multer({ storage: trackImageStorage })

