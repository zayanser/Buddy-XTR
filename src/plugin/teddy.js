import config from '../../config.cjs';

const teddy = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "teddy") {
    await m.React('🧸');
    
    // Random emojis for the teddy to hold
    const emojis = ['❤️', '🌟', '🎈', '🍯', '🎁', '🌸', '🦋', '🍭', '⚽', '🎀'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    // Animation frames
    const frames = [
      `(っ◔◡◔)っ${randomEmoji}\n ／|＼＼\n(ᴗ˳ᴗ)`,
      `(っ◔◡◔)っ${randomEmoji}\n ／|＼\n(ᴗ˳ᴗ)`,
      `(っ◕‿◕)っ${randomEmoji}\n ／|＼\n(ᵔᴥᵔ)`,
      `(っ◕‿◕)っ${randomEmoji}\n ／|＼\n(◠‿◠)`
    ];
    
    // Send animation
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        sock.sendMessage(m.from, { 
          text: `*Teddy Bear For You!* 🧸\n\n${frames[i]}\n\n*Holding:* ${randomEmoji}` 
        }, { quoted: m });
      }, i * 1000);
    }
  }
}

export default teddy;
