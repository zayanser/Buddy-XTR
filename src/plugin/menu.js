import moment from 'moment-timezone';
import fs from 'fs';
import os from 'os';
import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;
import config from '../../config.cjs';

const alive = async (m, sock) => {
  const prefix = config.PREFIX;
  const mode = config.MODE;
  const pushName = m.pushName || 'User';

  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';

  if (cmd === "menu") {
    await m.React('🕵');
    
    // Uptime calculation
    const uptimeSeconds = process.uptime();
    const days = Math.floor(uptimeSeconds / (24 * 3600));
    const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);

    // Time-based greeting
    const time2 = moment().tz("Asia/Karachi").format("HH:mm:ss");
    let pushwish = "";
    if (time2 < "05:00:00") pushwish = "Good Morning 🌄";
    else if (time2 < "11:00:00") pushwish = "Good Morning 🌄";
    else if (time2 < "15:00:00") pushwish = "Good Afternoon 🌅";
    else if (time2 < "19:00:00") pushwish = "Good Evening 🌃";
    else pushwish = "Good Night 🌌";

    // Define different font styles
    const fontStyles = [
      {
        name: "Bold",
        transform: (text) => `*${text}*`
      },
      {
        name: "Italic",
        transform: (text) => `_${text}_`
      },
      {
        name: "Monospace",
        transform: (text) => '```' + text + '```'
      },
      {
        name: "Strikethrough",
        transform: (text) => `~${text}~`
      },
      {
        name: "Small Caps",
        transform: (text) => text.toUpperCase()
      },
      {
        name: "Fancy",
        transform: (text) => {
          const fancyMap = {
            a: '𝒶', b: '𝒷', c: '𝒸', d: '𝒹', e: '𝑒', f: '𝒻', g: '𝑔', h: '𝒽', i: '𝒾', j: '𝒿',
            k: '𝓀', l: '𝓁', m: '𝓂', n: '𝓃', o: '𝑜', p: '𝓅', q: '𝓆', r: '𝓇', s: '𝓈', t: '𝓉',
            u: '𝓊', v: '𝓋', w: '𝓌', x: '𝓍', y: '𝓎', z: '𝓏',
            A: '𝒜', B: '𝐵', C: '𝒞', D: '𝒟', E: '𝐸', F: '𝐹', G: '𝒢', H: '𝐻', I: '𝐼', J: '𝒥',
            K: '𝒦', L: '𝐿', M: '𝑀', N: '𝒩', O: '𝒪', P: '𝒫', Q: '𝒬', R: '𝑅', S: '𝒮', T: '𝒯',
            U: '𝒰', V: '𝒱', W: '𝒲', X: '𝒳', Y: '𝒴', Z: '𝒵'
          };
          return text.split('').map(char => fancyMap[char] || char).join('');
        }
      },
      {
        name: "Double Struck",
        transform: (text) => {
          const doubleStruckMap = {
            a: '𝕒', b: '𝕓', c: '𝕔', d: '𝕕', e: '𝕖', f: '𝕗', g: '𝕘', h: '𝕙', i: '𝕚', j: '𝕛',
            k: '𝕜', l: '𝕝', m: '𝕞', n: '𝕟', o: '𝕠', p: '𝕡', q: '𝕢', r: '𝕣', s: '𝕤', t: '𝕥',
            u: '𝕦', v: '𝕧', w: '𝕨', x: '𝕩', y: '𝕪', z: '𝕫',
            A: '𝔸', B: '𝔹', C: 'ℂ', D: '𝔻', E: '𝔼', F: '𝔽', G: '𝔾', H: 'ℍ', I: '𝕀', J: '𝕁',
            K: '𝕂', L: '𝕃', M: '𝕄', N: 'ℕ', O: '𝕆', P: 'ℙ', Q: 'ℚ', R: 'ℝ', S: '𝕊', T: '𝕋',
            U: '𝕌', V: '𝕍', W: '𝕎', X: '𝕏', Y: '𝕐', Z: 'ℤ'
          };
          return text.split('').map(char => doubleStruckMap[char] || char).join('');
        }
      }
    ];

    // Language translations
    const languageTranslations = [
      {
        name: "English",
        translations: {
          hello: "Hello",
          uptime: "Uptime",
          mode: "Mode",
          prefix: "Prefix",
          ownerCommands: "Owner Commands",
          searchTools: "Search Tools",
          aiCommands: "AI Commands",
          religious: "Religious",
          christian: "Christian",
          islamic: "Islamic",
          conversionTools: "Conversion Tools",
          mediaDownloaders: "Media Downloaders",
          logoMaker: "Logo Maker",
          groupManagement: "Group Management",
          audioFilters: "Audio Filters",
          stickerCommands: "Sticker Commands",
          otherCommands: "Other Commands",
          stalkerTools: "Stalker Tools",
          configuration: "Configuration",
          helpPrompt: `Type ${prefix}help <command> for info`
        }
      },
      {
        name: "Spanish",
        translations: {
          hello: "Hola",
          uptime: "Tiempo activo",
          mode: "Modo",
          prefix: "Prefijo",
          ownerCommands: "Comandos de dueño",
          searchTools: "Herramientas de búsqueda",
          aiCommands: "Comandos de IA",
          religious: "Religioso",
          christian: "Cristiano",
          islamic: "Islámico",
          conversionTools: "Herramientas de conversión",
          mediaDownloaders: "Descargadores de medios",
          logoMaker: "Creador de logos",
          groupManagement: "Gestión de grupo",
          audioFilters: "Filtros de audio",
          stickerCommands: "Comandos de stickers",
          otherCommands: "Otros comandos",
          stalkerTools: "Herramientas de stalkeo",
          configuration: "Configuración",
          helpPrompt: `Escribe ${prefix}help <comando> para información`
        }
      },
      {
        name: "French",
        translations: {
          hello: "Bonjour",
          uptime: "Temps de fonctionnement",
          mode: "Mode",
          prefix: "Préfixe",
          ownerCommands: "Commandes du propriétaire",
          searchTools: "Outils de recherche",
          aiCommands: "Commandes IA",
          religious: "Religieux",
          christian: "Chrétien",
          islamic: "Islamique",
          conversionTools: "Outils de conversion",
          mediaDownloaders: "Téléchargeurs de médias",
          logoMaker: "Créateur de logo",
          groupManagement: "Gestion de groupe",
          audioFilters: "Filtres audio",
          stickerCommands: "Commandes d'autocollants",
          otherCommands: "Autres commandes",
          stalkerTools: "Outils de traçage",
          configuration: "Configuration",
          helpPrompt: `Tapez ${prefix}help <commande> pour info`
        }
      },
      {
        name: "Arabic",
        translations: {
          hello: "مرحباً",
          uptime: "مدة التشغيل",
          mode: "الوضع",
          prefix: "البادئة",
          ownerCommands: "أوامر المالك",
          searchTools: "أدوات البحث",
          aiCommands: "أوامر الذكاء الاصطناعي",
          religious: "ديني",
          christian: "مسيحي",
          islamic: "إسلامي",
          conversionTools: "أدوات التحويل",
          mediaDownloaders: "برامج تنزيل الوسائط",
          logoMaker: "صانع الشعارات",
          groupManagement: "إدارة المجموعة",
          audioFilters: "مرشحات الصوت",
          stickerCommands: "أوامر الملصقات",
          otherCommands: "أوامر أخرى",
          stalkerTools: "أدوات التتبع",
          configuration: "التكوين",
          helpPrompt: `اكتب ${prefix}help <أمر> للمعلومات`
        }
      },
      {
        name: "German",
        translations: {
          hello: "Hallo",
          uptime: "Betriebszeit",
          mode: "Modus",
          prefix: "Präfix",
          ownerCommands: "Eigentümer-Befehle",
          searchTools: "Such-Tools",
          aiCommands: "KI-Befehle",
          religious: "Religiös",
          christian: "Christlich",
          islamic: "Islamisch",
          conversionTools: "Konvertierungstools",
          mediaDownloaders: "Media-Downloader",
          logoMaker: "Logo-Maker",
          groupManagement: "Gruppenverwaltung",
          audioFilters: "Audiofilter",
          stickerCommands: "Sticker-Befehle",
          otherCommands: "Andere Befehle",
          stalkerTools: "Stalker-Tools",
          configuration: "Konfiguration",
          helpPrompt: `Tippe ${prefix}help <Befehl> für Infos`
        }
      },
      {
        name: "Japanese",
        translations: {
          hello: "こんにちは",
          uptime: "稼働時間",
          mode: "モード",
          prefix: "プレフィックス",
          ownerCommands: "所有者コマンド",
          searchTools: "検索ツール",
          aiCommands: "AIコマンド",
          religious: "宗教的",
          christian: "キリスト教",
          islamic: "イスラム教",
          conversionTools: "変換ツール",
          mediaDownloaders: "メディアダウンローダー",
          logoMaker: "ロゴメーカー",
          groupManagement: "グループ管理",
          audioFilters: "オーディオフィルター",
          stickerCommands: "ステッカーコマンド",
          otherCommands: "その他のコマンド",
          stalkerTools: "ストーカーツール",
          configuration: "設定",
          helpPrompt: `${prefix}help <コマンド> で情報を表示`
        }
      },
      {
        name: "Russian",
        translations: {
          hello: "Привет",
          uptime: "Время работы",
          mode: "Режим",
          prefix: "Префикс",
          ownerCommands: "Команды владельца",
          searchTools: "Инструменты поиска",
          aiCommands: "AI команды",
          religious: "Религиозный",
          christian: "Христианский",
          islamic: "Исламский",
          conversionTools: "Инструменты конвертации",
          mediaDownloaders: "Загрузчики медиа",
          logoMaker: "Создатель лого",
          groupManagement: "Управление группой",
          audioFilters: "Аудио фильтры",
          stickerCommands: "Команды стикеров",
          otherCommands: "Другие команды",
          stalkerTools: "Инструменты слежения",
          configuration: "Конфигурация",
          helpPrompt: `Введите ${prefix}help <команда> для информации`
        }
      },
      {
        name: "Chinese",
        translations: {
          hello: "你好",
          uptime: "运行时间",
          mode: "模式",
          prefix: "前缀",
          ownerCommands: "所有者命令",
          searchTools: "搜索工具",
          aiCommands: "AI命令",
          religious: "宗教",
          christian: "基督教",
          islamic: "伊斯兰教",
          conversionTools: "转换工具",
          mediaDownloaders: "媒体下载器",
          logoMaker: "标志制作器",
          groupManagement: "群组管理",
          audioFilters: "音频过滤器",
          stickerCommands: "贴纸命令",
          otherCommands: "其他命令",
          stalkerTools: "追踪工具",
          configuration: "配置",
          helpPrompt: `输入${prefix}help <命令> 获取信息`
        }
      }
    ];

    // Select random font and language
    const randomFont = fontStyles[Math.floor(Math.random() * fontStyles.length)];
    const randomLang = languageTranslations[Math.floor(Math.random() * languageTranslations.length)];

    // Apply the font transformation to menu sections
    const transformMenuSection = (section) => {
      const lines = section.split('\n');
      return lines.map(line => {
        // Don't transform the box characters
        if (line.match(/^[╭╰╯╮│─「」•<>]+$/)) return line;
        return randomFont.transform(line);
      }).join('\n');
    };

    const menuSections = [
      `╭──────────────────────╮
│  ${randomLang.translations.hello} ${pushName}!
│  
│  ⏳ ${randomLang.translations.uptime}: ${days}d ${hours}h ${minutes}m ${seconds}s
│  ⚙ ${randomLang.translations.mode}: ${mode}
│  🔠 ${randomLang.translations.prefix}: ${prefix}
╰──────────────────────╯`,

      `╭───「 ${randomLang.translations.ownerCommands} 」───╮
│ • block
│ • antiword
│ • antitext
│ • unblock
│ • join
│ • leave
│ • setvar
│ • restart
│ • pp
│ • ownerreact
│ • heartreact
│ • broadcast
│ • vv
│ • vv2
│ • del
│ • save
│ • report
│ • jid
╰──────────────────────╯`,

      `╭───「 ${randomLang.translations.searchTools} 」───╮
│ • yts
│ • google
│ • imd
│ • img
│ • weather
│ • playstore
│ • news
╰──────────────────────╯`,

      `╭───「 ${randomLang.translations.aiCommands} 」───╮
│ • blackboxai
│ • gpt
│ • visit
│ • define
╰──────────────────────╯`,

      `╭───「 ${randomLang.translations.religious} 」───╮
│ ${randomLang.translations.christian}:
│ • bible
│ • biblelist
 ───「 ${randomLang.translations.islamic} 」───╮
│ • surahaudio
│ • surahurdu
│ • asmaulhusna
│ • prophetname
╰──────────────────────╯`,

      `╭───「 ${randomLang.translations.conversionTools} 」───╮
│ • attp
│ • url
│ • attp3
│ • ebinary
│ • dbinary
│ • emojimix
│ • mp3
╰──────────────────────╯`,

      `╭───「 ${randomLang.translations.mediaDownloaders} 」───╮
│ • fb
│ • insta
│ • video
│ • gdrive
│ • twitter
│ • tiktok
│ • mediafire
│ • song
│ • video
│ • apk
│ • ttaudio
╰──────────────────────╯`,

      `╭───「 ${randomLang.translations.logoMaker} 」───╮
│ • logo
│ • hacker
│ • blackpink
│ • gossysilver
│ • naruto
│ • digitalglitch
│ • pixelglitch
│ • star
│ • smoke
│ • bear
│ • neondevil
│ • screen
│ • nature
│ • dragonball
│ • foggyglass
│ • neonlight
│ • castlepop
│ • frozenchristmas
│ • foilballoon
│ • colorfulpaint
│ • americanflag
│ • water
│ • neondevil
│ • underwater
│ • dragonfire
│ • bokeh
│ • snow
│ • sand3d
│ • pubg
│ • horror
│ • blood
│ • bulb
│ • graffiti
│ • thunder
│ • thunder1
│ • womensday
│ • valentine
│ • graffiti2
│ • queencard
│ • galaxy
│ • pentakill
│ • birthdayflower
│ • zodiacs
│ • water3d
│ • textlight
│ • wall
│ • gold
│ • glow
│ • team
│ • rotation
│ • paint
│ • avatar
│ • typography
│ • tattoo
│ • luxury
│ • logo
╰──────────────────────╯`,

      `╭───「 ${randomLang.translations.groupManagement} 」───╮
│ • del
│ • add
│ • kick
│ • welcome on
│ • welcome off
│ • promote
│ • demote
│ • tagall
│ • left
│ • hidetag
│ • invite
│ • mute
│ • nolinks
│ • unmute
│ • groupopen
│ • groupclose
│ • groupinfo
│ • poll
╰──────────────────────╯`,

      `╭───「 ${randomLang.translations.audioFilters} 」───╮
│ • deep
│ • bass
│ • robot
│ • reverse
│ • slow
│ • smooth
│ • nightcore
╰──────────────────────╯`,

      `╭───「 ${randomLang.translations.stickerCommands} 」───╮
│ • dance
│ • poke
│ • wink
│ • happ
│ • kick
│ • kill
│ • slap
│ • bite
│ • nom
│ • highfive
│ • wave
│ • smile
│ • blush
│ • yeet
│ • bonk
│ • smug
│ • pat
│ • lick
│ • kiss
│ • awoo
│ • hug
│ • cry
│ • cuddle
│ • bully
╰──────────────────────╯`,

      `╭───「 ${randomLang.translations.otherCommands} 」───╮
│ • fancy
│ • ebinary
│ • truth
│ • dare
│ • quiz
│ • quizgc
│ • insult
│ • dbinary
│ • get
│ • fetch
│ • updatenow
│ • mp3
│ • tts
│ • shorten
│ • tempmail
│ • checkmail
│ • about
│ • profile
│ • elements
│ • pp
╰──────────────────────╯`,

      `╭───「 ${randomLang.translations.stalkerTools} 」───╮
│ • gitstalk
│ • tikstalk
│ • npmstalk
│ • popinfo
│ • lookup
│ • wachannel
╰──────────────────────╯`,

      `╭───「 ${randomLang.translations.configuration} 」───╮
│ • mode <private/public>
│ • setprefix <symbol>
│ • autosview <yes/no>
│ • autoreact <yes/no>
│ • alwaysonline <yes/no>
│ • autoblock <yes/no>
│ • anticall <yes/no>
│ • autorecording <yes/no>
│ • autotyping <yes/no>
╰──────────────────────╯
> ${randomLang.translations.helpPrompt}`
    ];

    // Transform each section with the random font
    const transformedMenu = menuSections.map(section => transformMenuSection(section)).join('\n\n');

    await m.React('🔮');

    // Prepare audio message
    const audioMessage = {
        audio: { 
            url: 'https://files.catbox.moe/8k2q7p.mp3' 
        },
        mimetype: 'audio/mpeg',
        ptt: false,
        contextInfo: {
            isForwarded: true,
            forwardingScore: 999,
            externalAdReply: {
                title: "🎵 Menu Theme Music",
                body: "Tap for free hacks.",
                thumbnailUrl: 'https://files.catbox.moe/ptr27z.jpg',
                sourceUrl: 'https://whatsapp.com/channel/0029Vak0genJ93wQXq3q6X3h',
                mediaType: 2,
                renderLargerThumbnail: true
            }
        }
    };

    // Send audio first
    await sock.sendMessage(m.from, audioMessage, { quoted: m });

    // Send menu with multiple forwarding contexts
    const menuMessage = {
        text: transformedMenu,
        contextInfo: {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363313938933929@newsletter',
                newsletterName: "𝕭𝖔𝖙 𝖇𝖞 𝕮𝖆𝖗𝖑",
                serverMessageId: -1,
            },
            forwardingScore: 999,
            externalAdReply: {
                title: "📜 Bot Command Menu",
                body: `Using ${randomFont.name} font | Language: ${randomLang.name}`,
                thumbnailUrl: 'https://files.catbox.moe/ptr27z.jpg',
                sourceUrl: 'https://whatsapp.com/channel/0029Vak0genJ93wQXq3q6X3h',
                mediaType: 1,
                renderLargerThumbnail: true,
                showAdAttribution: true
            },
            // Add multiple forwarding layers
            forwardingScore: 999,
            forwardedNewsletterMessageInfo: [
                {
                    newsletterJid: '120363313938933929@newsletter',
                    newsletterName: "Bot Updates Channel",
                    serverMessageId: -1
                },
                {
                    newsletterJid: '120363313938933929@newsletter',
                    newsletterName: "Command Center",
                    serverMessageId: -1
                }
            ]
        }
    };

    // Send menu message
    await sock.sendMessage(m.from, menuMessage, { quoted: m });
  }
};

export default alive;
