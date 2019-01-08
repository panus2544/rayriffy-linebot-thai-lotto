import axios from 'axios'
import bodyParser from 'body-parser'
import express from 'express'

const server = express()
const {
  PORT = 3000,
  ACCESS_TOKEN = 'oFZLGiWiHqWLwFV0EA3783hk6QT8d42ajaUrvmKCePlMpz9O8ThiHuKWkrlNPejsMRsHnE7j45qThX3QZcAQ5bo7mHKsTTVmgC5Fm20uPaCqBADq+fZD5HlA5FAORBkG3DcJlpovxWlhKehb3UfYywdB04t89/1O/w1cDnyilFU=',
} = process.env

const LINE_API_URL = 'https://api.line.me/v2/bot/message'
const REQUEST_HEADER = {
  'Content-Type': `application/json`,
  Authorization: `Bearer ${ACCESS_TOKEN}`,
}

server.use(bodyParser.urlencoded({extended: false}))
server.use(bodyParser.json())

server.post('/linebot', async (req, res) => {
  console.log(req.body.events[0].message)

  if (req.body.events[0].message.type !== 'text') {
    return
  }

  let text = req.body.events[0].message.text

  // Verify input
  if (!Number(text) || text.length !== 6 || text !== '000000') {
    const payload = {
      replyToken: req.body.events[0].replyToken,
      messages: [
        {
          type: 'text',
          text:
            'ไม่สามารถตรวจผลสลากกินแบ่งได้เนื่องจาก: ข้อมูลขาเข้าไม่ถูกต้อง',
        },
      ],
    }

    const options = {
      headers: REQUEST_HEADER,
    }

    return axios
      .post(`${LINE_API_URL}/reply`, payload, options)
      .catch(err => console.log(err.data))
  }

  let isWin = []

  // Get data from API
  const json = await axios.get('https://thai-lotto-api.herokuapp.com/latest')

  // Check for major prizes
  const promise1 = json.data.response.prizes.map(prize => {
    return prize.number.map(number => {
      if (number === text) {
        isWin.push('win')
        const payload = {
          replyToken: req.body.events[0].replyToken,
          messages: [
            {
              type: 'text',
              text: `ยินดีด้วย! ท่านได้รับ ${prize.name} มูลค่า ${
                prize.reward
              } บาท!!!\nข้อมูลผลสลากกินแบ่งวันที่ ${json.data.response.date}`,
            },
          ],
        }

        const options = {
          headers: REQUEST_HEADER,
        }

        return axios
          .post(`${LINE_API_URL}/reply`, payload, options)
          .catch(err => console.log(err.data))
      }
    })
  })

  // Check for running numbers
  const promise2 = json.data.response.runningNumbers.map(runningNumber => {
    return runningNumber.number.map(number => {
      if (
        (runningNumber.id === 'runningNumberFrontThree' &&
          text.slice(0, 3) === number) ||
        (runningNumber.id === 'runningNumberBackThree' &&
          text.slice(3, 6) === number) ||
        (runningNumber.id === 'runningNumberBackTwo' &&
          text.slice(4, 6) === number)
      ) {
        isWin.push('win')
        const payload = {
          replyToken: req.body.events[0].replyToken,
          messages: [
            {
              type: 'text',
              text: `ยินดีด้วย! ท่านได้รับ ${runningNumber.name} มูลค่า ${
                runningNumber.reward
              } บาท!!!\nข้อมูลผลสลากกินแบ่งวันที่ ${json.data.response.date}`,
            },
          ],
        }

        const options = {
          headers: REQUEST_HEADER,
        }

        return axios
          .post(`${LINE_API_URL}/reply`, payload, options)
          .catch(err => console.log(err.data))
      }
    })
  })

  await Promise.all([promise1, promise2])

  if (isWin !== ['win']) {
    const payload = {
      replyToken: req.body.events[0].replyToken,
      messages: [
        {
          type: 'text',
          text: `เสียใจด้วย! คุณไม่ได้รับรางวัล\nข้อมูลผลสลากกินแบ่งวันที่ ${
            json.data.response.date
          }`,
        },
      ],
    }

    const options = {
      headers: REQUEST_HEADER,
    }

    return axios
      .post(`${LINE_API_URL}/reply`, payload, options)
      .catch(err => console.log(err.data))
  }

  res.send('OK!')
})

server.get('*', (req, res) => {
  res.send(
    {
      status: 'failure',
      response: 'route not found',
    },
    404,
  )
})

server.listen(PORT, () => console.log(`App listening on port ${PORT}!`))
