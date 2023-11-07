import { OPENAI_API_KEY, OPENAI_TTS_URL } from '@/const/api';

import { type SsmlOptions } from '../utils/genSSML';

export type OpenaiVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

export interface OpenaiTtsOptions extends SsmlOptions {
  api: {
    key: string;
    proxy: string;
  };
  model?: 'tts-1' | 'tts-1-hd';
  name: OpenaiVoice;
}

// 纯文本生成语音
export const fetchOpenaiTTS = async (
  text: string,
  { api, model = 'tts-1', ...options }: OpenaiTtsOptions,
): Promise<AudioBufferSourceNode> => {
  const key = api.key || OPENAI_API_KEY;
  const url = OPENAI_TTS_URL(api.proxy);

  const headers = new Headers({
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json',
  });

  const body = JSON.stringify({
    input: text,
    model,
    voice: options.name,
  });

  const response: Response = await fetch(url, { body, headers, method: 'POST' });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const audioData = await response.arrayBuffer();
  const audioContext = new AudioContext();
  const audioBufferSource = audioContext.createBufferSource();
  audioBufferSource.buffer = await audioContext.decodeAudioData(audioData);
  audioBufferSource.connect(audioContext.destination);
  return audioBufferSource;
};
