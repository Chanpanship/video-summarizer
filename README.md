# Video Summarizer

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

## Background and motivation

There is still no reliable, general-purpose browser extension that can summarize videos from Bilibili, online courses, lectures, and other web pages in one workflow. Existing browser assistants, including Chrome's Gemini-related experience, may help with page text but often cannot extract video streams, download audio, and transcribe speech into usable text. As a result, video summarization frequently stops before it can actually begin.

Video Summarizer is built to close this gap: it collects available subtitles, downloads or captures audio when subtitles are unavailable, converts speech into timestamped text, and then generates a structured summary with follow-up Q&A.

## 项目背景与动机

目前还没有一个足够可靠、通用的视频总结浏览器插件，可以把 B 站视频、网课、讲座和其他网页视频放在同一个流程中处理。现有的浏览器助手，包括 Chrome 中与 Gemini 相关的使用方式，通常可以理解网页文字，但在视频流提取、音频下载和语音转文字方面仍有局限。因此很多情况下，视频总结还没有真正开始，就卡在了内容获取这一步。

Video Summarizer 希望补上这一环：优先读取已有字幕；没有字幕时下载或捕获音频并转换为带时间戳的文字；最后生成结构化总结，并支持围绕视频内容继续追问。
