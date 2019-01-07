import * as functions from 'firebase-functions'
import axios from 'axios'

const config = functions.config()

const LINE_API_URL = 'https://api.line.me/v2/bot/message'
const REQUEST_HEADER = {
  'Content-Type': `application/json`,
  Authorization: `Bearer ${config.line.access_token}`,
}

export let test = functions.https.onRequest((req, res) => {
  res.status(200).send(`OK`)
})

export let linebot = functions.https.onRequest((req, res) => {
  if (req.body.events[0].message.type !== 'text') {
    return
  }
  let text = req.body.events[0].message.text

  // TODO: GET LOTTERY NUMBER AND MAKE A PROCESS
})
