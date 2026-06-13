import type { EventSchema } from '../types.js';

export function buildEventSchema(data: EventSchema): Record<string, any> {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: data.name,
    startDate: data.startDate,
    location: {
      '@type': 'Place',
      name: data.location.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: data.location.address
      }
    },
    organizer: {
      '@type': 'Organization',
      name: data.organizer.name,
      ...(data.organizer.url ? { url: data.organizer.url } : {})
    }
  };

  if (data.endDate) schema.endDate = data.endDate;
  if (data.description) schema.description = data.description;
  if (data.image) schema.image = data.image;

  if (data.offers) {
    const offerObj: Record<string, any> = {
      '@type': 'Offer',
      price: data.offers.price,
      priceCurrency: data.offers.currency
    };
    if (data.offers.availability) {
      offerObj.availability = data.offers.availability.startsWith('http') 
        ? data.offers.availability 
        : `https://schema.org/${data.offers.availability}`;
    }
    schema.offers = offerObj;
  }

  if (data.eventStatus) {
    schema.eventStatus = `https://schema.org/${data.eventStatus}`;
  }

  if (data.eventAttendanceMode) {
    schema.eventAttendanceMode = `https://schema.org/${data.eventAttendanceMode}`;
  }

  return schema;
}
