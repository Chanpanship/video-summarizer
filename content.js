(() => {
  const text = selector => document.querySelector(selector)?.textContent?.trim() || '';
  const json = id => { try { return JSON.parse(document.querySelector(`script#${id}`)?.textContent || 'null'); } catch { return null; } };
  function collect() {
    const state = json('__INITIAL_STATE__') || {};
    const data = state.videoData || state.videoInfo || {};
    const subtitle = data.subtitle || state.subtitle || {};
    const list = subtitle.list || subtitle.subtitles || [];
    const video = document.querySelector('video');
    return {
      url: location.href,
      title: data.title || text('h1.video-title, h1, title') || document.title,
      site: location.hostname,
      duration: video?.duration || 0,
      subtitles: list.map(item => ({url: item.subtitle_url || item.subtitleUrl || '', label: item.lan_doc || item.label || ''})),
      audioUrl: performance.getEntriesByType('resource').map(entry => entry.name).find(url => /\.m4s(?:\?|$)/i.test(url) && /audio|30280|30216|30232/i.test(url)) || ''
    };
  }
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_VIDEO_INFO') sendResponse({ok: true, payload: collect()});
    if (message.type === 'CAPTURE_AUDIO') { captureAudio(sendResponse); return true; }
  });
  async function captureAudio(sendResponse) {
    const video = document.querySelector('video');
    if (!video?.captureStream) { sendResponse({ok: false, error: '当前页面没有可捕获的视频播放器'}); return; }
    const recorder = new MediaRecorder(video.captureStream(), {mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 64000});
    const chunks = [];
    recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
    recorder.onstop = async () => { const buffer = await new Blob(chunks, {type:'audio/webm'}).arrayBuffer(); let binary=''; const bytes=new Uint8Array(buffer); for(let i=0;i<bytes.length;i+=8192) binary+=String.fromCharCode(...bytes.subarray(i,i+8192)); sendResponse({ok:true,audio:btoa(binary),mimeType:'audio/webm'}); };
    video.currentTime = 0; recorder.start(1000); try { await video.play(); } catch {}
    video.addEventListener('ended', () => recorder.state !== 'inactive' && recorder.stop(), {once:true});
  }
})();
