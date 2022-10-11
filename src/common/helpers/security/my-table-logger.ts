import { LogsSecurity } from '@safety/logs/log.entity';
import { ValidAcions } from '@safety/roles/enums';
import { v4 as UUID4 } from 'uuid';

export class TableLogger {
  async logProcess(action: ValidAcions, module: string, iduser: string, detail: string) {
    try {
      const logRecord = new LogsSecurity();
      logRecord.id = UUID4();
      logRecord.action = action;
      logRecord.module = module;
      logRecord.user_id = iduser;
      logRecord.detail = detail;

      logRecord.save();
    } catch {}
  }
}
