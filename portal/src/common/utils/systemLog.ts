const showSystemInfo = () => {
    // eslint-disable-next-line no-console
    console.log(
        `%c ${process.env.APP_NAME} %c ${process.env.APP_VERSION} %c ${process.env.APP_COMPILE_TIME} `,
        `background-color: #fac03d;color:white;padding:1px 3px;text-align: center;`,
        `background-color: #697723;color:white;padding:1px 3px;text-align: center;`,
        `background-color: #543044;color:white;padding:1px 3px;text-align: center;`,
    );
};
export default showSystemInfo;
