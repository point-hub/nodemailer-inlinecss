import inlineCss from "./index.js";
import juice from "juice";
import fs from "fs";

describe("test", function () {
  it("should inline styles from internal stylesheets", function (done) {
    const html = "<style>div{color:black}</style><div>Hello World</div>";
    const mail = {
      data: {
        html: html,
      },
      resolveContent: function (
        obj: object,
        key: string,
        cb: (arg0: unknown, arg1: string) => void
      ) {
        cb(null, html);
      },
    };

    const plugin = inlineCss();
    plugin(mail, function (error: unknown) {
      expect(error).toBeUndefined();
      expect(mail.data.html).toBe(
        '<div style="color: black;">Hello World</div>'
      );
      done();
    });
  });

  it("should inline styles from external stylesheets", function (done) {
    const html = "<div>Hello World</div>";
    const mail = {
      data: {
        html: html,
      },
      resolveContent: function (
        obj: object,
        key: string,
        cb: (arg0: unknown, arg1: string) => void
      ) {
        cb(null, html);
      },
    };

    const plugin = inlineCss({
      extraCss: fs.readFileSync("./src/style.css").toString(),
    });
    plugin(mail, function (error: unknown) {
      expect(error).toBeUndefined();
      expect(mail.data.html).toBe(
        '<div style="color: black;">Hello World</div>'
      );
      done();
    });
  });

  it("resolveContent() should return an error", function (done) {
    const mail = {
      data: {
        html: "test",
      },
      resolveContent: function (
        obj: object,
        key: string,
        cb: (arg0: unknown, arg1: string) => void
      ) {
        cb(new Error(), "");
      },
    };

    const plugin = inlineCss();
    plugin(mail, function (error: unknown) {
      expect(error).toBeDefined();
      done();
    });
  });

  it("juice.juiceResources() should return an error", function (done) {
    const html = "<div>Hello World</div>";
    const mail = {
      data: {
        html: html,
      },
      resolveContent: function (
        obj: object,
        key: string,
        cb: (arg0: unknown, arg1: string) => void
      ) {
        cb(null, html);
      },
    };

    juice.juiceResources = jest
      .fn()
      .mockImplementation((arg0, arg1, callback) => {
        callback(new Error(), "");
      });

    const plugin = inlineCss();
    plugin(mail, function (error: unknown) {
      expect(error).toBeDefined();
      done();
    });
  });
});
