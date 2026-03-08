import React from "react";
import "./style.scss";

const TerminalView = () => {
  return (
    <div className="terminal-wrapper">
      <div className="terminal-box">
        <div className="terminal-display">999999 s</div>

        <div className="terminal-double-row">
          <div className="terminal-block">⏸ ПАУЗА</div>
          <div className="terminal-block">💳 СПОСОБ ОПЛАТЫ</div>
        </div>

        <div className="terminal-grid">
          <div className="terminal-block">
            <div>🚿 ВОДА</div>
            <div className="subtext">3000 s/min</div>
          </div>
          <div className="terminal-block">
            <div>🚗 ВОСК</div>
            <div className="subtext">3000 s/min</div>
          </div>

          <div className="terminal-block">
            <div>💦 TURBO ВОДА</div>
            <div className="subtext">5000 s/min</div>
          </div>
          <div className="terminal-block">
            <div>💧 ОСМОС</div>
            <div className="subtext">5000 s/min</div>
          </div>

          <div className="terminal-block">
            <div>🧪 АКТИВНАЯ ХИМИЯ</div>
            <div className="subtext">3000 s/min</div>
          </div>
          <div className="terminal-block">
            <div>🫧 ПЕНА</div>
            <div className="subtext">3000 s/min</div>
          </div>

          <div className="terminal-block">
            <div>🧴 НАНО ШАМПУНЬ</div>
            <div className="subtext">5000 s/min</div>
          </div>
          <div className="terminal-block">
            <div>🚙 МОЙКА ПОРОГОВ</div>
            <div className="subtext">3000 s/min</div>
          </div>
        </div>

        <div className="terminal-double-row">
          <div className="terminal-block">📱 QR оплата</div>
          <div className="terminal-block">⚙️ настройки</div>
        </div>
      </div>
    </div>
  );
};

export default TerminalView;
