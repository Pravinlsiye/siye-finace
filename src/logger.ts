type LogLevel = 'debug' | 'info' | 'warning' | 'error';

class Logger {
  private static formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const formattedArgs = args.map(arg => {
      if (arg instanceof Error) {
        return {
          message: arg.message,
          stack: arg.stack,
          ...(arg as any)
        };
      }
      return arg;
    });
    return `[${timestamp}] [${level.toUpperCase()}]: ${message} ${formattedArgs.length ? JSON.stringify(formattedArgs, null, 2) : ''}`;
  }

  static debug(message: string, ...args: any[]) {
    // eslint-disable-next-line no-console
    console.debug(Logger.formatMessage('debug', message, ...args));
  }

  static info(message: string, ...args: any[]) {
    // eslint-disable-next-line no-console
    console.info(Logger.formatMessage('info', message, ...args));
  }

  static warning(message: string, ...args: any[]) {
    // eslint-disable-next-line no-console
    console.warn(Logger.formatMessage('warning', message, ...args));
  }

  static error(message: string, ...args: any[]) {
    // eslint-disable-next-line no-console
    console.error(Logger.formatMessage('error', message, ...args));
  }
}

export default Logger;