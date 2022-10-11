export interface LoggerAction {
  actionModule: string;
  actionDetail: string;
}

export const LOGGER_ACTION_KEY = '__action_module__';
