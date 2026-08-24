const $ = s => document.querySelector(s);
let info = null;
let transcript = '';

chrome.tabs.query({active: true, currentWindow: true}, tabs => {
  const tab = tabs[0];
  if (!tab?.url?.includes('bilibili.com/video/')) {
    $('#video').textContent = '请先打开一个 B 站视频页面';
    return;
  }
  chrome.tabs.sendMessage(tab.id, {type: 'GET_VIDEO_INFO'}, response => {
    if (chrome.runtime.lastError || !response?.ok) {
      $('#video').textContent = '请刷新 B 站视频页面后重试';
      return;
    }
    info = response.payload;
    $('#video').innerHTML = `<strong>${info.title || '未识别标题'}</strong><br><span>${info.author ? 'UP主：' + info.author + ' · ' : ''}${info.subtitles?.length ? '已发现字幕' : '暂未发现字幕'}</span>`;
    $('#summarize').disabled = false;
  });
});

$('#summarize').onclick = async () => {
  $('#summarize').disabled = true;
  $('#status').textContent = '正在整理内容…';
  try {
    if (info.subtitles?.[0]?.url) {
      const r = await chrome.runtime.sendMessage({type: 'FETCH_SUBTITLE', url: info.subtitles[0].url});
      transcript = r.text || '';
    }
    if (!transcript.trim()) {
      const tabs = await chrome.tabs.query({active: true, currentWindow: true});
      $('#status').textContent = '未发现字幕，正在尝试下载音频…';
      let captured = info.audioUrl ? await chrome.runtime.sendMessage({type: 'DOWNLOAD_AUDIO', url: info.audioUrl}) : {ok: false};
      if (!captured?.ok) {
        $('#status').textContent = '下载音频失败，改用播放捕获…';
        captured = await chrome.tabs.sendMessage(tabs[0].id, {type: 'CAPTURE_AUDIO'});
      }
      if (!captured?.ok) throw Error(captured?.error || '无法捕获视频音频');
      $('#status').textContent = '音频已捕获，正在识别…';
      const recognized = await chrome.runtime.sendMessage({type: 'TRANSCRIBE_AUDIO', audio: captured.audio, mimeType: captured.mimeType});
      if (!recognized?.ok || !recognized.text?.trim()) throw Error(recognized?.error || '没有识别出语音');
      transcript = recognized.segments?.length
        ? recognized.segments.map(segment => `[${String(Math.floor((segment.start || 0) / 60)).padStart(2, '0')}:${String(Math.floor((segment.start || 0) % 60)).padStart(2, '0')}] ${segment.text}`).join(' ')
        : recognized.text;
    }
    const data = await chrome.runtime.sendMessage({type: 'SUMMARIZE_VIDEO', title: info.title, content: transcript});
    if (!data?.ok) throw Error(data?.error || '总结服务暂时不可用');
    $('#summary').textContent = (data.summary || '没有返回总结').replace(/\s*\[未提供时间戳\]/g, '').replace(/\s*未提供时间戳/g, '');
    $('#transcript').textContent = transcript || '没有获取到原始字幕';
    $('#result').hidden = false;
    $('#status').textContent = '总结完成';
  } catch (error) {
    $('#status').textContent = '总结失败：' + error.message;
  } finally {
    $('#summarize').disabled = false;
  }
};

document.querySelectorAll('[data-tab]').forEach(button => button.onclick = () => {
  document.querySelectorAll('[data-tab]').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  $('#summary').hidden = button.dataset.tab !== 'summary';
  $('#transcript').hidden = button.dataset.tab !== 'transcript';
});

$('#settings').onclick = () => chrome.runtime.openOptionsPage();
