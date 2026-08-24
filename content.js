(() => {
  const text = s => document.querySelector(s)?.textContent?.trim() || '';
  const json = id => { try { return JSON.parse(document.querySelector(`script#${id}`)?.textContent || 'null'); } catch { return null; } };
  const collect = () => {
    const state = json('__INITIAL_STATE__') || {};
    const data = state.videoData || state.videoInfo || {};
    const subtitle = data.subtitle || state.subtitle || {};
    const list = subtitle.list || subtitle.subtitles || [];
    return {
      url: location.href,
      bvid: location.pathname.match(/\/video\/(BV[\w]+)/i)?.[1] || '',
      title: data.title || text('h1.video-title, h1') || document.title,
      description: data.desc || text('.basic-desc-info, .video-desc') || '',
      author: data.owner?.name || text('.up-name, .username'),
      subtitles: list.map(x => ({url: x.subtitle_url || x.subtitleUrl || '', label: x.lan_doc || x.label || ''})),
      pageText: document.body?.innerText?.slice(0, 8000) || ''
      ,audioUrl: performance.getEntriesByType('resource').map(entry => entry.name).find(url => /\.m4s(?:\?|$)/i.test(url) && /audio|30280|30216|30232/i.test(url)) || ''
    };
  };
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_VIDEO_INFO') {
      sendResponse({ok: true, payload: collect()});
    }
    if (message.type === 'CAPTURE_AUDIO') {
      captureAudio(sendResponse);
      return true;
    }
  });
  async function captureAudio(sendResponse) {
    const video = document.querySelector('video');
    if (!video || !video.captureStream) { sendResponse({ok: false, error: '当前浏览器无法捕获视频音频'}); return; }
    const stream = video.captureStream();
    const chunks = [];
    const recorder = new MediaRecorder(stream, {mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 64000});
    const wasPaused = video.paused;
    const oldTime = video.currentTime;
    recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
    recorder.onstop = async () => {
      const blob = new Blob(chunks, {type: 'audio/webm'});
      const buffer = await blob.arrayBuffer();
      let binary = '';
      const bytes = new Uint8Array(buffer);
      for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
      sendResponse({ok: true, audio: btoa(binary), mimeType: 'audio/webm'});
    };
    video.currentTime = 0;
    recorder.start(1000);
    try { await video.play(); } catch {}
    video.addEventListener('ended', () => { if (recorder.state !== 'inactive') recorder.stop(); }, {once: true});
    if (wasPaused) video.addEventListener('pause', () => { if (recorder.state !== 'inactive') recorder.stop(); }, {once: true});
  }
  window.postMessage({type:'BVS_READY'}, '*');
})();
