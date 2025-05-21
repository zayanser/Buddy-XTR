import moment from 'moment-timezone';
import fs from 'fs';
import os from 'os';
import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;
import config from '../../config.cjs';

const help = async (m, sock) => {
  const prefix = config.PREFIX;
  const mode = config.MODE;
  const pushName = m.pushName || 'User';

  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';

  if (cmd === "help") {
    await m.React('ℹ️');
    
    const helpMessage = `
╭──────────────────────╮
│  𝗛𝗲𝗹𝗽 𝗠𝗲𝗻𝘂 - ${pushName}
│  
│  𝗧𝘆𝗽𝗲: ${prefix}𝗁𝖾𝗅𝗉 <𝖼𝗈𝗆𝗆𝖺𝗇𝖽> 
│  𝗘𝘅𝗮𝗺𝗽𝗹𝗲: ${prefix}𝗁𝖾𝗅𝗉 𝗀𝗉𝗍
╰──────────────────────╯

╭───「 𝗢𝘄𝗻𝗲𝗿 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀 」───╮
│ • block <number> - Block a user
│ • unblock <number> - Unblock a user
│ • join <link> - Join a group via invite
│ • leave - Make bot leave group
│ • setvar <key> <value> - Set config variable
│ • restart - Restart the bot
│ • broadcast <message> - Broadcast to all chats
│ • del - Delete a message
│ • save <contact> - Save a contact
╰──────────────────────╯

╭───「 𝗦𝗲𝗮𝗿𝗰𝗵 𝗧𝗼𝗼𝗹𝘀 」───╮
│ • yts <query> - YouTube search
│ • google <query> - Google search
│ • imd <movie> - IMDb movie info
│ • img <query> - Image search
│ • weather <location> - Weather forecast
│ • playstore <app> - Play Store app info
│ • news - Latest news headlines
╰──────────────────────╯

╭───「 𝗔𝗜 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀 」───╮
│ • gpt <prompt> - ChatGPT response
│ • blackboxai <query> - Blackbox AI
│ • visit <url> - Fetch website content
│ • define <word> - Dictionary definition
╰──────────────────────╯

╭───「 𝗥𝗲𝗹𝗶𝗴𝗶𝗼𝘂𝘀 」───╮
│ 𝗖𝗵𝗿𝗶𝘀𝘁𝗶𝗮𝗻:
│ • bible <verse> - Bible verses
│ • biblelist - List Bible books
│ 𝗜𝘀𝗹𝗮𝗺𝗶𝗰:
│ • surahaudio <surah> - Quran audio
│ • surahurdu <surah> - Quran in Urdu
│ • asmaulhusna - Names of Allah
│ • prophetname - Islamic prophet names
╰──────────────────────╯

╭───「 𝗠𝗲𝗱𝗶𝗮 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿𝘀 」───╮
│ • fb <url> - Download Facebook video
│ • insta <url> - Instagram downloader
│ • tiktok <url> - TikTok downloader
│ • twitter <url> - Twitter video downloader
│ • song <name> - Download music
│ • video <name> - Download video
│ • apk <app> - APK downloader
╰──────────────────────╯

╭───「 𝗚𝗿𝗼𝘂𝗽 𝗠𝗮𝗻𝗮𝗴𝗲𝗺𝗲𝗻𝘁 」───╮
│ • add <number> - Add user to group
│ • kick <@tag> - Remove user from group
│ • promote <@tag> - Make admin
│ • demote <@tag> - Remove admin
│ • tagall - Mention all members
│ • mute - Silence group
│ • unmute - Unsilence group
│ • groupinfo - Group details
╰──────────────────────╯

╭───「 𝗦𝘁𝗶𝗰𝗸𝗲𝗿 𝗠𝗮𝗸𝗲𝗿𝘀 」───╮
│ • attp <text> - Animated text sticker
│ • emojimix <emoji+emoji> - Combine emojis
│ • sticker - Convert image to sticker
│ • crop - Crop sticker
╰──────────────────────╯

╭───「 𝗙𝘂𝗻 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀 」───╮
│ • truth - Random truth question
│ • dare - Random dare challenge
│ • insult - Generate funny insult
│ • quote - Random quote
│ • fact - Interesting fact
│ • meme - Random meme
╰──────────────────────╯

╭───「 𝗨𝘁𝗶𝗹𝗶𝘁𝘆 𝗧𝗼𝗼𝗹𝘀 」───╮
│ • tts <text> - Text to speech
│ • shorten <url> - URL shortener
│ • tempmail - Create temp email
│ • checkmail <email> - Check temp email
│ • qr <text> - Generate QR code
│ • translate <text> - Translate text
╰──────────────────────╯

> 𝗧𝘆𝗽𝗲 ${prefix}𝗁𝖾𝗅𝗉 <𝖼𝗈𝗆𝗆𝖺𝗇𝖽> 𝖿𝗈𝗋 𝖽𝖾𝗍𝖺𝗂𝗅𝗌`;

    await sock.sendMessage(m.from, { 
      text: helpMessage,
      contextInfo: {
        externalAdReply: {
          title: "📚 Bot Help Menu",
          body: "All available commands",
          thumbnailUrl: 'https://files.catbox.moe/ptr27z.jpg',
          sourceUrl: 'https://whatsapp.com/channel/0029Vak0genJ93wQXq3q6X3h',
          mediaType: 1
        }
      }
    }, { quoted: m });
  }
  
  // Detailed help for specific commands
  else if (m.body.startsWith(`${prefix}help `)) {
    const specificCmd = m.body.slice(`${prefix}help `.length).trim().toLowerCase();
    let detailedHelp = '';
    
    switch(specificCmd) {
      case 'gpt':
        detailedHelp = `𝗚𝗣-𝟰 𝗖𝗼𝗺𝗺𝗮𝗻𝗱\nUsage: ${prefix}gpt <your question>\nExample: ${prefix}gpt Explain quantum computing\n\nGet AI responses to any question using GPT-4 technology.`;
        break;
      case 'fb':
        detailedHelp = `𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿\nUsage: ${prefix}fb <facebook URL>\nExample: ${prefix}fb https://fb.watch/xyz\n\nDownload videos from Facebook.`;
        case 'song':
        detailedHelp = `𝗦𝗼𝗻𝗴 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿\nUsage: ${prefix}song <title>\nExample: ${prefix}song shape of you\n\nDownload high quality audio tracks.`;
        break;
      case 'weather':
        detailedHelp = `𝗪𝗲𝗮𝘁𝗵𝗲𝗿 𝗙𝗼𝗿𝗲𝗰𝗮𝘀𝘁\nUsage: ${prefix}weather <city>\nExample: ${prefix}weather London\n\nGet current weather and forecast.`;
        break;
      // Add more cases for other commands...
      default:
        detailedHelp = `No detailed help available for "${specificCmd}". Use ${prefix}help to see all commands.`;
    }
    
    await sock.sendMessage(m.from, { text: detailedHelp }, { quoted: m });
  }
};

export default help;
