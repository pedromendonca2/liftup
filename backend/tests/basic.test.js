// backend/tests/basic.test.js

describe('Basic Jest Tests', () => {
  it('should perform basic arithmetic correctly', () => {
    expect(2 + 2).toBe(4);
    expect(5 * 3).toBe(15);
    expect(10 / 2).toBe(5);
  });

  it('should handle string operations', () => {
    const greeting = 'Hello';
    const name = 'World';
    
    expect(greeting + ' ' + name).toBe('Hello World');
    expect(greeting.length).toBe(5);
    expect(name.toUpperCase()).toBe('WORLD');
  });

  it('should work with arrays', () => {
    const numbers = [1, 2, 3, 4, 5];
    
    expect(numbers).toHaveLength(5);
    expect(numbers).toContain(3);
    expect(numbers[0]).toBe(1);
    expect(numbers[numbers.length - 1]).toBe(5);
  });

  it('should work with objects', () => {
    const user = {
      id: 1,
      name: 'João',
      email: 'joao@example.com'
    };

    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name', 'João');
    expect(user.email).toBe('joao@example.com');
  });

  it('should handle async operations', async () => {
    const promise = new Promise(resolve => {
      setTimeout(() => resolve('success'), 10);
    });

    const result = await promise;
    expect(result).toBe('success');
  });

  it('should handle error cases', () => {
    const throwError = () => {
      throw new Error('Something went wrong');
    };

    expect(throwError).toThrow('Something went wrong');
  });
});
