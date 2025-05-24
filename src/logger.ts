type LogLevel = 'debug' | 'info' | 'warning' | 'error';

class Logger {
  private static enabledLevels: Set<LogLevel> = new Set(['debug', 'info', 'warning', 'error']);

  /**
   * Configures the log levels to enable or disable specific levels.
   * @param levels - An array of log levels to enable.
   */
  static configure(levels: LogLevel[]): void {
    this.enabledLevels = new Set(levels);
  }

  /**
   * Formats the log message with a timestamp, level, and additional arguments.
   * @param level - The log level.
   * @param message - The main log message.
   * @param args - Additional arguments to log.
   * @returns The formatted log message.
   */
  private static formatMessage(level: LogLevel, message: string, ...args: unknown[]): string {
    const timestamp = new Date().toISOString();
    const formattedArgs = args.map(arg => {
      if (arg instanceof Error) {
        return {
          stack: arg.stack,
          ...arg,
        };
      }
      return arg;
    });
    return `[${timestamp}] [${level.toUpperCase()}]: ${message} ${formattedArgs.length ? JSON.stringify(formattedArgs, null, 2) : ''}`;
  }

  /**
   * Logs a debug message if the debug level is enabled.
   */
  static debug(message: string, ...args: unknown[]): void {
    if (this.enabledLevels.has('debug')) {
      console.debug(this.formatMessage('debug', message, ...args));
    }
  }

  /**
   * Logs an info message if the info level is enabled.
   */
  static info(message: string, ...args: unknown[]): void {
    if (this.enabledLevels.has('info')) {
      console.info(this.formatMessage('info', message, ...args));
    }
  }

  /**
   * Logs a warning message if the warning level is enabled.
   */
  static warning(message: string, ...args: unknown[]): void {
    if (this.enabledLevels.has('warning')) {
      console.warn(this.formatMessage('warning', message, ...args));
    }
  }

  /**
   * Logs an error message if the error level is enabled.
   */
  static error(message: string, ...args: unknown[]): void {
    if (this.enabledLevels.has('error')) {
      console.error(this.formatMessage('error', message, ...args));
    }
  }
}

export default Logger;