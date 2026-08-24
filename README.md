# B站视频总结助手 | Bilibili Video Summarizer

Chrome / Edge Manifest V3 browser extension for summarizing Bilibili videos.

## Features

- Reads original Bilibili subtitles when available.
- If subtitles are unavailable, downloads or captures audio and transcribes it with SiliconFlow SenseVoice.
- Generates a one-sentence summary and key points.
- Preserves timestamps when the source transcript provides them.
- Does not require a local backend server.

## 安装

1. 打开 `chrome://extensions` 或 `edge://extensions`。
2. 开启“开发者模式”。
3. 点击“加载已解压的扩展程序”。
4. 选择本目录。

## Configuration

Open the extension options and enter your own SiliconFlow API key. The default text model is `Qwen/Qwen3.5-4B`, a free model option on SiliconFlow. Speech recognition uses `FunAudioLLM/SenseVoiceSmall`.

## 配置

在扩展设置中填写你自己的 SiliconFlow API Key。默认文本模型为 `Qwen/Qwen3.5-4B`，这是 SiliconFlow 的免费模型选项；语音识别使用 `FunAudioLLM/SenseVoiceSmall`。

API keys are stored in browser extension storage and are not included in the published package. Do not share your API key publicly.
