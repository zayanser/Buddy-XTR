import config from '../../config.cjs';
import axios from 'axios';
import fs from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

const gitclone = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "gitclone") {
    try {
      if (!text) {
        await m.React('❌');
        return sock.sendMessage(m.from, { 
          text: '🚀 *GitHub Repository Downloader*\n\n' +
                '❌ *Error:* Missing repository URL\n' +
                '💡 *Usage:* .gitclone https://github.com/user/repo\n' +
                '📌 *Example:* .gitclone https://github.com/carl24tech/Buddy-XTR',
          contextInfo: {
            isForwarded: true,
            forwardingScore: 999
          }
        }, { quoted: m });
      }

      await m.React('⏳');
      
      // Extract owner and repo from URL
      const url = text.replace(/\.git$/, '');
      const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/i);
      
      if (!match) {
        await m.React('❌');
        return sock.sendMessage(m.from, { 
          text: '🚀 *GitHub Repository Downloader*\n\n' +
                '❌ *Error:* Invalid GitHub URL format\n' +
                '🔗 *Expected Format:* https://github.com/username/repository\n' +
                '📌 *Example:* https://github.com/carl24tech/Buddy-XTR',
          contextInfo: {
            isForwarded: true,
            forwardingScore: 999
          }
        }, { quoted: m });
      }

      const [, owner, repo] = match;
      const downloadUrl = `https://api.github.com/repos/${owner}/${repo}/zipball/main`;
      const fileName = `${repo}.zip`;

      // Create initial progress message
      let progressMessage = await sock.sendMessage(m.from, {
        text: '🚀 *GitHub Repository Downloader*\n\n' +
              '🔍 *Initializing download...*\n\n' +
              '▰▱▱▱▱▱▱▱▱ 10%\n' +
              '📌 *Status:* Connecting to GitHub...',
        contextInfo: {
          isForwarded: true,
          forwardingScore: 999
        }
      }, { quoted: m });

      // Update progress function
      const updateProgress = async (percentage, status) => {
        const progressBars = Math.round(percentage / 10);
        const progressBar = '▰'.repeat(progressBars) + '▱'.repeat(10 - progressBars);
        
        let statusMessage = '';
        if (percentage < 30) statusMessage = '🌐 *Status:* Connecting to repository...';
        else if (percentage < 50) statusMessage = '⬇️ *Status:* Downloading repository data...';
        else if (percentage < 70) statusMessage = '📦 *Status:* Packaging files...';
        else if (percentage < 90) statusMessage = '🔧 *Status:* Finalizing download...';
        else statusMessage = '✅ *Status:* Almost done...';

        if (status) statusMessage = `📌 *Status:* ${status}`;

        await sock.sendMessage(m.from, {
          text: '🚀 *GitHub Repository Downloader*\n\n' +
                `🔍 *Downloading ${repo}...*\n\n` +
                `${progressBar} ${percentage}%\n` +
                statusMessage,
          edit: progressMessage.key
        }, { quoted: m });
      };

      // Download the repository zip with progress updates
      const response = await axios({
        method: 'get',
        url: downloadUrl,
        responseType: 'stream',
        headers: {
          'User-Agent': 'node.js'
        },
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          updateProgress(percentCompleted);
        }
      });

      const writer = fs.createWriteStream(fileName);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      // Final update with completion message
      await updateProgress(100, 'Download complete! Preparing file...');

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

      // Update the progress message to completion status
      await sock.sendMessage(m.from, {
        text: '🚀 *GitHub Repository Downloader*\n\n' +
              `✅ *Successfully Downloaded ${repo}*\n\n` +
              '▰▰▰▰▰▰▰▰▰▰ 100%\n' +
              `📦 *File:* ${fileName}\n` +
              `🔗 *Source:* ${url}\n` +
              '📤 *Status:* File sent successfully!',
        edit: progressMessage.key
      }, { quoted: m });

      // Clean up
      fs.unlinkSync(fileName);
      await m.React('✅');

    } catch (error) {
      console.error(error);
      await m.React('❌');
      let errorMessage = '🚀 *GitHub Repository Downloader*\n\n' +
                         '❌ *Error:* Failed to download repository';
      
      if (error.response && error.response.status === 404) {
        errorMessage = '🚀 *GitHub Repository Downloader*\n\n' +
                       '❌ *Error:* Repository not found\n' +
                       '🔍 *Possible Reasons:*\n' +
                       '- Repository is private\n' +
                       '- Repository was deleted\n' +
                       '- URL is incorrect';
      }

      sock.sendMessage(m.from, { 
        text: errorMessage,
        contextInfo: {
          isForwarded: true,
          forwardingScore: 999
        }
      }, { quoted: m });
    }
  }
}

export default gitclone;
