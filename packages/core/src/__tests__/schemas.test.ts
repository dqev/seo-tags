import { describe, it, expect } from 'vitest';
import { compileTypedSchema } from '../schemas/index.js';

describe('JSON-LD schema compilation', () => {
  it('should compile Person schema correctly', () => {
    const person = compileTypedSchema('Person', {
      name: 'Alice Smith',
      url: 'https://example.com',
      jobTitle: 'Developer'
    });
    expect(person['@type']).toBe('Person');
    expect(person.name).toBe('Alice Smith');
    expect(person.url).toBe('https://example.com');
    expect(person.jobTitle).toBe('Developer');
  });

  it('should compile FAQ schema correctly', () => {
    const faq = compileTypedSchema('FAQ', {
      questions: [
        { q: 'What is this?', a: 'A test.' }
      ]
    });
    expect(faq['@type']).toBe('FAQPage');
    expect(faq.mainEntity).toHaveLength(1);
    expect(faq.mainEntity[0].name).toBe('What is this?');
    expect(faq.mainEntity[0].acceptedAnswer.text).toBe('A test.');
  });
});
