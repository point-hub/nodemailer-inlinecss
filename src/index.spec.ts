import { expect } from "chai";
import inlineCss from "./index.js";
import sinon from "sinon";
import juice from "juice";
import fs from "fs";

describe("test", function () {
  it("should inline styles from internal stylesheets", function (done) {
    const plugin = inlineCss();
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
    plugin(mail, function (error: unknown) {
      expect(error).to.not.exist;
      expect(mail.data.html).to.equal(
        '<div style="color: black;">Hello World</div>'
      );
      done();
    });
  });

  it("should inline styles from external stylesheets", function (done) {
    const plugin = inlineCss({
      extraCss: fs.readFileSync("./src/style.css").toString(),
    });
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
    plugin(mail, function (error: unknown) {
      expect(error).to.not.exist;
      expect(mail.data.html).to.equal(
        '<div style="color: black;">Hello World</div>'
      );
      done();
    });
  });

  it("should return an error when resolve content", function (done) {
    const plugin = inlineCss();
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
    plugin(mail, function (error: unknown) {
      expect(error).to.be.instanceOf(Error);
      done();
    });
  });

  it("should return an error when inlining styles", function (done) {
    const plugin = inlineCss();
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

    const fsStub = sinon.stub(juice, "juiceResources");
    fsStub.yields(new Error());

    plugin(mail, function (error: unknown) {
      expect(error).to.be.instanceOf(Error);
      done();
    });
  });
});
