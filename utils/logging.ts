import {
  currentConfig,
  getPrintFn,
  LogLevel,
  withConfigProvideLogFn,
} from "../scorebridge-ts-submodule/genericLogger";

export function logFn(
  catPrefix: string,
): (catSuffix: string, logLevel: LogLevel, ...addlParams: unknown[]) => void {
  return withConfigProvideLogFn(
    currentConfig(process.env.EXPO_PUBLIC_SB_LOGGING_CONFIG),
    getPrintFn,
  )(catPrefix);
}
