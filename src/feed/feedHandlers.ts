import { Router } from 'express'
import { feed } from './feed'

const router = Router()

router.get('/', (req, res) => {
  try {
    res.header('Content-Type', 'application/xml')
    res.send(feed.atom1())
  } catch (error) {
    res.sendStatus(500)
    console.log(error.message)
  }
})

export default router
