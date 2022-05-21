# Nodemailer Inlining CSS
`@point-hub/nodemailer-inlinecss` is an ESM-only module - you are not able to import it with `require()`.

## Install

Install from npm

    npm install @point-hub/nodemailer-inlinecss

## Usage 
### Internal Styles
```javascript
import nodemailer from "nodemailer";
import inlineCss from "@point-hub/nodemailer-inlinecss";

var transporter = nodemailer.createTransport();
transporter.use('compile', inLineCss());
transporter.sendMail({
    from: '...',
    to: '...',
    html: '<style>div { color:black; }</style><div>Hello world</div>'
});
```

Will result in an email with the following HTML:

    <div style="color: black;">Hello world</div>

### External Styles
```javascript
import fs from "fs";
import nodemailer from "nodemailer";
import inlineCss from "@point-hub/nodemailer-inlinecss";

var transporter = nodemailer.createTransport();
transporter.use('compile', inLineCss({
    extraCss: fs.readFileSync("./src/styles.min.css").toString(),
}));
transporter.sendMail({
    from: '...',
    to: '...',
    html: '<div>Hello world</div>'
});
```
Your external css file.

```css
div {
  color: black;
}
```

Will result in an email with the following HTML:

    <div style="color: black;">Hello world</div>
