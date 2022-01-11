const fs = require('fs')
const axios = require('axios')
const cards = []
let currentPage = 0
let intervalId;
const startTime = +Date.now()
let shouldStop = false

const grabCards = async () => {
  if (shouldStop) {
    console.log('we should be donzo!')
    return false;
  }

  console.log('request...', startTime)
  console.log('we are on page', currentPage)
  const { data } = await axios.get(`https://fabdb.net/api/cards?page=${currentPage}&per_page=100`)

  if (data && data.data && data.data.length !== 0) {
    const { data: cardsFromCurrentPage } = data
    cards.push(...cardsFromCurrentPage)
    console.log('Added cards to array. Number of cards now: ', cards.length)
    currentPage++
  } else {
    const formattedCards = cards.map((card) => {
      const cardCopy = { ...card }
      delete cardCopy.printings
      delete cardCopy.sideboardTotal
      return cardCopy
    })

    const endTime = +Date.now()
    console.log('Writing the file!', `./json/cardData-${endTime}.json`)
    fs.writeFileSync(`./json/cardData-${endTime}.json`, JSON.stringify(formattedCards))
    console.log('Wrote json file!')
    console.log('Done! Clearing timer...', endTime)
    clearInterval(intervalId)
    console.log(`This took ${endTime - startTime} ms`)
    shouldStop = true
  }
}
const FIVE_SECONDS = 5000

intervalId = setInterval(grabCards, FIVE_SECONDS)
