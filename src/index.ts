import juice from "juice";
interface ResolveContentFunction {
  (
    arg0: object,
    arg1: string,
    arg2: (arg0: unknown, html: string) => void
  ): void;
}

interface Mail {
  data: {
    html: string;
  };
  resolveContent: ResolveContentFunction;
}

const plugin = function (options: object = {}) {
  return async function (mail: Mail, callback: (error?: unknown) => void) {
    const inlineCss = new InlineCss(options);
    await inlineCss.process(mail, callback);
  };
};

class InlineCss {
  options: object = {};

  constructor(options: object) {
    this.options = options;
  }

  async process(mail: Mail, callback: (error?: unknown) => void) {
    try {
      const html = await this.resolveContent(mail);
      mail.data.html = await this.inlineStyles(html);
      callback();
    } catch (error) {
      callback(error);
    }
  }

  resolveContent(mail: Mail): Promise<string> {
    return new Promise((resolve, reject) => {
      // if mail.data.html is a file or an url, it is returned as a Buffer
      mail.resolveContent(
        mail.data,
        "html",
        function (err: unknown, html: string) {
          if (err) {
            return reject(err);
          }
          return resolve(html);
        }
      );
    });
  }

  inlineStyles(html: string): Promise<string> {
    return new Promise((resolve, reject) => {
      juice.juiceResources(html, this.options, function (err, inlinedHtml) {
        if (err) {
          return reject(err);
        }
        return resolve(inlinedHtml);
      });
    });
  }
}

export default plugin;
