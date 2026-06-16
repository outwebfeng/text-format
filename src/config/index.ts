const metaEnv: Record<string, string | undefined> =
  (import.meta as any).env ?? {};
const procEnv: Record<string, string | undefined> =
  typeof process !== 'undefined' && process.env ? process.env : {};

const publicEnv = (key: string) => metaEnv[key] ?? procEnv[key];

export const envConfigs: Record<string, string> = {
  app_url: publicEnv('VITE_APP_URL') ?? 'https://text-format.com',
  app_name: publicEnv('VITE_APP_NAME') ?? 'Text-Format',
  app_description:
    publicEnv('VITE_APP_DESCRIPTION') ??
    'Text-format is text format cleaner online tool,text cleaner,format text online,text format remover,strip HTML,remove characters,replace online.',
  app_logo: publicEnv('VITE_APP_LOGO') ?? '/webui.svg',
  locale: publicEnv('VITE_DEFAULT_LOCALE') ?? 'en',
  google_analytics_id: publicEnv('VITE_GOOGLE_ANALYTICS_ID') ?? '',
  google_adsense_client_id:
    publicEnv('VITE_GOOGLE_ADSENSE_CLIENT_ID') ?? 'ca-pub-7741547389250990',
};
