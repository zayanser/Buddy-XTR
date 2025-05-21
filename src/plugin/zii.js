import config from '../../config.cjs';
import axios from 'axios';
import fs from 'fs';

const zip = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  
  if (cmd === "zip") {
    try {
      const repoUrl = "https://github.com/carl24tech/Buddy-XTR";
      const [, owner, repo] = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/i);
      const fileName = `${repo}.zip`;
      
      // Send initial notification message
      const notificationMsg = await sock.sendMessage(m.from, {
        text: '📦 *Repository Zip Downloader*\n\n' +
              `🔗 *Repository:* ${repoUrl}\n` +
              '⏳ *Download will start automatically in 10 seconds...*\n\n' +
              '🛑 Reply with *"cancel"* to abort\n' +
              '✅ Reply with *"confirm"* to start now\n\n' +
              '▰▱▱▱▱▱▱▱▱ 10 seconds remaining',
        contextInfo: {
          isForwarded: true,
          forwardingScore: 999
        }
      }, { quoted: m });

      let countdown = 10;
      let cancelled = false;
      let confirmed = false;

      // Countdown function
      const updateCountdown = async () => {
        while (countdown > 0 && !cancelled && !confirmed) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          countdown--;
          
          const progressBars = Math.round(countdown);
          const progressBar = '▰'.repeat(progressBars) + '▱'.repeat(10 - progressBars);
          
          await sock.sendMessage(m.from, {
            text: '📦 *Repository Zip Downloader*\n\n' +
                  `🔗 *Repository:* ${repoUrl}\n` +
                  `⏳ *Download will start automatically in ${countdown} seconds...*\n\n` +
                  '🛑 Reply with *"cancel"* to abort\n' +
                  '✅ Reply with *"confirm"* to start now\n\n' +
                  `${progressBar} ${countdown} seconds remaining`,
            edit: notificationMsg.key
          }, { quoted: m });
        }
      };

      // Start countdown
      updateCountdown();

      // Message collector for user response
      const collector = (response) => {
        if (response.from === m.from && response.key?.fromMe === false) {
          const userResponse = response.body.toLowerCase().trim();
          
          if (userResponse === 'cancel') {
            cancelled = true;
            sock.sendMessage(m.from, {
              text: '📦 *Repository Zip Downloader*\n\n' +
                    '❌ *Download cancelled by user*\n' +
                    `🔗 Repository: ${repoUrl}`,
              edit: notificationMsg.key
            }, { quoted: m });
            return true;
          } else if (userResponse === 'confirm') {
            confirmed = true;
            sock.sendMessage(m.from, {
              text: '📦 *Repository Zip Downloader*\n\n' +
                    '✅ *Starting download now...*\n' +
                    `🔗 Repository: ${repoUrl}`,
              edit: notificationMsg.key
            }, { quoted: m });
            startDownload();
            return true;
          }
        }
        return false;
      };

      // Set up listener for user response
      sock.ev.on('messages.upsert', ({ messages }) => {
        if (messages[0] && collector(messages[0])) {
          sock.ev.off('messages.upsert', collector);
        }
      });

      // Start download after countdown if not cancelled/confirmed
      setTimeout(async () => {
        if (!cancelled && !confirmed) {
          await sock.sendMessage(m.from, {
            text: '📦 *Repository Zip Downloader*\n\n' +
                  '⏳ *Starting automatic download...*\n' +
                  `🔗 Repository: ${repoUrl}`,
            edit: notificationMsg.key
          }, { quoted: m });
          startDownload();
        }
      }, 10000);

      // Download function
      const startDownload = async () => {
        try {
          // Remove the message listener
          sock.ev.off('messages.upsert', collector);
          
          // Update status to downloading
          await sock.sendMessage(m.from, {
            text: '📦 *Repository Zip Downloader*\n\n' +
                  '⬇️ *Downloading repository...*\n' +
                  `🔗 ${repoUrl}\n\n` +
                  '▰▱▱▱▱▱▱▱▱ 0%',
            edit: notificationMsg.key
          }, { quoted: m });

          const downloadUrl = `https://api.github.com/repos/${owner}/${repo}/zipball/main`;
          
          // Download with progress tracking
          const response = await axios({
            method: 'get',
            url: downloadUrl,
            responseType: 'stream',
            headers: {
              'User-Agent': 'node.js'
            },
            onDownloadProgress: async (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              const progressBars = Math.round(percentCompleted / 10);
              const progressBar = '▰'.repeat(progressBars) + '▱'.repeat(10 - progressBars);
              
              await sock.sendMessage(m.from, {
                text: '📦 *Repository Zip Downloader*\n\n' +
                      `⬇️ *Downloading ${repo}...*\n` +
                      `🔗 ${repoUrl}\n\n` +
                      `${progressBar} ${percentCompleted}%`,
                edit: notificationMsg.key
              }, { quoted: m });
            }
          });

          const writer = fs.createWriteStream(fileName);
          response.data.pipe(writer);

          await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
          });

          // Send the zip file
          await sock.sendMessage(m.from, {
            document: fs.readFileSync(fileName),
            mimetype: 'application/zip',
            fileName: fileName,
            contextInfo: {
              isForwarded: true,
              forwardingScore: 999
            }
          }, { quoted: m });

          // Update status to complete
          await sock.sendMessage(m.from, {
            text: '📦 *Repository Zip Downloader*\n\n' +
                  `✅ *Successfully Downloaded ${repo}*\n\n` +
                  '▰▰▰▰▰▰▰▰▰▰ 100%\n' +
                  `📦 *File:* ${fileName}\n` +
                  `🔗 *Source:* ${repoUrl}`,
            edit: notificationMsg.key
          }, { quoted: m });

          // Clean up
          fs.unlinkSync(fileName);

        } catch (error) {
          console.error(error);
          await sock.sendMessage(m.from, {
            text: '📦 *Repository Zip Downloader*\n\n' +
                  '❌ *Download Failed*\n\n' +
                  `🔗 ${repoUrl}\n\n` +
                  '⚠️ Error: ' + (error.response?.status === 404 ? 'Repository not found' : 'Download failed'),
            edit: notificationMsg.key
          }, { quoted: m });
        }
      };

    } catch (error) {
      console.error(error);
      await sock.sendMessage(m.from, {
        text: '📦 *Repository Zip Downloader*\n\n' +
              '❌ *Error Occurred*\n\n' +
              '⚠️ ' + error.message,
        contextInfo: {
          isForwarded: true,
          forwardingScore: 999
        }
      }, { quoted: m });
    }
  }
}

export default zip;
