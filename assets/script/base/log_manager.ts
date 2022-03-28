

export enum LOG_TYPE {
    sys, // 季节
    world, // 世界消息
    error, // 错误日志
    self,  // 自己的
}


export default class LogManager {

    private static _instance: LogManager = null;
    public static get Instance(): LogManager {
        if (this._instance == null) {
            this._instance = new LogManager()
        }
        return this._instance;
    }

    public static error(log: string) {
        LogManager.Instance.addLog({tag: LOG_TYPE.error, log: log})
    }

    public static world(log: string) {
        LogManager.Instance.addLog({tag: LOG_TYPE.world, log: log})
    }

    public static sys(log: string) {
        LogManager.Instance.addLog({tag: LOG_TYPE.sys, log: log})
    }

    public static self(log: string) {
        LogManager.Instance.addLog({tag: LOG_TYPE.self, log: log})
    }

    /**日志上限 */
    private limitMax: number = 100;
    /**日志 */
    private _logs: { tag: LOG_TYPE, log: string }[] = null;
    public get logs(): { tag: LOG_TYPE, log: string }[] {
        return this._logs;
    }

    /**初始化 */
    public init(limitMax: number) {
        this._logs = [];
        this.limitMax = limitMax;
    }

    /**添加一个log */
    public addLog(log: { tag: LOG_TYPE, log: string }) {
        if (!log) {
            return;
        }
        if (this._logs.length >= this.limitMax) {
            this._logs.pop();
        }
        else {
            this._logs.unshift(log);
        }
    }

}