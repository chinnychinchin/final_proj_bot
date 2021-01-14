//Load required libraries
const {Telegraf} = require('telegraf');
const fetch = require('node-fetch');

//Create an instance of a bot
const BOT_TOKEN = process.env.BOT_TOKEN
const bot = new Telegraf(BOT_TOKEN)


//
const welcomeMsg = `Hi there! Welcome to Veracity. Simply send me a command /analyze + <YOUR ARTICLE> in the chatbox to analyze your article!`

//Methods
bot.command('analyze', async (ctx, next) => {

  const offsetLength = ctx.message.entities[0].length
  const articleContent = ctx.message.text.substring(offsetLength, ctx.message.text.length);
  console.log(ctx.message)
  if (!articleContent.length){
      next(ctx)
  }
  else{

      const result = await fetch('http://chinsfakebox.eastus.azurecontainer.io:8080/fakebox/check', {method: 'post', body: JSON.stringify({content: articleContent}), headers: { 'Content-Type': 'application/json' }})
      const resultJson = await result.json()
      ctx.reply(`Content score: ${resultJson['content']['score'].toFixed(5)}/1 (${resultJson['content']['decision']})\n(Analysis by Veracity)`)

  }
  
}, async (ctx) => {ctx.reply(welcomeMsg)})


bot.command('help', ctx => ctx.reply(welcomeMsg))
bot.command('start', ctx => ctx.reply(welcomeMsg))


//To catch errors
bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
})

//Start bot
const PORT = process.env.PORT

bot.launch({
    webhook: {
      domain: 'https://thefakerealbot.herokuapp.com/',
      port: PORT
    }
  })