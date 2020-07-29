import express from 'express'
import monk from 'monk'
import helmet from 'helmet'
import yup from 'yup'
import { nanoid } from 'nanoid'
import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'
import dotenv from 'dotenv'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
dotenv.config()
const port = process.env.PORT || 5000
const { isSchema } = yup
const httpReg = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
const noHttpReg = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/

// this project was inspired by CJ from CodingGarden (https://github.com/CodingGarden)

// initialize db connection; load urls collection
const db = monk(process.env.MONGO_URL)
const urls = db.get('urls')
urls.createIndex('alias', { unique: true }) // ensures that every entry has a unique alias

const app = express()
app.enable('trust proxy')
app.use(helmet())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join('./client/build')))
app.use(cors())

const schema = yup.object().shape({
  alias: yup.string().trim().matches(/$|^[\w-]+$/i), // matches alphanumeric case insensitive strings
  url: yup.string().trim().url().required('🥺 pwease gib me a url 😖') // auto matches urls
})

app.get('/:id', async (req, res, next) => {
  const { id: alias } = req.params
  try {
    const url = await urls.findOne({ alias })
    if (url) {
      return res.redirect(url.url)
    }
    next()
  } catch (err) {
    return res.redirect(`localhost:${port}`)
  }
  next()
})

/*
 * post request to handle url creation
 */
app.post('/create', async (req, res, next) => {
  let { alias, url } = req.body

  if (!url.match(httpReg) && url.match(noHttpReg)) {
    url = `http://${url}`
  }
  try {
    await schema.validate({ alias, url })
    if (!alias) {
      alias = nanoid(7)
    } else {
      const current = await urls.findOne({ alias })
      if (current) {
        return res.status(500).send('😲 bruh someone took that alias already 😥')
      }
    }
    alias = alias.toLowerCase()
    const result = await urls.insert({ alias, url })
    return res.json(result)
  } catch (err) {
    // lets express know ur done with this url post thing and can move on if it needs to
    next(err)
  }
})

app.listen(port, () => {
  console.log(`listening at localhost:${port}`)
})
