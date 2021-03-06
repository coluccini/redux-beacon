import { Target } from 'redux-beacon';

declare let gtag: any;

function GoogleAnalyticsGtag(defaultTrackingId: string): Target {
  if (typeof window === 'undefined') {
    return () => {};
  }

  if (typeof (window as any).gtag !== 'function') {
    throw new Error(
      'window.gtag is not a function. Did you forget to include the Google Site Tag snippet?'
    );
  }

  gtag('config', defaultTrackingId, { send_page_view: false });

  return function target(events) {
    const pageTracking = events.filter(event => event.type === 'page');
    const eventTracking = events.filter(event => event.type === 'event');

    pageTracking.forEach(event => {
      const { type, trackingId, ...params } = event;

      let trackingIds = [defaultTrackingId];

      if (typeof trackingId === 'string') {
        trackingIds = [trackingId];
      }

      if (Array.isArray(trackingId) && trackingId.length > 0) {
        trackingIds = trackingId;
      }

      trackingIds.forEach(id => {
        gtag('config', id, params);
      });
    });

    eventTracking.forEach(event => {
      const { type, action, ...params } = event;

      gtag('event', action, params);
    });
  };
}

export default GoogleAnalyticsGtag;
