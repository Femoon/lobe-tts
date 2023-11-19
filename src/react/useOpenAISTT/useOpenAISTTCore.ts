import useSWR, { type SWRConfiguration } from 'swr';

import { type OpenAISTTAPI, type OpenAISTTPayload, OpenaiSTT } from '@/core/OpenAISTT';

export interface OpenAISTTCoreOptions extends OpenAISTTPayload, SWRConfiguration {
  api?: OpenAISTTAPI;
  headers?: Headers;
  shouldFetch?: boolean;
}
export const useOpenAISTTCore = (init: OpenAISTTCoreOptions) => {
  const key = new Date().getDate().toString();
  const { shouldFetch, api, options, speech, headers, ...swrConfig } = init;

  return useSWR(
    shouldFetch && speech ? key : null,
    async () => {
      const instance = new OpenaiSTT(api);
      return instance.create({ options, speech }, headers);
    },
    swrConfig,
  );
};
