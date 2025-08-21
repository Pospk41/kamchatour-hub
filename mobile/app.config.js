// Dynamic Expo config to inject EAS projectId from CI secrets
module.exports = ({ config }) => {
  const projectId = process.env.EAS_PROJECT_ID || (config.extra && config.extra.eas && config.extra.eas.projectId);
  const updatesUrl = projectId ? `https://u.expo.dev/${projectId}` : (config.updates && config.updates.url);
  return {
    ...config,
    updates: {
      ...config.updates,
      url: updatesUrl,
      checkAutomatically: (config.updates && config.updates.checkAutomatically) || 'ON_LOAD',
      fallbackToCacheTimeout: (config.updates && config.updates.fallbackToCacheTimeout) || 0,
    },
    extra: {
      ...config.extra,
      eas: {
        projectId,
      },
    },
  };
};

