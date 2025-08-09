describe('Basic test setup', () => {
  it('should pass basic test', () => {
    expect(true).toBe(true);
  });
  
  it('should handle string operations', () => {
    expect('hello world').toContain('world');
  });
});