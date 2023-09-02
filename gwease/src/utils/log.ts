const sourceStyle = `background-color: #606060;color:white;padding:1px 3px;border-radius:3px 0 0 3px;`;
const moduleStyle = `background-color: #42C02E;color:white;padding:1px 3px;border-radius:0 3px 3px 0;text-align: center;`;
const sketchStyle = `background-color: none;color:white;padding:1px 3px;`;

interface Log {
  source?: string;
  module?: string;
  sketch: string;
  type?: "log" | "warn" | "error";
}

export function log({ source = "ease", module = "", sketch = "", type = "log" }: Log) {
  // eslint-disable-next-line no-console
  console[type](`%c ${source} %c ${module} %c${sketch} `, sourceStyle, moduleStyle, sketchStyle);
}
