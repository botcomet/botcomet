import WebSocket from "ws";

import {
  Message,
  ContextCache,
  next_obfuscated_id
} from "@botcomet/protocol";
import { Certificate } from "@botcomet/auth";

// TODO: Add a config file for the station address.
const STATION_ADDRESS = "ws://localhost:8080";

/**
 * Plugins handle all functionality for comets. They
 * receive events from the bot, and emit commands for
 * the bot to execute. Plugins are loaded by the station
 * on connection, but are not verified by the station
 * itself. Comets handle all verification of plugins.
 */
class Plugin {
  // The client ID from the station
  private client_id = "";
  // The plugin address (see @botcomet/auth - Certificate)
  private address: string;
  // The context cache for messages. This holds persistent
  // data between messages, and is used to relate messages
  // to one another.
  private message_context: ContextCache = new Map();

  private station_conn: WebSocket | null = null;
  private certificate: Certificate;

  /**
   * @param publicKey The public key as a PEM string (see \@botcomet/auth - Certificate)
   * @param privateKey The private key as a PEM string (see \@botcomet/auth - Certificate)
   */
  constructor(publicKey: string, privateKey: string) {
    this.certificate = new Certificate(publicKey, privateKey);
    this.address = this.certificate.address;
  }

  /**
   * Starts the plugin. This will connect to the station,
   * and begin listening for messages on the station.
   */
  public start() {
    this.station_conn = new WebSocket(STATION_ADDRESS);
    this.station_conn.on("open", this.onOpen);
    this.station_conn.on("message", (data) => this.onMessage(JSON.parse(data.toString())));
  }

  private onOpen() {
    if (!this.certificate) {
      // The certificate is initialized in the constructor,
      // so this should never happen.
      throw new Error("No certificate loaded! [IMPOSSIBLE ERROR]");
    }

    const context_id = next_obfuscated_id();
    this.message_context.set(context_id, {
      type: "plugin_connect",
      data: {}
    });

    this.sendStationMessage({
      type: "plugin_connect",
      dst: "STATION",
      src: "CONNECTION",
      context: context_id,
      data: {
        address: this.address
      }
    });
  }

  private onMessage(data: Message) {
    switch (data.type) {

    case "plugin_verify": {
      if (!this.certificate) {
        console.error("No certificate loaded!");
        return;
      }

      let challenge: string = data.data.challenge;
      challenge = this.certificate.unlock(challenge);

      this.sendStationMessage({
        type: "plugin_verify_response",
        dst: data.src,
        src: data.dst,
        context: "CONTEXT",
        data: { challenge }
      });
    } break;

    case "plugin_connect_response": {
      if (!this.message_context.has(data.context)) {
        console.error("Plugin connect response context not found!");
        return;
      }

      const context = this.message_context.get(data.context)!;
      if (context.type !== "plugin_connect") {
        console.error("Plugin connect response context type mismatch!");
        return;
      }

      this.message_context.delete(data.context);
      this.client_id = data.data.client_id;
    } break;

    default:
      console.error("Unknown message type: " + data.type);

    }
  }

  private sendStationMessage(msg: Message) {
    this.station_conn?.send(JSON.stringify(msg));
  }

}

export default Plugin;
