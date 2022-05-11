interface ResolveContentFunction {
    (arg0: object, arg1: string, arg2: (arg0: unknown, html: string) => void): void;
}
interface Mail {
    data: {
        html: string;
    };
    resolveContent: ResolveContentFunction;
}
declare const plugin: (options?: object) => (mail: Mail, callback: (error?: unknown) => void) => Promise<void>;
export default plugin;
