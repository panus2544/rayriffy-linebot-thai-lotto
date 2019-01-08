import * as functions from 'firebase-functions'
import axios from 'axios'

const config = functions.config()

const LINE_API_URL = 'https://api.line.me/v2/bot/message'
const REQUEST_HEADER = {
  'Content-Type': `application/json`,
  Authorization: `Bearer ${config.line.access_token}`,
}

export let linebot = functions.https.onRequest((req, res) => {
  console.log(req.body.events[0].message)

  if (req.body.events[0].message.type !== 'text') {
    return
  }
  let text = req.body.events[0].message.text

  // TODO: GET LOTTERY NUMBER AND MAKE A PROCESS
  axios({
    method: 'GET',
    url: 'https://thai-lotto-api.herokuapp.com/lotto/30122561',
    responseType: 'json',
  }).then(json => {
    // Check for major prizes
    json.data.response.prizes.forEach(prize => {
      prize.number.forEach(number => {
        if (number === text) {
          axios({
            method: 'POST',
            url: `${LINE_API_URL}/reply`,
            headers: REQUEST_HEADER,
            data: {
              replyToken: req.body.events[0].replyToken,
              messages: [
                {
                  type: 'text',
                  text: `ยินดีด้วยท่านได้รับรางวัล ${prize.name} มูลค่า ${
                    prize.reward
                  } บาท!!!`,
                },
              ],
            },
          }).catch(err => {
            console.log(err.data)
          })
          return 0
        }
      })
    })
  })
})
