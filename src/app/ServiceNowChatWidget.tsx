import Script from 'next/script';

declare global {
  interface Window {
    ServiceNowChat: any;
  }
}

export default function ServiceNowChatWidget() {
  const onScriptLoad = () => {
    const waitForServiceNowChat = () => {
      if (window.ServiceNowChat) {
        new window.ServiceNowChat({
          instance: 'https://wendysdev.service-now.com',
          context: { skip_load_history: 1 },
          branding: {
            bgColor: '#333',
            primaryColor: '#000',
            hoverColor: '#EFEFEF',
            activeColor: '#AAA',
            openIcon: 'custom-open.svg',
            closeIcon: 'custom-close.svg',
            sizeMultiplier: 1.6,
          },
          offsetX: 50,
          offsetY: 50,
          position: 'left',
          translations: {
            'Open dialog': 'Open chat',
            'Open Chat. {0} unread message(s)': 'Click to open',
            'Close chat.': 'Click to close',
          },
        });
      } else {
        setTimeout(waitForServiceNowChat, 100);
      }
    };

    waitForServiceNowChat();
  };

  return (
    <>
      <Script
        src="https://wendysdev.service-now.com/scripts/now-requestor-chat-popover-app/now-requestor-chat-popover-app.min.js?sysparm_substitute=false"
        strategy="afterInteractive"
        onLoad={onScriptLoad}
      />
    </>
  );
}
