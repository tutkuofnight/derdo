import multer, { StorageEngine } from "multer"
import { Request } from "express"

import path from "node:path"
import fs from "node:fs"

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

const createUploadDirs = () => {
  const dirs = [
    path.join(__dirname, "../public/uploads/track"),
    path.join(__dirname, "../public/uploads/track/image")
  ]
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  })
}

createUploadDirs()

const trackStorage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: any, cb: any) => {
    const uploadPath = path.join(__dirname, "../public/uploads/track/")
    // Klasörün varlığını kontrol et
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req: Request, file: any, cb: any) => {
    const { fileType } = fileInfo(file)
    let fileName: string

    if (!acceptAudioFile.includes(fileType!)) {
      return cb(new Error('Invalid file type'))
    }

    fileName = `${req.params.id}.mp3`
    req.body.trackUrl = `${getFullDomain(req)}/uploads/track/${fileName}`
    cb(null, fileName)
  },
})

const trackImageStorage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: any, cb: any) => {
    const uploadPath = path.join(__dirname, "../public/uploads/track/image/")
    // Klasörün varlığını kontrol et
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req: Request, file: any, cb: any) => {
    const { fileType } = fileInfo(file)
    let fileName: string

    if (!acceptImageFile.includes(fileType!)) {
      return cb(new Error('Invalid file type'))
    }

    fileName = `${req.params.id}.${fileType}`
    req.body.imageUrl = `${getFullDomain(req)}/uploads/track/image/${fileName}`
    cb(null, fileName)
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

