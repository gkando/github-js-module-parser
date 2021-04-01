import app from "./app";

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
  console.log(`\n=== Server listening at localhost:${app.get("port")}.
    Press CTRL-C to stop\n
  `);
});

export default server;
