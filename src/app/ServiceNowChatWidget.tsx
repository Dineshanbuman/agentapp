// components/ServiceNowChatWidget.tsx
"use client";

import { useEffect } from 'react';

const ServiceNowChatWidget = () => {
  useEffect(() => {


    const snInstanceUrl = 'https://wendysdev.service-now.com';


    if (document.getElementById('servicenow-chat-script')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'servicenow-chat-script';
    script.type = 'module';


    script.innerHTML = `
      try {

        const ServiceNowChat = (await import('${snInstanceUrl}/uxasset/externals/now-requestor-chat-popover-app/index.jsdbx?sysparm_substitute=false')).default;

        // Check if the import was successful before initializing
        if (ServiceNowChat) {
          new ServiceNowChat({
            instance: '${snInstanceUrl}/'
          });
          console.log('ServiceNow Virtual Agent initialized.');
        } else {
          console.error('Failed to load ServiceNowChat module.');
        }
      } catch (error) {
        console.error('Error loading or initializing ServiceNow Virtual Agent:', error);
      }
    `;

    document.head.appendChild(script);


    return () => {
      const existingScript = document.getElementById('servicenow-chat-script');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null;
};

export default ServiceNowChatWidget;