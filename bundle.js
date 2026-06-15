const { useState, useEffect, useRef, useMemo, useCallback } = React;
const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;width:100%;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;height:22px;
    border-radius:6px;cursor:default;padding:0}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}
`;
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  const setTweak = React.useCallback((key, val) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [key]: val } }, "*");
  }, []);
  return [values, setTweak];
}
function TweaksPanel({ title = "Tweaks", children }) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({ x: 16, y: 16 });
  const PAD2 = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const maxRight = Math.max(PAD2, window.innerWidth - w - PAD2);
    const maxBottom = Math.max(PAD2, window.innerHeight - h - PAD2);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD2, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD2, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + "px";
    panel.style.bottom = offsetRef.current.y + "px";
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", clampToViewport);
      return () => window.removeEventListener("resize", clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = (e) => {
      var _a;
      const t = (_a = e == null ? void 0 : e.data) == null ? void 0 : _a.type;
      if (t === "__activate_edit_mode") setOpen(true);
      else if (t === "__deactivate_edit_mode") setOpen(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*");
  };
  const onDragStart = (e) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev) => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };
  if (!open) return null;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("style", null, __TWEAKS_STYLE), /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: dragRef,
      className: "twk-panel",
      style: { right: offsetRef.current.x, bottom: offsetRef.current.y }
    },
    /* @__PURE__ */ React.createElement("div", { className: "twk-hd", onMouseDown: onDragStart }, /* @__PURE__ */ React.createElement("b", null, title), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "twk-x",
        "aria-label": "Close tweaks",
        onMouseDown: (e) => e.stopPropagation(),
        onClick: dismiss
      },
      "\u2715"
    )),
    /* @__PURE__ */ React.createElement("div", { className: "twk-body" }, children)
  ));
}
function TweakSection({ label, children }) {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "twk-sect" }, label), children);
}
function TweakRow({ label, value, children, inline = false }) {
  return /* @__PURE__ */ React.createElement("div", { className: inline ? "twk-row twk-row-h" : "twk-row" }, /* @__PURE__ */ React.createElement("div", { className: "twk-lbl" }, /* @__PURE__ */ React.createElement("span", null, label), value != null && /* @__PURE__ */ React.createElement("span", { className: "twk-val" }, value)), children);
}
function TweakSlider({ label, value, min = 0, max = 100, step = 1, unit = "", onChange }) {
  return /* @__PURE__ */ React.createElement(TweakRow, { label, value: `${value}${unit}` }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "range",
      className: "twk-slider",
      min,
      max,
      step,
      value,
      onChange: (e) => onChange(Number(e.target.value))
    }
  ));
}
function TweakToggle({ label, value, onChange }) {
  return /* @__PURE__ */ React.createElement("div", { className: "twk-row twk-row-h" }, /* @__PURE__ */ React.createElement("div", { className: "twk-lbl" }, /* @__PURE__ */ React.createElement("span", null, label)), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "twk-toggle",
      "data-on": value ? "1" : "0",
      role: "switch",
      "aria-checked": !!value,
      onClick: () => onChange(!value)
    },
    /* @__PURE__ */ React.createElement("i", null)
  ));
}
function TweakRadio({ label, value, options, onChange }) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const opts = options.map((o) => typeof o === "object" ? o : { value: o, label: o });
  const idx = Math.max(0, opts.findIndex((o) => o.value === value));
  const n = opts.length;
  const valueRef = React.useRef(value);
  valueRef.current = value;
  const segAt = (clientX) => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = (e) => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = (ev) => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return /* @__PURE__ */ React.createElement(TweakRow, { label }, /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: trackRef,
      role: "radiogroup",
      onPointerDown,
      className: dragging ? "twk-seg dragging" : "twk-seg"
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "twk-seg-thumb",
        style: {
          left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
          width: `calc((100% - 4px) / ${n})`
        }
      }
    ),
    opts.map((o) => /* @__PURE__ */ React.createElement("button", { key: o.value, type: "button", role: "radio", "aria-checked": o.value === value }, o.label))
  ));
}
function TweakSelect({ label, value, options, onChange }) {
  return /* @__PURE__ */ React.createElement(TweakRow, { label }, /* @__PURE__ */ React.createElement("select", { className: "twk-field", value, onChange: (e) => onChange(e.target.value) }, options.map((o) => {
    const v = typeof o === "object" ? o.value : o;
    const l = typeof o === "object" ? o.label : o;
    return /* @__PURE__ */ React.createElement("option", { key: v, value: v }, l);
  })));
}
function TweakText({ label, value, placeholder, onChange }) {
  return /* @__PURE__ */ React.createElement(TweakRow, { label }, /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "twk-field",
      type: "text",
      value,
      placeholder,
      onChange: (e) => onChange(e.target.value)
    }
  ));
}
function TweakNumber({ label, value, min, max, step = 1, unit = "", onChange }) {
  const clamp = (n) => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({ x: 0, val: 0 });
  const onScrubStart = (e) => {
    e.preventDefault();
    startRef.current = { x: e.clientX, val: value };
    const decimals = (String(step).split(".")[1] || "").length;
    const move = (ev) => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "twk-num" }, /* @__PURE__ */ React.createElement("span", { className: "twk-num-lbl", onPointerDown: onScrubStart }, label), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      value,
      min,
      max,
      step,
      onChange: (e) => onChange(clamp(Number(e.target.value)))
    }
  ), unit && /* @__PURE__ */ React.createElement("span", { className: "twk-num-unit" }, unit));
}
function TweakColor({ label, value, onChange }) {
  return /* @__PURE__ */ React.createElement("div", { className: "twk-row twk-row-h" }, /* @__PURE__ */ React.createElement("div", { className: "twk-lbl" }, /* @__PURE__ */ React.createElement("span", null, label)), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "color",
      className: "twk-swatch",
      value,
      onChange: (e) => onChange(e.target.value)
    }
  ));
}
function TweakButton({ label, onClick, secondary = false }) {
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: secondary ? "twk-btn secondary" : "twk-btn",
      onClick
    },
    label
  );
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
function PersuasionBars({ palette, size = "lg" }) {
  const isLg = size === "lg";
  const sz = isLg ? 44 : 30;
  const dotR = isLg ? "32%" : "30%";
  return /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: isLg ? 56 : 40,
    width: "100%"
  }, "aria-label": "\uC124\uB4DD \uC911" }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: sz, height: sz } }, [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement("div", { key: i, style: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    border: `1.8px solid ${palette.primary}`,
    animation: "waitRipple 1.8s ease-out infinite",
    animationDelay: `${i * 0.6}s`,
    opacity: 0
  } })), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: dotR,
    borderRadius: "50%",
    background: palette.primary,
    boxShadow: `0 0 14px ${palette.primary}`,
    animation: "waitPulse 1.8s ease-in-out infinite"
  } })));
}
function questionType(r, c) {
  const seed = (r * 7 + c * 3 + r * c) % 7;
  return seed < 4 ? "T" : "B";
}
function isHangul(ch) {
  if (!ch) return false;
  const c = ch.charCodeAt(0);
  return c >= 44032 && c <= 55203 || c >= 4352 && c <= 4607 || c >= 12592 && c <= 12687;
}
function initialFont(ch) {
  return isHangul(ch) ? "'EliceDigitalBaeum', system-ui, sans-serif" : "'Nura', system-ui, sans-serif";
}
const TIERS = [
  { id: "bronze", label: { ko: "\uBE0C\uB860\uC988", en: "Bronze" }, min: 0, color: "#C18A5A", glow: "rgba(193,138,90," },
  { id: "silver", label: { ko: "\uC2E4\uBC84", en: "Silver" }, min: 5, color: "#BFC4CC", glow: "rgba(191,196,204," },
  { id: "gold", label: { ko: "\uACE8\uB4DC", en: "Gold" }, min: 12, color: "#F2C857", glow: "rgba(242,200,87," },
  { id: "platinum", label: { ko: "\uD50C\uB798\uD2F0\uB118", en: "Platinum" }, min: 25, color: "#74E0DB", glow: "rgba(116,224,219," },
  { id: "diamond", label: { ko: "\uB2E4\uC774\uC544", en: "Diamond" }, min: 50, color: "#9DD6FF", glow: "rgba(157,214,255," },
  { id: "master", label: { ko: "\uB9C8\uC2A4\uD130", en: "Master" }, min: 100, color: "#FFB1F0", glow: "rgba(255,177,240," }
];
function getTier(gp = 0) {
  let t = TIERS[0];
  for (const tier of TIERS) if (gp >= tier.min) t = tier;
  return t;
}
function getBingoLines(cells, role) {
  const owned = (r, c) => {
    const v = cells == null ? void 0 : cells[`${r},${c}`];
    return v && v.state === "won" && v.role === role;
  };
  const lines = [];
  for (let r = 0; r < 5; r++) {
    if ([0, 1, 2, 3, 4].every((c) => owned(r, c)))
      lines.push({ cells: [0, 1, 2, 3, 4].map((c) => [r, c]), dir: "row" });
  }
  for (let c = 0; c < 5; c++) {
    if ([0, 1, 2, 3, 4].every((r) => owned(r, c)))
      lines.push({ cells: [0, 1, 2, 3, 4].map((r) => [r, c]), dir: "col" });
  }
  if ([0, 1, 2, 3, 4].every((i) => owned(i, i)))
    lines.push({ cells: [0, 1, 2, 3, 4].map((i) => [i, i]), dir: "diag" });
  if ([0, 1, 2, 3, 4].every((i) => owned(i, 4 - i)))
    lines.push({ cells: [0, 1, 2, 3, 4].map((i) => [i, 4 - i]), dir: "diag" });
  return lines;
}
function countBingoLines(cells, role) {
  const owned = (r, c) => {
    const v = cells == null ? void 0 : cells[`${r},${c}`];
    return v && v.state === "won" && v.role === role;
  };
  let lines = 0;
  for (let r = 0; r < 5; r++) {
    let all = true;
    for (let c = 0; c < 5; c++) if (!owned(r, c)) {
      all = false;
      break;
    }
    if (all) lines++;
  }
  for (let c = 0; c < 5; c++) {
    let all = true;
    for (let r = 0; r < 5; r++) if (!owned(r, c)) {
      all = false;
      break;
    }
    if (all) lines++;
  }
  let diag1 = true, diag2 = true;
  for (let i = 0; i < 5; i++) {
    if (!owned(i, i)) diag1 = false;
    if (!owned(i, 4 - i)) diag2 = false;
  }
  if (diag1) lines++;
  if (diag2) lines++;
  return lines;
}
const ROLE = {
  host: {
    name: "cammup",
    initial: "C",
    primary: "#FF0077",
    primaryDark: "#BD0558",
    deep: "#610C39",
    soft: "#FFD1E3",
    glow: "rgba(255,0,119,",
    gradient: "linear-gradient(160deg, #FF5CA1 0%, #BD0558 100%)",
    gradientReserved: "linear-gradient(160deg, #FFFFFF 0%, #FFB4D4 60%, #FF4D94 100%)",
    auraHint: "rgba(255,0,119,0.06)"
  },
  guest: {
    name: "Guest",
    initial: "G",
    primary: "#6B14EC",
    primaryDark: "#430887",
    deep: "#2E0645",
    soft: "#D6C0FB",
    glow: "rgba(107,20,236,",
    gradient: "linear-gradient(160deg, #B487FD 0%, #430887 100%)",
    gradientReserved: "linear-gradient(160deg, #FFFFFF 0%, #C8A8FF 60%, #6B14EC 100%)",
    auraHint: "rgba(107,20,236,0.07)"
  }
};
function TopBar({ role, phase, currentTurn, attacksLeft, scores, bingoLines, lang, setLang, onExit, gameOver = false }) {
  const turnRole = currentTurn || role;
  const turnPal = ROLE[turnRole];
  const isMyTurn = turnRole === role;
  const myScore = scores || { gpPlus: 0, gpMinus: 0 };
  const myLines = bingoLines != null ? bingoLines : 0;
  const tier = getTier(myScore.gpPlus || 0);
  const t = lang === "en" ? {
    gp: "GP",
    atk: "ATK",
    bingo: "BINGO",
    turnSuffix: "\u2019s turn"
  } : {
    gp: "GP",
    atk: "ATK",
    bingo: "BINGO",
    turnSuffix: " \uCC28\uB840"
  };
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "stretch", gap: 10, paddingTop: 10, paddingBottom: 6, width: "100%", boxSizing: "border-box", overflow: "hidden", opacity: gameOver ? 0.28 : 1, pointerEvents: gameOver ? "none" : "auto", transition: "opacity 400ms ease" } }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    boxSizing: "border-box",
    padding: "0 14px",
    gap: 6
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", flex: "0 0 auto" } }, /* @__PURE__ */ React.createElement(TierBadge, { tier, lang })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, minWidth: 0 } }, /* @__PURE__ */ React.createElement(GPStat, { plus: myScore.gpPlus, minus: myScore.gpMinus }), /* @__PURE__ */ React.createElement(Stat, { label: t.atk, value: `${attacksLeft != null ? attacksLeft : 2}/2` }), /* @__PURE__ */ React.createElement(Stat, { label: t.bingo, value: myLines, highlight: myLines > 0 }))), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    boxSizing: "border-box",
    padding: "0 12px",
    gap: 6
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "inline-flex",
    alignItems: "center",
    padding: "10px 20px",
    background: isMyTurn ? turnPal.gradient : "rgba(255,255,255,0.06)",
    border: isMyTurn ? "none" : "1px solid rgba(255,255,255,0.1)",
    borderRadius: 999,
    boxShadow: isMyTurn ? `0 6px 22px ${turnPal.glow}0.55), inset 0 1px 0 rgba(255,255,255,0.25)` : "none",
    fontSize: 21,
    fontWeight: 700,
    color: isMyTurn ? "white" : "rgba(255,255,255,0.55)",
    whiteSpace: "nowrap",
    flex: "0 0 auto",
    animation: isMyTurn ? "turnPillPulse 2.4s ease-in-out infinite" : "none"
  } }, isMyTurn ? lang === "en" ? "Your turn" : "\uB0B4 \uCC28\uB840" : lang === "en" ? "Your friend's turn" : "\uCE5C\uAD6C \uCC28\uB840")));
}
function GPStat({ plus = 0, minus = 0 }) {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "inline-flex", alignItems: "baseline", gap: 5, lineHeight: 1 } }, /* @__PURE__ */ React.createElement("span", { style: {
    fontSize: 8.5,
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: "rgba(255,255,255,0.45)",
    textTransform: "uppercase"
  } }, "GP"), /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "baseline", gap: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, fontWeight: 700, color: "rgba(120,255,180,0.7)" } }, "(+)"), /* @__PURE__ */ React.createElement("span", { style: {
    fontSize: 13,
    fontWeight: 800,
    color: plus > 0 ? "#7BFFB4" : "rgba(255,255,255,0.55)",
    textShadow: plus > 0 ? "0 0 10px rgba(123,255,180,0.45)" : "none"
  } }, plus)), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: "rgba(255,255,255,0.2)", fontWeight: 600 } }, "\xB7"), /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "baseline", gap: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, fontWeight: 700, color: "rgba(255,130,140,0.7)" } }, "(\u2212)"), /* @__PURE__ */ React.createElement("span", { style: {
    fontSize: 13,
    fontWeight: 800,
    color: minus > 0 ? "#FF8A92" : "rgba(255,255,255,0.55)",
    textShadow: minus > 0 ? "0 0 10px rgba(255,80,90,0.45)" : "none"
  } }, minus)));
}
function Stat({ label, value, highlight }) {
  const isNegative = typeof value === "number" && value < 0;
  return /* @__PURE__ */ React.createElement("div", { style: { display: "inline-flex", alignItems: "baseline", gap: 3, lineHeight: 1 } }, /* @__PURE__ */ React.createElement("span", { style: {
    fontSize: 8.5,
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: "rgba(255,255,255,0.45)",
    textTransform: "uppercase"
  } }, label), /* @__PURE__ */ React.createElement("span", { style: {
    fontSize: 13,
    fontWeight: 800,
    color: isNegative ? "#FF8A92" : highlight ? "#F2C857" : "rgba(255,255,255,0.92)",
    textShadow: isNegative ? "0 0 10px rgba(255,80,90,0.55)" : highlight ? "0 0 10px rgba(242,200,87,0.55)" : "none"
  } }, value));
}
function CrownIcon({ size = 16, animate = false }) {
  return /* @__PURE__ */ React.createElement(
    "svg",
    {
      width: size,
      height: size * 0.85,
      viewBox: "0 0 24 20",
      fill: "none",
      style: {
        transformOrigin: "50% 90%",
        animation: animate ? "crownRock 2.6s ease-in-out infinite" : "none",
        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))"
      }
    },
    /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("linearGradient", { id: "crownGold", x1: "0", y1: "0", x2: "0", y2: "1" }, /* @__PURE__ */ React.createElement("stop", { offset: "0", stopColor: "#FFE89A" }), /* @__PURE__ */ React.createElement("stop", { offset: "1", stopColor: "#E0A93A" }))),
    /* @__PURE__ */ React.createElement(
      "path",
      {
        d: "M3 16 L3 8 L8 12 L12 4 L16 12 L21 8 L21 16 Z",
        fill: "url(#crownGold)",
        stroke: "#7A4F12",
        strokeWidth: "0.8",
        strokeLinejoin: "round"
      }
    ),
    /* @__PURE__ */ React.createElement("rect", { x: "3", y: "16", width: "18", height: "2.4", rx: "0.8", fill: "#B8801E", stroke: "#7A4F12", strokeWidth: "0.6" }),
    /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "6", r: "1", fill: "#FFF6D6" }, animate && /* @__PURE__ */ React.createElement("animate", { attributeName: "opacity", values: "1;0.3;1", dur: "1.6s", repeatCount: "indefinite" }))
  );
}
function TierBadge({ tier, lang }) {
  const label = tier.label[lang] || tier.label.ko;
  return /* @__PURE__ */ React.createElement("div", { style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "3px 7px 3px 4px",
    borderRadius: 999,
    background: `linear-gradient(180deg, ${tier.glow}0.18) 0%, ${tier.glow}0.05) 100%)`,
    border: `1px solid ${tier.glow}0.4)`,
    flex: "0 0 auto"
  } }, /* @__PURE__ */ React.createElement(
    "svg",
    {
      width: "13",
      height: "11",
      viewBox: "0 0 24 20",
      fill: "none",
      style: { flex: "0 0 auto", filter: `drop-shadow(0 0 3px ${tier.glow}0.6))` }
    },
    /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("linearGradient", { id: `crownTier_${tier.id}`, x1: "0", y1: "0", x2: "0", y2: "1" }, /* @__PURE__ */ React.createElement("stop", { offset: "0", stopColor: tier.color }), /* @__PURE__ */ React.createElement("stop", { offset: "1", stopColor: tier.color + "99" }))),
    /* @__PURE__ */ React.createElement(
      "path",
      {
        d: "M3 16 L3 8 L8 12 L12 4 L16 12 L21 8 L21 16 Z",
        fill: `url(#crownTier_${tier.id})`,
        stroke: tier.color + "88",
        strokeWidth: "0.8",
        strokeLinejoin: "round"
      }
    ),
    /* @__PURE__ */ React.createElement("rect", { x: "3", y: "16", width: "18", height: "2.4", rx: "0.8", fill: tier.color + "BB" })
  ), /* @__PURE__ */ React.createElement("span", { style: {
    fontSize: 9.5,
    fontWeight: 700,
    color: tier.color,
    letterSpacing: "0.02em",
    textShadow: `0 0 6px ${tier.glow}0.4)`
  } }, label));
}
function LangToggle({ lang, setLang }) {
  const next = lang === "en" ? "ko" : "en";
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setLang == null ? void 0 : setLang(next),
      "aria-label": "Toggle language",
      style: {
        height: 22,
        padding: "0 7px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.18)",
        color: "white",
        fontSize: 8.5,
        fontWeight: 800,
        fontFamily: "'EliceDigitalCodingverH', monospace",
        letterSpacing: "0.08em",
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        cursor: "pointer"
      }
    },
    /* @__PURE__ */ React.createElement("span", { style: { opacity: lang === "ko" ? 1 : 0.4 } }, "KO"),
    /* @__PURE__ */ React.createElement("span", { style: { opacity: 0.3 } }, "/"),
    /* @__PURE__ */ React.createElement("span", { style: { opacity: lang === "en" ? 1 : 0.4 } }, "EN")
  );
}
function ExitToggle({ onExit, lang }) {
  const [armed, setArmed] = React.useState(false);
  const [askSave, setAskSave] = React.useState(false);
  const t = lang === "en" ? {
    exit: "Exit",
    title: "Save your game?",
    save: "Save & exit",
    leave: "Leave without saving",
    cancel: "Cancel"
  } : {
    exit: "\uB098\uAC00\uAE30",
    title: "\uAC8C\uC784\uC744 \uC800\uC7A5\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?",
    save: "\uC800\uC7A5\uD558\uACE0 \uB098\uAC00\uAE30",
    leave: "\uADF8\uB0E5 \uB098\uAC00\uAE30",
    cancel: "\uCDE8\uC18C"
  };
  React.useEffect(() => {
    if (!armed) return;
    const id = setTimeout(() => setArmed(false), 4e3);
    return () => clearTimeout(id);
  }, [armed]);
  const handleClick = () => {
    if (!armed) {
      setArmed(true);
      return;
    }
    setArmed(false);
    setAskSave(true);
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleClick,
      "aria-label": t.exit,
      style: {
        height: 22,
        padding: armed ? "0 8px 0 7px" : "0",
        width: armed ? "auto" : 22,
        borderRadius: 999,
        background: armed ? "rgba(255,90,100,0.18)" : "rgba(255,255,255,0.06)",
        border: armed ? "1px solid rgba(255,140,150,0.55)" : "1px solid rgba(255,255,255,0.18)",
        color: armed ? "#FFB4BA" : "white",
        fontSize: 9.5,
        fontWeight: 700,
        letterSpacing: "0.02em",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        transition: "all 180ms"
      }
    },
    /* @__PURE__ */ React.createElement("svg", { width: "11", height: "11", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M10 2H4v12h6" }), /* @__PURE__ */ React.createElement("path", { d: "M9 8h6" }), /* @__PURE__ */ React.createElement("path", { d: "M12 5l3 3-3 3" })),
    armed && /* @__PURE__ */ React.createElement("span", null, t.exit)
  ), askSave && /* @__PURE__ */ React.createElement(
    ExitSaveModal,
    {
      lang,
      t,
      onSave: () => {
        setAskSave(false);
        onExit == null ? void 0 : onExit({ save: true });
      },
      onLeave: () => {
        setAskSave(false);
        onExit == null ? void 0 : onExit({ save: false });
      },
      onCancel: () => setAskSave(false)
    }
  ));
}
function ExitSaveModal({ t, onSave, onLeave, onCancel }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    zIndex: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(8,4,18,0.65)",
    backdropFilter: "blur(6px)",
    animation: "fadeIn 200ms ease-out"
  }, onClick: onCancel }, /* @__PURE__ */ React.createElement("div", { onClick: (e) => e.stopPropagation(), style: {
    width: 280,
    padding: 22,
    background: "linear-gradient(180deg, rgba(40,18,60,0.96), rgba(20,8,32,0.96))",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 22,
    boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    animation: "modalPop 280ms cubic-bezier(.34,1.56,.64,1)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "white", textAlign: "center", lineHeight: 1.4 } }, t.title), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, marginTop: 4 } }, /* @__PURE__ */ React.createElement("button", { onClick: onSave, style: {
    height: 42,
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(180deg, #FFE89A 0%, #E0A93A 100%)",
    color: "#3A2208",
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(224,169,58,0.4), inset 0 1px 0 rgba(255,255,255,0.5)"
  } }, t.save), /* @__PURE__ */ React.createElement("button", { onClick: onLeave, style: {
    height: 38,
    borderRadius: 12,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,140,150,0.4)",
    color: "#FFB4BA",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer"
  } }, t.leave), /* @__PURE__ */ React.createElement("button", { onClick: onCancel, style: {
    height: 32,
    borderRadius: 10,
    border: "none",
    background: "transparent",
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer"
  } }, t.cancel))));
}
function AmbientBokeh({ role }) {
  const pal = ROLE[role];
  const dots = [
    { l: 10, t: 12, s: 44, o: 0.18 },
    { l: 76, t: 6, s: 54, o: 0.14 },
    { l: 88, t: 58, s: 32, o: 0.2 },
    { l: 6, t: 62, s: 40, o: 0.16 },
    { l: 22, t: 84, s: 28, o: 0.22 },
    { l: 58, t: 88, s: 38, o: 0.12 },
    { l: 40, t: 44, s: 22, o: 0.14 },
    { l: 80, t: 34, s: 18, o: 0.22 }
  ];
  return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" } }, dots.map(
    (d, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: {
      position: "absolute",
      left: `${d.l}%`,
      top: `${d.t}%`,
      width: d.s,
      height: d.s,
      borderRadius: "50%",
      background: pal.primary,
      opacity: d.o,
      filter: "blur(8px)",
      animation: `bokehFloat ${12 + i % 4 * 3}s ease-in-out ${i * -2}s infinite alternate`
    } })
  ));
}
function Particles({ bursts }) {
  return /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" } }, bursts.map((b) => /* @__PURE__ */ React.createElement(BurstInstance, { key: b.id, ...b })));
}
function BurstInstance({ x, y, color, big }) {
  const count = big ? 14 : 8;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    left: x,
    top: y,
    width: 4,
    height: 4,
    marginLeft: -2,
    marginTop: -2,
    borderRadius: "50%",
    border: `2px solid ${color}`,
    animation: `ringExpand ${big ? 900 : 700}ms ease-out forwards`
  } }), Array.from({ length: count }).map((_, i) => {
    const angle = i / count * Math.PI * 2 + Math.random() * 0.3;
    const dist = (big ? 50 : 30) + Math.random() * 50;
    const size = 4 + Math.random() * 5;
    return /* @__PURE__ */ React.createElement("div", { key: i, style: {
      position: "absolute",
      left: x,
      top: y,
      width: size,
      height: size,
      marginLeft: -size / 2,
      marginTop: -size / 2,
      borderRadius: "50%",
      background: color,
      boxShadow: `0 0 8px ${color}`,
      "--dx": `${Math.cos(angle) * dist}px`,
      "--dy": `${Math.sin(angle) * dist}px`,
      animation: "particleFly 800ms cubic-bezier(.17,.84,.44,1) forwards"
    } });
  }));
}
function BingoCelebration({ role, lines, boardRef, onDone }) {
  const pal = ROLE[role];
  const [phase, setPhase] = useState("enter");
  const [visibleCells, setVisibleCells] = useState([]);
  useEffect(() => {
    const cells = lines.flatMap((l) => l.cells);
    cells.forEach((_, i) => {
      setTimeout(() => setVisibleCells((prev) => [...prev, i]), i * 80);
    });
    setTimeout(() => setPhase("confetti"), cells.length * 80 + 100);
    setTimeout(() => {
      setPhase("exit");
      setTimeout(onDone, 500);
    }, cells.length * 80 + 2200);
  }, []);
  const confetti = React.useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      // % across screen
      delay: Math.random() * 0.8,
      dur: 1.2 + Math.random() * 1.2,
      size: 6 + Math.random() * 8,
      color: [pal.primary, pal.soft, "#FFDD33", "#FFFFFF", pal.primaryDark, "#FF6FD8"][Math.floor(Math.random() * 6)],
      rotate: Math.random() * 360,
      shape: Math.random() > 0.5 ? "circle" : "rect",
      swing: (Math.random() - 0.5) * 180
    }));
  }, []);
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    zIndex: 100,
    pointerEvents: "none",
    overflow: "hidden",
    animation: phase === "exit" ? "celebFadeOut 500ms ease-out forwards" : "none"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    background: `radial-gradient(circle at 50% 50%, ${pal.glow}0.35) 0%, transparent 70%)`,
    animation: "celebGlow 600ms ease-out forwards"
  } }), phase !== "enter" && confetti.map(
    (p) => /* @__PURE__ */ React.createElement("div", { key: p.id, style: {
      position: "absolute",
      left: `${p.x}%`,
      top: "-20px",
      width: p.shape === "rect" ? p.size * 0.6 : p.size,
      height: p.size,
      borderRadius: p.shape === "circle" ? "50%" : 3,
      background: p.color,
      boxShadow: `0 0 6px ${p.color}99`,
      "--swing": `${p.swing}px`,
      animation: `confettiFall ${p.dur}s cubic-bezier(.25,.46,.45,.94) ${p.delay}s forwards`,
      transform: `rotate(${p.rotate}deg)`
    } })
  ), phase !== "enter" && /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    left: "50%",
    top: "38%",
    transform: "translateX(-50%)",
    fontFamily: "'Nura', system-ui, sans-serif",
    fontSize: 72,
    fontWeight: 900,
    color: "white",
    textShadow: `0 0 40px ${pal.primary}, 0 0 80px ${pal.glow}0.7), 0 4px 0 ${pal.deep}`,
    letterSpacing: "0.06em",
    animation: "bingoPop 600ms cubic-bezier(.34,1.7,.4,1) forwards",
    whiteSpace: "nowrap"
  } }, "BINGO!"), phase !== "enter" && lines.length > 1 && /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    left: "50%",
    top: "calc(38% + 88px)",
    transform: "translateX(-50%)",
    fontFamily: "'EliceDigitalBaeum', system-ui, sans-serif",
    fontSize: 18,
    fontWeight: 700,
    color: pal.soft,
    animation: "bingoPop 600ms cubic-bezier(.34,1.7,.4,1) 200ms forwards",
    opacity: 0,
    whiteSpace: "nowrap"
  } }, lines.length, "\uC904 \uC644\uC131!"), phase !== "enter" && [
    { l: "15%", t: "20%", s: 24 },
    { l: "80%", t: "15%", s: 18 },
    { l: "10%", t: "65%", s: 14 },
    { l: "88%", t: "60%", s: 20 },
    { l: "50%", t: "72%", s: 16 }
  ].map(
    (sp, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: {
      position: "absolute",
      left: sp.l,
      top: sp.t,
      width: sp.s,
      height: sp.s,
      color: pal.soft,
      animation: `starPop 800ms cubic-bezier(.34,1.7,.4,1) ${i * 120}ms forwards`,
      opacity: 0,
      fontSize: sp.s,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    } }, "\u2726")
  ));
}
function BingoLineFlash({ lines, role, cells, boardRef }) {
  const pal = ROLE[role];
  const [revealed, setRevealed] = useState([]);
  useEffect(() => {
    lines.forEach((line, li) => {
      line.cells.forEach((cell, ci) => {
        setTimeout(() => {
          setRevealed((prev) => [...prev, `${li}-${ci}`]);
        }, li * 200 + ci * 80);
      });
    });
  }, []);
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 6,
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 8
  } }, Array.from({ length: 25 }).map((_, i) => {
    const r = Math.floor(i / 5), c = i % 5;
    const lineIdx = lines.findIndex((l) => l.cells.some(([lr, lc]) => lr === r && lc === c));
    if (lineIdx === -1) return /* @__PURE__ */ React.createElement("div", { key: i });
    const cellIdx = lines[lineIdx].cells.findIndex(([lr, lc]) => lr === r && lc === c);
    const key = `${lineIdx}-${cellIdx}`;
    const isRevealed = revealed.includes(key);
    return /* @__PURE__ */ React.createElement("div", { key: i, style: {
      aspectRatio: "1/1",
      borderRadius: 18,
      background: isRevealed ? `linear-gradient(135deg, ${pal.glow}0.85), ${pal.glow}0.4))` : "transparent",
      boxShadow: isRevealed ? `0 0 20px ${pal.primary}, 0 0 40px ${pal.glow}0.5), inset 0 0 12px ${pal.glow}0.3)` : "none",
      border: isRevealed ? `2px solid ${pal.soft}` : "none",
      transition: "all 0ms",
      animation: isRevealed ? `lineCellPop 400ms cubic-bezier(.34,1.7,.4,1) forwards` : "none"
    } });
  }));
}
function TypeBadge({ type, confirmed, size = 24 }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Nura', system-ui, sans-serif",
    color: confirmed ? "white" : "rgba(30,15,45,0.75)",
    fontSize: size,
    fontWeight: 900,
    letterSpacing: "-0.02em",
    textShadow: confirmed ? "0 2px 4px rgba(0,0,0,0.5)" : "none",
    animation: confirmed ? "none" : "reservedBlink 1.1s ease-in-out infinite"
  } }, type);
}
function InitialBadge({ ch, size = 24 }) {
  const isKo = isHangul(ch);
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: initialFont(ch),
    color: "white",
    // Korean glyphs read smaller — bump them slightly so optical size matches Latin.
    fontSize: size * (isKo ? 1.08 : 1),
    fontWeight: isKo ? 800 : 900,
    letterSpacing: "-0.02em",
    textShadow: "0 2px 6px rgba(0,0,0,0.45)"
  } }, ch);
}
function LockIcon({ color = "rgba(255,255,255,0.85)", size = 26 }) {
  return /* @__PURE__ */ React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement(
    "path",
    {
      d: "M7.5 10.5V8a4.5 4.5 0 1 1 9 0v2.5",
      stroke: color,
      strokeWidth: "2.2",
      strokeLinecap: "round",
      fill: "none"
    }
  ), /* @__PURE__ */ React.createElement("rect", { x: "4.8", y: "10", width: "14.4", height: "11", rx: "3.2", fill: color }), /* @__PURE__ */ React.createElement("rect", { x: "6.2", y: "11.4", width: "11.6", height: "2.2", rx: "1.1", fill: "rgba(255,255,255,0.18)" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "15.4", r: "1.4", fill: "rgba(0,0,0,0.55)" }), /* @__PURE__ */ React.createElement("rect", { x: "11.3", y: "15.4", width: "1.4", height: "3", rx: "0.7", fill: "rgba(0,0,0,0.55)" }));
}
function SwordIcon({ color = "#FF0077", size = 22 }) {
  return /* @__PURE__ */ React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement(
    "path",
    {
      d: "M19 3 L21 5 L9 17 L7.5 16.5 L7 15 Z",
      fill: "white",
      stroke: color,
      strokeWidth: "0.8",
      strokeLinejoin: "round"
    }
  ), /* @__PURE__ */ React.createElement(
    "path",
    {
      d: "M5.5 14.5 L9.5 18.5",
      stroke: color,
      strokeWidth: "2.4",
      strokeLinecap: "round"
    }
  ), /* @__PURE__ */ React.createElement(
    "path",
    {
      d: "M3 21 L7 17 L8 18 L4 22 Z",
      fill: color,
      stroke: color,
      strokeWidth: "0.6",
      strokeLinejoin: "round"
    }
  ), /* @__PURE__ */ React.createElement("circle", { cx: "3", cy: "21", r: "1.2", fill: color }));
}
function MessageInput({ role, panel, lang }) {
  const pal = ROLE[role];
  const placeholder = lang === "en" ? "Type a message\u2026" : "\uBA54\uC2DC\uC9C0\uB97C \uC785\uB825\uD558\uC138\uC694...";
  const onChat = panel === 1;
  const hints = lang === "en" ? [
    { key: "input", text: "Tap to type a message", delay: 1200 },
    { key: "btn", text: onChat ? "Send message" : "Hold to voice message", delay: 3e3 }
  ] : [
    { key: "input", text: "\uD0ED\uD574\uC11C \uBA54\uC2DC\uC9C0\uB97C \uC785\uB825\uD558\uC138\uC694", delay: 1200 },
    { key: "btn", text: onChat ? "\uBA54\uC2DC\uC9C0 \uC804\uC1A1\uD558\uAE30" : "\uB204\uB974\uACE0 \uB9D0\uD574\uBCF4\uC138\uC694", delay: 3e3 }
  ];
  const [activeHint, setActiveHint] = React.useState(null);
  const shownRef = React.useRef(false);
  React.useEffect(() => {
    if (shownRef.current) return;
    shownRef.current = true;
    hints.forEach(({ key, text, delay }) => {
      setTimeout(() => {
        setActiveHint({ key, text });
        setTimeout(() => setActiveHint((h) => (h == null ? void 0 : h.key) === key ? null : h), 2200);
      }, delay);
    });
  }, []);
  const [draft, setDraft] = React.useState("");
  const send = () => {
    const v = draft.trim();
    if (!v) return;
    window.__tbChatId = (window.__tbChatId || 0) + 1;
    window.__tbChat = [...window.__tbChat || [], { id: "m" + window.__tbChatId, who: role, text: v }];
    window.dispatchEvent(new CustomEvent("tbchat"));
    setDraft("");
  };
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "5px 18px 5px", position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, position: "relative" } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      value: draft,
      onChange: (e) => setDraft(e.target.value),
      onKeyDown: (e) => {
        if (e.key === "Enter") send();
      },
      placeholder,
      style: {
        height: 42,
        width: "100%",
        boxSizing: "border-box",
        borderRadius: 22,
        background: "rgba(255,255,255,0.04)",
        border: `1.5px solid ${pal.glow}0.4)`,
        padding: "0 18px",
        outline: "none",
        fontSize: 13,
        color: "white",
        fontFamily: "inherit"
      }
    }
  ), (activeHint == null ? void 0 : activeHint.key) === "input" && /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    bottom: "calc(100% + 8px)",
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(20,8,36,0.95)",
    border: `1px solid ${pal.glow}0.45)`,
    borderRadius: 10,
    padding: "6px 12px",
    fontSize: 11,
    fontWeight: 700,
    color: pal.primary,
    whiteSpace: "nowrap",
    pointerEvents: "none",
    boxShadow: `0 4px 14px rgba(0,0,0,0.5), 0 0 12px ${pal.glow}0.3)`,
    animation: "hintPopCentered 320ms cubic-bezier(.34,1.56,.64,1) forwards"
  } }, activeHint.text, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    bottom: -4,
    left: "50%",
    transform: "translateX(-50%) rotate(45deg)",
    width: 8,
    height: 8,
    background: "rgba(20,8,36,0.95)",
    borderRight: `1px solid ${pal.glow}0.45)`,
    borderBottom: `1px solid ${pal.glow}0.45)`
  } }))), /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement("div", { onClick: send, style: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    cursor: "pointer",
    background: onChat ? pal.gradient : "rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: onChat ? `0 4px 12px ${pal.glow}0.4)` : "none",
    transition: "all 220ms cubic-bezier(.25,.46,.45,.94)"
  } }, onChat ? /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "white" }, /* @__PURE__ */ React.createElement("path", { d: "M3 11l18-8-8 18-2-8z" })) : /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none" }, /* @__PURE__ */ React.createElement("path", { d: "M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z M19 10v2a7 7 0 01-14 0v-2 M12 19v4 M8 23h8", stroke: "rgba(255,255,255,0.6)", strokeWidth: "2", strokeLinecap: "round" }))), (activeHint == null ? void 0 : activeHint.key) === "btn" && /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    bottom: "calc(100% + 8px)",
    right: 0,
    background: "rgba(20,8,36,0.95)",
    border: `1px solid ${pal.glow}0.45)`,
    borderRadius: 10,
    padding: "6px 12px",
    fontSize: 11,
    fontWeight: 700,
    color: pal.primary,
    whiteSpace: "nowrap",
    pointerEvents: "none",
    boxShadow: `0 4px 14px rgba(0,0,0,0.5), 0 0 12px ${pal.glow}0.3)`,
    animation: "hintPopCentered 320ms cubic-bezier(.34,1.56,.64,1) forwards"
  } }, activeHint.text, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    bottom: -4,
    right: 14,
    transform: "rotate(45deg)",
    width: 8,
    height: 8,
    background: "rgba(20,8,36,0.95)",
    borderRight: `1px solid ${pal.glow}0.45)`,
    borderBottom: `1px solid ${pal.glow}0.45)`
  } }))));
}
function BannerAd({ role, lang }) {
  return null;
  const pal = ROLE[role];
  return /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px 6px" } }, /* @__PURE__ */ React.createElement("div", { style: {
    height: 56,
    borderRadius: 12,
    background: "rgba(255,255,255,0.04)",
    border: "1px dashed rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 14px",
    fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
    fontSize: 10,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.45)",
    position: "relative",
    overflow: "hidden"
  } }, /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "absolute",
    inset: 0,
    backgroundImage: `repeating-linear-gradient(135deg, ${pal.glow}0.05) 0 6px, transparent 6px 14px)`,
    pointerEvents: "none"
  } }), /* @__PURE__ */ React.createElement("span", { style: { position: "relative" } }, "AD \xB7 320\xD750 banner slot"), /* @__PURE__ */ React.createElement("span", { style: {
    position: "relative",
    padding: "2px 6px",
    borderRadius: 4,
    background: "rgba(255,255,255,0.06)",
    fontSize: 9,
    color: "rgba(255,255,255,0.55)"
  } }, lang === "en" ? "AD" : "\uAD11\uACE0")));
}
function TypeLegend({ lang = "ko" }) {
  const labels = lang === "en" ? { t: "Truth", b: "This or That" } : { t: "\uC9C4\uC2E4", b: "\uBC38\uB7F0\uC2A4" };
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", gap: 10, marginBottom: 10 } }, /* @__PURE__ */ React.createElement(LegendChip, { letter: "T", label: labels.t }), /* @__PURE__ */ React.createElement(LegendChip, { letter: "B", label: labels.b }));
}
function LegendChip({ letter, label }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 10px 4px 4px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600,
    color: "rgba(255,255,255,0.85)"
  } }, /* @__PURE__ */ React.createElement("span", { style: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(220,210,230,0.8))",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Nura', system-ui, sans-serif",
    color: "rgba(30,15,45,0.85)",
    fontSize: 12,
    fontWeight: 900
  } }, letter), /* @__PURE__ */ React.createElement("span", null, label));
}
const TRUTH_QUESTIONS = window.__TB_TRUTH || {
  ko: [
    "\uCD5C\uADFC\uC5D0 \uC81C\uC77C \uBD80\uB044\uB7EC\uC6E0\uB358 \uC21C\uAC04\uC740?",
    "\uB9D0 \uBABB\uD55C \uBE44\uBC00 \uD558\uB098\uB9CC \uD480\uC5B4\uBD10",
    "\uCCAB\uC0AC\uB791 \uC774\uB984\uC758 \uCD08\uC131\uC740?",
    "\uC9C0\uAE08 \uAC00\uC7A5 \uD6C4\uD68C\uD558\uB294 \uC77C\uC740?",
    "\uAC00\uC7A5 \uCE5C\uD55C \uCE5C\uAD6C\uC758 \uB2E8\uC810 \uD55C \uAC00\uC9C0",
    "\uC624\uB298\uAE4C\uC9C0 \uAC70\uC9D3\uB9D0\uD55C \uD69F\uC218\uB294?",
    "\uBAB0\uB798 \uC88B\uC544\uD55C \uC0AC\uB78C\uC774 \uC788\uC5B4?",
    "\uAC00\uC871 \uC911 \uC81C\uC77C \uB2EE\uACE0 \uC2F6\uC740 \uC0AC\uB78C\uC740?"
  ],
  en: [
    "Most embarrassing moment recently?",
    "Share one secret you've never told",
    "Initials of your first crush?",
    "Biggest regret right now?",
    "One flaw of your best friend?",
    "How many lies have you told today?",
    "Anyone you secretly like?",
    "Family member you most want to be like?"
  ]
};
const BALANCE_QUESTIONS = window.__TB_BALANCE || {
  ko: [{ q: "\uB458 \uC911 \uD558\uB098\uB9CC!", a: "\uC2DC\uAC04 \uBA48\uCD94\uAE30", b: "\uC2DC\uAC04 \uB418\uB3CC\uB9AC\uAE30" }],
  en: [{ q: "Pick one!", a: "Pause time", b: "Rewind time" }]
};
const TRUTH_CHIPS = {
  ko: ["\uACE0\uB9C8\uC6CC", "\uC0AC\uB791\uD574", "\uBBF8\uC548\uD574", "\uBCF4\uACE0\uC2F6\uC5B4", "\uC608\uBED0", "\uBA4B\uC788\uC5B4", "\uCD5C\uACE0\uC57C"],
  en: ["Thanks", "Love you", "Sorry", "Miss you", "You're cute", "You rock", "My fave"]
};
const I18N = {
  ko: {
    truthLabel: "\uC9C4\uC2E4\uAC8C\uC784",
    balanceLabel: "\uBC38\uB7F0\uC2A4 \uD034\uC988",
    balancePrompt: "\uB458 \uC911\uC5D0 \uD558\uB098\uB9CC \uACE8\uB77C",
    stageMineAnswering: "\uB0B4 \uCC28\uB840 \xB7 \uB2F5\uBCC0 \uC911",
    stageMineWaiting: "\uC0C1\uB300\uBC29\uC774 \uACF5\uAC10\uD560 \uC218 \uC788\uAC8C \uC124\uB4DD\uD574\uBD10!",
    stageTheirsAnswering: (name) => `${name}\uB2D8\uC774 \uB2F5\uBCC0\uD558\uACE0 \uC788\uC5B4\uC694`,
    stageTheirsReviewingAsk: (type) => type === "T" ? "\uB2F9\uC2E0\uB3C4 \uAC19\uC740 \uC758\uACAC\uC778\uAC00\uC694?" : "\uB2F9\uC2E0\uB3C4 \uAC19\uC740 \uC120\uD0DD\uC778\uAC00\uC694?",
    stageTheirsReviewing: "\uC0C1\uB300\uBC29\uC758 \uC758\uACAC\uC744 \uB4E4\uC5B4\uBCF4\uC138\uC694",
    placeholder: "\uC194\uC9C1\uD558\uAC8C \uC785\uB825 (\uCD5C\uB300 20\uC790)",
    typingHint: "\uC0C1\uB300\uBC29\uC774 \uB2F5\uBCC0\uC744 \uC785\uB825\uD558\uACE0 \uC788\uC5B4\uC694\u2026",
    cancel: "\uCDE8\uC18C",
    undo: "\uB418\uB3CC\uB9AC\uAE30",
    submit: "\uC81C\uCD9C",
    pickFirst: "\uC635\uC158\uC744 \uACE8\uB77C\uC918",
    waitingPassive: "\uC7A0\uC2DC\uB9CC \uAE30\uB2E4\uB824\uC918",
    reject: "\uBE44\uACF5\uAC10",
    approve: "\uACF5\uAC10"
  },
  en: {
    truthLabel: "TRUTH",
    balanceLabel: "THIS or THAT",
    balancePrompt: "Pick one",
    stageMineAnswering: "Your turn \xB7 answering",
    stageMineWaiting: "Convince them to empathize!",
    stageTheirsAnswering: (name) => `${name} is answering\u2026`,
    stageTheirsReviewingAsk: (type) => type === "T" ? "Do you feel the same way?" : "Would you make the same choice?",
    stageTheirsReviewing: "Hear them out",
    placeholder: "Be honest (max 20 chars)",
    typingHint: "They're typing their answer\u2026",
    cancel: "Cancel",
    undo: "Reset",
    submit: "Submit",
    pickFirst: "Pick an option",
    waitingPassive: "Hold tight",
    reject: "Disagree",
    approve: "Empathize"
  }
};
function QuestionModal({ type, role, ownerRole, cellKey, onClose, onResolve, seed = 0, lang = "ko", footerHeight = 96, boardTop = 184, boardBottom = 96, boardLeft = 16, boardRight = 16 }) {
  const isTruth = type === "T";
  const isAnswerer = role === ownerRole;
  const ownerPal = ROLE[ownerRole];
  const myPal = ROLE[role];
  const pal = myPal;
  const t = I18N[lang] || I18N.ko;
  const truthList = TRUTH_QUESTIONS[lang] || TRUTH_QUESTIONS.ko;
  const balList = BALANCE_QUESTIONS[lang] || BALANCE_QUESTIONS.ko;
  const truthQ = truthList[seed % truthList.length];
  const balQ = balList[seed % balList.length];
  const truthChips = TRUTH_CHIPS[lang] || TRUTH_CHIPS.ko;
  const busKey = `__qm_${seed}_${type}`;
  const [step, setStep] = React.useState(() => {
    var _a;
    return ((_a = window[busKey]) == null ? void 0 : _a.step) || "answering";
  });
  const [answer, setAnswer] = React.useState(() => {
    var _a;
    return ((_a = window[busKey]) == null ? void 0 : _a.answer) || null;
  });
  const [text, setText] = React.useState("");
  const [starRating, setStarRating] = React.useState(0);
  const [starHover, setStarHover] = React.useState(0);
  React.useEffect(() => {
    const handler = () => {
      const b = window[busKey];
      if (!b) return;
      setStep(b.step);
      setAnswer(b.answer);
    };
    window.addEventListener(busKey, handler);
    return () => window.removeEventListener(busKey, handler);
  }, [busKey]);
  const broadcast = (next) => {
    window[busKey] = { ...window[busKey] || {}, ...next };
    window.dispatchEvent(new CustomEvent(busKey));
  };
  const submit = (val) => {
    broadcast({ step: "reviewing", answer: val });
  };
  const decide = (verdict) => {
    onResolve == null ? void 0 : onResolve({ verdict, answer, ownerRole, key: cellKey, questionType: type, seed });
    delete window[busKey];
  };
  let stageLabel, stageColor;
  if (isAnswerer && step === "answering") {
    stageLabel = t.stageMineAnswering;
    stageColor = pal.primary;
  } else if (isAnswerer && step === "reviewing") {
    stageLabel = t.stageMineWaiting;
    stageColor = pal.primary;
  } else if (!isAnswerer && step === "answering") {
    stageLabel = t.stageTheirsAnswering(ROLE[ownerRole].name);
    stageColor = pal.primary;
  } else if (!isAnswerer && step === "reviewing") {
    stageLabel = t.stageTheirsReviewing;
    stageColor = pal.primary;
  }
  const askLabel = !isAnswerer && step === "reviewing" ? t.stageTheirsReviewingAsk ? t.stageTheirsReviewingAsk(type) : null : null;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      onPointerDown: (e) => e.stopPropagation(),
      style: {
        // Backdrop covers the whole frame; card is anchored to the
        // bingo-board's bounding box so the size is identical regardless
        // of question type or step (truth vs balance, answering vs reviewing).
        position: "absolute",
        inset: 0,
        zIndex: 30,
        pointerEvents: "none",
        animation: "modalFade 220ms ease-out"
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      inset: 0,
      background: "rgba(6,1,15,0.62)",
      backdropFilter: "blur(4px)",
      pointerEvents: "auto"
    }, onPointerDown: (e) => e.stopPropagation() }),
    /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      top: "50%",
      left: 16,
      right: 16,
      transform: "translateY(-50%)",
      maxHeight: "calc(100% - 280px)",
      background: "linear-gradient(180deg, rgba(28,12,46,0.98) 0%, rgba(14,4,26,0.98) 100%)",
      borderRadius: 24,
      padding: "20px 18px 16px",
      border: `1.5px solid ${pal.glow}0.45)`,
      boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 60px ${pal.glow}0.3)`,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      animation: "modalRise 320ms cubic-bezier(.2,1.4,.4,1)",
      pointerEvents: "auto"
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      textAlign: "center",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: pal.primary,
      marginBottom: 14
    } }, isTruth ? t.truthLabel : t.balanceLabel), /* @__PURE__ */ React.createElement("div", { style: {
      textAlign: "center",
      fontSize: isTruth ? 21 : 20,
      fontWeight: 800,
      color: "white",
      lineHeight: 1.32,
      marginBottom: 8,
      textWrap: "balance",
      letterSpacing: "-0.01em"
    } }, isTruth ? truthQ : balQ.q), askLabel && /* @__PURE__ */ React.createElement("div", { style: {
      textAlign: "center",
      fontSize: 12,
      fontWeight: 700,
      marginBottom: 4,
      opacity: 1,
      color: pal.primary
    } }, askLabel), stageLabel && /* @__PURE__ */ React.createElement("div", { style: {
      textAlign: "center",
      fontSize: 12,
      fontWeight: 600,
      color: stageColor,
      marginBottom: 14,
      opacity: 0.95
    } }, stageLabel), !(step === "reviewing") && /* @__PURE__ */ React.createElement("div", { style: { height: 8 } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0 } }, isAnswerer && step === "answering" && (isTruth ? (
      // ── TRUTH answerer: white input + suggestion chips ──
      /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 14, display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" } }, /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "text",
          maxLength: 20,
          value: text,
          onChange: (e) => setText(e.target.value),
          placeholder: t.placeholder,
          style: {
            width: "100%",
            boxSizing: "border-box",
            padding: "14px 16px",
            borderRadius: 14,
            background: "white",
            color: "#1a0530",
            border: `2px solid ${pal.glow}0.55)`,
            fontSize: 15,
            fontWeight: 600,
            outline: "none",
            fontFamily: "inherit",
            textAlign: "center",
            boxShadow: `0 4px 14px ${pal.glow}0.35), inset 0 0 0 1px rgba(255,255,255,0.6)`
          }
        }
      ), /* @__PURE__ */ React.createElement("div", { style: {
        textAlign: "right",
        marginTop: 4,
        fontSize: 10,
        color: "rgba(255,255,255,0.45)",
        fontWeight: 600,
        letterSpacing: "0.04em"
      } }, text.length, "/20"), /* @__PURE__ */ React.createElement("div", { style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 5,
        marginTop: 10,
        justifyContent: "center"
      } }, truthChips.map(
        (chip) => /* @__PURE__ */ React.createElement(
          "button",
          {
            key: chip,
            onClick: () => setText(chip.slice(0, 20)),
            style: {
              padding: "5px 10px",
              borderRadius: 999,
              background: text === chip ? pal.gradient : "rgba(255,255,255,0.06)",
              border: text === chip ? `1px solid ${pal.glow}0.6)` : "1px solid rgba(255,255,255,0.14)",
              color: text === chip ? "white" : "rgba(255,255,255,0.78)",
              fontSize: 10.5,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
              transition: "all 160ms",
              boxShadow: text === chip ? `0 3px 10px ${pal.glow}0.4)` : "none"
            }
          },
          chip
        )
      )))
    ) : (
      // ── BALANCE answerer: huge left/right 5:5 split ──
      // Tap either side → instant submit. No keyboard, no extra button.
      /* @__PURE__ */ React.createElement("div", { style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8,
        marginBottom: 14,
        flex: 1,
        minHeight: 180
      } }, [balQ.a, balQ.b].map((opt, i) => {
        const sidePal = i === 0 ? ROLE.host : ROLE.guest;
        const letter = ["A", "B"][i];
        return /* @__PURE__ */ React.createElement(
          "button",
          {
            key: i,
            onClick: () => submit(opt),
            style: {
              position: "relative",
              padding: "20px 14px",
              borderRadius: 18,
              background: sidePal.gradient,
              border: `1.5px solid ${sidePal.glow}0.5)`,
              color: "white",
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              boxShadow: `0 8px 22px ${sidePal.glow}0.5), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -2px 8px rgba(0,0,0,0.18)`,
              transition: "transform 140ms ease, box-shadow 140ms ease"
            },
            onPointerDown: (e) => {
              e.currentTarget.style.transform = "scale(0.97)";
            },
            onPointerUp: (e) => {
              e.currentTarget.style.transform = "scale(1)";
            },
            onPointerLeave: (e) => {
              e.currentTarget.style.transform = "scale(1)";
            }
          },
          /* @__PURE__ */ React.createElement("span", { style: {
            fontSize: 15,
            fontWeight: 700,
            lineHeight: 1.3,
            textAlign: "center",
            textWrap: "balance",
            textShadow: "0 1px 2px rgba(0,0,0,0.25)"
          } }, opt)
        );
      }))
    )), step === "reviewing" && /* @__PURE__ */ React.createElement("div", { style: {
      flex: 1,
      padding: "20px 16px",
      borderRadius: 12,
      marginBottom: 14,
      // Answer card uses the ANSWERER's color (ownerPal), not viewer's.
      background: ownerPal.gradient,
      color: "white",
      textAlign: "center",
      fontSize: 17,
      fontWeight: 800,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textWrap: "balance",
      lineHeight: 1.35,
      boxShadow: `0 6px 18px ${ownerPal.glow}0.45), inset 0 1px 0 rgba(255,255,255,0.25)`
    } }, answer), !isAnswerer && step === "answering" && /* @__PURE__ */ React.createElement("div", { style: {
      flex: 1,
      padding: "20px 14px",
      borderRadius: 12,
      marginBottom: 14,
      background: "rgba(255,255,255,0.04)",
      border: "1px dashed rgba(255,255,255,0.16)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 14
    } }, isTruth && /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 12,
      fontWeight: 600,
      color: "rgba(255,255,255,0.7)",
      textAlign: "center",
      letterSpacing: "0.01em"
    } }, t.typingHint), /* @__PURE__ */ React.createElement(PersuasionBars, { palette: pal, size: "lg" }))), !(isAnswerer && step === "answering" && !isTruth) && /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      gap: 8,
      alignItems: "stretch",
      ...!isAnswerer && step === "reviewing" ? {
        background: "rgba(10,4,22,0.85)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        margin: "0 -18px -16px",
        padding: "12px 18px 16px",
        backdropFilter: "blur(8px)"
      } : {}
    } }, isAnswerer && step === "answering" && isTruth && /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setText(""),
        disabled: !text,
        "aria-label": t.undo,
        title: t.undo,
        style: {
          flex: "0 0 auto",
          width: 48,
          height: 48,
          padding: 0,
          borderRadius: 14,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.14)",
          color: text ? pal.primary : "rgba(255,255,255,0.3)",
          cursor: text ? "pointer" : "not-allowed",
          opacity: text ? 1 : 0.5,
          fontFamily: "inherit",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 160ms"
        }
      },
      /* @__PURE__ */ React.createElement("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M4 12a8 8 0 1 0 2.5-5.8" }), /* @__PURE__ */ React.createElement("polyline", { points: "4 4 4 9 9 9" }))
    ), isAnswerer && step === "answering" && isTruth && /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => submit(text.trim()),
        disabled: !text.trim(),
        style: {
          flex: 1,
          padding: "15px 18px",
          borderRadius: 14,
          background: text.trim() ? pal.gradient : "rgba(255,255,255,0.08)",
          border: "none",
          color: "white",
          fontSize: 14,
          fontWeight: 800,
          cursor: text.trim() ? "pointer" : "not-allowed",
          opacity: text.trim() ? 1 : 0.5,
          letterSpacing: "0.02em",
          boxShadow: text.trim() ? `0 8px 22px ${pal.glow}0.55), inset 0 1px 0 rgba(255,255,255,0.3)` : "none",
          fontFamily: "inherit",
          transition: "all 200ms"
        }
      },
      t.submit
    ), isAnswerer && step === "reviewing" && /* @__PURE__ */ React.createElement(React.Fragment, null, !isTruth && /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => broadcast({ step: "answering", answer: null }),
        "aria-label": t.undo,
        title: t.undo,
        style: {
          flex: "0 0 auto",
          width: 48,
          height: 48,
          padding: 0,
          borderRadius: 12,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.14)",
          color: pal.primary,
          cursor: "pointer",
          fontFamily: "inherit",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }
      },
      /* @__PURE__ */ React.createElement("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M4 12a8 8 0 1 0 2.5-5.8" }), /* @__PURE__ */ React.createElement("polyline", { points: "4 4 4 9 9 9" }))
    ), /* @__PURE__ */ React.createElement("div", { style: {
      flex: 1,
      padding: "14px 18px",
      borderRadius: 12,
      textAlign: "center",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.1)",
      color: "rgba(255,255,255,0.55)",
      fontSize: 12,
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    } }, t.waitingPassive)), !isAnswerer && step === "reviewing" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { onClick: () => decide("reject"), style: {
      flex: 1,
      padding: "12px 14px",
      borderRadius: 12,
      background: "rgba(255,80,90,0.12)",
      border: "1.5px solid rgba(255,80,90,0.5)",
      color: "#FF8A92",
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer",
      fontFamily: "inherit",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6
    } }, /* @__PURE__ */ React.createElement("span", null, t.reject), /* @__PURE__ */ React.createElement("span", { style: {
      fontSize: 10,
      padding: "2px 6px",
      borderRadius: 999,
      background: "rgba(255,80,90,0.25)",
      fontWeight: 800
    } }, "GP \u22121")), /* @__PURE__ */ React.createElement("button", { onClick: () => decide("approve"), style: {
      flex: 1,
      padding: "14px 14px",
      borderRadius: 12,
      background: pal.gradient,
      border: "none",
      color: "white",
      fontSize: 14,
      fontWeight: 800,
      cursor: "pointer",
      fontFamily: "inherit",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      boxShadow: `0 8px 24px ${pal.glow}0.65), inset 0 1px 0 rgba(255,255,255,0.35)`
    } }, /* @__PURE__ */ React.createElement("span", null, t.approve)))), isAnswerer && step === "answering" && /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginTop: 8,
      paddingTop: 10,
      borderTop: "1px solid rgba(255,255,255,0.07)"
    } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" } }, lang === "en" ? "Rate this question" : "\uC9C8\uBB38 \uD3C9\uAC00"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 3 } }, [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ React.createElement(
      "span",
      {
        key: n,
        onMouseEnter: () => setStarHover(n),
        onMouseLeave: () => setStarHover(0),
        onClick: () => setStarRating(n),
        style: {
          fontSize: 18,
          cursor: "pointer",
          opacity: (starHover || starRating) >= n ? 1 : 0.25,
          color: (starHover || starRating) >= n ? "#FFCC44" : "white",
          filter: (starHover || starRating) >= n ? "drop-shadow(0 0 4px rgba(255,204,68,0.6))" : "none",
          transition: "all 120ms"
        }
      },
      "\u2605"
    )))))
  );
}
function useBoardState(externalState) {
  const local = useState({});
  const [cells, setCells] = externalState || local;
  const [reservedKey, setReservedKey] = useState(null);
  const [attackPendingKey, setAttackPendingKey] = useState(null);
  const tap = (key, role, currentTurn) => {
    var _a;
    const current = cells[key];
    const stateNow = (current == null ? void 0 : current.state) || "none";
    if (current && current.role === role && (stateNow === "confirmed" || stateNow === "won")) {
      return { action: null };
    }
    if (stateNow === "locked" && current.role === role) {
      const turnsLeft = (_a = current.lockedTurnsLeft) != null ? _a : 0;
      if (turnsLeft > 0) {
        return { action: null, refused: "still_locked", turnsLeft };
      }
      return { action: "minigame", kind: "unlock", cell: current };
    }
    if (stateNow === "locked" && current.role !== role) {
      return { action: null, refused: "opponent_locked", ownerRole: current.role };
    }
    if (stateNow === "won" && current.role !== role) {
      setCells((c) => {
        const next = { ...c };
        Object.keys(next).forEach((k) => {
          if (next[k].state === "attack_pending" && next[k].attackerRole === role) {
            next[k] = { state: "won", role: next[k].role, ownerInitial: next[k].ownerInitial, type: next[k].type };
          }
        });
        next[key] = { ...current, state: "attack_pending", attackerRole: role };
        return next;
      });
      setAttackPendingKey(key);
      return { action: "attack_intent" };
    }
    if (stateNow === "attack_pending" && current.attackerRole === role) {
      return { action: "minigame", kind: "attack", cell: current };
    }
    if (current && stateNow === "confirmed" && current.role !== role) return { action: null };
    if (stateNow === "reserved" && current.role === role) {
      setCells((c) => {
        var _a2;
        return { ...c, [key]: { state: "confirmed", role, type: (_a2 = c[key]) == null ? void 0 : _a2.type } };
      });
      setReservedKey(null);
      return { action: "confirm" };
    }
    if (stateNow === "reserved" && current.role !== role) return { action: null };
    if (currentTurn && currentTurn !== role) {
      return { action: null, refused: "not_your_turn", turnRole: currentTurn };
    }
    setCells((c) => {
      const next = { ...c };
      Object.keys(next).forEach((k) => {
        if (next[k].state === "reserved" && next[k].role === role) delete next[k];
      });
      next[key] = { state: "reserved", role };
      return next;
    });
    setReservedKey(key);
    return { action: "reserve" };
  };
  const tickLocks = (next, exceptKey) => {
    Object.keys(next).forEach((k) => {
      var _a;
      if (k === exceptKey) return;
      const cell = next[k];
      if ((cell == null ? void 0 : cell.state) === "locked" && ((_a = cell.lockedTurnsLeft) != null ? _a : 0) > 0) {
        const nextLeft = cell.lockedTurnsLeft - 1;
        next[k] = {
          ...cell,
          lockedTurnsLeft: nextLeft,
          // Mark the moment of transition so the UI can show a one-shot toast.
          // Cleared by the cell renderer after the toast animation finishes.
          justUnlocked: nextLeft === 0 ? Date.now() : cell.justUnlocked
        };
      }
    });
  };
  const resolveQuestion = (key, ownerRole, verdict, ownerInitial) => {
    setCells((c) => {
      const next = { ...c };
      const cur = next[key] || {};
      if (verdict === "approve") {
        next[key] = {
          ...cur,
          state: "won",
          role: ownerRole,
          ownerInitial: ownerInitial || ROLE[ownerRole].initial
        };
      } else {
        next[key] = {
          ...cur,
          state: "locked",
          role: ownerRole,
          ownerInitial: ownerInitial || ROLE[ownerRole].initial,
          lockedTurnsLeft: 3
        };
      }
      tickLocks(next, key);
      return next;
    });
    setReservedKey(null);
  };
  const resolveMinigame = (key, winnerRole, winnerInitial) => {
    setCells((c) => {
      const next = {
        ...c,
        [key]: {
          state: "won",
          role: winnerRole,
          ownerInitial: winnerInitial || ROLE[winnerRole].initial
        }
      };
      tickLocks(next, key);
      return next;
    });
    setAttackPendingKey(null);
  };
  const cancelAttackIntent = (role) => {
    setCells((c) => {
      const next = { ...c };
      Object.keys(next).forEach((k) => {
        if (next[k].state === "attack_pending" && next[k].attackerRole === role) {
          next[k] = { state: "won", role: next[k].role, ownerInitial: next[k].ownerInitial, type: next[k].type };
        }
      });
      return next;
    });
    setAttackPendingKey(null);
  };
  const cellAt = (k) => cells[k] || { state: "none", role: null };
  const hasAttackPending = Object.values(cells).some((v) => v.state === "attack_pending");
  const phase = hasAttackPending ? "attack_pending" : reservedKey ? "reserved" : Object.values(cells).some((v) => v.state === "confirmed") ? "confirmed" : "idle";
  return { cellAt, tap, phase, resolveQuestion, resolveMinigame, cancelAttackIntent, cells };
}
function JellyCell({ row, col, cell, type, role, onTap, pressDepth, speed, currentTurn, transient, gameOver = false }) {
  const [pressing, setPressing] = useState(false);
  const [released, setReleased] = useState(false);
  const ref = useRef(null);
  const breathe = (row * 5 + col) * 0.13;
  const ownerRole = cell.role || role;
  const pal = ROLE[ownerRole];
  const myPal = ROLE[role];
  const attackerPal = cell.attackerRole ? ROLE[cell.attackerRole] : null;
  const state = cell.state || "none";
  const handleTap = () => {
    var _a, _b, _c;
    const rect = (_a = ref.current) == null ? void 0 : _a.getBoundingClientRect();
    const boardRect = (_c = (_b = ref.current) == null ? void 0 : _b.closest(".jelly-board")) == null ? void 0 : _c.getBoundingClientRect();
    if (rect && boardRect) onTap(row, col, rect.left - boardRect.left + rect.width / 2, rect.top - boardRect.top + rect.height / 2);
    setReleased(true);
    setTimeout(() => setReleased(false), 700);
  };
  const isNone = state === "none";
  const isReserved = state === "reserved";
  const isConfirmed = state === "confirmed";
  const isWon = state === "won";
  const isLocked = state === "locked";
  const isAttackPending = state === "attack_pending";
  const isOwned = isConfirmed || isWon || isAttackPending;
  const faceBg = isOwned ? pal.gradient : isReserved ? pal.gradientReserved : isLocked ? "linear-gradient(180deg, #2A1F35 0%, #150A22 100%)" : "linear-gradient(160deg, #FFFFFF 0%, #EDE5EE 100%)";
  const faceShadow = isOwned ? `0 6px 0 ${pal.glow}0.8), 0 14px 22px ${pal.glow}0.5), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -4px 8px ${pal.glow}0.3)` : isReserved ? `0 8px 0 ${pal.glow}0.7), 0 18px 26px ${pal.glow}0.55), inset 0 2px 0 rgba(255,255,255,0.8)` : isLocked ? "0 4px 0 rgba(0,0,0,0.5), 0 10px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -2px 6px rgba(0,0,0,0.4)" : `0 ${pressDepth * 0.55}px 0 rgba(30,15,45,0.6), 0 ${pressDepth + 4}px 20px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.9)`;
  const faceBorder = isReserved ? `1.5px solid ${pal.primary}` : isLocked ? "1.5px solid rgba(255,255,255,0.12)" : isOwned ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(255,255,255,0.5)";
  const outerAnim = isNone ? `jellyBreathe 2.4s ease-in-out ${-breathe}s infinite` : isReserved ? `jellyShimmer 1s ease-in-out infinite` : "none";
  const isInteractive = !gameOver && !(isConfirmed && cell.role === role);
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      ref,
      onPointerDown: () => setPressing(true),
      onPointerUp: () => {
        setPressing(false);
        handleTap();
      },
      onPointerLeave: () => setPressing(false),
      style: {
        position: "relative",
        border: 0,
        padding: 0,
        background: "transparent",
        width: "100%",
        aspectRatio: "1/1",
        cursor: isInteractive ? "pointer" : "default",
        outline: "none",
        zIndex: pressing ? 10 : transient ? 9 : isReserved && cell.role === role ? 8 : isAttackPending ? 7 : isConfirmed ? 4 : 1,
        animation: outerAnim,
        transform: pressing ? `translateY(${pressDepth}px) scale(1.08, 0.76)` : released ? void 0 : "translateY(0) scale(1,1)",
        transition: pressing ? `transform ${90 / (speed / 100)}ms cubic-bezier(.4,0,.2,1)` : `transform ${600 / (speed / 100)}ms cubic-bezier(.18,1.6,.3,1)`,
        animationName: released ? "jellyBounce" : void 0,
        animationDuration: released ? `${700 / (speed / 100)}ms` : void 0
      }
    },
    isReserved && /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      inset: -4,
      borderRadius: 22,
      border: `2px dashed ${pal.primary}`,
      animation: "dashSpin 8s linear infinite, pulseGlow 1.2s ease-in-out infinite",
      pointerEvents: "none"
    } }),
    /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      inset: 0,
      borderRadius: 18,
      background: faceBg,
      boxShadow: faceShadow,
      border: faceBorder,
      overflow: "hidden",
      transition: "all 200ms cubic-bezier(.25,.46,.45,.94)"
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      left: "12%",
      right: "12%",
      top: "8%",
      height: "30%",
      borderRadius: "50%",
      background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0))",
      opacity: isLocked ? 0.18 : isOwned ? 0.4 : 0.7,
      pointerEvents: "none"
    } }), (isReserved || isConfirmed) && /* @__PURE__ */ React.createElement(TypeBadge, { type, confirmed: isConfirmed }), (isWon || isAttackPending) && /* @__PURE__ */ React.createElement(InitialBadge, { ch: cell.ownerInitial || pal.initial, size: 26 }), isWon && /* @__PURE__ */ React.createElement("span", { style: {
      position: "absolute",
      top: "12%",
      right: "14%",
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: "radial-gradient(circle, #FFF 0%, transparent 65%)",
      animation: "wonSparkle 4s ease-in-out infinite",
      pointerEvents: "none"
    } }), isLocked && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: "lockBreathe 2.4s ease-in-out infinite"
    } }, /* @__PURE__ */ React.createElement(LockIcon, { size: 26, color: "rgba(255,255,255,0.78)" })), /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 6,
      display: "flex",
      justifyContent: "center",
      gap: 4
    } }, [0, 1, 2].map(
      (i) => {
        var _a;
        return /* @__PURE__ */ React.createElement("span", { key: i, style: {
          width: 4,
          height: 4,
          borderRadius: "50%",
          background: i < ((_a = cell.lockedTurnsLeft) != null ? _a : 3) ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.18)"
        } });
      }
    )), /* @__PURE__ */ React.createElement(
      "svg",
      {
        width: "100%",
        height: "100%",
        viewBox: "0 0 88 88",
        style: {
          position: "absolute",
          inset: 0,
          opacity: 0.18,
          animation: "crackPulse 3s ease-in-out infinite"
        }
      },
      /* @__PURE__ */ React.createElement(
        "path",
        {
          d: "M22 14 L34 32 L28 44 L42 56 L36 74",
          stroke: "white",
          strokeWidth: "0.8",
          fill: "none",
          strokeLinecap: "round"
        }
      ),
      /* @__PURE__ */ React.createElement(
        "path",
        {
          d: "M64 18 L52 30 L60 44 L48 60",
          stroke: "white",
          strokeWidth: "0.8",
          fill: "none",
          strokeLinecap: "round"
        }
      )
    )), isAttackPending && attackerPal && /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      inset: 0,
      borderRadius: 18,
      boxShadow: `inset 0 0 0 2px ${attackerPal.primary}, inset 0 0 24px ${attackerPal.glow}0.55)`,
      pointerEvents: "none",
      animation: "attackVignette 1s ease-in-out infinite"
    } })),
    isAttackPending && attackerPal && /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      top: -6,
      right: -6,
      width: 32,
      height: 32,
      background: `radial-gradient(circle, ${attackerPal.glow}0.6) 0%, transparent 65%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: "swordGlow 1s ease-in-out infinite",
      pointerEvents: "none"
    } }, /* @__PURE__ */ React.createElement("div", { style: { animation: "swordShake 0.6s ease-in-out infinite alternate" } }, /* @__PURE__ */ React.createElement(SwordIcon, { size: 22, color: attackerPal.primary }))),
    isAttackPending && attackerPal && cell.attackerRole === role && /* @__PURE__ */ React.createElement(HintBubble, { flip: row === 0, col, variant: "attack", text: "\uD55C \uBC88 \uB354 \uD130\uCE58\uD558\uBA74 \uACF5\uACA9\uD569\uB2C8\uB2E4" }),
    isReserved && cell.role === role && /* @__PURE__ */ React.createElement(HintBubble, { flip: row === 0, col, roleColor: myPal, text: "\uD55C \uBC88 \uB354 \uD130\uCE58\uD558\uBA74 \uD655\uC815\uB3FC\uC694" }),
    isConfirmed && cell.role === role && /* @__PURE__ */ React.createElement(HintBubble, { flip: row === 0, col, variant: "confirmed", text: "\uBE59\uACE0\uCE78\uC774 \uD655\uC815\uB410\uC5B4\uC694" }),
    transient && /* @__PURE__ */ React.createElement(
      HintBubble,
      {
        key: transient.id,
        flip: row === 0,
        col,
        variant: transient.variant,
        roleColor: transient.roleColor,
        text: transient.text,
        duration: transient.duration,
        transient: true
      }
    )
  );
}
const BUBBLE_VARIANTS = {
  attack: {
    bg: "linear-gradient(135deg, rgba(220,40,55,0.98), rgba(150,20,30,0.98))",
    border: "rgba(255,120,130,0.55)",
    shadow: "0 8px 22px rgba(180,30,40,0.55), 0 2px 0 rgba(120,15,25,0.6), inset 0 1px 0 rgba(255,255,255,0.18)",
    pulse: true
  },
  confirmed: {
    bg: "linear-gradient(135deg, rgba(34,197,94,0.95), rgba(22,163,74,0.98))",
    border: "rgba(110,240,160,0.55)",
    shadow: "0 8px 22px rgba(22,163,74,0.5), 0 2px 0 rgba(15,120,55,0.55), inset 0 1px 0 rgba(255,255,255,0.18)",
    pulse: false
  },
  won: {
    bg: "linear-gradient(135deg, rgba(255,200,80,0.98), rgba(245,160,40,0.98))",
    border: "rgba(255,230,140,0.6)",
    shadow: "0 8px 24px rgba(245,160,40,0.55), 0 2px 0 rgba(180,110,20,0.55), inset 0 1px 0 rgba(255,255,255,0.3)",
    pulse: false
  },
  locked: {
    bg: "linear-gradient(135deg, rgba(50,40,65,0.98), rgba(28,20,42,0.98))",
    border: "rgba(255,255,255,0.18)",
    shadow: "0 8px 20px rgba(0,0,0,0.55), 0 2px 0 rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
    pulse: false
  },
  opponent: {
    bg: "linear-gradient(135deg, rgba(40,30,55,0.96), rgba(22,16,35,0.98))",
    border: "rgba(255,255,255,0.2)",
    shadow: "0 8px 20px rgba(0,0,0,0.5), 0 2px 0 rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.1)",
    pulse: false
  },
  turn: {
    bg: "linear-gradient(135deg, rgba(40,30,55,0.96), rgba(22,16,35,0.98))",
    border: "rgba(255,255,255,0.2)",
    shadow: "0 8px 20px rgba(0,0,0,0.5), 0 2px 0 rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.1)",
    pulse: false
  }
};
function HintBubble({ flip, variant, text, roleColor, transient = false, col = 2, duration = 2e3 }) {
  const positionStyle = flip ? { top: "calc(100% + 10px)" } : { bottom: "calc(100% + 10px)" };
  let v = variant ? BUBBLE_VARIANTS[variant] : null;
  if (!v && roleColor) {
    v = {
      bg: roleColor.gradient,
      border: "rgba(255,255,255,0.3)",
      shadow: `0 8px 22px ${roleColor.glow}0.55), 0 2px 0 ${roleColor.glow}0.6), inset 0 1px 0 rgba(255,255,255,0.22)`,
      pulse: false
    };
  }
  if (!v) v = BUBBLE_VARIANTS.attack;
  let anchor;
  let tailStyle;
  if (col <= 0) {
    anchor = { left: -4, transform: "none" };
    tailStyle = { left: 28, transform: "rotate(45deg)" };
  } else if (col >= 4) {
    anchor = { right: -4, transform: "none" };
    tailStyle = { right: 28, transform: "rotate(45deg)" };
  } else {
    anchor = { left: "50%", transform: "translateX(-50%)" };
    tailStyle = { left: "50%", transform: "translateX(-50%) rotate(45deg)" };
  }
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    ...anchor,
    ...positionStyle,
    pointerEvents: "none",
    zIndex: 50
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    animation: transient ? `hintToastInOutCentered ${duration}ms ease-out forwards` : "hintPopCentered 320ms cubic-bezier(.34,1.56,.64,1) backwards"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    padding: "8px 14px 8px 10px",
    background: v.bg,
    borderRadius: 999,
    border: `1px solid ${v.border}`,
    boxShadow: v.shadow,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    whiteSpace: "nowrap",
    animation: v.pulse ? "attackBannerPulse 1s ease-in-out infinite" : "none"
  } }, /* @__PURE__ */ React.createElement("span", { style: {
    width: 16,
    height: 16,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.18)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    flexShrink: 0
  } }, /* @__PURE__ */ React.createElement("span", { style: {
    position: "absolute",
    inset: -2,
    borderRadius: "50%",
    border: "1.2px solid rgba(255,255,255,0.6)",
    animation: "captionPulse 1.6s ease-out infinite"
  } }), /* @__PURE__ */ React.createElement("svg", { width: "8", height: "8", viewBox: "0 0 24 24", fill: "white" }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "5" }))), /* @__PURE__ */ React.createElement("span", { style: {
    fontSize: 11.5,
    fontWeight: 700,
    color: "white",
    letterSpacing: "-0.005em"
  } }, text), /* @__PURE__ */ React.createElement("span", { style: {
    position: "absolute",
    ...tailStyle,
    ...flip ? { top: -5 } : { bottom: -5 },
    width: 10,
    height: 10,
    background: v.bg,
    ...flip ? { borderLeft: `1px solid ${v.border}`, borderTop: `1px solid ${v.border}` } : { borderRight: `1px solid ${v.border}`, borderBottom: `1px solid ${v.border}` }
  } }))));
}
function VariantJelly({ tweaks, setTweak, role, sharedCells, sharedModal, onResolveModal, lang, setLang, onExit, sharedTurn, sharedAttacks, sharedMinigame, sharedHistory, onMinigameWin, sharedRound, scores, bingoLines }) {
  var _a;
  const board = useBoardState(sharedCells);
  const [cells] = sharedCells || [{}];
  const [bursts, setBursts] = useState([]);
  const [modal, setModal] = sharedModal;
  const [currentTurn, setCurrentTurn] = sharedTurn || [role, () => {
  }];
  const [attacksLeft, setAttacksLeft] = sharedAttacks || [{ host: 2, guest: 2 }, () => {
  }];
  const [minigame, setMinigame] = sharedMinigame || [null, () => {
  }];
  const pal = ROLE[role];
  const [celebration, setCelebration] = useState(null);
  const prevBingoLines = useRef((_a = bingoLines == null ? void 0 : bingoLines[role]) != null ? _a : 0);
  useEffect(() => {
    var _a2;
    const current = (_a2 = bingoLines == null ? void 0 : bingoLines[role]) != null ? _a2 : 0;
    const prev = prevBingoLines.current;
    if (current > prev) {
      const completedLines = getBingoLines(cells, role);
      setCelebration({ lines: completedLines });
    }
    prevBingoLines.current = current;
  }, [bingoLines == null ? void 0 : bingoLines[role]]);
  const [transients, setTransients] = useState({});
  const showToast = React.useCallback((key, payload) => {
    var _a2;
    const id = Math.random();
    const duration = (_a2 = payload.duration) != null ? _a2 : 2e3;
    setTransients((prev) => ({ ...prev, [key]: { id, ...payload, duration } }));
    setTimeout(() => {
      setTransients((prev) => {
        var _a3;
        if (((_a3 = prev[key]) == null ? void 0 : _a3.id) !== id) return prev;
        const { [key]: _drop, ...rest } = prev;
        return rest;
      });
    }, duration - 100);
  }, []);
  const prevCellsRef = useRef({});
  React.useEffect(() => {
    const prev = prevCellsRef.current;
    const curr = board.cells || {};
    Object.entries(curr).forEach(([k, v]) => {
      var _a2;
      const before = prev[k];
      if (v.state === "won" && v.role === role && (before == null ? void 0 : before.state) !== "won") {
        showToast(k, { variant: "won", text: "GP +1" });
      }
      if (v.state === "locked" && v.role === role && ((_a2 = v.lockedTurnsLeft) != null ? _a2 : 0) === 0 && v.justUnlocked && v.justUnlocked !== (before == null ? void 0 : before.justUnlocked)) {
        showToast(k, { roleColor: ROLE[role], text: "\uC7A0\uAE40\uD574\uC81C \uAC00\uB2A5", duration: 3600 });
      }
    });
    prevCellsRef.current = curr;
  }, [board.cells, role, showToast]);
  React.useEffect(() => {
    const getDelay = () => 15e3 + Math.random() * 1e4;
    let timer;
    const fire = () => {
      var _a2;
      if (((_a2 = sharedRound == null ? void 0 : sharedRound[0]) == null ? void 0 : _a2.phase) !== "playing") {
        timer = setTimeout(fire, getDelay());
        return;
      }
      const opponentRole = role === "host" ? "guest" : "host";
      const currentCells = (sharedCells == null ? void 0 : sharedCells[0]) || {};
      const targets = Object.keys(currentCells).filter((k) => {
        const c = currentCells[k];
        return c.state === "won" && c.role === opponentRole;
      });
      if (targets.length > 0) {
        const key = targets[Math.floor(Math.random() * targets.length)];
        const tipText = lang === "en" ? "Steal this cell!" : "\uC140 \uBE7C\uC557\uAE30 \uD558\uC138\uC694!";
        showToast(key, { roleColor: ROLE[role], text: tipText, duration: 2800 });
      }
      timer = setTimeout(fire, getDelay());
    };
    timer = setTimeout(fire, getDelay());
    return () => clearTimeout(timer);
  }, [role, lang]);
  const onTap = (r, c, x, y) => {
    var _a2, _b;
    if (((_a2 = sharedRound == null ? void 0 : sharedRound[0]) == null ? void 0 : _a2.phase) === "gameOver") return;
    const key = `${r},${c}`;
    const result = board.tap(key, role, currentTurn);
    const { action, kind, cell, refused } = result;
    if (refused) {
      if (refused === "not_your_turn") {
        const turnPal = ROLE[result.turnRole];
        showToast(key, {
          variant: "turn",
          text: `${turnPal.name}\uB2D8\uC758 \uCC28\uB840\uC785\uB2C8\uB2E4`
        });
      } else if (refused === "opponent_locked") {
        const ownerPal = ROLE[result.ownerRole];
        showToast(key, {
          variant: "opponent",
          text: `${ownerPal.name}\uB2D8\uC774 \uC120\uD0DD\uD558\uC154\uC57C \uD569\uB2C8\uB2E4`
        });
      } else if (refused === "still_locked") {
        showToast(key, {
          variant: "locked",
          text: `${result.turnsLeft}\uD134 \uD6C4 \uC7A0\uAE40\uD574\uC81C`
        });
      }
      return;
    }
    if (!action) return;
    if (tweaks.particlesOn) {
      const id = Math.random();
      const burstColor = action === "attack_intent" ? "#FF505A" : pal.primary;
      setBursts((b) => [...b, { id, x, y, color: burstColor, big: action === "confirm" || action === "minigame" }]);
      setTimeout(() => setBursts((b) => b.filter((x2) => x2.id !== id)), 900);
    }
    if (action === "confirm") {
      const type = questionType(r, c);
      setModal({ type, seed: r * 5 + c, ownerRole: role, key: `${r},${c}` });
    }
    if (action === "minigame") {
      if (kind === "attack") {
        setAttacksLeft((prev) => {
          var _a3;
          return { ...prev, [role]: Math.max(0, ((_a3 = prev[role]) != null ? _a3 : 2) - 1) };
        });
      }
      const challengerRole = kind === "attack" ? role : cell.role;
      const defenderRole = challengerRole === "host" ? "guest" : "host";
      const gameKinds = ["arrow", "soccer", "balloon"];
      const gameKind = gameKinds[Math.floor(Math.random() * gameKinds.length)];
      const newMg = {
        key: `${r},${c}`,
        kind,
        ownerRole: cell.role,
        attackerRole: role,
        phase: "p1_confirm",
        gameKind,
        p1Role: challengerRole,
        p2Role: defenderRole,
        p1Score: null,
        p2Score: null,
        winner: null,
        // increment global play count; show ad every 3rd game
        playCount: (((_b = sharedMinigame[0]) == null ? void 0 : _b.playCount) || 0) + 1
      };
      newMg.showAd = newMg.playCount % 3 === 0;
      setMinigame(newMg);
      sharedMinigame[1](newMg);
    }
  };
  React.useEffect(() => {
    window.__bingoBoard_resolveQuestion = board.resolveQuestion;
    window.__bingoBoard_resolveMinigame = board.resolveMinigame;
  }, [board.resolveQuestion, board.resolveMinigame]);
  return /* @__PURE__ */ React.createElement(
    SwipeFrame,
    {
      title: "A. Jelly Squish",
      tweaks,
      setTweak,
      bursts,
      phase: board.phase,
      role,
      modal,
      lang,
      setLang,
      onExit,
      onResolveModal,
      onCloseModal: () => setModal(null),
      currentTurn,
      attacksLeft: attacksLeft == null ? void 0 : attacksLeft[role],
      scores: scores == null ? void 0 : scores[role],
      bingoLines: bingoLines == null ? void 0 : bingoLines[role],
      allScores: scores,
      minigame,
      setMinigame,
      resolveMinigame: board.resolveMinigame,
      sharedMinigame,
      onMinigameWin,
      sharedRound,
      history: sharedHistory ? sharedHistory[0] : [],
      celebration,
      onCelebrationDone: () => setCelebration(null)
    },
    /* @__PURE__ */ React.createElement("div", { className: "jelly-board", style: {
      padding: 14,
      borderRadius: 28,
      background: "rgba(255,255,255,0.03)",
      border: "1.5px solid rgba(255,255,255,0.12)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
      overflow: "visible",
      position: "relative"
    } }, celebration && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, borderRadius: 28, overflow: "hidden", zIndex: 8, pointerEvents: "none" } }, /* @__PURE__ */ React.createElement(BingoLineFlash, { lines: celebration.lines, role })), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, overflow: "visible" } }, Array.from({ length: 25 }).map((_, i) => {
      var _a2;
      const r = Math.floor(i / 5), c = i % 5;
      const k = `${r},${c}`;
      return /* @__PURE__ */ React.createElement(
        JellyCell,
        {
          key: i,
          row: r,
          col: c,
          cell: board.cellAt(k),
          type: questionType(r, c),
          role,
          currentTurn,
          transient: transients[k],
          gameOver: ((_a2 = sharedRound == null ? void 0 : sharedRound[0]) == null ? void 0 : _a2.phase) === "gameOver",
          onTap,
          pressDepth: tweaks.pressDepth,
          speed: tweaks.speed
        }
      );
    }))),
    /* @__PURE__ */ React.createElement("div", { style: { marginTop: 14 } }, /* @__PURE__ */ React.createElement(TypeLegend, { lang }))
  );
}
function FloatCell({ row, col, cell, type, role, onTap, pressDepth, speed }) {
  const [pressing, setPressing] = useState(false);
  const ref = useRef(null);
  const floatDelay = (row + col) * 0.2 % 1.4;
  const floatDur = 2.8 + (row * 3 + col) % 4 * 0.2;
  const ownerRole = cell.role || role;
  const pal = ROLE[ownerRole];
  const state = cell.state;
  const handleTap = () => {
    var _a, _b, _c;
    const rect = (_a = ref.current) == null ? void 0 : _a.getBoundingClientRect();
    const boardRect = (_c = (_b = ref.current) == null ? void 0 : _b.closest(".float-board")) == null ? void 0 : _c.getBoundingClientRect();
    if (rect && boardRect) onTap(row, col, rect.left - boardRect.left + rect.width / 2, rect.top - boardRect.top + rect.height / 2);
  };
  const isEligible = state === "eligible", isReserved = state === "reserved", isConfirmed = state === "confirmed";
  const bg = isConfirmed ? `radial-gradient(circle at 30% 25%, ${pal.soft} 0%, ${pal.primary} 40%, ${pal.primaryDark} 100%)` : isReserved ? pal.gradientReserved : "radial-gradient(circle at 30% 25%, #FFFFFF 0%, #F5F0F7 45%, #D9CCE0 100%)";
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      ref,
      onPointerDown: () => setPressing(true),
      onPointerUp: () => {
        setPressing(false);
        handleTap();
      },
      onPointerLeave: () => setPressing(false),
      style: {
        position: "relative",
        border: 0,
        padding: 0,
        background: "transparent",
        width: "100%",
        aspectRatio: "1/1",
        cursor: isConfirmed ? "default" : "pointer",
        outline: "none",
        transform: pressing ? `translateY(${pressDepth * 0.8}px) scale(0.9)` : "translateY(0) scale(1)",
        transition: pressing ? `transform ${80 / (speed / 100)}ms ease-out` : `transform ${500 / (speed / 100)}ms cubic-bezier(.34,1.56,.64,1)`
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      inset: 0,
      animation: isEligible && !pressing ? `floatDrift ${floatDur}s ease-in-out ${-floatDelay}s infinite` : isReserved ? "floatDrift 1.4s ease-in-out infinite" : "none"
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      inset: 0,
      borderRadius: 20,
      background: bg,
      boxShadow: isConfirmed ? `0 8px 18px ${pal.glow}0.6), 0 2px 0 ${pal.glow}0.5), inset 0 2px 0 rgba(255,255,255,0.4)` : isReserved ? `0 16px 28px ${pal.glow}0.55), 0 3px 0 ${pal.glow}0.6), inset 0 2px 0 rgba(255,255,255,0.8)` : `0 10px 18px rgba(0,0,0,0.25), 0 2px 0 rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.9)`,
      border: isReserved ? `2px solid ${pal.primary}` : "1px solid rgba(255,255,255,0.25)"
    } }, isReserved && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: -14, borderRadius: 28, background: `radial-gradient(circle, ${pal.glow}0.55), transparent 70%)`, zIndex: -1, animation: "pulseGlow 0.8s ease-in-out infinite" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: "18%", top: "12%", width: "35%", height: "25%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,0.95), rgba(255,255,255,0) 70%)" } }), (isReserved || isConfirmed) && /* @__PURE__ */ React.createElement(TypeBadge, { type, confirmed: isConfirmed, size: 22 })))
  );
}
function VariantFloat({ tweaks, role, sharedCells, lang = "ko" }) {
  const board = useBoardState(sharedCells);
  const [bursts, setBursts] = useState([]);
  const pal = ROLE[role];
  const onTap = (r, c, x, y) => {
    const { action } = board.tap(`${r},${c}`, role);
    if (!action || !tweaks.particlesOn) return;
    const id = Math.random();
    setBursts((b) => [...b, { id, x, y, color: pal.primary, big: action === "confirm" }]);
    setTimeout(() => setBursts((b) => b.filter((x2) => x2.id !== id)), 900);
  };
  return /* @__PURE__ */ React.createElement(SwipeFrame, { title: "B. Floating Orbs", tweaks, bursts, phase: board.phase, role }, /* @__PURE__ */ React.createElement("div", { className: "float-board", style: {
    padding: 18,
    borderRadius: 32,
    background: `radial-gradient(circle at 50% 30%, ${pal.auraHint}, transparent 70%)`,
    position: "relative"
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 } }, Array.from({ length: 25 }).map((_, i) => {
    const r = Math.floor(i / 5), c = i % 5;
    return /* @__PURE__ */ React.createElement(
      FloatCell,
      {
        key: i,
        row: r,
        col: c,
        cell: board.cellAt(`${r},${c}`),
        type: questionType(r, c),
        role,
        onTap,
        pressDepth: tweaks.pressDepth,
        speed: tweaks.speed
      }
    );
  }))));
}
function PopCell({ row, col, cell, type, role, onTap, pressDepth, speed }) {
  const [pressing, setPressing] = useState(false);
  const [released, setReleased] = useState(false);
  const [ripple, setRipple] = useState(null);
  const ref = useRef(null);
  const ownerRole = cell.role || role;
  const pal = ROLE[ownerRole];
  const state = cell.state;
  const handleDown = (e) => {
    var _a;
    setPressing(true);
    const rect = (_a = ref.current) == null ? void 0 : _a.getBoundingClientRect();
    if (rect) {
      const x = (e.clientX || rect.left + rect.width / 2) - rect.left;
      const y = (e.clientY || rect.top + rect.height / 2) - rect.top;
      setRipple({ x, y, id: Math.random() });
      setTimeout(() => setRipple(null), 700);
    }
  };
  const handleUp = () => {
    var _a, _b, _c;
    setPressing(false);
    const rect = (_a = ref.current) == null ? void 0 : _a.getBoundingClientRect();
    const boardRect = (_c = (_b = ref.current) == null ? void 0 : _b.closest(".pop-board")) == null ? void 0 : _c.getBoundingClientRect();
    if (rect && boardRect) onTap(row, col, rect.left - boardRect.left + rect.width / 2, rect.top - boardRect.top + rect.height / 2);
    setReleased(true);
    setTimeout(() => setReleased(false), 500);
  };
  const wobbleDelay = (row * 7 + col) % 5 * 0.1;
  const isEligible = state === "eligible", isReserved = state === "reserved", isConfirmed = state === "confirmed";
  const baseBg = isConfirmed ? `linear-gradient(180deg, ${pal.deep} 0%, #1A0624 100%)` : isReserved ? `linear-gradient(180deg, ${pal.primaryDark} 0%, ${pal.deep} 100%)` : "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.8) 100%)";
  const topBg = isConfirmed ? pal.gradient : isReserved ? pal.gradientReserved : "linear-gradient(160deg, #FFFFFF 0%, #EDE4ED 100%)";
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      ref,
      onPointerDown: handleDown,
      onPointerUp: handleUp,
      onPointerLeave: () => setPressing(false),
      style: {
        position: "relative",
        border: 0,
        padding: 0,
        background: "transparent",
        width: "100%",
        aspectRatio: "1/1",
        cursor: isConfirmed ? "default" : "pointer",
        outline: "none"
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, borderRadius: 16, background: baseBg } }),
    /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      inset: 0,
      borderRadius: 16,
      background: topBg,
      transform: pressing ? `translateY(${pressDepth}px)` : released ? "translateY(-2px)" : isReserved ? "translateY(-2px)" : "translateY(0)",
      transition: pressing ? `transform ${80 / (speed / 100)}ms ease-out` : `transform ${500 / (speed / 100)}ms cubic-bezier(.34,1.7,.4,1)`,
      boxShadow: isConfirmed ? "inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -3px 6px rgba(0,0,0,0.25)" : isReserved ? `inset 0 2px 0 rgba(255,255,255,0.85), inset 0 -4px 8px ${pal.glow}0.3), 0 0 16px ${pal.glow}0.5)` : "inset 0 2px 0 rgba(255,255,255,0.9), inset 0 -3px 6px rgba(0,0,0,0.1)",
      border: isReserved ? `2px solid ${pal.primary}` : "1px solid rgba(255,255,255,0.5)",
      overflow: "hidden",
      animation: isEligible && !pressing && !released ? `popWobble 2.4s ease-in-out ${-wobbleDelay}s infinite` : isReserved ? "popReserved 1s ease-in-out infinite" : "none"
    } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: "10%", right: "10%", top: "6%", height: "28%", borderRadius: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0))", opacity: isConfirmed ? 0.45 : 0.75 } }), ripple && /* @__PURE__ */ React.createElement("span", { key: ripple.id, style: { position: "absolute", left: ripple.x, top: ripple.y, width: 6, height: 6, marginLeft: -3, marginTop: -3, borderRadius: "50%", background: `${pal.glow}0.4)`, animation: "rippleOut 600ms ease-out forwards" } }), (isReserved || isConfirmed) && /* @__PURE__ */ React.createElement(TypeBadge, { type, confirmed: isConfirmed, size: 22 }))
  );
}
function VariantPop({ tweaks, role, sharedCells, lang = "ko" }) {
  const board = useBoardState(sharedCells);
  const [bursts, setBursts] = useState([]);
  const pal = ROLE[role];
  const onTap = (r, c, x, y) => {
    const { action } = board.tap(`${r},${c}`, role);
    if (!action || !tweaks.particlesOn) return;
    const id = Math.random();
    setBursts((b) => [...b, { id, x, y, color: pal.primary, big: action === "confirm" }]);
    setTimeout(() => setBursts((b) => b.filter((x2) => x2.id !== id)), 900);
  };
  return /* @__PURE__ */ React.createElement(SwipeFrame, { title: "C. Gummy Pop", tweaks, bursts, phase: board.phase, role }, /* @__PURE__ */ React.createElement("div", { className: "pop-board", style: {
    padding: 16,
    borderRadius: 28,
    background: "rgba(255,255,255,0.02)",
    border: "1.5px solid rgba(109,97,109,0.5)",
    boxShadow: "inset 0 2px 0 rgba(255,255,255,0.05), 0 10px 30px rgba(0,0,0,0.4)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 9 } }, Array.from({ length: 25 }).map((_, i) => {
    const r = Math.floor(i / 5), c = i % 5;
    return /* @__PURE__ */ React.createElement(
      PopCell,
      {
        key: i,
        row: r,
        col: c,
        cell: board.cellAt(`${r},${c}`),
        type: questionType(r, c),
        role,
        onTap,
        pressDepth: tweaks.pressDepth,
        speed: tweaks.speed
      }
    );
  }))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 14 } }, /* @__PURE__ */ React.createElement(TypeLegend, { lang })));
}
function ChatPanel({ role, lang, modal, history = [], gameOver = false, onExit }) {
  const pal = ROLE[role];
  const seedMessages = [
    { id: "seed-0", kind: "chat", who: "them", text: lang === "en" ? "Hey! Ready?" : "\uC548\uB155! \uC900\uBE44\uB410\uC5B4?" },
    { id: "seed-1", kind: "chat", who: "you", text: lang === "en" ? "Let's go!" : "\uC751! \uC2DC\uC791\uD558\uC790" },
    { id: "seed-2", kind: "chat", who: "them", text: lang === "en" ? "Start with T?" : "\uC774\uBC88\uC5D4 T\uBD80\uD130 \uAC00\uBCFC\uAE4C?" },
    { id: "seed-3", kind: "chat", who: "you", text: lang === "en" ? "Sure \u{1F60A}" : "\uC88B\uC544 \u{1F60A}" }
  ];
  const [liveMsgs, setLiveMsgs] = React.useState(() => window.__tbChat || []);
  React.useEffect(() => {
    const h = () => setLiveMsgs([...window.__tbChat || []]);
    window.addEventListener("tbchat", h);
    return () => window.removeEventListener("tbchat", h);
  }, []);
  const allItems = [
    ...seedMessages,
    ...history.map((rec) => ({ ...rec, kind: "record" })),
    ...liveMsgs.map((m) => ({ id: m.id, kind: "chat", who: m.who === role ? "you" : "them", text: m.text }))
  ];
  const ActiveCard = () => {
    var _a;
    if (!modal) return null;
    const isTruth = modal.type === "T";
    const ownerPal = ROLE[modal.ownerRole];
    const seed = modal.seed || 0;
    const truthList = TRUTH_QUESTIONS[lang] || TRUTH_QUESTIONS.ko;
    const balList = BALANCE_QUESTIONS[lang] || BALANCE_QUESTIONS.ko;
    const question = isTruth ? truthList[seed % truthList.length] : (balList[seed % balList.length] || {}).q || "";
    const typeLabel = isTruth ? lang === "en" ? "TRUTH" : "\uC9C4\uC2E4\uAC8C\uC784" : lang === "en" ? "THIS OR THAT" : "\uBC38\uB7F0\uC2A4";
    const busKey = "__qm_" + seed + "_" + modal.type;
    const isReviewing = ((_a = window[busKey]) == null ? void 0 : _a.step) === "reviewing";
    const [busStep, setBusStep] = React.useState(() => {
      var _a2;
      return ((_a2 = window[busKey]) == null ? void 0 : _a2.step) || "answering";
    });
    React.useEffect(() => {
      const handler = () => {
        var _a2;
        return setBusStep(((_a2 = window[busKey]) == null ? void 0 : _a2.step) || "answering");
      };
      window.addEventListener(busKey, handler);
      return () => window.removeEventListener(busKey, handler);
    }, [busKey]);
    const reviewing = busStep === "reviewing";
    return /* @__PURE__ */ React.createElement("div", { style: {
      borderRadius: 14,
      overflow: "hidden",
      border: `1.5px solid ${ownerPal.glow}0.5)`,
      boxShadow: `0 4px 18px rgba(0,0,0,0.4), 0 0 20px ${ownerPal.glow}0.2)`,
      marginTop: 4
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      background: ownerPal.gradient,
      padding: "7px 12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9.5, fontWeight: 800, letterSpacing: "0.12em", color: "white" } }, typeLabel), reviewing ? /* @__PURE__ */ React.createElement("span", { style: {
      fontSize: 9.5,
      fontWeight: 800,
      color: "white",
      background: "rgba(255,255,255,0.22)",
      padding: "2px 8px",
      borderRadius: 999,
      letterSpacing: "0.04em",
      display: "inline-block",
      animation: "swipeNudge 1.8s ease-in-out infinite"
    } }, lang === "en" ? "\u2190 Empathize? Disagree?" : "\u2190 \uACF5\uAC10? \uBE44\uACF5\uAC10?") : /* @__PURE__ */ React.createElement("span", { style: {
      fontSize: 9,
      fontWeight: 600,
      color: "rgba(255,255,255,0.85)",
      display: "inline-block",
      animation: "swipeNudge 1.8s ease-in-out infinite"
    } }, ROLE[modal.ownerRole].name, " ", lang === "en" ? "\xB7 answering\u2026" : "\xB7 \uC751\uB2F5 \uC911\u2026")), /* @__PURE__ */ React.createElement("div", { style: { background: "rgba(18,6,32,0.97)", padding: "10px 12px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, fontWeight: 700, color: "white", lineHeight: 1.4, textWrap: "balance" } }, question)));
  };
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, #0C0219 0%, #1A0A2E 100%)",
    display: "flex",
    flexDirection: "column",
    padding: "14px 16px"
  } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.9)", padding: "8px 0 12px" } }, lang === "en" ? "Chat" : "\uCC44\uD305"), /* @__PURE__ */ React.createElement("div", { style: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    overflowY: "auto",
    minHeight: 0
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, marginTop: "auto" } }, allItems.map((item) => {
    if (item.kind === "chat") {
      const isMe = item.who === "you";
      return /* @__PURE__ */ React.createElement("div", { key: item.id, style: { display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" } }, /* @__PURE__ */ React.createElement("div", { style: {
        maxWidth: "72%",
        padding: "9px 13px",
        borderRadius: 14,
        background: isMe ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.07)",
        border: isMe ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(255,255,255,0.1)",
        color: "white",
        fontSize: 13,
        lineHeight: 1.4,
        borderBottomRightRadius: isMe ? 4 : 14,
        borderBottomLeftRadius: isMe ? 14 : 4
      } }, item.text));
    }
    const isTruth = item.questionType === "T";
    const ownerPal = ROLE[item.ownerRole];
    const seed = item.seed || 0;
    const truthList = TRUTH_QUESTIONS[lang] || TRUTH_QUESTIONS.ko;
    const balList = BALANCE_QUESTIONS[lang] || BALANCE_QUESTIONS.ko;
    const question = isTruth ? truthList[seed % truthList.length] : (balList[seed % balList.length] || {}).q || "";
    const approved = item.verdict === "approve";
    return /* @__PURE__ */ React.createElement("div", { key: item.id, style: {
      borderRadius: 12,
      overflow: "hidden",
      background: "rgba(255,255,255,0.05)",
      opacity: 0.85
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "5px 10px",
      borderBottom: "1px solid rgba(255,255,255,0.07)"
    } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", color: ownerPal.primary } }, isTruth ? lang === "en" ? "TRUTH" : "\uC9C4\uC2E4" : lang === "en" ? "THIS OR THAT" : "\uBC38\uB7F0\uC2A4"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: "rgba(255,255,255,0.35)" } }, item.ts)), /* @__PURE__ */ React.createElement("div", { style: { padding: "7px 10px 5px", fontSize: 11.5, fontWeight: 600, color: "rgba(255,255,255,0.65)", lineHeight: 1.4 } }, question), item.answer && /* @__PURE__ */ React.createElement("div", { style: {
      margin: "0 8px 8px",
      padding: "5px 10px",
      borderRadius: 8,
      background: approved ? `${ownerPal.glow}0.2)` : "rgba(255,80,90,0.12)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 6
    } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: "white" } }, item.answer), /* @__PURE__ */ React.createElement("span", { style: {
      fontSize: 9,
      fontWeight: 800,
      padding: "2px 6px",
      borderRadius: 999,
      background: approved ? ownerPal.primary : "rgba(255,80,90,0.6)",
      color: "white",
      whiteSpace: "nowrap"
    } }, approved ? lang === "en" ? "\uACF5\uAC10" : "\uACF5\uAC10" : lang === "en" ? "\uBE44\uACF5\uAC10" : "\uBE44\uACF5\uAC10")));
  }), /* @__PURE__ */ React.createElement(ActiveCard, null))));
}
function FauxKeyboard() {
  const rows = [
    "\u3142\u3148\u3137\u3131\u3145\u315B\u3155\u3151\u3150\u3154",
    "\u3141\u3134\u3147\u3139\u314E\u3157\u3153\u314F\u3163",
    "\u21E7\u314B\u314C\u314A\u314D\u3160\u315C\u3161\u232B"
  ];
  return /* @__PURE__ */ React.createElement("div", { style: {
    background: "linear-gradient(180deg, #2A2030 0%, #1B1322 100%)",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    padding: "8px 4px 6px",
    display: "flex",
    flexDirection: "column",
    gap: 7
  } }, rows.map(
    (row, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", justifyContent: "center", gap: 5, padding: "0 4px" } }, [...row].map(
      (ch, j) => /* @__PURE__ */ React.createElement("div", { key: j, style: {
        flex: ch === "\u21E7" || ch === "\u232B" ? "1.4" : "1",
        height: 38,
        borderRadius: 5,
        background: ch === "\u21E7" || ch === "\u232B" ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.08)",
        boxShadow: "0 1px 0 rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 15,
        color: "rgba(255,255,255,0.85)",
        fontWeight: 500
      } }, ch)
    ))
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 5, padding: "0 4px" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: "1.2", height: 38, borderRadius: 5, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 600 } }, "\uD55C/A"), /* @__PURE__ */ React.createElement("div", { style: { flex: "5", height: 38, borderRadius: 5, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "rgba(255,255,255,0.6)" } }, "\uC2A4\uD398\uC774\uC2A4"), /* @__PURE__ */ React.createElement("div", { style: { flex: "1.2", height: 38, borderRadius: 5, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 600 } }, "\u21B5")));
}
function RewardBoard({ role, lang, scores, allScores, bingoLines, onExit, onNextRound }) {
  const isHost = role === "host";
  const pal = ROLE[role];
  const myScore = scores || { gpPlus: 0, gpMinus: 0 };
  const opponentRole = isHost ? "guest" : "host";
  const oppPal = ROLE[opponentRole];
  const oppScore = (allScores == null ? void 0 : allScores[opponentRole]) || { gpPlus: 0, gpMinus: 0 };
  const ko = lang !== "en";
  const EP = myScore.gpPlus || 0;
  const NP = myScore.gpMinus || 0;
  const oppEP = oppScore.gpPlus || 0;
  const winner = EP > oppEP ? role : oppEP > EP ? opponentRole : null;
  const isWinner = winner === role;
  const isTie = winner === null;
  const VP = isWinner ? 20 : 0;
  const winnerVP = 20;
  const gpNet = EP - NP;
  const tier = getTier(myScore.gpPlus || 0);
  const myName = ROLE[role].name;
  const heroLine = isWinner ? ko ? `${myName} \uC2B9\uB9AC!` : `${myName} Wins!` : isTie ? ko ? "\uBB34\uC2B9\uBD80" : "Draw" : ko ? `\uC544\uC26C\uC6CC\uC694 ${myName}` : `So close, ${myName}`;
  const heroColor = isWinner ? "#F2C857" : isTie ? "rgba(255,255,255,0.75)" : "#FF8A92";
  const PointRow = ({ dot, label, value, color, bold }) => /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 7 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 8, height: 8, borderRadius: "50%", background: dot, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: bold ? 13 : 12, fontWeight: bold ? 700 : 500, color: "rgba(255,255,255,0.78)" } }, label)), /* @__PURE__ */ React.createElement("span", { style: { fontSize: bold ? 17 : 14, fontWeight: bold ? 900 : 700, color } }, value));
  const t = {
    over: ko ? "REWARDS" : "REWARDS",
    rewTitle: ko ? "\uAC8C\uC784 \uBCF4\uC0C1 \uC815\uC0B0" : "Game Rewards",
    ep: ko ? "\uC140 \uD68D\uB4DD" : "Cells",
    ap: ko ? "\uBE59\uACE0 \uBCF4\uB108\uC2A4" : "Bingo Bonus",
    vp: ko ? "\uC2B9\uB9AC \uBCF4\uB108\uC2A4 VP" : "Win Bonus VP",
    np: ko ? "\uBE44\uACF5\uAC10 \uD328\uB110\uD2F0 NP" : "Disagree Penalty NP",
    gpTotal: ko ? "\uC138\uC158 \uCD5C\uC885 GP" : "Session GP",
    next: ko ? "\uB2E4\uC74C \uB77C\uC6B4\uB4DC" : "Next Round",
    exit: ko ? "\uAC8C\uC784 \uB098\uAC00\uAE30" : "Leave Game"
  };
  const resultLabel = heroLine;
  const resultColor = heroColor;
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, #0C0219 0%, #1A0A2E 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    overflowY: "auto",
    overflowX: "hidden",
    padding: "14px 16px 28px",
    gap: 12,
    boxSizing: "border-box"
  } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "8px 0 0", minHeight: 136, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", paddingBottom: 24 } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.35)",
    marginBottom: 8,
    fontFamily: "'Alexandria', system-ui, sans-serif"
  } }, t.over), /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 32,
    fontWeight: 700,
    letterSpacing: "-0.01em",
    lineHeight: 1.2,
    fontFamily: "'Alexandria', 'EliceDigitalBaeum', system-ui, sans-serif",
    color: resultColor,
    textShadow: `0 0 40px ${resultColor}66`,
    animation: "heroPopIn 550ms cubic-bezier(.34,1.56,.64,1) forwards",
    wordBreak: "keep-all",
    overflowWrap: "break-word",
    width: "100%",
    textAlign: "center"
  } }, resultLabel)), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "end" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6 } }, isWinner && VP > 0 && /* @__PURE__ */ React.createElement("div", { style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "5px 12px",
    borderRadius: 999,
    background: `${pal.glow}0.18)`,
    border: `1.5px solid ${pal.glow}0.5)`,
    fontSize: 11,
    fontWeight: 800,
    color: pal.primary,
    boxShadow: `0 0 12px ${pal.glow}0.35)`,
    fontFamily: "'Alexandria', system-ui, sans-serif"
  } }, /* @__PURE__ */ React.createElement("svg", { width: "10", height: "10", viewBox: "0 0 24 24", fill: "currentColor" }, /* @__PURE__ */ React.createElement("path", { d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" })), "VP +", VP), /* @__PURE__ */ React.createElement("div", { style: {
    padding: "10px 8px",
    borderRadius: 14,
    width: "100%",
    boxSizing: "border-box",
    background: `linear-gradient(160deg, ${pal.glow}0.22) 0%, ${pal.glow}0.06) 100%)`,
    border: `1.5px solid ${pal.glow}0.55)`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    boxShadow: `0 4px 18px ${pal.glow}0.2)`
  } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, fontWeight: 800, color: pal.primary, letterSpacing: "0.1em", textTransform: "uppercase" } }, ROLE[role].name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 26, fontWeight: 900, color: "white", lineHeight: 1 } }, "+", gpNet), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "rgba(255,255,255,0.4)" } }, "GP"), /* @__PURE__ */ React.createElement(TierBadge, { tier, lang }))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.18)", textAlign: "center" } }, "VS"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6 } }, !isWinner && !isTie && /* @__PURE__ */ React.createElement("div", { style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "5px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.18)",
    fontSize: 11,
    fontWeight: 700,
    color: "rgba(255,255,255,0.55)",
    fontFamily: "'Alexandria', system-ui, sans-serif"
  } }, /* @__PURE__ */ React.createElement("svg", { width: "10", height: "10", viewBox: "0 0 24 24", fill: "currentColor" }, /* @__PURE__ */ React.createElement("path", { d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" })), "VP +", winnerVP), /* @__PURE__ */ React.createElement("div", { style: {
    padding: "10px 8px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    opacity: 0.65,
    width: "100%",
    boxSizing: "border-box"
  } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, fontWeight: 800, color: oppPal.primary, letterSpacing: "0.1em", textTransform: "uppercase" } }, ROLE[opponentRole].name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 26, fontWeight: 900, color: "white", lineHeight: 1 } }, "+", oppScore.gpPlus || 0), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "rgba(255,255,255,0.4)" } }, "GP"), /* @__PURE__ */ React.createElement(TierBadge, { tier: getTier(oppScore.gpPlus || 0), lang })))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 9 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => onNextRound == null ? void 0 : onNextRound(), style: {
    height: 42,
    borderRadius: 13,
    cursor: "pointer",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "inherit"
  } }, t.next), /* @__PURE__ */ React.createElement("button", { onClick: () => onExit == null ? void 0 : onExit({ save: false }), style: {
    height: 42,
    borderRadius: 13,
    cursor: "pointer",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "inherit"
  } }, t.exit)));
}
function SwipeFrame({ title, children, tweaks, setTweak, bursts, phase, role, modal, onCloseModal, onResolveModal, lang, setLang, onExit, currentTurn, attacksLeft, scores, allScores, bingoLines, minigame, setMinigame, resolveMinigame, sharedMinigame, onMinigameWin, sharedRound, history, celebration, onCelebrationDone }) {
  var _a;
  const [panel, setPanel] = useState(0);
  const [unread, setUnread] = useState(0);
  const roundPhase = (_a = sharedRound == null ? void 0 : sharedRound[0]) == null ? void 0 : _a.phase;
  useEffect(() => {
    if (roundPhase === "gameOver") setPanel(2);
  }, [roundPhase]);
  const prevHistoryLen = useRef(0);
  useEffect(() => {
    const len = (history == null ? void 0 : history.length) || 0;
    if (panel !== 1 && len > prevHistoryLen.current) {
      setUnread((u) => u + (len - prevHistoryLen.current));
    }
    prevHistoryLen.current = len;
  }, [history == null ? void 0 : history.length]);
  useEffect(() => {
    if (panel === 1) setUnread(0);
  }, [panel]);
  const dragRef = useRef({ startX: null, dx: 0 });
  const [dragDx, setDragDx] = useState(0);
  const W = 390;
  const dockRef = useRef(null);
  const [dockH, setDockH] = useState(96);
  useEffect(() => {
    if (!dockRef.current) return;
    const el = dockRef.current;
    const ro = new ResizeObserver(() => setDockH(el.offsetHeight));
    ro.observe(el);
    setDockH(el.offsetHeight);
    return () => ro.disconnect();
  }, [tweaks.keyboardOn]);
  const frameRef = useRef(null);
  const boardSlotRef = useRef(null);
  const [boardBox, setBoardBox] = useState({ top: 184, bottom: 96, left: 16, right: 16 });
  useEffect(() => {
    const measure = () => {
      const frame = frameRef.current;
      const slot = boardSlotRef.current;
      if (!frame || !slot) return;
      const card = slot.querySelector(".jelly-board, .float-board, .pop-board") || slot.firstElementChild;
      if (!card) return;
      const fr = frame.getBoundingClientRect();
      const cr = card.getBoundingClientRect();
      setBoardBox({
        top: Math.round(cr.top - fr.top),
        bottom: Math.round(fr.bottom - cr.bottom),
        left: Math.round(cr.left - fr.left),
        right: Math.round(fr.right - cr.right)
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (frameRef.current) ro.observe(frameRef.current);
    if (boardSlotRef.current) ro.observe(boardSlotRef.current);
    const t = setTimeout(measure, 150);
    return () => {
      ro.disconnect();
      clearTimeout(t);
    };
  }, [tweaks.keyboardOn, panel]);
  const onStart = (e) => {
    if (e.target.closest("button")) return;
    dragRef.current.startX = e.clientX;
    dragRef.current.active = true;
  };
  const onMove = (e) => {
    if (!dragRef.current.active || dragRef.current.startX == null) return;
    const dx = e.clientX - dragRef.current.startX;
    const base = -panel * W;
    const maxPanel = roundPhase === "gameOver" ? 2 : 1;
    const clamped = Math.max(-W * maxPanel, Math.min(0, base + dx));
    setDragDx(clamped - base);
  };
  const onEnd = () => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    const threshold = 70;
    const maxPanel = roundPhase === "gameOver" ? 2 : 1;
    if (dragDx < -threshold) setPanel((p) => Math.min(maxPanel, p + 1));
    else if (dragDx > threshold) setPanel((p) => Math.max(0, p - 1));
    setDragDx(0);
    dragRef.current.startX = null;
  };
  const offset = -panel * W + dragDx;
  return /* @__PURE__ */ React.createElement("div", { ref: frameRef, style: {
    width: W,
    height: 844,
    background: "linear-gradient(180deg, #0C0219 0%, #1A0A2E 100%)",
    borderRadius: 44,
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 24px 60px rgba(0,0,0,0.5), inset 0 0 0 8px #0a0514",
    fontFamily: "'EliceDigitalBaeum', system-ui, sans-serif"
  } }, /* @__PURE__ */ React.createElement(AmbientBokeh, { role }), /* @__PURE__ */ React.createElement("div", { "data-ticker-header": "true", style: { position: "relative", zIndex: 60 } }, /* @__PURE__ */ React.createElement(
    TopBar,
    {
      role,
      phase,
      currentTurn,
      attacksLeft,
      scores,
      bingoLines,
      lang,
      setLang,
      onExit,
      gameOver: roundPhase === "gameOver"
    }
  )), /* @__PURE__ */ React.createElement(
    "div",
    {
      onClick: () => {
        if (tweaks.keyboardOn) setTweak == null ? void 0 : setTweak("keyboardOn", false);
      },
      style: { flex: 1, position: "relative", overflow: "hidden", touchAction: "auto", minHeight: 0 }
    },
    /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      top: 0,
      left: 0,
      width: W * 3,
      height: "100%",
      display: "flex",
      transform: `translateX(${offset}px)`,
      transition: dragRef.current.active ? "none" : "transform 320ms cubic-bezier(.25,.46,.45,.94)"
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      width: W,
      position: "relative",
      height: "100%",
      padding: tweaks.keyboardOn ? "8px 16px 0" : "0 16px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: tweaks.keyboardOn ? "flex-start" : "center",
      transformOrigin: "top center",
      transform: tweaks.keyboardOn ? "scale(0.78)" : "scale(1)",
      transition: "transform 280ms cubic-bezier(.25,.46,.45,.94), padding 280ms",
      boxSizing: "border-box"
    } }, /* @__PURE__ */ React.createElement("div", { ref: boardSlotRef, style: { width: "100%" } }, children), /* @__PURE__ */ React.createElement(Particles, { bursts })), /* @__PURE__ */ React.createElement("div", { style: { width: W, position: "relative" } }, /* @__PURE__ */ React.createElement(ChatPanel, { role, lang, modal, history: history || [], gameOver: roundPhase === "gameOver", onExit })), /* @__PURE__ */ React.createElement("div", { style: { width: W, height: "100%", position: "relative" } }, /* @__PURE__ */ React.createElement(
      RewardBoard,
      {
        role,
        lang,
        scores,
        allScores,
        bingoLines,
        onExit,
        onNextRound: () => {
          sharedRound[1]((r) => ({ ...r, round: r.round + 1, phase: "playing" }));
          setPanel(0);
        }
      }
    )))
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", alignItems: "center", gap: 6, paddingBottom: 2, position: "relative", zIndex: 60 } }, [0, 1, ...roundPhase === "gameOver" ? [2] : []].map((i) => {
    const active = panel === i;
    const dotColor = i === 2 ? "#F2C857" : ROLE[role].primary;
    return /* @__PURE__ */ React.createElement("div", { key: i, style: {
      width: active ? 16 : 6,
      height: 6,
      borderRadius: 999,
      background: active ? dotColor : "rgba(255,255,255,0.18)",
      boxShadow: active ? `0 0 8px ${dotColor}88` : "none",
      transition: "all 280ms cubic-bezier(.25,.46,.45,.94)"
    } });
  })), /* @__PURE__ */ React.createElement("div", { ref: dockRef, "data-ticker-dock": "true", style: { position: "relative", zIndex: 60, background: "linear-gradient(180deg, transparent 0%, rgba(12,2,25,0.85) 18%, #0C0219 100%)" } }, /* @__PURE__ */ React.createElement(MessageInput, { role, panel, lang }), !tweaks.keyboardOn && /* @__PURE__ */ React.createElement(BannerAd, { role, lang }), !tweaks.keyboardOn && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", padding: "4px 0 6px" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 134, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.5)" } })), tweaks.keyboardOn && /* @__PURE__ */ React.createElement(FauxKeyboard, null), tweaks.keyboardOn && /* @__PURE__ */ React.createElement(BannerAd, { role, lang })), modal && panel === 0 && /* @__PURE__ */ React.createElement(
    QuestionModal,
    {
      type: modal.type,
      role,
      ownerRole: modal.ownerRole,
      cellKey: modal.key,
      seed: modal.seed,
      lang,
      onClose: onCloseModal,
      onResolve: onResolveModal,
      footerHeight: dockH,
      boardTop: boardBox.top,
      boardBottom: boardBox.bottom,
      boardLeft: boardBox.left,
      boardRight: boardBox.right
    }
  ), minigame && panel === 0 && /* @__PURE__ */ React.createElement(
    MinigameOverlay,
    {
      sharedMinigame,
      viewerRole: role,
      lang,
      onResolve: (winnerRole) => {
        const winnerInitial = ROLE[winnerRole].initial;
        resolveMinigame == null ? void 0 : resolveMinigame(minigame.key, winnerRole, winnerInitial);
        onMinigameWin == null ? void 0 : onMinigameWin(winnerRole);
      }
    }
  ), modal && panel === 1 && /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: 12,
    left: "50%",
    transform: "translateX(-50%)",
    padding: "6px 12px",
    borderRadius: 999,
    background: "rgba(6,1,15,0.85)",
    border: `1px solid ${ROLE[role].primary}55`,
    color: ROLE[role].primary,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.05em",
    backdropFilter: "blur(8px)",
    pointerEvents: "none",
    zIndex: 60,
    animation: "modalFade 220ms ease-out"
  } }, "\u2190 ", lang === "en" ? "Question in progress" : "\uC9C4\uD589 \uC911\uC778 \uC9C8\uBB38 \uC788\uC74C"), /* @__PURE__ */ React.createElement(ChatTicker, { role, panel, lang, onTogglePanel: () => setPanel((p) => p === 2 ? 1 : p === 0 ? 1 : 0), unread, frameRef, rewardReady: roundPhase === "gameOver" && panel !== 2, gameOver: roundPhase === "gameOver" }), celebration && panel === 0 && /* @__PURE__ */ React.createElement(
    BingoCelebration,
    {
      role,
      lines: celebration.lines,
      onDone: onCelebrationDone
    }
  ), sharedRound && sharedRound[0].phase === "roundEnd" && /* @__PURE__ */ React.createElement(
    RoundEndPopup,
    {
      round: sharedRound[0].round,
      sharedRound,
      scores: allScores,
      lang,
      viewerRole: role,
      onGameOver: () => setPanel(1)
    }
  ));
}
function ChatTicker({ role, panel, onTogglePanel, unread = 0, rewardReady = false, gameOver = false, lang = "ko" }) {
  const pal = ROLE[role];
  const tickerRef = useRef(null);
  const [hintOn, setHintOn] = useState(false);
  const hintDismissed = useRef(false);
  useEffect(() => {
    if (panel !== 0) hintDismissed.current = true;
  }, [panel]);
  useEffect(() => {
    if (role !== "host") return;
    let t;
    const loop = (on) => {
      if (hintDismissed.current) {
        setHintOn(false);
        return;
      }
      setHintOn(on);
      t = setTimeout(() => loop(!on), on ? 4e3 : 6e3);
    };
    loop(true);
    return () => clearTimeout(t);
  }, [role]);
  const [parked, setParked] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [bounds, setBounds] = useState(null);
  const [longPressReady, setLongPressReady] = useState(false);
  const lastFrame = useRef(performance.now());
  const vel = useRef({ vx: 0, vy: 0 });
  const posRef = useRef({ x: 0, y: 0 });
  const drag = useRef({ active: false, dragging: false, dx: 0, dy: 0, moved: 0, startX: 0, startY: 0, timer: null });
  useEffect(() => {
    var _a;
    const parent = (_a = tickerRef.current) == null ? void 0 : _a.parentElement;
    if (!parent) return;
    const measure = () => {
      const pr = parent.getBoundingClientRect();
      const topBar = parent.querySelector("[data-ticker-header]") || parent.children[1];
      const dock = parent.querySelector("[data-ticker-dock]") || parent.lastElementChild;
      const headerH = topBar ? topBar.getBoundingClientRect().bottom - pr.top : 184;
      const dockH = dock ? pr.bottom - dock.getBoundingClientRect().top : 96;
      setBounds({
        x0: PAD,
        y0: headerH + PAD,
        x1: pr.width - PAD,
        y1: pr.height - dockH - PAD - 20,
        w: pr.width,
        h: pr.height
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(parent);
    const t = setTimeout(measure, 400);
    return () => {
      ro.disconnect();
      clearTimeout(t);
    };
  }, []);
  useEffect(() => {
    if (!bounds || posRef.current.x !== 0 || posRef.current.y !== 0) return;
    const x = bounds.x1 - SIZE;
    const y = bounds.y0 + (bounds.y1 - bounds.y0) * 0.5;
    posRef.current = { x, y };
    setPos({ x, y });
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.04 + Math.random() * 0.03;
    vel.current = { vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed };
  }, [bounds]);
  const floating = !parked;
  const bobT = useRef(0);
  useEffect(() => {
    if (!parked) return;
    let raf;
    const base = { ...posRef.current };
    const step = (now) => {
      const dt = Math.min(64, now - lastFrame.current);
      lastFrame.current = now;
      bobT.current += dt * 15e-4;
      const offsetY = Math.sin(bobT.current) * 4;
      const offsetX = Math.sin(bobT.current * 0.7 + 1) * 2;
      setPos({ x: base.x + offsetX, y: base.y + offsetY });
      raf = requestAnimationFrame(step);
    };
    lastFrame.current = performance.now();
    bobT.current = 0;
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [parked]);
  useEffect(() => {
    if (!floating || !bounds) return;
    let raf;
    const step = (now) => {
      const dt = Math.min(64, now - lastFrame.current);
      lastFrame.current = now;
      let { x, y } = posRef.current;
      let { vx, vy } = vel.current;
      x += vx * dt;
      y += vy * dt;
      if (x <= bounds.x0) {
        x = bounds.x0;
        vx = Math.abs(vx);
      }
      if (x >= bounds.x1) {
        x = bounds.x1;
        vx = -Math.abs(vx);
      }
      if (y <= bounds.y0) {
        y = bounds.y0;
        vy = Math.abs(vy);
      }
      if (y >= bounds.y1) {
        y = bounds.y1;
        vy = -Math.abs(vy);
      }
      if (Math.random() < dt * 4e-5) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.04 + Math.random() * 0.03;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
      }
      posRef.current = { x, y };
      vel.current = { vx, vy };
      setPos({ x, y });
      raf = requestAnimationFrame(step);
    };
    lastFrame.current = performance.now();
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [floating, bounds]);
  const LONG_PRESS_MS = 350;
  const onDown = (e) => {
    var _a, _b;
    e.stopPropagation();
    (_b = (_a = tickerRef.current) == null ? void 0 : _a.setPointerCapture) == null ? void 0 : _b.call(_a, e.pointerId);
    const rect = tickerRef.current.getBoundingClientRect();
    drag.current = {
      active: true,
      dragging: false,
      dx: e.clientX - rect.left,
      dy: e.clientY - rect.top,
      moved: 0,
      startX: e.clientX,
      startY: e.clientY,
      timer: null
    };
    drag.current.timer = setTimeout(() => {
      drag.current.dragging = true;
      setLongPressReady(true);
      if (navigator.vibrate) navigator.vibrate(15);
    }, LONG_PRESS_MS);
  };
  const onMove = (e) => {
    if (!drag.current.active || !bounds) return;
    const moved = Math.hypot(e.clientX - drag.current.startX, e.clientY - drag.current.startY);
    drag.current.moved = Math.max(drag.current.moved, moved);
    if (!drag.current.dragging) {
      if (moved > 8 && drag.current.timer) {
        clearTimeout(drag.current.timer);
        drag.current.timer = null;
      }
      return;
    }
    e.stopPropagation();
    const parent = tickerRef.current.parentElement;
    const prect = parent.getBoundingClientRect();
    const x = e.clientX - prect.left - drag.current.dx + SIZE / 2;
    const y = e.clientY - prect.top - drag.current.dy + SIZE / 2;
    const nx = Math.max(PAD, Math.min(bounds.w - PAD, x));
    const ny = Math.max(PAD, Math.min(bounds.h - PAD, y));
    posRef.current = { x: nx, y: ny };
    setPos({ x: nx, y: ny });
  };
  const onUp = () => {
    if (!drag.current.active) return;
    const wasDragging = drag.current.dragging;
    if (drag.current.timer) clearTimeout(drag.current.timer);
    drag.current.active = false;
    drag.current.dragging = false;
    setLongPressReady(false);
    if (wasDragging) {
      setParked(true);
      const angle = Math.random() * Math.PI * 2;
      vel.current = { vx: Math.cos(angle) * 0.05, vy: Math.sin(angle) * 0.05 };
    } else if (drag.current.moved < 8) {
      onTogglePanel == null ? void 0 : onTogglePanel();
    }
  };
  if (!bounds || gameOver) return /* @__PURE__ */ React.createElement("div", { ref: tickerRef, style: { display: "none" } });
  const isChatPanel = panel === 1;
  const isRewardPanel = panel === 2;
  const icon = isChatPanel ? /* @__PURE__ */ React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "white" }, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1.5" }), /* @__PURE__ */ React.createElement("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1.5" }), /* @__PURE__ */ React.createElement("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1.5" }), /* @__PURE__ */ React.createElement("rect", { x: "14", y: "14", width: "7", height: "7", rx: "1.5" })) : isRewardPanel ? /* @__PURE__ */ React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "white" }, /* @__PURE__ */ React.createElement("path", { d: "M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z" })) : /* @__PURE__ */ React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "white" }, /* @__PURE__ */ React.createElement("path", { d: "M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z" }));
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: tickerRef,
      onPointerDown: onDown,
      onPointerMove: onMove,
      onPointerUp: onUp,
      onPointerCancel: onUp,
      style: {
        position: "absolute",
        left: pos.x - SIZE / 2,
        top: pos.y - SIZE / 2,
        width: SIZE,
        height: SIZE,
        touchAction: "none",
        cursor: drag.current.dragging ? "grabbing" : "pointer",
        zIndex: 50,
        transition: drag.current.dragging ? "none" : "left 180ms cubic-bezier(.3,1.4,.5,1), top 180ms cubic-bezier(.3,1.4,.5,1), transform 180ms",
        transform: longPressReady ? "scale(1.15)" : "scale(1)",
        filter: `drop-shadow(0 6px 14px ${pal.glow}0.5))`
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      inset: -8,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${pal.glow}0.55), transparent 70%)`,
      animation: "tickerAura 2s ease-in-out infinite"
    } }),
    /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      background: pal.gradient,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: longPressReady ? "2px solid rgba(255,255,255,0.85)" : "2px solid rgba(255,255,255,0.35)",
      boxShadow: `inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -4px 6px ${pal.glow}0.45)`,
      transition: "border-color 150ms"
    } }, icon),
    hintOn && panel === 0 && !gameOver && /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      left: "calc(100% + 12px)",
      top: "50%",
      transform: "translateY(-50%)",
      background: "rgba(20,8,36,0.55)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      border: `1px solid ${pal.glow}0.4)`,
      borderRadius: 10,
      padding: "7px 12px",
      fontSize: 11.5,
      fontWeight: 700,
      color: pal.primary,
      whiteSpace: "nowrap",
      pointerEvents: "none",
      boxShadow: `0 4px 14px rgba(0,0,0,0.4)`,
      animation: "hintPopCentered 320ms cubic-bezier(.34,1.56,.64,1) forwards"
    } }, lang === "en" ? "Tap to chat" : "\uD0ED\uD558\uC5EC \uCC44\uD305", /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      left: -4,
      top: "50%",
      transform: "translateY(-50%) rotate(45deg)",
      width: 8,
      height: 8,
      background: "rgba(20,8,36,0.55)",
      borderLeft: `1px solid ${pal.glow}0.4)`,
      borderBottom: `1px solid ${pal.glow}0.4)`
    } })),
    unread > 0 && /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      top: -4,
      right: -4,
      minWidth: 18,
      height: 18,
      paddingLeft: unread > 9 ? 4 : 0,
      paddingRight: unread > 9 ? 4 : 0,
      borderRadius: 999,
      background: "#FF0077",
      border: "2px solid #1A0A2E",
      boxShadow: "0 0 8px rgba(255,0,119,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 9.5,
      fontWeight: 900,
      color: "white",
      fontFamily: "'EliceDigitalCodingverH', monospace"
    } }, unread > 99 ? "99+" : unread),
    rewardReady && unread === 0 && /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      top: -5,
      right: -5,
      width: 18,
      height: 18,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #FFE89A, #E0A93A)",
      border: "2px solid #1A0A2E",
      boxShadow: "0 0 10px rgba(242,200,87,0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: "reservedBlink 1.2s ease-in-out infinite"
    } }, /* @__PURE__ */ React.createElement("svg", { width: "9", height: "9", viewBox: "0 0 24 24", fill: "#7A4F12" }, /* @__PURE__ */ React.createElement("path", { d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" })))
  );
}
const SIZE = 48;
const PAD = 30;
function ExitTicker({ role, lang, onExit, bounds }) {
  const pal = ROLE[role];
  const ref = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const vel = useRef({ vx: 0.035, vy: 0.05 });
  const lastFrame = useRef(performance.now());
  const bobT = useRef(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [parked, setParked] = useState(false);
  const drag = useRef({ active: false, dragging: false, startX: 0, startY: 0, dx: 0, dy: 0, moved: 0, timer: null });
  useEffect(() => {
    if (!bounds) return;
    const x = bounds.x1 - SIZE - 10;
    const y = bounds.y1 - SIZE - 10;
    posRef.current = { x, y };
    setPos({ x, y });
  }, [bounds]);
  useEffect(() => {
    if (!bounds || parked || pos.x === 0) return;
    let raf;
    const step = (now) => {
      const dt = Math.min(64, now - lastFrame.current);
      lastFrame.current = now;
      let { x, y } = posRef.current;
      let { vx, vy } = vel.current;
      x += vx * dt;
      y += vy * dt;
      if (x <= bounds.x0) {
        x = bounds.x0;
        vx = Math.abs(vx);
      }
      if (x >= bounds.x1) {
        x = bounds.x1;
        vx = -Math.abs(vx);
      }
      if (y <= bounds.y0) {
        y = bounds.y0;
        vy = Math.abs(vy);
      }
      if (y >= bounds.y1) {
        y = bounds.y1;
        vy = -Math.abs(vy);
      }
      posRef.current = { x, y };
      vel.current = { vx, vy };
      setPos({ x, y });
      raf = requestAnimationFrame(step);
    };
    lastFrame.current = performance.now();
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [bounds, parked, pos.x === 0]);
  useEffect(() => {
    if (!parked) return;
    let raf;
    const base = { ...posRef.current };
    const step = (now) => {
      const dt = Math.min(64, now - lastFrame.current);
      lastFrame.current = now;
      bobT.current += dt * 15e-4;
      setPos({ x: base.x + Math.sin(bobT.current * 0.7 + 1) * 2, y: base.y + Math.sin(bobT.current) * 4 });
      raf = requestAnimationFrame(step);
    };
    lastFrame.current = performance.now();
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [parked]);
  const onDown = (e) => {
    var _a, _b;
    e.stopPropagation();
    (_b = (_a = ref.current) == null ? void 0 : _a.setPointerCapture) == null ? void 0 : _b.call(_a, e.pointerId);
    const rect = ref.current.getBoundingClientRect();
    drag.current = { active: true, dragging: false, startX: e.clientX, startY: e.clientY, dx: e.clientX - rect.left, dy: e.clientY - rect.top, moved: 0, timer: setTimeout(() => {
      drag.current.dragging = true;
    }, 350) };
  };
  const onMove = (e) => {
    if (!drag.current.active || !bounds) return;
    drag.current.moved = Math.hypot(e.clientX - drag.current.startX, e.clientY - drag.current.startY);
    if (!drag.current.dragging) return;
    e.stopPropagation();
    const parent = ref.current.parentElement;
    const pr = parent.getBoundingClientRect();
    const nx = Math.max(PAD, Math.min(bounds.x1, e.clientX - pr.left - drag.current.dx + SIZE / 2));
    const ny = Math.max(bounds.y0, Math.min(bounds.y1, e.clientY - pr.top - drag.current.dy + SIZE / 2));
    posRef.current = { x: nx, y: ny };
    setPos({ x: nx, y: ny });
  };
  const onUp = () => {
    if (!drag.current.active) return;
    const wasDragging = drag.current.dragging;
    clearTimeout(drag.current.timer);
    drag.current.active = false;
    drag.current.dragging = false;
    if (wasDragging) {
      setParked(true);
    } else if (drag.current.moved < 8) {
      onExit == null ? void 0 : onExit({ save: true });
    }
  };
  if (pos.x === 0) return null;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      ref,
      onPointerDown: onDown,
      onPointerMove: onMove,
      onPointerUp: onUp,
      onPointerCancel: onUp,
      style: {
        position: "absolute",
        left: pos.x - SIZE / 2,
        top: pos.y - SIZE / 2,
        width: SIZE,
        height: SIZE,
        zIndex: 51,
        touchAction: "none",
        cursor: "pointer",
        transition: drag.current.dragging ? "none" : "left 180ms cubic-bezier(.3,1.4,.5,1), top 180ms cubic-bezier(.3,1.4,.5,1)",
        filter: `drop-shadow(0 6px 14px rgba(255,0,119,0.5))`
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      inset: -8,
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(255,0,119,0.5), transparent 70%)",
      animation: "tickerAura 2s ease-in-out infinite"
    } }),
    /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #FF0077, #BD0558)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "2px solid rgba(255,255,255,0.35)",
      boxShadow: "inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -4px 6px rgba(189,5,88,0.5)"
    } }, /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 16 16", fill: "none", stroke: "white", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M10 2H4v12h6" }), /* @__PURE__ */ React.createElement("path", { d: "M9 8h6" }), /* @__PURE__ */ React.createElement("path", { d: "M12 5l3 3-3 3" }))),
    /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      top: SIZE + 4,
      left: "50%",
      transform: "translateX(-50%)",
      whiteSpace: "nowrap",
      fontSize: 9,
      fontWeight: 800,
      color: "rgba(255,255,255,0.75)",
      letterSpacing: "0.04em",
      pointerEvents: "none",
      textShadow: "0 1px 3px rgba(0,0,0,0.8)"
    } }, lang === "en" ? "Leave" : "\uAC8C\uC784\uB098\uAC00\uAE30")
  );
}
function RoundEndPopup({ sharedRound, scores, lang, onGameOver, viewerRole }) {
  var _a, _b;
  const [r, setR] = sharedRound;
  const t = lang === "en";
  const maxRounds = 3;
  const canContinue = r.round < maxRounds;
  const bingoWinner = r.bingoWinner || "host";
  const isDecider = viewerRole === bingoWinner;
  const deciderPal = ROLE[bingoWinner];
  const handleNext = () => setR((prev) => ({ ...prev, round: prev.round + 1, phase: "playing" }));
  const handleStop = () => {
    setR((prev) => ({ ...prev, phase: "gameOver" }));
    onGameOver == null ? void 0 : onGameOver();
  };
  const hostPal = ROLE.host;
  const guestPal = ROLE.guest;
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    zIndex: 90,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(6,1,15,0.78)",
    backdropFilter: "blur(8px)",
    animation: "modalFade 300ms ease-out"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    left: 20,
    right: 20,
    top: "50%",
    transform: "translateY(-50%)",
    background: "linear-gradient(180deg, rgba(28,12,46,0.99) 0%, rgba(14,4,26,0.99) 100%)",
    borderRadius: 24,
    padding: "22px 20px 18px",
    border: `1.5px solid ${deciderPal.glow}0.35)`,
    boxShadow: "0 24px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.07)",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    animation: "modalRise 350ms cubic-bezier(.2,1.4,.4,1)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" } }, t ? `ROUND ${r.round} COMPLETE` : `${r.round}\uB77C\uC6B4\uB4DC \uC644\uB8CC`)), /* @__PURE__ */ React.createElement("div", { style: {
    textAlign: "center",
    fontFamily: "'Nura', system-ui, sans-serif",
    fontSize: 52,
    fontWeight: 900,
    letterSpacing: "0.04em",
    color: "white",
    textShadow: `0 0 40px ${deciderPal.glow}0.7), 0 0 80px ${deciderPal.glow}0.4)`,
    lineHeight: 1
  } }, "BINGO!"), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", fontSize: 13, fontWeight: 700, color: deciderPal.primary } }, t ? `${deciderPal.name} completed a bingo line!` : `${deciderPal.name}\uB2D8\uC774 \uBE59\uACE0\uB97C \uC644\uC131\uD588\uC2B5\uB2C8\uB2E4!`), /* @__PURE__ */ React.createElement("div", { style: {
    textAlign: "center",
    fontSize: 11.5,
    fontWeight: 600,
    color: "rgba(255,255,255,0.5)",
    lineHeight: 1.5,
    padding: "6px 10px",
    borderRadius: 8,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)"
  } }, "\u{1F513} ", t ? "All locked cells will be unlocked for the next round." : "\uB2E4\uC74C \uB77C\uC6B4\uB4DC \uC2DC\uC791 \uC2DC \uAE30\uC874 \uC140 \uC7A0\uAE40\uC774 \uD574\uC81C\uB429\uB2C8\uB2E4."), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: "10px 14px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: hostPal.primary, letterSpacing: "0.06em", marginBottom: 3 } }, hostPal.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 20, fontWeight: 900, color: "white" } }, "+", ((_a = scores == null ? void 0 : scores.host) == null ? void 0 : _a.gpPlus) || 0, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.45)", marginLeft: 2 } }, "GP"))), /* @__PURE__ */ React.createElement("div", { style: { width: 1, height: 36, background: "rgba(255,255,255,0.1)" } }), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, color: guestPal.primary, letterSpacing: "0.06em", marginBottom: 3 } }, guestPal.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 20, fontWeight: 900, color: "white" } }, "+", ((_b = scores == null ? void 0 : scores.guest) == null ? void 0 : _b.gpPlus) || 0, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.45)", marginLeft: 2 } }, "GP")))), isDecider ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, canContinue ? /* @__PURE__ */ React.createElement("button", { onClick: handleNext, style: {
    padding: "14px",
    borderRadius: 14,
    border: "none",
    background: deciderPal.gradient,
    color: "white",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: `0 8px 22px ${deciderPal.glow}0.45), inset 0 1px 0 rgba(255,255,255,0.3)`
  } }, t ? `Start Round ${r.round + 1}! \u2192` : `${r.round + 1}\uB77C\uC6B4\uB4DC \uB3C4\uC804\uD558\uAE30 \u2192`) : /* @__PURE__ */ React.createElement("div", { style: {
    padding: "10px 14px",
    borderRadius: 12,
    textAlign: "center",
    background: "rgba(255,221,51,0.12)",
    border: "1px solid rgba(255,221,51,0.3)",
    fontSize: 12,
    fontWeight: 700,
    color: "#FFE566"
  } }, t ? "\u{1F389} All 3 rounds complete!" : "\u{1F389} 3\uB77C\uC6B4\uB4DC \uBAA8\uB450 \uC644\uB8CC!"), /* @__PURE__ */ React.createElement("button", { onClick: handleStop, style: {
    padding: "11px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit"
  } }, t ? "End game" : "\uAC8C\uC784 \uC885\uB8CC")) : /* @__PURE__ */ React.createElement("div", { style: {
    padding: "14px",
    borderRadius: 14,
    textAlign: "center",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    fontSize: 13,
    fontWeight: 700,
    color: "rgba(255,255,255,0.55)"
  } }, t ? `Waiting for ${deciderPal.name} to decide\u2026` : `${deciderPal.name}\uB2D8\uC758 \uC120\uD0DD\uC744 \uAE30\uB2E4\uB9AC\uB294 \uC911\u2026`, /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10 } }, /* @__PURE__ */ React.createElement(PersuasionBars, { palette: deciderPal, size: "sm" })))));
}
Object.assign(window, { VariantJelly, VariantFloat, VariantPop, QuestionModal, PersuasionBars, ROLE, countBingoLines, GPStat, RoundEndPopup });
const GAME_NAMES = {
  ko: { arrow: "\uD654\uC0B4 \uACFC\uB141", soccer: "\uCD95\uAD6C \uC2B9\uBD80\uCC28\uAE30", balloon: "\uD48D\uC120 \uD130\uD2B8\uB9AC\uAE30" },
  en: { arrow: "Arrow Target", soccer: "Penalty Shootout", balloon: "Balloon Pop" }
};
function ArrowGame({ role, isPlayer, onScore }) {
  const pal = ROLE[role];
  const [rings] = useState(() => [80, 60, 40, 20, 10]);
  const [hit, setHit] = useState(null);
  const [done, setDone] = useState(false);
  const svgRef = useRef(null);
  const handleClick = (e) => {
    if (!isPlayer || done) return;
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const cx = rect.width / 2, cy = rect.height / 2;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dist = Math.hypot(x - cx, y - cy);
    const maxR = rect.width / 2;
    let score = 0;
    if (dist < maxR * 0.12) score = 10;
    else if (dist < maxR * 0.28) score = 8;
    else if (dist < maxR * 0.46) score = 6;
    else if (dist < maxR * 0.64) score = 4;
    else if (dist < maxR * 0.82) score = 2;
    else score = 1;
    setHit({ x, y, score });
    setDone(true);
    setTimeout(() => onScore(score), 800);
  };
  const colors = ["#FF4466", "#FF7744", "#FFCC00", "#44CC66", "#4488FF"];
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)", textAlign: "center" } }, isPlayer ? "\uACFC\uB141\uC744 \uD130\uCE58\uD574\uC11C \uD654\uC0B4\uC744 \uC3D8\uC138\uC694!" : "\uC0C1\uB300\uBC29\uC774 \uD654\uC0B4\uC744 \uC3D8\uACE0 \uC788\uC5B4\uC694\u2026"), /* @__PURE__ */ React.createElement(
    "svg",
    {
      ref: svgRef,
      width: "220",
      height: "220",
      viewBox: "0 0 220 220",
      onClick: handleClick,
      style: { cursor: isPlayer && !done ? "crosshair" : "default", userSelect: "none" }
    },
    [82, 66, 50, 34, 18].map((r, i) => /* @__PURE__ */ React.createElement("circle", { key: i, cx: "110", cy: "110", r, fill: colors[i], stroke: "rgba(0,0,0,0.2)", strokeWidth: "1.5" })),
    /* @__PURE__ */ React.createElement("circle", { cx: "110", cy: "110", r: "5", fill: "white" }),
    hit && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("line", { x1: hit.x - 8, y1: hit.y, x2: hit.x + 8, y2: hit.y, stroke: "white", strokeWidth: "2.5", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("line", { x1: hit.x, y1: hit.y - 8, x2: hit.x, y2: hit.y + 8, stroke: "white", strokeWidth: "2.5", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("circle", { cx: hit.x, cy: hit.y, r: "5", fill: "none", stroke: "white", strokeWidth: "2" }))
  ), hit && /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 28,
    fontWeight: 900,
    color: pal.primary,
    textShadow: `0 0 20px ${pal.glow}0.8)`,
    animation: "bingoPop 400ms cubic-bezier(.34,1.7,.4,1) forwards"
  } }, hit.score, "\uC810!"));
}
function SoccerGame({ role, isPlayer, onScore }) {
  var _a;
  const pal = ROLE[role];
  const ZONES = [
    { id: "tl", label: "\u2196", x: 0, y: 0, pts: 3 },
    { id: "tc", label: "\u2191", x: 1, y: 0, pts: 2 },
    { id: "tr", label: "\u2197", x: 2, y: 0, pts: 3 },
    { id: "ml", label: "\u2190", x: 0, y: 1, pts: 2 },
    { id: "mc", label: "\xB7", x: 1, y: 1, pts: 1 },
    { id: "mr", label: "\u2192", x: 2, y: 1, pts: 2 }
  ];
  const [chosen, setChosen] = useState(null);
  const [saved, setSaved] = useState(null);
  const [done, setDone] = useState(false);
  const shoot = (zone) => {
    if (!isPlayer || done) return;
    const saveZone = ZONES[Math.floor(Math.random() * ZONES.length)].id;
    setSaved(saveZone);
    setChosen(zone.id);
    setDone(true);
    const scored = zone.id !== saveZone;
    const score = scored ? zone.pts : 0;
    setTimeout(() => onScore(score), 1e3);
  };
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)", textAlign: "center" } }, isPlayer ? "\uACE8\uB300 \uBC29\uD5A5\uC744 \uC120\uD0DD\uD558\uC138\uC694!" : "\uC0C1\uB300\uBC29\uC774 \uC29B\uC744 \uC900\uBE44 \uC911\u2026"), /* @__PURE__ */ React.createElement("div", { style: {
    width: 240,
    border: "3px solid white",
    borderRadius: "4px 4px 0 0",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    background: "rgba(50,180,80,0.18)",
    overflow: "hidden"
  } }, ZONES.map((z) => {
    const isChosen = chosen === z.id;
    const isSaved = saved === z.id;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: z.id,
        onClick: () => shoot(z),
        style: {
          height: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: isPlayer && !done ? "pointer" : "default",
          background: isChosen && isSaved ? "rgba(255,60,60,0.55)" : isChosen ? `${pal.glow}0.65)` : isSaved && done ? "rgba(255,255,255,0.2)" : "transparent",
          border: "1px solid rgba(255,255,255,0.15)",
          fontSize: 22,
          color: "white",
          transition: "background 200ms",
          position: "relative"
        }
      },
      isChosen && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 28 } }, "\u26BD"),
      isSaved && done && !isChosen && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 22 } }, "\u{1F9E4}"),
      !isChosen && !isSaved && /* @__PURE__ */ React.createElement("span", { style: { opacity: 0.3, fontSize: 16 } }, z.label)
    );
  })), /* @__PURE__ */ React.createElement("div", { style: { width: 260, height: 8, background: "rgba(50,180,80,0.4)", borderRadius: 4 } }), done && /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 20,
    fontWeight: 900,
    color: chosen !== saved ? pal.primary : "#FF8A92",
    animation: "bingoPop 400ms cubic-bezier(.34,1.7,.4,1) forwards"
  } }, chosen !== saved ? `\uACE8! +${(_a = ZONES.find((z) => z.id === chosen)) == null ? void 0 : _a.pts}\uC810` : "\uB9C9\uD614\uB2E4! 0\uC810"));
}
function BalloonGame({ role, isPlayer, onScore }) {
  const pal = ROLE[role];
  const TOTAL = 9;
  const [popped, setPopped] = useState(/* @__PURE__ */ new Set());
  const [timeLeft, setTimeLeft] = useState(5);
  const [active, setActive] = useState(isPlayer);
  const timerRef = useRef(null);
  useEffect(() => {
    if (!isPlayer || !active) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setActive(false);
          return 0;
        }
        return t - 1;
      });
    }, 1e3);
    return () => clearInterval(timerRef.current);
  }, [isPlayer]);
  useEffect(() => {
    if (!active && isPlayer) {
      const score = Math.min(popped.size * 2, 10);
      setTimeout(() => onScore(score), 600);
    }
  }, [active]);
  const pop = (i) => {
    if (!isPlayer || !active || popped.has(i)) return;
    setPopped((p) => /* @__PURE__ */ new Set([...p, i]));
  };
  const colors = ["#FF4488", "#FF8844", "#FFCC00", "#44CC88", "#4488FF", "#AA44FF", "#FF44CC", "#44CCFF", "#88FF44"];
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", width: "100%", padding: "0 4px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)" } }, isPlayer ? "\uD48D\uC120\uC744 \uD130\uD2B8\uB9AC\uC138\uC694!" : "\uC0C1\uB300\uBC29\uC774 \uD48D\uC120\uC744 \uD130\uD2B8\uB9AC\uB294 \uC911\u2026"), isPlayer && /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 20,
    fontWeight: 900,
    color: timeLeft <= 2 ? "#FF8A92" : pal.primary,
    animation: timeLeft <= 2 ? "turnPillPulse 0.5s ease-in-out infinite" : "none"
  } }, timeLeft, "s")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, padding: "0 8px", width: "100%" } }, Array.from({ length: TOTAL }).map((_, i) => /* @__PURE__ */ React.createElement("div", { key: i, onClick: () => pop(i), style: {
    aspectRatio: "1/1",
    borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
    background: popped.has(i) ? "rgba(255,255,255,0.08)" : colors[i],
    border: popped.has(i) ? "1px dashed rgba(255,255,255,0.2)" : "none",
    cursor: isPlayer && active && !popped.has(i) ? "pointer" : "default",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    boxShadow: popped.has(i) ? "none" : `0 4px 12px ${colors[i]}88`,
    transition: "all 120ms",
    transform: popped.has(i) ? "scale(0.7)" : "scale(1)"
  } }, popped.has(i) ? "\u{1F4A5}" : "\u{1F388}"))), !active && isPlayer && /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 20,
    fontWeight: 900,
    color: pal.primary,
    animation: "bingoPop 400ms cubic-bezier(.34,1.7,.4,1) forwards"
  } }, popped.size, "\uAC1C \uD130\uD2B8\uB9BC! +", Math.min(popped.size * 2, 10), "\uC810"));
}
function MiniGamePlay({ gameKind, role, isPlayer, onScore }) {
  const props = { role, isPlayer, onScore };
  if (gameKind === "arrow") return /* @__PURE__ */ React.createElement(ArrowGame, { ...props });
  if (gameKind === "soccer") return /* @__PURE__ */ React.createElement(SoccerGame, { ...props });
  if (gameKind === "balloon") return /* @__PURE__ */ React.createElement(BalloonGame, { ...props });
  return null;
}
function ScoreBar({ p1Role, p2Role, p1Score, p2Score, lang }) {
  const p1Pal = ROLE[p1Role];
  const p2Pal = ROLE[p2Role];
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6
  } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 700, color: p1Pal.primary } }, p1Pal.name), /* @__PURE__ */ React.createElement("span", { style: {
    fontSize: 22,
    fontWeight: 900,
    color: p1Score != null ? p1Pal.primary : "rgba(255,255,255,0.25)",
    textShadow: p1Score != null ? `0 0 16px ${p1Pal.glow}0.7)` : "none",
    minWidth: 28,
    textAlign: "right"
  } }, p1Score != null ? p1Score : "\u2014")), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)" } }, "vs"), /* @__PURE__ */ React.createElement("div", { style: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 6
  } }, /* @__PURE__ */ React.createElement("span", { style: {
    fontSize: 22,
    fontWeight: 900,
    color: p2Score != null ? p2Pal.primary : "rgba(255,255,255,0.25)",
    textShadow: p2Score != null ? `0 0 16px ${p2Pal.glow}0.7)` : "none",
    minWidth: 28,
    textAlign: "left"
  } }, p2Score != null ? p2Score : "\u2014"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 700, color: p2Pal.primary } }, p2Pal.name)));
}
function MinigameOverlay({ sharedMinigame, viewerRole, lang, onResolve }) {
  const [mg, setMg] = sharedMinigame;
  if (!mg) return null;
  const { phase, gameKind, p1Role, p2Role, p1Score, p2Score, kind } = mg;
  const p1Pal = ROLE[p1Role];
  const p2Pal = ROLE[p2Role];
  const t = lang === "en";
  const activeRole = phase === "p1_confirm" || phase === "p1_playing" ? p1Role : p2Role;
  const isMyTurn = viewerRole === activeRole;
  const activePal = ROLE[activeRole];
  const advance = (update) => setMg((prev) => ({ ...prev, ...update }));
  if (phase === "p1_confirm" || phase === "p2_confirm") {
    const isP1 = phase === "p1_confirm";
    const opponentScore = isP1 ? null : p1Score;
    return /* @__PURE__ */ React.createElement(Overlay, null, /* @__PURE__ */ React.createElement(GameHeader, { gameKind, lang, mg }), /* @__PURE__ */ React.createElement(ScoreBar, { p1Role, p2Role, p1Score, p2Score, lang }), /* @__PURE__ */ React.createElement("div", { style: { height: 1, background: "rgba(255,255,255,0.08)", margin: "4px 0" } }), isMyTurn ? (
      // My confirm turn
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, alignItems: "stretch" } }, /* @__PURE__ */ React.createElement("div", { style: {
        textAlign: "center",
        fontSize: 13,
        fontWeight: 700,
        color: "rgba(255,255,255,0.85)",
        padding: "6px 0 0",
        lineHeight: 1.4
      } }, isP1 ? mg.kind === "unlock" ? t ? `${activePal.name} is trying to unlock` : `${activePal.name}\uB2D8\uC774 \uC7A0\uAE08\uC744 \uD480\uB824\uACE0 \uD569\uB2C8\uB2E4` : t ? `${activePal.name} is attacking` : `${activePal.name}\uB2D8\uC774 \uACF5\uACA9\uC744 \uC2DC\uB3C4\uD569\uB2C8\uB2E4` : t ? `It's ${activePal.name}'s turn.` : `${activePal.name}\uB2D8\uC758 \uCC28\uB840\uC785\uB2C8\uB2E4.`), /* @__PURE__ */ React.createElement("div", { style: {
        textAlign: "center",
        fontSize: 11.5,
        fontWeight: 600,
        color: "rgba(255,255,255,0.45)",
        lineHeight: 1.4,
        padding: "2px 8px 4px"
      } }, t ? "The player with the higher score wins the tile." : "\uBBF8\uB2C8\uAC8C\uC784\uC740 \uB354 \uB192\uC740 \uC810\uC218\uB97C \uD68D\uB4DD\uD55C \uCABD\uC774 \uC2B9\uB9AC\uD569\uB2C8\uB2E4"), /* @__PURE__ */ React.createElement("div", { style: {
        textAlign: "center",
        fontSize: 12.5,
        fontWeight: 700,
        color: activePal.primary,
        lineHeight: 1.4,
        marginBottom: 4
      } }, `\u300C${(GAME_NAMES[lang] || GAME_NAMES.ko)[mg.gameKind]}\u300D${t ? " \u2014 Ready?" : "\uB97C \uC2DC\uC791\uD558\uC2DC\uACA0\uC5B4\uC694?"}`), !isP1 && opponentScore != null && /* @__PURE__ */ React.createElement("div", { style: {
        textAlign: "center",
        fontSize: 13,
        fontWeight: 800,
        color: p1Pal.primary,
        marginBottom: 0,
        padding: "2px 10px",
        borderRadius: 8,
        background: `${p1Pal.glow}0.15)`
      } }, p1Pal.name, ": ", opponentScore, t ? "pts" : "\uC810"), /* @__PURE__ */ React.createElement("button", { onClick: () => advance({ phase: isP1 ? "p1_playing" : "p2_playing" }), style: {
        padding: "14px",
        borderRadius: 14,
        border: "none",
        background: activePal.gradient,
        color: "white",
        fontSize: 14,
        fontWeight: 800,
        cursor: "pointer",
        fontFamily: "inherit",
        boxShadow: `0 8px 22px ${activePal.glow}0.55), inset 0 1px 0 rgba(255,255,255,0.3)`
      } }, t ? `${activePal.name} \u2014 Start!` : `${activePal.name} \uBA3C\uC800 \uB3C4\uC804`), /* @__PURE__ */ React.createElement("button", { onClick: () => {
        if (isP1) advance({ phase: "p2_confirm", p1Score: 0 });
        else {
          advance({ phase: "result", p2Score: 0 });
        }
      }, style: {
        padding: "11px",
        borderRadius: 12,
        background: "rgba(255,80,90,0.1)",
        border: "1px solid rgba(255,80,90,0.4)",
        color: "#FF8A92",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "inherit"
      } }, t ? "Forfeit (0pts)" : "\uD3EC\uAE30 (0\uC810 \uCC98\uB9AC)"))
    ) : (
      // Waiting for opponent to confirm
      /* @__PURE__ */ React.createElement("div", { style: {
        padding: "20px 14px",
        borderRadius: 12,
        textAlign: "center",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)"
      } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)", marginBottom: 12 } }, t ? `Waiting for ${activePal.name}\u2026` : `${activePal.name}\uB2D8\uC758 \uC120\uD0DD\uC744 \uAE30\uB2E4\uB9AC\uB294 \uC911\u2026`), /* @__PURE__ */ React.createElement(PersuasionBars, { palette: activePal, size: "sm" }))
    ));
  }
  if (phase === "p1_playing" || phase === "p2_playing") {
    const isP1 = phase === "p1_playing";
    const playerRole = isP1 ? p1Role : p2Role;
    const isPlayer = viewerRole === playerRole;
    const playerPal = ROLE[playerRole];
    const handleScore = (score) => {
      if (isP1) advance({ phase: "p2_confirm", p1Score: score });
      else advance({ phase: "result", p2Score: score });
    };
    return /* @__PURE__ */ React.createElement(Overlay, { noPad: true }, /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 18px 10px" } }, /* @__PURE__ */ React.createElement(GameHeader, { gameKind, lang, mg }), /* @__PURE__ */ React.createElement(ScoreBar, { p1Role, p2Role, p1Score, p2Score, lang })), /* @__PURE__ */ React.createElement("div", { style: {
      margin: "0 14px 14px",
      padding: "14px",
      borderRadius: 16,
      background: isPlayer ? `linear-gradient(180deg, ${playerPal.glow}0.12), rgba(14,4,26,0.95))` : "rgba(255,255,255,0.03)",
      border: `1.5px solid ${playerPal.glow}${isPlayer ? "0.45)" : "0.18)"}`
    } }, !isPlayer && /* @__PURE__ */ React.createElement("div", { style: {
      textAlign: "center",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.1em",
      color: playerPal.primary,
      marginBottom: 10,
      opacity: 0.8
    } }, "\u{1F441} ", t ? `Spectating ${playerPal.name}` : `${playerPal.name}\uB2D8 \uAD00\uC804 \uC911`), /* @__PURE__ */ React.createElement(
      MiniGamePlay,
      {
        gameKind,
        role: playerRole,
        isPlayer,
        onScore: handleScore
      }
    )));
  }
  if (phase === "result") {
    const winner = p1Score > p2Score ? p1Role : p2Score > p1Score ? p2Role : null;
    const effectiveWinner = winner || mg.p1Role;
    const winnerPal = ROLE[effectiveWinner];
    const isDraw = p1Score === p2Score;
    return /* @__PURE__ */ React.createElement(Overlay, null, /* @__PURE__ */ React.createElement(GameHeader, { gameKind, lang, mg }), /* @__PURE__ */ React.createElement(ScoreBar, { p1Role, p2Role, p1Score, p2Score, lang }), /* @__PURE__ */ React.createElement("div", { style: { height: 1, background: "rgba(255,255,255,0.08)", margin: "6px 0" } }), /* @__PURE__ */ React.createElement("div", { style: {
      textAlign: "center",
      padding: "12px 16px 8px"
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 11,
      fontWeight: 700,
      color: "rgba(255,255,255,0.5)",
      marginBottom: 6
    } }, isDraw ? t ? "Draw \u2014 challenger wins!" : "\uB3D9\uC810! \uB3C4\uC804\uC790 \uC2B9\uB9AC" : ""), /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 24,
      fontWeight: 900,
      color: winnerPal.primary,
      textShadow: `0 0 30px ${winnerPal.glow}0.8), 0 0 60px ${winnerPal.glow}0.4)`,
      animation: "modalRise 500ms cubic-bezier(.34,1.7,.4,1) forwards",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    } }, winnerPal.name, " ", t ? "wins! \u{1F389}" : "\uC2B9\uB9AC! \u{1F389}")), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      if (mg.showAd) {
        advance({ phase: "ad", winner: effectiveWinner });
      } else {
        onResolve(effectiveWinner);
        setMg(null);
      }
    }, style: {
      width: "100%",
      padding: "13px",
      borderRadius: 14,
      border: "none",
      background: winnerPal.gradient,
      color: "white",
      fontSize: 13,
      fontWeight: 800,
      cursor: "pointer",
      fontFamily: "inherit",
      boxShadow: `0 6px 20px ${winnerPal.glow}0.5), inset 0 1px 0 rgba(255,255,255,0.3)`,
      marginTop: 8
    } }, mg.showAd ? t ? "Watch ad \u2192 return to bingo board" : "\uAD11\uACE0 \uC2DC\uCCAD \uD6C4 \uBE59\uACE0\uBCF4\uB4DC\uB85C \uC774\uB3D9 \u2192" : t ? "Back to bingo board \u2192" : "\uBE59\uACE0\uBCF4\uB4DC\uB85C \uB3CC\uC544\uAC00\uAE30 \u2192"));
  }
  if (phase === "ad") {
    return /* @__PURE__ */ React.createElement(AdOverlay, { mg, viewerRole, lang, onDone: () => {
      onResolve(mg.winner);
      setMg(null);
    } });
  }
  return null;
}
function AdOverlay({ mg, viewerRole, lang, onDone }) {
  const [sec, setSec] = useState(5);
  const t = lang === "en";
  const winnerPal = ROLE[mg.winner];
  useEffect(() => {
    const id = setInterval(() => {
      setSec((s) => {
        if (s <= 1) {
          clearInterval(id);
          setTimeout(onDone, 400);
          return 0;
        }
        return s - 1;
      });
    }, 1e3);
    return () => clearInterval(id);
  }, []);
  return /* @__PURE__ */ React.createElement(Overlay, null, /* @__PURE__ */ React.createElement("div", { style: {
    textAlign: "center",
    padding: "6px 12px",
    borderRadius: 999,
    marginBottom: 8,
    background: "rgba(255,221,51,0.15)",
    border: "1px solid rgba(255,221,51,0.4)",
    fontSize: 11,
    fontWeight: 700,
    color: "#FFE566",
    letterSpacing: "0.06em"
  } }, "\u{1F4FA} ", t ? "Both players are watching an ad" : "\uC591\uCABD \uBAA8\uB450 \uAD11\uACE0\uB97C \uC2DC\uCCAD \uC911\uC785\uB2C8\uB2E4"), /* @__PURE__ */ React.createElement("div", { style: {
    borderRadius: 14,
    overflow: "hidden",
    border: "1px dashed rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.03)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: 160,
    gap: 8,
    position: "relative"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0 6px, transparent 6px 14px)`
  } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em" } }, "AD \xB7 320\xD7160"), /* @__PURE__ */ React.createElement("div", { style: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: `conic-gradient(${winnerPal.primary} ${(5 - sec) / 5 * 360}deg, rgba(255,255,255,0.1) 0deg)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    fontWeight: 900,
    color: "white"
  } }, sec), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 600 } }, t ? `Skip in ${sec}s` : `${sec}\uCD08 \uD6C4 \uC2A4\uD0B5`)), /* @__PURE__ */ React.createElement("div", { style: {
    textAlign: "center",
    padding: "10px 0 4px",
    fontSize: 13,
    fontWeight: 700,
    color: winnerPal.primary
  } }, winnerPal.name, " ", t ? "wins the tile!" : "\uBE59\uACE0\uCE78 \uD68D\uB4DD!"));
}
function Overlay({ children, noPad = false }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    zIndex: 35,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "modalFade 220ms ease-out"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    background: "rgba(6,1,15,0.72)",
    backdropFilter: "blur(6px)"
  } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    left: 16,
    right: 16,
    top: "50%",
    transform: "translateY(-50%)",
    maxHeight: "calc(100% - 260px)",
    background: "linear-gradient(180deg, rgba(28,12,46,0.99) 0%, rgba(14,4,26,0.99) 100%)",
    borderRadius: 24,
    padding: noPad ? 0 : "18px 18px 16px",
    border: "1.5px solid rgba(255,255,255,0.1)",
    boxShadow: "0 24px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.07)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    overflow: "hidden",
    animation: "modalRise 320ms cubic-bezier(.2,1.4,.4,1)"
  } }, children));
}
function GameHeader({ gameKind, lang, mg }) {
  const t = lang === "en";
  const names = GAME_NAMES[lang] || GAME_NAMES.ko;
  const kindLabel = mg.kind === "attack" ? t ? "ATTACK" : "\uACF5\uACA9" : t ? "UNLOCK" : "\uC7A0\uAE08 \uD574\uC81C";
  return /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4
  } }, /* @__PURE__ */ React.createElement("span", { style: {
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.14em",
    color: mg.kind === "attack" ? "#FF8A92" : "rgba(255,255,255,0.55)",
    textTransform: "uppercase"
  } }, kindLabel), /* @__PURE__ */ React.createElement("span", { style: {
    fontSize: 11,
    fontWeight: 700,
    color: "rgba(255,255,255,0.8)",
    background: "rgba(255,255,255,0.08)",
    padding: "3px 10px",
    borderRadius: 999
  } }, names[gameKind] || gameKind));
}
Object.assign(window, { MinigameOverlay, GAME_NAMES });
const SEED_CELLS = {
  "0,0": { state: "won", role: "host", ownerInitial: "Y" },
  "0,1": { state: "won", role: "host", ownerInitial: "Y" },
  "0,2": { state: "won", role: "host", ownerInitial: "Y" },
  "2,3": { state: "won", role: "guest", ownerInitial: "M" },
  "3,1": { state: "won", role: "guest", ownerInitial: "M" }
};
const LINES = (() => {
  const L = [];
  for (let r = 0; r < 5; r++) L.push([0, 1, 2, 3, 4].map((c) => `${r},${c}`));
  for (let c = 0; c < 5; c++) L.push([0, 1, 2, 3, 4].map((r) => `${r},${c}`));
  L.push(["0,0", "1,1", "2,2", "3,3", "4,4"]);
  L.push(["0,4", "1,3", "2,2", "3,1", "4,0"]);
  return L;
})();
function pickBotCell(cells) {
  const occ = (k) => cells[k] && ["won", "confirmed", "reserved", "locked"].includes(cells[k].state);
  const ownerOf = (k) => cells[k] && (cells[k].state === "won" || cells[k].state === "confirmed") ? cells[k].role : null;
  let best = null, bestScore = -1e9;
  for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
    const key = `${r},${c}`;
    if (occ(key)) continue;
    let score = Math.random() * 0.4;
    for (const ln of LINES) {
      if (!ln.includes(key)) continue;
      let g = 0, h = 0;
      for (const k of ln) {
        const o = ownerOf(k);
        if (o === "guest") g++;
        else if (o === "host") h++;
      }
      if (h === 0) score += (g + 1) * (g + 1);
      if (g === 0 && h > 0) score -= h * h * 1.5;
    }
    if (score > bestScore) {
      bestScore = score;
      best = key;
    }
  }
  return best;
}
function botQuestionType(r, c) {
  const s = (r * 7 + c * 3 + r * c) % 7;
  return s < 4 ? "T" : "B";
}
const BOT_TRUTH = ["\uC74C\u2026 \uADF8\uAC74 \uBE44\uBC00\uB85C \uD560\uB798 \u314E\u314E", "\uAE00\uC384, \uC544\uC9C1 \uC798 \uBAA8\uB974\uACA0\uC5B4", "\uB108\uB294 \uC5B4\uB5BB\uAC8C \uC0DD\uAC01\uD574?", "\uADF8\uB0E5 \uADF8\uB7F0 \uB0A0\uC774\uC5C8\uC5B4"];
const BOT_BALANCE = ["\uC74C, \uB09C \uC774\uCABD!", "\uACE0\uBBFC\uB418\uC9C0\uB9CC \uC774\uAC78\uB85C", "\uC9C1\uAC10\uC801\uC73C\uB85C \uC774\uAC70", "\uBC18\uBC18\uC778\uB370 \uAD73\uC774 \uACE0\uB974\uBA74 \uC774\uAC70"];
function botAnswer(type) {
  const p = type === "B" ? BOT_BALANCE : BOT_TRUTH;
  return p[Math.floor(Math.random() * p.length)];
}
const BOT_CHAT = ["\uC624 \uC88B\uC740 \uC9C8\uBB38\uC774\uB2E4 \u314E\u314E", "\uC74C \uB098\uB3C4 \uBE44\uC2B7\uD574!", "\uADF8\uAC74 \uC0DD\uAC01 \uBABB \uD588\uB124", "\uB9DE\uC544 \uB9DE\uC544 \u{1F60A}", "\uB108\uB791 \uC598\uAE30\uD558\uB2C8\uAE4C \uC7AC\uBC0C\uB2E4", "\uC624 \uADF8\uB798? \uB354 \uB9D0\uD574\uBD10"];
function DemoApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const setLang = (v) => setTweak("lang", v);
  const sharedCells = useState({ ...SEED_CELLS });
  const sharedTurn = useState("host");
  const sharedAttacks = useState({ host: 2, guest: 2 });
  const sharedMinigame = useState(null);
  const sharedHistory = useState([]);
  const sharedRound = useState({ round: 1, phase: "playing", bingoLines: { host: 0, guest: 0 } });
  const [scores, setScores] = useState({ host: { gp: 0, np: 0 }, guest: { gp: 0, np: 0 } });
  const sharedModal = useState(null);
  const [, setModal] = sharedModal;
  const [cells, setCells] = sharedCells;
  const [turn, setTurn] = sharedTurn;
  const bingoLines = useMemo(() => ({
    host: window.countBingoLines ? window.countBingoLines(cells, "host") : 0,
    guest: window.countBingoLines ? window.countBingoLines(cells, "guest") : 0
  }), [cells]);
  const [phase, setPhase] = useState("play");
  const [lastReveal, setLastReveal] = useState(null);
  const [reviewLong, setReviewLong] = useState(false);
  const wonRef = useRef(false);
  useEffect(() => {
    if (wonRef.current) return;
    const winner = bingoLines.host > 0 ? "host" : bingoLines.guest > 0 ? "guest" : null;
    if (!winner) return;
    wonRef.current = true;
    setPhase("won");
    setTimeout(() => {
      const ko2 = t.lang !== "en";
      const cta = document.getElementById("cta");
      const h = cta.querySelector("h2"), p = cta.querySelector("p");
      h.textContent = winner === "host" ? ko2 ? "\u{1F389} \uBE59\uACE0!" : "\u{1F389} Bingo!" : ko2 ? "\u{1F60F} \uCE5C\uAD6C \uBE59\uACE0!" : "\u{1F60F} Friend wins!";
      const ctx = window.__TB_CTX;
      p.innerHTML = ctx === "inapp" ? ko2 ? "\uC774\uC81C \uCE5C\uAD6C\uB97C \uCD08\uB300\uD574<br>\uC9C4\uC9DC\uB85C \uD50C\uB808\uC774\uD574\uBCF4\uC138\uC694!" : "Now invite a friend<br>and play for real!" : ko2 ? "\uAC8C\uC784 \uCCB4\uD5D8\uC774 \uC544\uC26C\uC6E0\uB098\uC694?<br>\uB354 \uB2E4\uC591\uD55C \uC11C\uBE44\uC2A4\uAC00 \uC571\uC5D0 \uC900\uBE44\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4." : "Want more than a quick game?<br>The app has a lot more in store.";
      const dl = cta.querySelector(".dl"), back = cta.querySelector(".back");
      cta.querySelector(".again").textContent = ko2 ? "\uB2E4\uC2DC \uD574\uBCF4\uAE30" : "Play again";
      if (ctx === "inapp") {
        dl.style.display = "none";
        back.style.display = "inline-block";
        back.classList.add("primary");
        back.textContent = ko2 ? "\uACC4\uC18D\uD558\uAE30" : "Continue";
      } else {
        dl.style.display = "inline-block";
        dl.textContent = ko2 ? "\uC571 \uB2E4\uC6B4\uB85C\uB4DC \u2193" : "Download the app \u2193";
        back.classList.remove("primary");
        back.style.display = ctx === "company" ? "inline-block" : "none";
        back.textContent = ko2 ? "\u2190 \uB418\uB3CC\uC544 \uAC00\uAE30" : "\u2190 Back";
      }
      cta.classList.add("on");
    }, 1400);
  }, [bingoLines.host, bingoLines.guest]);
  const handleResolveModal = ({ ownerRole, key, verdict = "approve" }) => {
    const resolveQ = window.__bingoBoard_resolveQuestion;
    if (resolveQ && key) resolveQ(key, ownerRole, verdict, ownerRole === "host" ? "Y" : "M");
    if (verdict === "approve") setScores((s) => ({ ...s, [ownerRole]: { ...s[ownerRole], gp: s[ownerRole].gp + 1 } }));
    const reveal = { ownerRole, approved: verdict === "approve" };
    setLastReveal(reveal);
    setTimeout(() => setLastReveal((prev) => prev === reveal ? null : prev), 2500);
    setTurn(ownerRole === "host" ? "guest" : "host");
    botBusy.current = false;
    setModal(null);
  };
  const botBusy = useRef(false);
  useEffect(() => {
    if (phase !== "play" || turn !== "guest" || botBusy.current) return;
    botBusy.current = true;
    const timers = [];
    timers.push(setTimeout(() => {
      const key = pickBotCell(cells);
      if (!key) {
        botBusy.current = false;
        return;
      }
      const [r, c] = key.split(",").map(Number);
      const type = botQuestionType(r, c);
      const seed = r * 5 + c;
      const bus = `__qm_${seed}_${type}`;
      setCells((c0) => ({ ...c0, [key]: { state: "reserved", role: "guest" } }));
      timers.push(setTimeout(() => {
        setCells((c1) => ({ ...c1, [key]: { state: "confirmed", role: "guest" } }));
        setModal({ type, seed, ownerRole: "guest", key });
        timers.push(setTimeout(() => {
          window[bus] = { step: "reviewing", answer: botAnswer(type) };
          window.dispatchEvent(new CustomEvent(bus));
        }, 2800));
      }, 1300));
    }, 2e3));
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [turn, phase]);
  useEffect(() => {
    window.__setDemoLang = (l) => setTweak("lang", l);
  }, []);
  const botChatReplied = useRef(null);
  useEffect(() => {
    const onChat = () => {
      const list = window.__tbChat || [];
      const last = list[list.length - 1];
      if (!last || last.who !== "host" || botChatReplied.current === last.id) return;
      botChatReplied.current = last.id;
      setTimeout(() => {
        window.__tbChatId = (window.__tbChatId || 0) + 1;
        window.__tbChat = [...window.__tbChat || [], { id: "m" + window.__tbChatId, who: "guest", text: BOT_CHAT[Math.floor(Math.random() * BOT_CHAT.length)] }];
        window.dispatchEvent(new CustomEvent("tbchat"));
      }, 1400);
    };
    window.addEventListener("tbchat", onChat);
    return () => window.removeEventListener("tbchat", onChat);
  }, []);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth < 760);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 760);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  const carRef = useRef(null);
  const common = {
    tweaks: t,
    setTweak,
    sharedCells,
    sharedModal,
    onResolveModal: handleResolveModal,
    sharedTurn,
    sharedAttacks,
    sharedMinigame,
    sharedHistory,
    sharedRound,
    onMinigameWin: () => {
    },
    scores,
    bingoLines,
    lang: t.lang,
    setLang,
    onExit: () => {
    }
  };
  const lang = t.lang;
  const modalNow = sharedModal[0];
  const [modalStep, setModalStep] = useState("answering");
  useEffect(() => {
    if (!modalNow) {
      setModalStep("answering");
      return;
    }
    const busKey = `__qm_${modalNow.seed}_${modalNow.type}`;
    const read = () => setModalStep(window[busKey] && window[busKey].step || "answering");
    read();
    window.addEventListener(busKey, read);
    return () => window.removeEventListener(busKey, read);
  }, [modalNow && modalNow.seed, modalNow && modalNow.type]);
  useEffect(() => {
    if (modalStep !== "reviewing" || !modalNow || modalNow.ownerRole !== "host") return;
    const tm = setTimeout(() => {
      handleResolveModal({ ownerRole: modalNow.ownerRole, key: modalNow.key });
      delete window[`__qm_${modalNow.seed}_${modalNow.type}`];
    }, 2800);
    return () => clearTimeout(tm);
  }, [modalStep, modalNow && modalNow.key]);
  useEffect(() => {
    setReviewLong(false);
    if (!modalNow || modalStep !== "reviewing" || modalNow.ownerRole !== "host") return;
    const tm = setTimeout(() => setReviewLong(true), 1600);
    return () => clearTimeout(tm);
  }, [modalStep, modalNow && modalNow.key]);
  let activeRole;
  if (phase === "won") activeRole = null;
  else if (modalNow) activeRole = modalStep === "reviewing" ? modalNow.ownerRole === "host" ? "guest" : "host" : modalNow.ownerRole;
  else activeRole = turn;
  const dimHost = activeRole && activeRole !== "host";
  const dimGuest = activeRole && activeRole !== "guest";
  let instr, processing = false;
  const ko = lang !== "en";
  if (phase === "won") {
    instr = ko ? "\u{1F389} \uBE59\uACE0!" : "\u{1F389} Bingo!";
  } else if (lastReveal) {
    if (lastReveal.ownerRole === "host") {
      instr = lastReveal.approved ? ko ? "\u{1F389} \uCE5C\uAD6C\uAC00 \uACF5\uAC10\uD588\uC5B4\uC694 \u2014 \uBE59\uACE0 \uC140 \uD68D\uB4DD!" : "\u{1F389} Friend approved \u2014 cell won!" : ko ? "\uCE5C\uAD6C\uAC00 \uBE44\uACF5\uAC10\uD588\uC5B4\uC694 \u2014 \uC140\uC774 \uC7A0\uACBC\uC5B4\uC694" : "Friend rejected \u2014 cell locked";
    } else {
      instr = lastReveal.approved ? ko ? "\uCE5C\uAD6C\uAC00 \uBE59\uACE0 \uC140\uC744 \uD68D\uB4DD\uD588\uC5B4\uC694" : "Friend won a cell" : ko ? "\uCE5C\uAD6C\uC758 \uC140\uC774 \uC7A0\uACBC\uC5B4\uC694" : "Friend's cell locked";
    }
  } else if (modalNow) {
    const friend = modalNow.ownerRole === "guest";
    if (friend) {
      if (modalStep === "reviewing") {
        instr = ko ? "\uACF5\uAC10/\uBE44\uACF5\uAC10 \uC911\uC5D0 \uD558\uB098\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694" : "Choose: approve or pass on friend's answer";
      } else {
        instr = ko ? "\uCE5C\uAD6C\uAC00 \uC9C8\uBB38\uC744 \uBCF4\uB294 \uC911\uC774\uC5D0\uC694" : "Friend is reading the question\u2026";
        processing = true;
      }
    } else {
      if (modalStep === "reviewing") {
        instr = reviewLong ? ko ? "\uCE5C\uAD6C\uC758 \uC758\uACAC\uC744 \uAE30\uB2E4\uB9AC\uB294 \uC911\u2026" : "Waiting for friend's reaction\u2026" : ko ? "\uCE5C\uAD6C\uAC00 \uB2F9\uC2E0\uC758 \uB2F5\uC744 \uBCF4\uACE0 \uC788\uC5B4\uC694" : "Friend is reading your answer";
        processing = true;
      } else {
        instr = modalNow.type === "B" ? ko ? "\uC120\uD0DD\uC9C0\uB97C \uACE8\uB77C\uC8FC\uC138\uC694" : "Choose your option" : ko ? "\uC9C8\uBB38\uC5D0 \uB2F5\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694" : "Type your answer to the question";
      }
    }
  } else if (turn === "guest") {
    instr = ko ? "\uC774\uBC88\uC5D4 \uCE5C\uAD6C\uC758 \uCC28\uB840\uC608\uC694" : "It's your friend's turn";
    processing = true;
  } else {
    instr = ko ? "\uBE59\uACE0\uD560 \uCE78\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694" : "Pick a cell to play";
  }
  const arrow = activeRole === "host" ? "\u2190" : activeRole === "guest" ? "\u2192" : "";
  useEffect(() => {
    if (!isMobile || !carRef.current) return;
    const idx = activeRole === "guest" ? 0 : 1;
    const card = carRef.current.children[idx];
    if (card) setTimeout(() => card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" }), 60);
  }, [activeRole, isMobile]);
  const hud = /* @__PURE__ */ React.createElement(React.Fragment, null, arrow && /* @__PURE__ */ React.createElement("div", { className: "arrow" }, arrow), /* @__PURE__ */ React.createElement("div", { className: "instr" }, instr), processing && /* @__PURE__ */ React.createElement("div", { className: "proc" }, /* @__PURE__ */ React.createElement("span", null), /* @__PURE__ */ React.createElement("span", null), /* @__PURE__ */ React.createElement("span", null)));
  if (isMobile) {
    const swipe = lang === "en" ? "swipe to see both boards" : "\uC88C\uC6B0\uB85C \uBC00\uC5B4 \uC591\uCABD \uD654\uBA74 \uBCF4\uAE30";
    return /* @__PURE__ */ React.createElement("div", { id: "stage", className: "m" }, /* @__PURE__ */ React.createElement("div", { className: "mTopHud" }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 0, right: 0 } }, /* @__PURE__ */ React.createElement(LangToggle, { lang, setLang })), hud, /* @__PURE__ */ React.createElement("div", { className: "swipeHint" }, /* @__PURE__ */ React.createElement("span", { className: "sw" }, "\u21C4"), " ", swipe)), /* @__PURE__ */ React.createElement("div", { className: "mCarousel", ref: carRef }, /* @__PURE__ */ React.createElement("div", { className: "mCard" + (activeRole && activeRole !== "guest" ? " inactive" : "") }, /* @__PURE__ */ React.createElement("div", { className: "bz" }, /* @__PURE__ */ React.createElement(VariantJelly, { role: "guest", ...common }))), /* @__PURE__ */ React.createElement("div", { className: "mCard" + (activeRole && activeRole !== "host" ? " inactive" : "") }, /* @__PURE__ */ React.createElement("div", { className: "bz" }, /* @__PURE__ */ React.createElement(VariantJelly, { role: "host", ...common })))));
  }
  return /* @__PURE__ */ React.createElement("div", { id: "stage", style: { minHeight: "100vh", padding: "24px 16px", boxSizing: "border-box", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("div", { className: "boards" }, /* @__PURE__ */ React.createElement("div", { className: "boardwrap" + (dimGuest ? " dimmed" : "") }, /* @__PURE__ */ React.createElement("div", { className: "boardlabel", style: { color: "#B487FD" } }, "\uCE5C\uAD6C (\uBD07) \xB7 GUEST"), /* @__PURE__ */ React.createElement(VariantJelly, { role: "guest", ...common }), /* @__PURE__ */ React.createElement("div", { className: "dim" })), /* @__PURE__ */ React.createElement("div", { className: "centerHud" }, hud), /* @__PURE__ */ React.createElement("div", { className: "boardwrap" + (dimHost ? " dimmed" : "") }, /* @__PURE__ */ React.createElement("div", { className: "boardlabel", style: { color: "#FF5CA1" } }, "YOU \xB7 HOST"), /* @__PURE__ */ React.createElement(VariantJelly, { role: "host", ...common }), /* @__PURE__ */ React.createElement("div", { className: "dim" }))));
}
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(DemoApp, null));
