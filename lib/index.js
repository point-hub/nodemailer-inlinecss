var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import juice from "juice";
const plugin = function (options = {}) {
    return function (mail, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const inlineCss = new InlineCss(options);
            yield inlineCss.process(mail, callback);
        });
    };
};
class InlineCss {
    constructor(options) {
        this.options = {};
        this.options = options;
    }
    process(mail, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const html = yield this.resolveContent(mail);
                mail.data.html = yield this.inlineStyles(html);
                callback();
            }
            catch (error) {
                callback(error);
            }
        });
    }
    resolveContent(mail) {
        return new Promise((resolve, reject) => {
            // if mail.data.html is a file or an url, it is returned as a Buffer
            mail.resolveContent(mail.data, "html", function (err, html) {
                if (err) {
                    return reject(err);
                }
                return resolve(html);
            });
        });
    }
    inlineStyles(html) {
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
