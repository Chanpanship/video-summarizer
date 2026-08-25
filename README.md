# 通用视频总结助手 | Universal Video Summarizer

Chrome / Edge Manifest V3 browser extension for summarizing Bilibili videos, online courses, lectures, and other web videos.

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

## Why SiliconFlow instead of Gemini?

Gemini is useful as a language model, but the Gemini browser experience cannot currently handle the complete workflow required here: extracting video streams from arbitrary video pages, downloading the audio, and transcribing the audio into timestamped text. This extension therefore uses SiliconFlow for speech recognition and summarization, so the video-to-text workflow can run inside the extension without requiring the user to manually prepare a transcript.

## 为什么使用 SiliconFlow 而不是 Gemini？

Gemini 适合进行文本理解和总结，但目前 Gemini 的浏览器使用方式无法完整完成本项目所需的视频流程，包括从不同网页提取视频流、下载音频，以及将音频转换为带时间戳的文字。因此本插件使用 SiliconFlow 完成语音识别和视频总结，让用户不需要先手动准备字幕文本。
