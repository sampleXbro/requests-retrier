import { RetryLogger } from '../src/services/logger';

describe('RetryLogger', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('when logging is disabled', () => {
    const logger = new RetryLogger(false);

    it('should not log messages', () => {
      logger.log('Test log');
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should not log errors', () => {
      logger.error('Test error', new Error('Test'));
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should not log warnings', () => {
      logger.warn('Test warning');
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });

  describe('when logging is enabled', () => {
    const logger = new RetryLogger(true);

    it('should log messages with optional data', () => {
      logger.log('Test log', { key: 'value' });
      expect(consoleLogSpy).toHaveBeenCalledWith('[axios-retryer] Test log', JSON.stringify({ key: 'value' }));

      logger.log('Test log without data');
      expect(consoleLogSpy).toHaveBeenCalledWith('[axios-retryer] Test log without data', '');
    });

    it('should log errors', () => {
      const error = new Error('Test error');
      logger.error('Test error', error);
      expect(consoleErrorSpy).toHaveBeenCalledWith('[axios-retryer] Test error', error);
    });

    it('should log warnings with optional data', () => {
      logger.warn('Test warning', { key: 'value' });
      expect(consoleWarnSpy).toHaveBeenCalledWith('[axios-retryer] Test warning', JSON.stringify({ key: 'value' }));

      logger.warn('Test warning without data');
      expect(consoleWarnSpy).toHaveBeenCalledWith('[axios-retryer] Test warning without data', '');
    });
  });
});