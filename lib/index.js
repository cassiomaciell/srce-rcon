"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RCON = void 0;
var events_1 = __importDefault(require("events"));
var net_1 = __importDefault(require("net"));
var packets_1 = __importDefault(require("./utils/packets"));
var RCON = /** @class */ (function (_super) {
    __extends(RCON, _super);
    function RCON(host, port, password) {
        var _this = _super.call(this) || this;
        _this.client = net_1.default.createConnection(port, host, function () {
            _this.client.on("data", function (data) {
                _this.emit("data", data);
                var response = packets_1.default.response(data);
                switch (response.type) {
                    case 2:
                        var success = response.id < 0 ? false : true;
                        _this.emit("serverdata_auth_response", success);
                        if (success) {
                            _this.emit("connected", _this);
                        }
                        else {
                            _this.emit("wrong_password");
                            _this.client.destroy();
                        }
                        break;
                    case 0:
                        _this.emit("serverdata_response_value", response);
                        break;
                }
            });
            _this.login(password);
        });
        _this.client.once("close", function (hadError) {
            _this.emit("close", hadError);
        });
        _this.client.once("error", function (err) {
            _this.emit("error", err);
        });
        return _this;
    }
    RCON.prototype.login = function (password) {
        this.client.write(packets_1.default.request(1, 3, password));
    };
    RCON.prototype.sendCommand = function (command) {
        this.client.write(packets_1.default.request(1, 2, command));
    };
    return RCON;
}(events_1.default));
exports.RCON = RCON;
