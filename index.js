//Load required libraries
const {Telegraf} = require('telegraf');
const {xNumOfCookies} = require('./fortune-cookie');
const {MenuTemplate, MenuMiddleware} = require('telegraf-inline-menu');
const fetch = require('node-fetch');

//Create an instance of a bot
const BOT_TOKEN = process.env.BOT_TOKEN
const bot = new Telegraf(BOT_TOKEN)




//Methods
bot.hears(new RegExp("fortune", "i"), (ctx) => {

    const [cookie] = xNumOfCookies(1)
    ctx.reply(cookie)

})

bot.on('inline_query', async ({ inlineQuery, answerInlineQuery }) => {

    const numOfCookies = inlineQuery.query;
    if(numOfCookies > 0 && numOfCookies < 11) {
        
        const responseArray = xNumOfCookies(numOfCookies).map(cookie => {return {type: 'article', id: cookie.substring(20), title: cookie, input_message_content: {"message_text": cookie}}})
        return answerInlineQuery(responseArray)
    }

    else{
        const responseArray = xNumOfCookies(1).map(cookie => {return {type: 'article', id: cookie.substring(20), title: cookie, input_message_content: {"message_text": cookie}}})
        return answerInlineQuery(responseArray)
    }
    
  })

bot.command('analyze', async (ctx, next) => {

  const offsetLength = ctx.message.entities[0].length
  const articleContent = ctx.message.text.substring(offsetLength, ctx.message.text.length);
  console.log(ctx.message)
  if (!message.length){
      //return menuMiddleware.replyToContext(ctx)
      next(ctx)
  }
  else{

      const result = await fetch('http://chinsfakebox.eastus.azurecontainer.io:8080/fakebox/check', {method: 'post', body: JSON.stringify({content: articleContent}), headers: { 'Content-Type': 'application/json' }})
      const resultJson = await result.json()
      ctx.reply(`Content score: ${resultJson['content']['score']} (${resultJson['content']['decision']})\n(Analysis by Veracity)`)

  }
  

}, async (ctx) => { console.log('menu middleware'); await menuMiddleware.replyToContext(ctx, '') })

  

//Inline keyboard menu
const menuTemplate = new MenuTemplate(() => `Hi there! Welcome to Veracity. Simply send me a command /analyze + <YOUR ARTICLE> in the chatbox to analyze your article!`)

//Buttons 
/*
menuTemplate.interact('Give me a cookie!', 'a', {
do: async ctx => { 
    
    const [cookie] = xNumOfCookies(1)
    ctx.reply(cookie)
    return false 

}
})
*/

const menuMiddleware = new MenuMiddleware('/', menuTemplate)
bot.command('help', ctx => menuMiddleware.replyToContext(ctx))
bot.command('start', ctx => menuMiddleware.replyToContext(ctx))
bot.use(menuMiddleware)



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