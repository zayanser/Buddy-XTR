import moment from 'moment-timezone';
import fs from 'fs';
import os from 'os';
import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;
import config from '../../config.cjs';

const insult = async (m, sock) => {
  const prefix = config.PREFIX;
  const pushName = m.pushName || 'User';

  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';

  if (cmd === "insult") {
    await m.React('😡'); // React with an angry icon
    
    // Array of random insults
   const insults = [  
  "You're the reason God created the middle finger.",  
  "If I wanted to kill myself, I'd climb your ego and jump to your IQ.",  
  "You're not pretty enough to be this stupid.",  
  "I'd agree with you, but then we'd both be wrong.",  
  "You're the human equivalent of a participation trophy.",  
  "I'd explain it to you, but I don't have any crayons with me.",  
  "You have the personality of a wet mop.",  
  "If stupidity was a crime, you'd be serving a life sentence.",  
  "You're like a cloud—when you disappear, it's a beautiful day.",  
  "I'm not saying I hate you, but I would unplug your life support to charge my phone.",  
  "You're the reason the gene pool needs a lifeguard.",  
  "Your face makes onions cry.",  
  "You're not stupid, you just have bad luck when thinking.",  
  "You're the reason shampoo has instructions.",  
  "I'd call you an idiot, but that would be an insult to stupid people.",  
  "You're about as useful as a screen door on a submarine.",  
  "If laughter is the best medicine, your face must be curing the world.",  
  "You're not the sharpest tool in the shed, but at least you're a tool.",  
  "You're like a dictionary—you add meaning to my life, but only briefly.",  
  "I'd slap you, but that would be animal abuse.",  
  // **EXTREME ADDITIONS**  
  "Your birth certificate is an apology letter from the condom factory.",  
  "You’re so ugly, when you were born, the doctor slapped your mother.",  
  "I’d rather drink a gallon of diarrhea than spend another minute with you.",  
  "If I had a gun with two bullets and was in a room with Hitler, Bin Laden, and you, I'd shoot you twice.",  
  "You’re the human version of a ‘404 Error: Intelligence Not Found.’",  
  "You have two brain cells, and they’re both fighting for third place.",  
  "Your family tree must be a cactus because everyone on it is a prick.",  
  "You’re like a broken pencil—pointless.",  
  "I’d call you a waste of oxygen, but even plants reject your CO2.",  
  "You’re so dense, light bends around you to avoid contact.",  
  "If ignorance is bliss, you must be the happiest person alive.",  
  "You’re the reason why aliens avoid Earth.",  
  "Your existence is proof that evolution can go backwards.",  
  "You’re the human equivalent of a ‘Do Not Resuscitate’ order.",  
  "I’d roast you, but I’m not allowed to burn trash.",  
  "You’re like a parking lot—no matter where you go, you’re always the worst spot.",  
  "The only thing worse than your personality is your face.",  
  "You’re the reason why some animals eat their young.",  
  "You’re not just a clown—you’re the entire circus.",  
  "If you were any dumber, we’d have to water you twice a week."  
];

    // Get a random insult
    const randomInsult = insults[Math.floor(Math.random() * insults.length)];
    
    const insultMessage = `
╭┈───────────────• 
│  ◦ 𝖕𝖗𝖊𝖋𝖎𝖝: ${prefix}
│  ◦ 𝕴𝖓𝖘𝖚𝖑𝖙: ${randomInsult}
│  ◦ 𝖛𝖎𝖈𝖙𝖎𝖒: ${pushName}            
╰┈───────────────•
> Powered by carl`;

    await m.React('🤡'); // React with a clown icon

    sock.sendMessage(
      m.from,
      {
        text: insultMessage,
        contextInfo: {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363315115438245@newsletter',
            newsletterName: "𝕭𝖔𝖙 𝖇𝖞 𝕮𝖆𝖗𝖑",
            serverMessageId: -1,
          },
          forwardingScore: 999,
          externalAdReply: {
            title: "𝕭𝖚𝖉𝖉𝖞 𝖃𝕿𝕽",
            body: "𝕴𝖓𝖘𝖚𝖑𝖙",
            thumbnailUrl: 'https://files.catbox.moe/kffzth.jpg',
            sourceUrl: 'https://whatsapp.com/channel/0029Vak0genJ93wQXq3q6X3h',
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        },
      },
      { quoted: m }
    );
  }
};

export default insult;
