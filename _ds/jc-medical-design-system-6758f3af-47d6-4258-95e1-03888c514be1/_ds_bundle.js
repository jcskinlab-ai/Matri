/* @ds-bundle: {"format":3,"namespace":"JCMedicalDesignSystem_6758f3","components":[],"sourceHashes":{"feed/design-canvas.jsx":"bd8746af6e58","feed/export.js":"3241448b71bb","feed/fit.js":"1461f0ab3171","feed/posts.jsx":"fd79e201c0a3","landing-tweaks.jsx":"fa267d70c555","resize-tool.js":"7ea98d03257d","tweaks-panel.jsx":"6591467622ed"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.JCMedicalDesignSystem_6758f3 = window.JCMedicalDesignSystem_6758f3 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// feed/design-canvas.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// DesignCanvas.jsx — Figma-ish design canvas wrapper
// Warm gray grid bg + Sections + Artboards + PostIt notes.
// Exports (to window): DesignCanvas, DCSection, DCArtboard, DCPostIt.
// Artboards are reorderable (grip-drag), deletable, labels/titles are
// inline-editable, and any artboard can be opened in a fullscreen focus
// overlay (←/→/Esc). State persists to a .design-canvas.state.json sidecar
// via the host bridge. No assets, no deps.
//
// Usage:
//   <DesignCanvas>
//     <DCSection id="onboarding" title="Onboarding" subtitle="First-run variants">
//       <DCArtboard id="a" label="A · Dusk" width={260} height={480}>…</DCArtboard>
//       <DCArtboard id="b" label="B · Minimal" width={260} height={480}>…</DCArtboard>
//     </DCSection>
//   </DesignCanvas>
//
// Artboards are static design frames, not scroll regions — never use
// height: 100% + overflow: auto/scroll on inner elements; size each artboard
// to fit its content (explicit pixel height, or let it grow).
/* END USAGE */

const DC = {
  bg: '#f0eee9',
  grid: 'rgba(0,0,0,0.06)',
  label: 'rgba(60,50,40,0.7)',
  title: 'rgba(40,30,20,0.85)',
  subtitle: 'rgba(60,50,40,0.6)',
  postitBg: '#fef4a8',
  postitText: '#5a4a2a',
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
};

// One-time CSS injection (classes are dc-prefixed so they don't collide with
// the hosted design's own styles).
if (typeof document !== 'undefined' && !document.getElementById('dc-styles')) {
  const s = document.createElement('style');
  s.id = 'dc-styles';
  s.textContent = ['.dc-editable{cursor:text;outline:none;white-space:nowrap;border-radius:3px;padding:0 2px;margin:0 -2px}', '.dc-editable:focus{background:#fff;box-shadow:0 0 0 1.5px #c96442}', '[data-dc-slot]{transition:transform .18s cubic-bezier(.2,.7,.3,1)}', '[data-dc-slot].dc-dragging{transition:none;z-index:10;pointer-events:none}', '[data-dc-slot].dc-dragging .dc-card{box-shadow:0 12px 40px rgba(0,0,0,.25),0 0 0 2px #c96442;transform:scale(1.02)}',
  // isolation:isolate contains artboard content's z-indexes so a
  // z-indexed child (sticky navbar etc.) can't paint over .dc-header or
  // the .dc-menu popover that drops into the top of the card.
  '.dc-card{isolation:isolate;transition:box-shadow .15s,transform .15s}', '.dc-card *{scrollbar-width:none}', '.dc-card *::-webkit-scrollbar{display:none}',
  // Per-artboard header: grip + label on the left, delete/expand on the
  // right. Single flex row; when the artboard's on-screen width is too
  // narrow for both the label yields (ellipsis, then hidden entirely below
  // ~4ch via the container query) and the buttons stay on the row.
  '.dc-header{position:absolute;bottom:100%;left:-4px;margin-bottom:calc(4px * var(--dc-inv-zoom,1));z-index:2;', '  display:flex;align-items:center;container-type:inline-size}', '.dc-labelrow{display:flex;align-items:center;gap:4px;height:24px;flex:1 1 auto;min-width:0}', '.dc-grip{flex:0 0 auto;cursor:grab;display:flex;align-items:center;padding:5px 4px;border-radius:4px;transition:background .12s,opacity .12s}', '.dc-grip:hover{background:rgba(0,0,0,.08)}', '.dc-grip:active{cursor:grabbing}', '.dc-labeltext{flex:1 1 auto;min-width:0;cursor:pointer;border-radius:4px;padding:3px 6px;', '  display:flex;align-items:center;transition:background .12s;overflow:hidden}',
  // Below ~4ch of label room: hide the label entirely, and drop the grip to
  // hover-only (same reveal rule as .dc-btns) so a narrow header is clean
  // until the card is moused.
  '@container (max-width: 110px){', '  .dc-labeltext{display:none}', '  .dc-grip{opacity:0}', '  [data-dc-slot]:hover .dc-grip{opacity:1}', '}', '.dc-labeltext:hover{background:rgba(0,0,0,.05)}', '.dc-labeltext .dc-editable{overflow:hidden;text-overflow:ellipsis;max-width:100%}', '.dc-labeltext .dc-editable:focus{overflow:visible;text-overflow:clip}', '.dc-btns{flex:0 0 auto;margin-left:auto;display:flex;gap:2px;opacity:0;transition:opacity .12s}', '[data-dc-slot]:hover .dc-btns,.dc-btns:has(.dc-menu){opacity:1}', '.dc-expand,.dc-kebab{width:22px;height:22px;border-radius:5px;border:none;cursor:pointer;padding:0;', '  background:transparent;color:rgba(60,50,40,.7);display:flex;align-items:center;justify-content:center;', '  font:inherit;transition:background .12s,color .12s}', '.dc-expand:hover,.dc-kebab:hover{background:rgba(0,0,0,.06);color:#2a251f}',
  // Slot hosting an open menu floats above later siblings (which otherwise
  // paint on top — same z-index:auto, later DOM order) so the popup isn't
  // clipped by the next card.
  '[data-dc-slot]:has(.dc-menu){z-index:10}', '.dc-menu{position:absolute;top:100%;right:0;margin-top:4px;background:#fff;border-radius:8px;', '  box-shadow:0 8px 28px rgba(0,0,0,.18),0 0 0 1px rgba(0,0,0,.05);padding:4px;min-width:160px;z-index:10}', '.dc-menu button{display:block;width:100%;padding:7px 10px;border:0;background:transparent;', '  border-radius:5px;font-family:inherit;font-size:13px;font-weight:500;line-height:1.2;', '  color:#29261b;cursor:pointer;text-align:left;transition:background .12s;white-space:nowrap}', '.dc-menu button:hover{background:rgba(0,0,0,.05)}', '.dc-menu hr{border:0;border-top:1px solid rgba(0,0,0,.08);margin:4px 2px}', '.dc-menu .dc-danger{color:#c96442}', '.dc-menu .dc-danger:hover{background:rgba(201,100,66,.1)}',
  // Chrome (titles / labels / buttons) counter-scales against the viewport
  // zoom so it stays a constant on-screen size. --dc-inv-zoom is set by
  // DCViewport on every transform update and inherits to all descendants —
  // any overlay inside the world (e.g. a TweaksPanel on an artboard) can use
  // it the same way.
  //
  // The header uses transform:scale (out-of-flow, so layout impact doesn't
  // matter) with its world-space width set to card-width / inv-zoom so that
  // after counter-scaling its on-screen width exactly matches the card's —
  // that's what lets the container query + text-overflow behave against the
  // card's visible edge at every zoom level.
  //
  // The section head uses CSS zoom instead of transform so its layout box
  // grows with the counter-scale, pushing the card row down — otherwise the
  // constant-screen-size title would overflow into the (shrinking) world-
  // space gap and overlap the artboard headers at low zoom.
  '.dc-header{width:calc((100% + 4px) / var(--dc-inv-zoom,1));', '  transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom left}', '.dc-sectionhead{zoom:var(--dc-inv-zoom,1)}'].join('\n');
  document.head.appendChild(s);
}
const DCCtx = React.createContext(null);

// Recursively unwrap React.Fragment so <>…</> grouping doesn't hide
// DCSection/DCArtboard children from the type-based walks below.
function dcFlatten(children) {
  const out = [];
  React.Children.forEach(children, c => {
    if (c && c.type === React.Fragment) out.push(...dcFlatten(c.props.children));else out.push(c);
  });
  return out;
}

// ─────────────────────────────────────────────────────────────
// DesignCanvas — stateful wrapper around the pan/zoom viewport.
// Owns runtime state (per-section order, renamed titles/labels, hidden
// artboards, focused artboard). Order/titles/labels/hidden persist to a
// .design-canvas.state.json
// sidecar next to the HTML. Reads go via plain fetch() so the saved
// arrangement is visible anywhere the HTML + sidecar are served together
// (omelette preview, direct link, downloaded zip). Writes go through the
// host's window.omelette bridge — editing requires the omelette runtime.
// Focus is ephemeral.
// ─────────────────────────────────────────────────────────────
const DC_STATE_FILE = '.design-canvas.state.json';
function DesignCanvas({
  children,
  minScale,
  maxScale,
  style
}) {
  const [state, setState] = React.useState({
    sections: {},
    focus: null
  });
  // Hold rendering until the sidecar read settles so the saved order/titles
  // appear on first paint (no source-order flash). didRead gates writes until
  // the read settles so the empty initial state can't clobber a slow read;
  // skipNextWrite suppresses the one echo-write that would otherwise follow
  // hydration.
  const [ready, setReady] = React.useState(false);
  const didRead = React.useRef(false);
  const skipNextWrite = React.useRef(false);
  React.useEffect(() => {
    let off = false;
    fetch('./' + DC_STATE_FILE).then(r => r.ok ? r.json() : null).then(saved => {
      if (off || !saved || !saved.sections) return;
      skipNextWrite.current = true;
      setState(s => ({
        ...s,
        sections: saved.sections
      }));
    }).catch(() => {}).finally(() => {
      didRead.current = true;
      if (!off) setReady(true);
    });
    const t = setTimeout(() => {
      if (!off) setReady(true);
    }, 150);
    return () => {
      off = true;
      clearTimeout(t);
    };
  }, []);
  React.useEffect(() => {
    if (!didRead.current) return;
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    const t = setTimeout(() => {
      window.omelette?.writeFile(DC_STATE_FILE, JSON.stringify({
        sections: state.sections
      })).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [state.sections]);

  // Build registries synchronously from children so FocusOverlay can read
  // them in the same render. Fragments are flattened; wrapping in other
  // elements still opts out of focus/reorder.
  const registry = {}; // slotId -> { sectionId, artboard }
  const sectionMeta = {}; // sectionId -> { title, subtitle, slotIds[] }
  const sectionOrder = [];
  dcFlatten(children).forEach(sec => {
    if (!sec || sec.type !== DCSection) return;
    const sid = sec.props.id ?? sec.props.title;
    if (!sid) return;
    sectionOrder.push(sid);
    const persisted = state.sections[sid] || {};
    const abs = [];
    dcFlatten(sec.props.children).forEach(ab => {
      if (!ab || ab.type !== DCArtboard) return;
      const aid = ab.props.id ?? ab.props.label;
      if (aid) abs.push([aid, ab]);
    });
    // hidden is scoped to one source revision — when the agent regenerates
    // (artboard-ID set changes), prior deletes don't apply to new content.
    const srcKey = abs.map(([k]) => k).join('\x1f');
    const hidden = persisted.srcKey === srcKey ? persisted.hidden || [] : [];
    const srcIds = [];
    abs.forEach(([aid, ab]) => {
      if (hidden.includes(aid)) return;
      registry[`${sid}/${aid}`] = {
        sectionId: sid,
        artboard: ab
      };
      srcIds.push(aid);
    });
    const kept = (persisted.order || []).filter(k => srcIds.includes(k));
    sectionMeta[sid] = {
      title: persisted.title ?? sec.props.title,
      subtitle: sec.props.subtitle,
      slotIds: [...kept, ...srcIds.filter(k => !kept.includes(k))]
    };
  });
  const api = React.useMemo(() => ({
    state,
    section: id => state.sections[id] || {},
    patchSection: (id, p) => setState(s => ({
      ...s,
      sections: {
        ...s.sections,
        [id]: {
          ...s.sections[id],
          ...(typeof p === 'function' ? p(s.sections[id] || {}) : p)
        }
      }
    })),
    setFocus: slotId => setState(s => ({
      ...s,
      focus: slotId
    }))
  }), [state]);

  // Esc exits focus; any outside pointerdown commits an in-progress rename.
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') api.setFocus(null);
    };
    const onPd = e => {
      const ae = document.activeElement;
      if (ae && ae.isContentEditable && !ae.contains(e.target)) ae.blur();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPd, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPd, true);
    };
  }, [api]);
  return /*#__PURE__*/React.createElement(DCCtx.Provider, {
    value: api
  }, /*#__PURE__*/React.createElement(DCViewport, {
    minScale: minScale,
    maxScale: maxScale,
    style: style
  }, ready && children), state.focus && registry[state.focus] && /*#__PURE__*/React.createElement(DCFocusOverlay, {
    entry: registry[state.focus],
    sectionMeta: sectionMeta,
    sectionOrder: sectionOrder
  }));
}

// ─────────────────────────────────────────────────────────────
// DCViewport — transform-based pan/zoom (internal)
//
// Input mapping (Figma-style):
//   • trackpad pinch  → zoom   (ctrlKey wheel; Safari gesture* events)
//   • trackpad scroll → pan    (two-finger)
//   • mouse wheel     → zoom   (notched; distinguished from trackpad scroll)
//   • middle-drag / primary-drag-on-bg → pan
//
// Transform state lives in a ref and is written straight to the DOM
// (translate3d + will-change) so wheel ticks don't go through React —
// keeps pans at 60fps on dense canvases.
// ─────────────────────────────────────────────────────────────
function DCViewport({
  children,
  minScale = 0.1,
  maxScale = 8,
  style = {}
}) {
  const vpRef = React.useRef(null);
  const worldRef = React.useRef(null);
  const tf = React.useRef({
    x: 0,
    y: 0,
    scale: 1
  });
  // Persist viewport across reloads so the user lands back where they were
  // after an agent edit or browser refresh. The sandbox origin is already
  // per-project; pathname keeps multiple canvas files in one project apart.
  const tfKey = 'dc-viewport:' + location.pathname;
  const saveT = React.useRef(0);
  const lastPostedScale = React.useRef();
  const apply = React.useCallback(() => {
    const {
      x,
      y,
      scale
    } = tf.current;
    const el = worldRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    // Exposed for zoom-invariant chrome (labels, buttons, TweaksPanel).
    el.style.setProperty('--dc-inv-zoom', String(1 / scale));
    // Keep the host toolbar's % readout in sync with the canvas scale. Pan
    // ticks leave scale unchanged — skip the cross-frame post for those.
    if (lastPostedScale.current !== scale) {
      lastPostedScale.current = scale;
      window.parent.postMessage({
        type: '__dc_zoom',
        scale
      }, '*');
    }
    clearTimeout(saveT.current);
    saveT.current = setTimeout(() => {
      try {
        localStorage.setItem(tfKey, JSON.stringify(tf.current));
      } catch {}
    }, 200);
  }, [tfKey]);
  React.useLayoutEffect(() => {
    const flush = () => {
      clearTimeout(saveT.current);
      try {
        localStorage.setItem(tfKey, JSON.stringify(tf.current));
      } catch {}
    };
    try {
      const s = JSON.parse(localStorage.getItem(tfKey) || 'null');
      if (s && Number.isFinite(s.x) && Number.isFinite(s.y) && Number.isFinite(s.scale)) {
        tf.current = {
          x: s.x,
          y: s.y,
          scale: Math.min(maxScale, Math.max(minScale, s.scale))
        };
        apply();
      }
    } catch {}
    // Flush on pagehide and unmount so a reload within the 200ms debounce
    // window doesn't drop the last pan/zoom.
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, []);
  React.useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    const zoomAt = (cx, cy, factor) => {
      const r = vp.getBoundingClientRect();
      const px = cx - r.left,
        py = cy - r.top;
      const t = tf.current;
      const next = Math.min(maxScale, Math.max(minScale, t.scale * factor));
      const k = next / t.scale;
      // --dc-inv-zoom consumers (.dc-sectionhead's CSS zoom, each section's
      // marginBottom) reflow on every scale change, vertically shifting the
      // world layout — so a world point mathematically pinned under the cursor
      // drifts as you zoom (content creeps up on zoom-in, down on zoom-out).
      // Anchor the DOM element under the cursor instead: record its screen Y,
      // apply the transform + --dc-inv-zoom, then cancel whatever vertical
      // drift the reflow introduced so it stays put on screen.
      let marker = null,
        markerY0 = 0;
      if (k !== 1) {
        const hit = document.elementFromPoint(cx, cy);
        marker = hit && hit.closest ? hit.closest('[data-dc-slot],[data-dc-section]') : null;
        if (marker) markerY0 = marker.getBoundingClientRect().top;
      }
      // keep the world point under the cursor fixed
      t.x = px - (px - t.x) * k;
      t.y = py - (py - t.y) * k;
      t.scale = next;
      apply();
      if (marker) {
        // A pure zoom around (cx, cy) maps screen Y → cy + (Y - cy) * k. Any
        // departure after the --dc-inv-zoom reflow is the layout drift.
        const drift = marker.getBoundingClientRect().top - (cy + (markerY0 - cy) * k);
        if (Math.abs(drift) > 0.1) {
          t.y -= drift;
          apply();
        }
      }
    };

    // Mouse-wheel vs trackpad-scroll heuristic. A physical wheel sends
    // line-mode deltas (Firefox) or large integer pixel deltas with no X
    // component (Chrome/Safari, typically multiples of 100/120). Trackpad
    // two-finger scroll sends small/fractional pixel deltas, often with
    // non-zero deltaX. ctrlKey is set by the browser for trackpad pinch.
    const isMouseWheel = e => e.deltaMode !== 0 || e.deltaX === 0 && Number.isInteger(e.deltaY) && Math.abs(e.deltaY) >= 40;
    const onWheel = e => {
      e.preventDefault();
      if (isGesturing) return; // Safari: gesture* owns the pinch — discard concurrent wheels
      if ((e.ctrlKey || e.metaKey) && !isMouseWheel(e)) {
        // trackpad pinch, or ctrl/cmd + smooth-scroll mouse. Notched
        // wheels fall through to the fixed-step branch below.
        zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.01));
      } else if (isMouseWheel(e)) {
        // notched mouse wheel — fixed-ratio step per click
        zoomAt(e.clientX, e.clientY, Math.exp(-Math.sign(e.deltaY) * 0.18));
      } else {
        // trackpad two-finger scroll — pan
        tf.current.x -= e.deltaX;
        tf.current.y -= e.deltaY;
        apply();
      }
    };

    // Safari sends native gesture* events for trackpad pinch with a smooth
    // e.scale; preferring these over the ctrl+wheel fallback gives a much
    // better feel there. No-ops on other browsers. Safari also fires
    // ctrlKey wheel events during the same pinch — isGesturing makes
    // onWheel drop those entirely so they neither zoom nor pan.
    let gsBase = 1;
    let isGesturing = false;
    const onGestureStart = e => {
      e.preventDefault();
      isGesturing = true;
      gsBase = tf.current.scale;
    };
    const onGestureChange = e => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, gsBase * e.scale / tf.current.scale);
    };
    const onGestureEnd = e => {
      e.preventDefault();
      isGesturing = false;
    };

    // Drag-pan: middle button anywhere, or primary button on canvas
    // background (anything that isn't an artboard or an inline editor).
    let drag = null;
    const onPointerDown = e => {
      const onBg = !e.target.closest('[data-dc-slot], .dc-editable');
      if (!(e.button === 1 || e.button === 0 && onBg)) return;
      e.preventDefault();
      vp.setPointerCapture(e.pointerId);
      drag = {
        id: e.pointerId,
        lx: e.clientX,
        ly: e.clientY
      };
      vp.style.cursor = 'grabbing';
    };
    const onPointerMove = e => {
      if (!drag || e.pointerId !== drag.id) return;
      tf.current.x += e.clientX - drag.lx;
      tf.current.y += e.clientY - drag.ly;
      drag.lx = e.clientX;
      drag.ly = e.clientY;
      apply();
    };
    const onPointerUp = e => {
      if (!drag || e.pointerId !== drag.id) return;
      vp.releasePointerCapture(e.pointerId);
      drag = null;
      vp.style.cursor = '';
    };

    // Host-driven zoom (toolbar % menu). Zooms around viewport centre so the
    // visible midpoint stays fixed — matching the host's iframe-zoom feel.
    const onHostMsg = e => {
      const d = e.data;
      if (d && d.type === '__dc_set_zoom' && typeof d.scale === 'number') {
        const r = vp.getBoundingClientRect();
        zoomAt(r.left + r.width / 2, r.top + r.height / 2, d.scale / tf.current.scale);
      } else if (d && d.type === '__dc_probe') {
        // Host's [readyGen] reset asks whether a canvas is present; it
        // fires on the iframe's native 'load', which for canvases with
        // images/fonts is after our mount-time announce, so re-announce.
        // Clear the pan-tick guard so apply() re-posts the current scale
        // even if it's unchanged — the host just reset dcScale to 1.
        window.parent.postMessage({
          type: '__dc_present'
        }, '*');
        lastPostedScale.current = undefined;
        apply();
      }
    };
    window.addEventListener('message', onHostMsg);
    // Announce canvas mode so the host toolbar proxies its % control here
    // instead of scaling the iframe element (which would just shrink the
    // viewport window of an infinite canvas). The apply() that follows emits
    // the initial __dc_zoom so the toolbar % is correct before first pinch.
    // lastPostedScale reset mirrors the __dc_probe handler: the layout
    // effect's restore-path apply() may already have posted the restored
    // scale (before __dc_present), so clear the guard to re-post it in order.
    window.parent.postMessage({
      type: '__dc_present'
    }, '*');
    lastPostedScale.current = undefined;
    apply();
    vp.addEventListener('wheel', onWheel, {
      passive: false
    });
    vp.addEventListener('gesturestart', onGestureStart, {
      passive: false
    });
    vp.addEventListener('gesturechange', onGestureChange, {
      passive: false
    });
    vp.addEventListener('gestureend', onGestureEnd, {
      passive: false
    });
    vp.addEventListener('pointerdown', onPointerDown);
    vp.addEventListener('pointermove', onPointerMove);
    vp.addEventListener('pointerup', onPointerUp);
    vp.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('message', onHostMsg);
      vp.removeEventListener('wheel', onWheel);
      vp.removeEventListener('gesturestart', onGestureStart);
      vp.removeEventListener('gesturechange', onGestureChange);
      vp.removeEventListener('gestureend', onGestureEnd);
      vp.removeEventListener('pointerdown', onPointerDown);
      vp.removeEventListener('pointermove', onPointerMove);
      vp.removeEventListener('pointerup', onPointerUp);
      vp.removeEventListener('pointercancel', onPointerUp);
    };
  }, [apply, minScale, maxScale]);
  const gridSvg = `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 0H0v120' fill='none' stroke='${encodeURIComponent(DC.grid)}' stroke-width='1'/%3E%3C/svg%3E")`;
  return /*#__PURE__*/React.createElement("div", {
    ref: vpRef,
    className: "design-canvas",
    style: {
      height: '100vh',
      width: '100vw',
      background: DC.bg,
      overflow: 'hidden',
      overscrollBehavior: 'none',
      touchAction: 'none',
      position: 'relative',
      fontFamily: DC.font,
      boxSizing: 'border-box',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: worldRef,
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      transformOrigin: '0 0',
      willChange: 'transform',
      width: 'max-content',
      minWidth: '100%',
      minHeight: '100%',
      padding: '60px 0 80px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: -6000,
      backgroundImage: gridSvg,
      backgroundSize: '120px 120px',
      pointerEvents: 'none',
      zIndex: -1
    }
  }), children));
}

// ─────────────────────────────────────────────────────────────
// DCSection — editable title + h-row of artboards in persisted order
// ─────────────────────────────────────────────────────────────
function DCSection({
  id,
  title,
  subtitle,
  children,
  gap = 48
}) {
  const ctx = React.useContext(DCCtx);
  const sid = id ?? title;
  const all = React.Children.toArray(dcFlatten(children));
  const artboards = all.filter(c => c && c.type === DCArtboard);
  const rest = all.filter(c => !(c && c.type === DCArtboard));
  const sec = ctx && sid && ctx.section(sid) || {};
  // Must match DesignCanvas's srcKey computation exactly (it filters falsy
  // IDs), or onDelete persists a srcKey that DesignCanvas never recognizes.
  const allIds = artboards.map(a => a.props.id ?? a.props.label).filter(Boolean);
  const srcKey = allIds.join('\x1f');
  const hidden = sec.srcKey === srcKey ? sec.hidden || [] : [];
  const srcOrder = allIds.filter(k => !hidden.includes(k));
  const order = React.useMemo(() => {
    const kept = (sec.order || []).filter(k => srcOrder.includes(k));
    return [...kept, ...srcOrder.filter(k => !kept.includes(k))];
  }, [sec.order, srcOrder.join('|')]);
  const byId = Object.fromEntries(artboards.map(a => [a.props.id ?? a.props.label, a]));

  // marginBottom counter-scales so the on-screen gap between sections stays
  // constant — otherwise at low zoom the (world-space) gap collapses while
  // the screen-constant sectionhead below it doesn't, and the title reads as
  // belonging to the section above. paddingBottom below is just enough for
  // the 24px artboard-header (abs-positioned above each card) plus ~8px, so
  // the title sits tight against its own row at every zoom.
  return /*#__PURE__*/React.createElement("div", {
    "data-dc-section": sid,
    style: {
      marginBottom: 'calc(80px * var(--dc-inv-zoom, 1))',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 60px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-sectionhead",
    style: {
      paddingBottom: 36
    }
  }, /*#__PURE__*/React.createElement(DCEditable, {
    tag: "div",
    value: sec.title ?? title,
    onChange: v => ctx && sid && ctx.patchSection(sid, {
      title: v
    }),
    style: {
      fontSize: 28,
      fontWeight: 600,
      color: DC.title,
      letterSpacing: -0.4,
      marginBottom: 6,
      display: 'inline-block'
    }
  }), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      color: DC.subtitle
    }
  }, subtitle))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap,
      padding: '0 60px',
      alignItems: 'flex-start',
      width: 'max-content'
    }
  }, order.map(k => /*#__PURE__*/React.createElement(DCArtboardFrame, {
    key: k,
    sectionId: sid,
    artboard: byId[k],
    order: order,
    label: (sec.labels || {})[k] ?? byId[k].props.label,
    onRename: v => ctx && ctx.patchSection(sid, x => ({
      labels: {
        ...x.labels,
        [k]: v
      }
    })),
    onReorder: next => ctx && ctx.patchSection(sid, {
      order: next
    }),
    onDelete: () => ctx && ctx.patchSection(sid, x => ({
      hidden: [...(x.srcKey === srcKey ? x.hidden || [] : []), k],
      srcKey
    })),
    onFocus: () => ctx && ctx.setFocus(`${sid}/${k}`)
  }))), rest);
}

// DCArtboard — marker; rendered by DCArtboardFrame via DCSection.
function DCArtboard() {
  return null;
}

// Per-artboard export (kind: 'png' | 'html'). Both paths share the same
// self-contained clone: computed styles baked in, @font-face / <img> /
// inline-style background-image urls inlined as data URIs. PNG wraps the
// clone in foreignObject→canvas at 3× the artboard's natural width×height
// (same pipeline the host uses for page captures); HTML wraps it in a
// minimal standalone document. Both are independent of viewport zoom.
async function dcExport(node, w, h, name, kind) {
  try {
    await document.fonts.ready;
  } catch {}
  const toDataURL = url => fetch(url).then(r => r.blob()).then(b => new Promise(res => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = () => res(url);
    fr.readAsDataURL(b);
  })).catch(() => url);

  // Collect @font-face rules. ss.cssRules throws SecurityError on
  // cross-origin sheets (e.g. fonts.googleapis.com) — in that case fetch
  // the CSS text directly (those endpoints send ACAO:*) and regex-extract
  // the blocks. @import and @media/@supports are walked so nested
  // @font-face rules aren't missed.
  const fontRules = [],
    pending = [],
    seen = new Set();
  const scrapeCss = href => {
    if (seen.has(href)) return;
    seen.add(href);
    pending.push(fetch(href).then(r => r.text()).then(css => {
      for (const m of css.match(/@font-face\s*{[^}]*}/g) || []) fontRules.push({
        css: m,
        base: href
      });
      for (const m of css.matchAll(/@import\s+(?:url\()?['"]?([^'")\s;]+)/g)) scrapeCss(new URL(m[1], href).href);
    }).catch(() => {}));
  };
  const walk = (rules, base) => {
    for (const r of rules) {
      if (r.type === CSSRule.FONT_FACE_RULE) fontRules.push({
        css: r.cssText,
        base
      });else if (r.type === CSSRule.IMPORT_RULE && r.styleSheet) {
        const ibase = r.styleSheet.href || base;
        try {
          walk(r.styleSheet.cssRules, ibase);
        } catch {
          scrapeCss(ibase);
        }
      } else if (r.cssRules) walk(r.cssRules, base);
    }
  };
  for (const ss of document.styleSheets) {
    const base = ss.href || location.href;
    try {
      walk(ss.cssRules, base);
    } catch {
      if (ss.href) scrapeCss(ss.href);
    }
  }
  while (pending.length) await pending.shift();
  const fontCss = (await Promise.all(fontRules.map(async rule => {
    let out = rule.css,
      m;
    const re = /url\((['"]?)([^'")]+)\1\)/g;
    while (m = re.exec(rule.css)) {
      if (m[2].indexOf('data:') === 0) continue;
      let abs;
      try {
        abs = new URL(m[2], rule.base).href;
      } catch {
        continue;
      }
      out = out.split(m[0]).join('url("' + (await toDataURL(abs)) + '")');
    }
    return out;
  }))).join('\n');
  const cloneStyled = src => {
    if (src.nodeType === 8 || src.nodeType === 1 && src.tagName === 'SCRIPT') return document.createTextNode('');
    const dst = src.cloneNode(false);
    if (src.nodeType === 1) {
      const cs = getComputedStyle(src);
      let txt = '';
      for (let i = 0; i < cs.length; i++) txt += cs[i] + ':' + cs.getPropertyValue(cs[i]) + ';';
      dst.setAttribute('style', txt + 'animation:none;transition:none;');
      if (src.tagName === 'CANVAS') try {
        const im = document.createElement('img');
        im.src = src.toDataURL();
        im.setAttribute('style', txt);
        return im;
      } catch {}
    }
    for (let c = src.firstChild; c; c = c.nextSibling) dst.appendChild(cloneStyled(c));
    return dst;
  };
  const clone = cloneStyled(node);
  clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  // Drop the card's own shadow/radius so the export is a flush w×h rect;
  // the artboard's own background (if any) is already in the computed style.
  clone.style.boxShadow = 'none';
  clone.style.borderRadius = '0';
  const jobs = [];
  clone.querySelectorAll('img').forEach(el => {
    const s = el.getAttribute('src');
    if (s && s.indexOf('data:') !== 0) jobs.push(toDataURL(el.src).then(d => el.setAttribute('src', d)));
  });
  [clone, ...clone.querySelectorAll('*')].forEach(el => {
    const bg = el.style.backgroundImage;
    if (!bg) return;
    let m;
    const re = /url\(["']?([^"')]+)["']?\)/g;
    while (m = re.exec(bg)) {
      const tok = m[0],
        url = m[1];
      if (url.indexOf('data:') === 0) continue;
      jobs.push(toDataURL(url).then(d => {
        el.style.backgroundImage = el.style.backgroundImage.split(tok).join('url("' + d + '")');
      }));
    }
  });
  await Promise.all(jobs);
  const xml = new XMLSerializer().serializeToString(clone);
  const save = (blob, ext) => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name + '.' + ext;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  if (kind === 'html') {
    const html = '<!doctype html><html><head><meta charset="utf-8"><title>' + name + '</title>' + (fontCss ? '<style>' + fontCss + '</style>' : '') + '</head><body style="margin:0">' + xml + '</body></html>';
    return save(new Blob([html], {
      type: 'text/html'
    }), 'html');
  }

  // PNG: the SVG's own width/height must be the output resolution — an
  // <img>-loaded SVG rasterizes at its intrinsic size, so sizing it at 1×
  // and ctx.scale()-ing up would just upscale a 1× bitmap. viewBox maps the
  // w×h foreignObject onto the px·w × px·h SVG canvas so the browser renders
  // the HTML at full resolution.
  const px = 3;
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w * px + '" height="' + h * px + '" viewBox="0 0 ' + w + ' ' + h + '"><foreignObject width="' + w + '" height="' + h + '">' + (fontCss ? '<style><![CDATA[' + fontCss + ']]></style>' : '') + xml + '</foreignObject></svg>';
  const img = new Image();
  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = () => rej(new Error('svg load failed'));
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
  const cv = document.createElement('canvas');
  cv.width = w * px;
  cv.height = h * px;
  cv.getContext('2d').drawImage(img, 0, 0);
  cv.toBlob(blob => save(blob, 'png'), 'image/png');
}
function DCArtboardFrame({
  sectionId,
  artboard,
  label,
  order,
  onRename,
  onReorder,
  onFocus,
  onDelete
}) {
  const {
    id: rawId,
    label: rawLabel,
    width = 260,
    height = 480,
    children,
    style = {}
  } = artboard.props;
  const id = rawId ?? rawLabel;
  const ref = React.useRef(null);
  const cardRef = React.useRef(null);
  const menuRef = React.useRef(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);

  // ⋯ menu: close on any outside pointerdown. Two-click delete lives inside
  // the menu — first click arms the row, second commits; closing disarms.
  React.useEffect(() => {
    if (!menuOpen) {
      setConfirming(false);
      return;
    }
    const off = e => {
      if (!menuRef.current || !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('pointerdown', off, true);
    return () => document.removeEventListener('pointerdown', off, true);
  }, [menuOpen]);
  const doExport = kind => {
    setMenuOpen(false);
    if (!cardRef.current) return;
    const name = String(label || id || 'artboard').replace(/[^\w\s.-]+/g, '_');
    dcExport(cardRef.current, width, height, name, kind).catch(e => console.error('[design-canvas] export failed:', e));
  };

  // Live drag-reorder: dragged card sticks to cursor; siblings slide into
  // their would-be slots in real time via transforms. DOM order only
  // changes on drop.
  const onGripDown = e => {
    e.preventDefault();
    e.stopPropagation();
    const me = ref.current;
    // translateX is applied in local (pre-scale) space but pointer deltas and
    // getBoundingClientRect().left are screen-space — divide by the viewport's
    // current scale so the dragged card tracks the cursor at any zoom level.
    const scale = me.getBoundingClientRect().width / me.offsetWidth || 1;
    const peers = Array.from(document.querySelectorAll(`[data-dc-section="${sectionId}"] [data-dc-slot]`));
    const homes = peers.map(el => ({
      el,
      id: el.dataset.dcSlot,
      x: el.getBoundingClientRect().left
    }));
    const slotXs = homes.map(h => h.x);
    const startIdx = order.indexOf(id);
    const startX = e.clientX;
    let liveOrder = order.slice();
    me.classList.add('dc-dragging');
    const layout = () => {
      for (const h of homes) {
        if (h.id === id) continue;
        const slot = liveOrder.indexOf(h.id);
        h.el.style.transform = `translateX(${(slotXs[slot] - h.x) / scale}px)`;
      }
    };
    const move = ev => {
      const dx = ev.clientX - startX;
      me.style.transform = `translateX(${dx / scale}px)`;
      const cur = homes[startIdx].x + dx;
      let nearest = 0,
        best = Infinity;
      for (let i = 0; i < slotXs.length; i++) {
        const d = Math.abs(slotXs[i] - cur);
        if (d < best) {
          best = d;
          nearest = i;
        }
      }
      if (liveOrder.indexOf(id) !== nearest) {
        liveOrder = order.filter(k => k !== id);
        liveOrder.splice(nearest, 0, id);
        layout();
      }
    };
    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      const finalSlot = liveOrder.indexOf(id);
      me.classList.remove('dc-dragging');
      me.style.transform = `translateX(${(slotXs[finalSlot] - homes[startIdx].x) / scale}px)`;
      // After the settle transition, kill transitions + clear transforms +
      // commit the reorder in the same frame so there's no visual snap-back.
      setTimeout(() => {
        for (const h of homes) {
          h.el.style.transition = 'none';
          h.el.style.transform = '';
        }
        if (liveOrder.join('|') !== order.join('|')) onReorder(liveOrder);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          for (const h of homes) h.el.style.transition = '';
        }));
      }, 180);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    "data-dc-slot": id,
    style: {
      position: 'relative',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-header",
    "data-omelette-chrome": "",
    style: {
      color: DC.label
    },
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-labelrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dc-grip",
    onPointerDown: onGripDown,
    title: "Drag to reorder"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "13",
    viewBox: "0 0 9 13",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "2",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "6.5",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "2",
    cy: "11",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "11",
    r: "1.1"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-labeltext",
    onClick: onFocus,
    title: "Click to focus"
  }, /*#__PURE__*/React.createElement(DCEditable, {
    value: label,
    onChange: onRename,
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: DC.label,
      lineHeight: 1
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "dc-btns"
  }, /*#__PURE__*/React.createElement("div", {
    ref: menuRef,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "dc-kebab",
    title: "More",
    onClick: () => setMenuOpen(o => !o)
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "2.5",
    cy: "6",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "6",
    r: "1.1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9.5",
    cy: "6",
    r: "1.1"
  }))), menuOpen && /*#__PURE__*/React.createElement("div", {
    className: "dc-menu",
    onPointerDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => doExport('png')
  }, "Download PNG"), /*#__PURE__*/React.createElement("button", {
    onClick: () => doExport('html')
  }, "Download HTML"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("button", {
    className: "dc-danger",
    onClick: () => {
      if (confirming) {
        setMenuOpen(false);
        onDelete();
      } else setConfirming(true);
    }
  }, confirming ? 'Click again to delete' : 'Delete'))), /*#__PURE__*/React.createElement("button", {
    className: "dc-expand",
    onClick: onFocus,
    title: "Focus"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 1h4v4M5 11H1V7M11 1L7.5 4.5M1 11l3.5-3.5"
  }))))), /*#__PURE__*/React.createElement("div", {
    ref: cardRef,
    className: "dc-card",
    style: {
      borderRadius: 2,
      boxShadow: '0 1px 3px rgba(0,0,0,.08),0 4px 16px rgba(0,0,0,.06)',
      overflow: 'hidden',
      width,
      height,
      background: '#fff',
      ...style
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb',
      fontSize: 13,
      fontFamily: DC.font
    }
  }, id)));
}

// Inline rename — commits on blur or Enter.
function DCEditable({
  value,
  onChange,
  style,
  tag = 'span',
  onClick
}) {
  const T = tag;
  return /*#__PURE__*/React.createElement(T, {
    className: "dc-editable",
    contentEditable: true,
    suppressContentEditableWarning: true,
    onClick: onClick,
    onPointerDown: e => e.stopPropagation(),
    onBlur: e => onChange && onChange(e.currentTarget.textContent),
    onKeyDown: e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.currentTarget.blur();
      }
    },
    style: style
  }, value);
}

// ─────────────────────────────────────────────────────────────
// Focus mode — overlay one artboard; ←/→ within section, ↑/↓ across
// sections, Esc or backdrop click to exit.
// ─────────────────────────────────────────────────────────────
function DCFocusOverlay({
  entry,
  sectionMeta,
  sectionOrder
}) {
  const ctx = React.useContext(DCCtx);
  const {
    sectionId,
    artboard
  } = entry;
  const sec = ctx.section(sectionId);
  const meta = sectionMeta[sectionId];
  const peers = meta.slotIds;
  const aid = artboard.props.id ?? artboard.props.label;
  const idx = peers.indexOf(aid);
  const secIdx = sectionOrder.indexOf(sectionId);
  const go = d => {
    const n = peers[(idx + d + peers.length) % peers.length];
    if (n) ctx.setFocus(`${sectionId}/${n}`);
  };
  const goSection = d => {
    // Sections whose artboards are all deleted have slotIds:[] — step past
    // them to the next non-empty section so ↑/↓ doesn't dead-end.
    const n = sectionOrder.length;
    for (let i = 1; i < n; i++) {
      const ns = sectionOrder[((secIdx + d * i) % n + n) % n];
      const first = sectionMeta[ns] && sectionMeta[ns].slotIds[0];
      if (first) {
        ctx.setFocus(`${ns}/${first}`);
        return;
      }
    }
  };
  React.useEffect(() => {
    const k = e => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        goSection(-1);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goSection(1);
      }
    };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  });
  const {
    width = 260,
    height = 480,
    children
  } = artboard.props;
  const [vp, setVp] = React.useState({
    w: window.innerWidth,
    h: window.innerHeight
  });
  React.useEffect(() => {
    const r = () => setVp({
      w: window.innerWidth,
      h: window.innerHeight
    });
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);
  const scale = Math.max(0.1, Math.min((vp.w - 200) / width, (vp.h - 260) / height, 2));
  const [ddOpen, setDd] = React.useState(false);
  const Arrow = ({
    dir,
    onClick
  }) => /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onClick();
    },
    style: {
      position: 'absolute',
      top: '50%',
      [dir]: 28,
      transform: 'translateY(-50%)',
      border: 'none',
      background: 'rgba(255,255,255,.08)',
      color: 'rgba(255,255,255,.9)',
      width: 44,
      height: 44,
      borderRadius: 22,
      fontSize: 18,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background .15s'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.18)',
    onMouseLeave: e => e.currentTarget.style.background = 'rgba(255,255,255,.08)'
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: dir === 'left' ? 'M11 3L5 9l6 6' : 'M7 3l6 6-6 6'
  })));

  // Portal to body so position:fixed is the real viewport regardless of any
  // transform on DesignCanvas's ancestors (including the canvas zoom itself).
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    onClick: () => ctx.setFocus(null),
    onWheel: e => e.preventDefault(),
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(24,20,16,.6)',
      backdropFilter: 'blur(14px)',
      fontFamily: DC.font,
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 72,
      display: 'flex',
      alignItems: 'flex-start',
      padding: '16px 20px 0',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDd(o => !o),
    style: {
      border: 'none',
      background: 'transparent',
      color: '#fff',
      cursor: 'pointer',
      padding: '6px 8px',
      borderRadius: 6,
      textAlign: 'left',
      fontFamily: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: -0.3
    }
  }, meta.title), /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 11 11",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    style: {
      opacity: .7
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 4l3.5 3.5L9 4"
  }))), meta.subtitle && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 13,
      opacity: .6,
      fontWeight: 400,
      marginTop: 2
    }
  }, meta.subtitle)), ddOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      marginTop: 4,
      background: '#2a251f',
      borderRadius: 8,
      boxShadow: '0 8px 32px rgba(0,0,0,.4)',
      padding: 4,
      minWidth: 200,
      zIndex: 10
    }
  }, sectionOrder.filter(sid => sectionMeta[sid].slotIds.length).map(sid => /*#__PURE__*/React.createElement("button", {
    key: sid,
    onClick: () => {
      setDd(false);
      const f = sectionMeta[sid].slotIds[0];
      if (f) ctx.setFocus(`${sid}/${f}`);
    },
    style: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      border: 'none',
      cursor: 'pointer',
      background: sid === sectionId ? 'rgba(255,255,255,.1)' : 'transparent',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: 5,
      fontSize: 14,
      fontWeight: sid === sectionId ? 600 : 400,
      fontFamily: 'inherit'
    }
  }, sectionMeta[sid].title)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => ctx.setFocus(null),
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,.12)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent',
    style: {
      border: 'none',
      background: 'transparent',
      color: 'rgba(255,255,255,.7)',
      width: 32,
      height: 32,
      borderRadius: 16,
      fontSize: 20,
      cursor: 'pointer',
      lineHeight: 1,
      transition: 'background .12s'
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 64,
      bottom: 56,
      left: 100,
      right: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: width * scale,
      height: height * scale,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      background: '#fff',
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: '0 20px 80px rgba(0,0,0,.4)'
    }
  }, children || /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#bbb'
    }
  }, aid))), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      fontSize: 14,
      fontWeight: 500,
      opacity: .85,
      textAlign: 'center'
    }
  }, (sec.labels || {})[aid] ?? artboard.props.label, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .5,
      marginLeft: 10,
      fontVariantNumeric: 'tabular-nums'
    }
  }, idx + 1, " / ", peers.length))), /*#__PURE__*/React.createElement(Arrow, {
    dir: "left",
    onClick: () => go(-1)
  }), /*#__PURE__*/React.createElement(Arrow, {
    dir: "right",
    onClick: () => go(1)
  }), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 8
    }
  }, peers.map((p, i) => /*#__PURE__*/React.createElement("button", {
    key: p,
    onClick: () => ctx.setFocus(`${sectionId}/${p}`),
    style: {
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      width: 6,
      height: 6,
      borderRadius: 3,
      background: i === idx ? '#fff' : 'rgba(255,255,255,.3)'
    }
  })))), document.body);
}

// ─────────────────────────────────────────────────────────────
// Post-it — absolute-positioned sticky note
// ─────────────────────────────────────────────────────────────
function DCPostIt({
  children,
  top,
  left,
  right,
  bottom,
  rotate = -2,
  width = 180
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top,
      left,
      right,
      bottom,
      width,
      background: DC.postitBg,
      padding: '14px 16px',
      fontFamily: '"Comic Sans MS", "Marker Felt", "Segoe Print", cursive',
      fontSize: 14,
      lineHeight: 1.4,
      color: DC.postitText,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
      transform: `rotate(${rotate}deg)`,
      zIndex: 5
    }
  }, children);
}
Object.assign(window, {
  DesignCanvas,
  DCSection,
  DCArtboard,
  DCPostIt
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "feed/design-canvas.jsx", error: String((e && e.message) || e) }); }

// feed/export.js
try { (() => {
/* ============================================================
   JC MEDICAL — Exportador de plantillas a PNG 1080×1350 (4:5)
   Rasteriza un nodo DOM a un PNG nítido vía SVG/foreignObject → canvas,
   con @font-face, <img> y background-image incrustados como data-URI.
   (Mismo pipeline probado del lienzo de diseño.)
   Expone: window.jcExport.rasterize(node, w, h) -> Promise<Blob>
           window.jcExport.download(blob, name)
   ============================================================ */
(function () {
  const toDataURL = url => fetch(url).then(r => r.blob()).then(b => new Promise(res => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = () => res(url);
    fr.readAsDataURL(b);
  })).catch(() => url);
  let _fontCss = null;
  async function collectFontCss() {
    if (_fontCss !== null) return _fontCss;
    const fontRules = [],
      pending = [],
      seen = new Set();
    const scrapeCss = href => {
      if (seen.has(href)) return;
      seen.add(href);
      pending.push(fetch(href).then(r => r.text()).then(css => {
        for (const m of css.match(/@font-face\s*{[^}]*}/g) || []) fontRules.push({
          css: m,
          base: href
        });
        for (const m of css.matchAll(/@import\s+(?:url\()?['"]?([^'")\s;]+)/g)) scrapeCss(new URL(m[1], href).href);
      }).catch(() => {}));
    };
    const walk = (rules, base) => {
      for (const r of rules) {
        if (r.type === CSSRule.FONT_FACE_RULE) fontRules.push({
          css: r.cssText,
          base
        });else if (r.type === CSSRule.IMPORT_RULE && r.styleSheet) {
          const ibase = r.styleSheet.href || base;
          try {
            walk(r.styleSheet.cssRules, ibase);
          } catch {
            scrapeCss(ibase);
          }
        } else if (r.cssRules) walk(r.cssRules, base);
      }
    };
    for (const ss of document.styleSheets) {
      const base = ss.href || location.href;
      try {
        walk(ss.cssRules, base);
      } catch {
        if (ss.href) scrapeCss(ss.href);
      }
    }
    while (pending.length) await pending.shift();
    _fontCss = (await Promise.all(fontRules.map(async rule => {
      let out = rule.css,
        m;
      const re = /url\((['"]?)([^'")]+)\1\)/g;
      while (m = re.exec(rule.css)) {
        if (m[2].indexOf('data:') === 0) continue;
        let abs;
        try {
          abs = new URL(m[2], rule.base).href;
        } catch {
          continue;
        }
        out = out.split(m[0]).join('url("' + (await toDataURL(abs)) + '")');
      }
      return out;
    }))).join('\n');
    return _fontCss;
  }
  function cloneStyled(src) {
    if (src.nodeType === 8 || src.nodeType === 1 && src.tagName === 'SCRIPT') return document.createTextNode('');
    const dst = src.cloneNode(false);
    if (src.nodeType === 1) {
      const cs = getComputedStyle(src);
      let txt = '';
      for (let i = 0; i < cs.length; i++) txt += cs[i] + ':' + cs.getPropertyValue(cs[i]) + ';';
      dst.setAttribute('style', txt + 'animation:none;transition:none;');
    }
    for (let c = src.firstChild; c; c = c.nextSibling) dst.appendChild(cloneStyled(c));
    return dst;
  }
  async function rasterize(node, w, h, scale) {
    const px = scale || 3;
    const fontCss = await collectFontCss();
    const clone = cloneStyled(node);
    clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    clone.style.boxShadow = 'none';
    clone.style.borderRadius = '0';
    clone.style.margin = '0';
    const jobs = [];
    clone.querySelectorAll('img').forEach(el => {
      const s = el.getAttribute('src');
      if (s && s.indexOf('data:') !== 0) jobs.push(toDataURL(new URL(el.getAttribute('src'), location.href).href).then(d => el.setAttribute('src', d)));
    });
    [clone, ...clone.querySelectorAll('*')].forEach(el => {
      const bg = el.style.backgroundImage;
      if (!bg) return;
      let m;
      const re = /url\(["']?([^"')]+)["']?\)/g;
      while (m = re.exec(bg)) {
        const tok = m[0],
          url = m[1];
        if (url.indexOf('data:') === 0) continue;
        let abs;
        try {
          abs = new URL(url, location.href).href;
        } catch {
          continue;
        }
        jobs.push(toDataURL(abs).then(d => {
          el.style.backgroundImage = el.style.backgroundImage.split(tok).join('url("' + d + '")');
        }));
      }
    });
    await Promise.all(jobs);
    const xml = new XMLSerializer().serializeToString(clone);
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w * px + '" height="' + h * px + '" viewBox="0 0 ' + w + ' ' + h + '"><foreignObject width="' + w + '" height="' + h + '">' + (fontCss ? '<style><![CDATA[' + fontCss + ']]></style>' : '') + xml + '</foreignObject></svg>';
    const img = new Image();
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = () => rej(new Error('svg load failed'));
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
    const cv = document.createElement('canvas');
    cv.width = w * px;
    cv.height = h * px;
    cv.getContext('2d').drawImage(img, 0, 0);
    return await new Promise(res => cv.toBlob(res, 'image/png'));
  }
  function download(blob, name) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  }

  // Rasteriza un elemento usando sus dimensiones reales en pantalla, escalado
  // a targetW de ancho (1080 → 4:5 = 1080×1350). Evita distorsión por usar
  // un tamaño fijo distinto al render real.
  async function rasterizeEl(el, targetW) {
    const w = el.offsetWidth,
      h = el.offsetHeight;
    const scale = (targetW || 1080) / w;
    return rasterize(el, w, h, scale);
  }
  window.jcExport = {
    rasterize,
    rasterizeEl,
    download,
    collectFontCss
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "feed/export.js", error: String((e && e.message) || e) }); }

// feed/fit.js
try { (() => {
/* Ajusta el título serif de Antes/Después para que nunca se corte en su columna. */
(function () {
  function fitOne(name) {
    const adL = name.closest(".adL");
    if (!adL) return;
    const cs = getComputedStyle(adL);
    const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const avail = adL.clientWidth - padX - 2;
    if (avail <= 0) return;
    name.style.fontSize = ""; // volver a la base (cqw)
    const kids = name.children.length ? Array.from(name.children) : [name];
    kids.forEach(k => {
      k.style.whiteSpace = "nowrap";
    });
    const tooWide = () => kids.some(k => k.scrollWidth > avail);
    let fs = parseFloat(getComputedStyle(name).fontSize);
    let guard = 0;
    while (tooWide() && fs > 6 && guard++ < 80) {
      fs *= 0.95;
      name.style.fontSize = fs + "px";
    }
  }
  function fitAll(root) {
    (root || document).querySelectorAll(".adL .name").forEach(fitOne);
  }
  async function fitWhenReady(root) {
    try {
      await document.fonts.ready;
    } catch (e) {}
    fitAll(root);
    requestAnimationFrame(() => fitAll(root));
  }
  window.jcFit = {
    fitAll,
    fitOne,
    fitWhenReady
  };
  window.addEventListener("resize", () => fitAll());
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "feed/fit.js", error: String((e && e.message) || e) }); }

// feed/posts.jsx
try { (() => {
/* global React */
// ============================================================
// JC MEDICAL — Componentes de plantillas de feed (1080×1350 / 4:5)
// Todos escalan vía cqw. Surface: 'light' | 'light2' | 'dark' | 'ink'
// ============================================================

const LOGOS = {
  navy: "assets/logo-jc-mark-navy.png",
  // nuevo monograma JC (navy, fondos claros)
  white: "assets/logo-jc-mark-white.png",
  // nuevo monograma JC (blanco, fondos oscuros)
  lockupNavy: "assets/logo-jc-lockup-navy.png",
  // lockup completo JC + medical.cl (navy)
  lockupWhite: "assets/logo-jc-lockup-white.png",
  // lockup completo JC + medical.cl (blanco)
  taupe: "assets/logo-jc-taupe-trans.png"
};
const isDark = s => s === "dark" || s === "ink";
const logoFor = s => isDark(s) ? LOGOS.white : LOGOS.navy;
const lockupFor = s => isDark(s) ? LOGOS.lockupWhite : LOGOS.lockupNavy;
function Logo({
  surface,
  variant,
  className = "",
  style
}) {
  const src = variant ? LOGOS[variant] : logoFor(surface);
  return /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "JC Medical",
    className: "logo " + className,
    style: style
  });
}

// --- iconos (línea fina, estilo Lucide) ---
const ICON = {
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",
  pin: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z",
  ig: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
};
function Icon({
  name
}) {
  if (name === "pin") return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: ICON.pin
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "10",
    r: "3"
  }));
  if (name === "ig") return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "20",
    height: "20",
    rx: "5"
  }), /*#__PURE__*/React.createElement("path", {
    d: ICON.ig
  }), /*#__PURE__*/React.createElement("line", {
    x1: "17.5",
    y1: "6.5",
    x2: "17.51",
    y2: "6.5"
  }));
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: ICON.phone
  }));
}
function Arrow() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 48 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "2",
    y1: "12",
    x2: "42",
    y2: "12"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "34,4 44,12 34,20"
  }));
}

// --- marco base ---
function PostFrame({
  surface = "light",
  glow = false,
  className = "",
  children
}) {
  const cls = ["post", "s-" + surface, glow ? "glow-dark grain" : "", className].join(" ");
  return /*#__PURE__*/React.createElement("div", {
    className: cls
  }, children);
}

// celda 1:1 para mosaico
function FeedCell({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "feedcell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "postwrap"
  }, children));
}

// ============================================================
// 1 · ANTES / DESPUÉS  (panel de texto izq. + 2 fotos apiladas der.)
// ============================================================
function Sparkle({
  size = 2.6
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: "spark",
    viewBox: "0 0 24 24",
    style: {
      width: size + "cqw",
      height: size + "cqw"
    },
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2c0 5 2 8 10 10-8 2-10 5-10 10-0-5-2-8-10-10 8-2 10-5 10-10z"
  }));
}
function AntesDespues({
  surface = "dark",
  eyebrow = "Expresión más suave",
  titulo = ["Botox", "Entrecejo"],
  lead = [/*#__PURE__*/React.createElement("b", {
    key: "b"
  }, "Relaja"), " tu expresión de forma natural."],
  cta = "Agenda tu evaluación",
  antes = "assets/rino-antes.jpg",
  despues = "assets/rino-despues.jpg"
}) {
  const lines = Array.isArray(titulo) ? titulo : [titulo];
  return /*#__PURE__*/React.createElement(PostFrame, {
    surface: surface,
    glow: isDark(surface)
  }, /*#__PURE__*/React.createElement("div", {
    className: "ad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adL"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adL-top",
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Sparkle, null), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, eyebrow), /*#__PURE__*/React.createElement("div", {
    className: "adL-rule"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ln"
  }), /*#__PURE__*/React.createElement(Sparkle, {
    size: 1.7
  }), /*#__PURE__*/React.createElement("span", {
    className: "ln"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "adL-mid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "serif name"
  }, lines.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, l))), /*#__PURE__*/React.createElement("div", {
    className: "lead"
  }, lead), /*#__PURE__*/React.createElement("button", {
    className: "adL-cta"
  }, cta)), /*#__PURE__*/React.createElement("div", {
    className: "adL-foot"
  }, /*#__PURE__*/React.createElement(Logo, {
    surface: surface
  }), /*#__PURE__*/React.createElement("div", {
    className: "med"
  }, "medical.cl"))), /*#__PURE__*/React.createElement("div", {
    className: "adR"
  }, /*#__PURE__*/React.createElement("div", {
    className: "adRcell"
  }, /*#__PURE__*/React.createElement("img", {
    src: antes,
    alt: "antes"
  }), /*#__PURE__*/React.createElement("span", {
    className: "pill pill-photo"
  }, "Antes")), /*#__PURE__*/React.createElement("div", {
    className: "adRcell"
  }, /*#__PURE__*/React.createElement("img", {
    src: despues,
    alt: "despu\xE9s"
  }), /*#__PURE__*/React.createElement("span", {
    className: "pill pill-photo"
  }, "Despu\xE9s")))));
}

// ============================================================
// 2 · FICHA DE TRATAMIENTO  (gel claro + círculo de beneficios + producto real)
// ============================================================
function FichaTratamiento({
  nombre = "Botox",
  sub = "Tercio superior",
  categoria = "Toxina botulínica",
  prod = "assets/prod-botox.png",
  beneficios = ["Suaviza líneas de expresión", "Resultados naturales", "Frente, entrecejo y patas de gallo", "Previene que las arrugas se profundicen"],
  handle = "@jcmedical.cl"
}) {
  const pos = ["tl", "tr", "bl", "br"];
  return /*#__PURE__*/React.createElement(PostFrame, {
    surface: "light2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ficha-gel"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/gel-clean.png",
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "ficha-frame"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ficha"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ficha-head"
  }, /*#__PURE__*/React.createElement(Logo, {
    surface: "light",
    className: "cat-logo"
  }), /*#__PURE__*/React.createElement("div", {
    className: "name"
  }, nombre), sub && /*#__PURE__*/React.createElement("div", {
    className: "sub"
  }, sub), categoria && /*#__PURE__*/React.createElement("div", {
    className: "cat"
  }, categoria)), /*#__PURE__*/React.createElement("div", {
    className: "ficha-stage"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ficha-ring"
  }), pos.map(p => /*#__PURE__*/React.createElement("span", {
    key: p,
    className: "ficha-dot " + p
  })), prod && /*#__PURE__*/React.createElement("img", {
    className: "ficha-prodimg",
    src: prod,
    alt: nombre
  }), beneficios.slice(0, 4).map((b, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "ficha-cb " + pos[i]
  }, b))), /*#__PURE__*/React.createElement("div", {
    className: "ficha-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "disp"
  }, "Disponible en"), /*#__PURE__*/React.createElement("div", {
    className: "handle2"
  }, handle))));
}

// ============================================================
// 3 · CARRUSEL — PORTADA
// ============================================================
function CarruselCover({
  kicker = "El futuro del rejuvenecimiento es la",
  palabra = "Bioestimulación",
  pill = "Avanzada",
  idx = "1/5",
  bg = "assets/rino-despues.jpg"
}) {
  return /*#__PURE__*/React.createElement(PostFrame, {
    surface: "dark",
    glow: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "carr"
  }, /*#__PURE__*/React.createElement("div", {
    className: "carr-bg"
  }, /*#__PURE__*/React.createElement("img", {
    src: bg,
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "carr-veil"
  }), /*#__PURE__*/React.createElement("div", {
    className: "carr-idx"
  }, idx), /*#__PURE__*/React.createElement("div", {
    className: "carr-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "carr-title"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kick headline",
    style: {
      fontWeight: 400
    }
  }, kicker), /*#__PURE__*/React.createElement("div", {
    className: "word headline"
  }, palabra), /*#__PURE__*/React.createElement("div", {
    className: "carr-wordpill headline"
  }, pill), /*#__PURE__*/React.createElement("div", {
    className: "carr-arrow"
  }, /*#__PURE__*/React.createElement(Arrow, null))))));
}

// 3b · CARRUSEL — SLIDE DE CONTENIDO
function CarruselSlide({
  surface = "dark",
  num = "01",
  titulo = "¿Qué es?",
  texto = "Tecnología que estimula la producción natural de colágeno, devolviendo firmeza y luminosidad de forma gradual.",
  total = 5,
  on = 1
}) {
  return /*#__PURE__*/React.createElement(PostFrame, {
    surface: surface
  }, /*#__PURE__*/React.createElement("div", {
    className: "slide"
  }, /*#__PURE__*/React.createElement("div", {
    className: "num"
  }, num), /*#__PURE__*/React.createElement("div", {
    className: "serif stitle"
  }, titulo), /*#__PURE__*/React.createElement("div", {
    className: "body stext"
  }, texto), /*#__PURE__*/React.createElement("div", {
    className: "slide-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dots"
  }, Array.from({
    length: total
  }).map((_, i) => /*#__PURE__*/React.createElement("i", {
    key: i,
    className: i === on ? "on" : ""
  }))), /*#__PURE__*/React.createElement(Logo, {
    surface: surface,
    className: "logo-sm"
  }))));
}

// ============================================================
// 4 · FRASE / HERO DE MARCA
// ============================================================
function Frase({
  surface = "ink",
  frase = ["Cambios sutiles,", /*#__PURE__*/React.createElement("em", {
    key: "e"
  }, "resultados naturales.")],
  by = "JC Medical · Talca",
  showMark = true
}) {
  return /*#__PURE__*/React.createElement(PostFrame, {
    surface: surface,
    glow: isDark(surface)
  }, /*#__PURE__*/React.createElement("div", {
    className: "frase"
  }, showMark && /*#__PURE__*/React.createElement(Logo, {
    surface: surface,
    className: "logo-lg",
    style: {
      marginBottom: "4cqw"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "q serif"
  }, frase), /*#__PURE__*/React.createElement("div", {
    className: "by"
  }, by)));
}

// ============================================================
// 5 · PROMOCIÓN
// ============================================================
function Promo({
  surface = "ink",
  badge = "Edición limitada",
  pct = "20",
  titulo = ["Medicina estética", /*#__PURE__*/React.createElement("br", {
    key: "b"
  }), "facial y corporal"],
  cond = "Para socios con plan activo. Presentando app vigente en consulta. Válido durante el mes.",
  handle = "@jcmedical.cl"
}) {
  return /*#__PURE__*/React.createElement(PostFrame, {
    surface: surface,
    glow: isDark(surface)
  }, /*#__PURE__*/React.createElement("div", {
    className: "promo"
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge"
  }, badge), /*#__PURE__*/React.createElement("div", {
    className: "big"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pct serif"
  }, pct, "%"), /*#__PURE__*/React.createElement("div", {
    className: "pctlabel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dcto serif-it"
  }, "dcto."), /*#__PURE__*/React.createElement("div", {
    className: "on"
  }, "en todos los tratamientos"))), /*#__PURE__*/React.createElement("div", {
    className: "ptitle serif"
  }, titulo), /*#__PURE__*/React.createElement("div", {
    className: "pcond"
  }, cond), /*#__PURE__*/React.createElement("div", {
    className: "promo-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "disp",
    style: {
      fontSize: "2.1cqw",
      letterSpacing: "0.04em"
    }
  }, handle), /*#__PURE__*/React.createElement(Logo, {
    surface: surface,
    className: "logo-sm"
  }))));
}

// ============================================================
// 6 · RETRATO PROFESIONAL
// ============================================================
function Retrato({
  img = "assets/jc-retrato.jpg",
  role = "Enfermero universitario · Medicina estética",
  nombre = "Juan Claudio Parra",
  tag = "Criterio clínico, resultados naturales y atención personalizada en Talca."
}) {
  return /*#__PURE__*/React.createElement(PostFrame, {
    surface: "dark"
  }, /*#__PURE__*/React.createElement("div", {
    className: "retrato"
  }, /*#__PURE__*/React.createElement("img", {
    src: img,
    alt: nombre
  })), /*#__PURE__*/React.createElement("div", {
    className: "retrato-veil"
  }), /*#__PURE__*/React.createElement("div", {
    className: "retrato-top"
  }, /*#__PURE__*/React.createElement(Logo, {
    surface: "dark",
    className: "logo-sm"
  })), /*#__PURE__*/React.createElement("div", {
    className: "retrato-cap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "role"
  }, role), /*#__PURE__*/React.createElement("div", {
    className: "nm serif"
  }, nombre), /*#__PURE__*/React.createElement("div", {
    className: "tag"
  }, tag)));
}

// ============================================================
// 7 · CTA / AGENDA
// ============================================================
function CTA({
  surface = "ink",
  big = ["Agenda tu", /*#__PURE__*/React.createElement("em", {
    key: "e"
  }, "evaluaci\xF3n")],
  tel = "+56 9 6113 1946",
  dir = "11 Oriente 1660, Talca",
  handle = "@jcmedical.cl"
}) {
  return /*#__PURE__*/React.createElement(PostFrame, {
    surface: surface,
    glow: isDark(surface)
  }, /*#__PURE__*/React.createElement("div", {
    className: "ctaP"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lead"
  }, "Tu primera consulta"), /*#__PURE__*/React.createElement("div", {
    className: "big serif"
  }, big), /*#__PURE__*/React.createElement("div", {
    className: "rows"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone"
  })), tel), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pin"
  })), dir), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ig"
  })), handle)), /*#__PURE__*/React.createElement("div", {
    className: "ctaP-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "handle"
  }, "jcmedical.cl"), /*#__PURE__*/React.createElement(Logo, {
    surface: surface,
    className: "logo-sm"
  }))));
}

// ============================================================
// 8 · EDUCATIVO — MITO VS REALIDAD
// ============================================================
function Educativo({
  surface = "dark",
  eyebrow = "Educativo · Mito vs Realidad",
  titulo = "Botox",
  tituloIt = "sin mitos.",
  pares = [{
    mito: "“El Botox congela la cara.”",
    real: "Bien dosificado, relaja músculos selectivos. Tu expresión se mantiene natural."
  }, {
    mito: "“Es solo estético.”",
    real: "También trata bruxismo, hiperhidrosis y dolores de cabeza por tensión."
  }, {
    mito: "“Cuanto más, mejor.”",
    real: "El criterio clínico define las unidades exactas para tu anatomía. Menos es más."
  }],
  cta = "Agenda tu evaluación",
  handle = "@jcmedical.cl"
}) {
  return /*#__PURE__*/React.createElement(PostFrame, {
    surface: surface,
    glow: isDark(surface)
  }, /*#__PURE__*/React.createElement("div", {
    className: "edu"
  }, /*#__PURE__*/React.createElement("div", {
    className: "edu-top"
  }, /*#__PURE__*/React.createElement(Logo, {
    surface: surface,
    className: "logo-sm"
  }), /*#__PURE__*/React.createElement("span", {
    className: "edu-flag"
  }, "Botox \xB7 Criterio cl\xEDnico")), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow edu-eye"
  }, eyebrow), /*#__PURE__*/React.createElement("div", {
    className: "edu-title serif"
  }, titulo, " ", /*#__PURE__*/React.createElement("em", null, tituloIt)), /*#__PURE__*/React.createElement("div", {
    className: "edu-list"
  }, pares.map((p, i) => /*#__PURE__*/React.createElement("div", {
    className: "edu-row",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "edu-k m"
  }, "Mito"), /*#__PURE__*/React.createElement("div", {
    className: "edu-mt"
  }, p.mito), /*#__PURE__*/React.createElement("div", {
    className: "edu-k r"
  }, "Realidad"), /*#__PURE__*/React.createElement("div", {
    className: "edu-rt"
  }, p.real)))), /*#__PURE__*/React.createElement("div", {
    className: "edu-foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "edu-cta"
  }, cta), /*#__PURE__*/React.createElement("span", {
    className: "edu-handle"
  }, handle))));
}

// ============================================================
// 8b · EDUCATIVO — PORTADA DE CARRUSEL (intro)
// ============================================================
// Motivo de línea continua (abstracto, evoca el trazo facial de marca)
function IntroLines() {
  return /*#__PURE__*/React.createElement("svg", {
    className: "ec-lines",
    viewBox: "0 0 1080 1350",
    preserveAspectRatio: "xMidYMid slice",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.4",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("g", {
    className: "ln-steel"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1005 70 C 880 150, 940 300, 1040 360 C 1120 405, 1060 520, 980 540 C 905 560, 935 660, 1030 690"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M905 120 C 980 210, 900 250, 935 330 C 965 400, 1075 410, 1045 500"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M70 980 C 150 900, 250 980, 230 1080 C 215 1160, 110 1150, 120 1245 C 126 1300, 215 1290, 250 1245"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M120 1040 C 60 1110, 175 1130, 150 1210"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M60 150 C 150 210, 120 320, 210 360 C 280 392, 250 470, 180 480"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M980 760 C 1060 820, 1010 920, 1080 950"
  })), /*#__PURE__*/React.createElement("g", {
    className: "ln-gold"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M250 1010 C 360 940, 470 1030, 430 1130 C 405 1200, 300 1180, 330 1270"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M40 1180 C 130 1140, 120 1250, 210 1255"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M1040 250 C 950 300, 1010 380, 1080 360"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M120 240 C 60 300, 150 340, 110 410"
  })));
}
function EduIntro({
  surface = "ink",
  eyebrow = "Educativo · Botox",
  hero = ["¿Mito o", /*#__PURE__*/React.createElement("br", {
    key: "br"
  }), /*#__PURE__*/React.createElement("em", {
    key: "e"
  }, "realidad?")],
  kicker = "Tres creencias frecuentes sobre el Botox, aclaradas con criterio clínico.",
  url = "jcmedical.cl",
  swipe = "Desliza"
}) {
  return /*#__PURE__*/React.createElement(PostFrame, {
    surface: surface,
    className: "s-intro"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ec-bg"
  }), /*#__PURE__*/React.createElement(IntroLines, null), /*#__PURE__*/React.createElement("div", {
    className: "ec-grain"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ec-vig"
  }), /*#__PURE__*/React.createElement("div", {
    className: "eduintro-frame"
  }), /*#__PURE__*/React.createElement("div", {
    className: "eduintro"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eduintro-head"
  }, /*#__PURE__*/React.createElement(Logo, {
    surface: surface,
    variant: isDark(surface) ? "lockupWhite" : "lockupNavy",
    className: "eduintro-lockup"
  }), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eduintro-eye"
  }, eyebrow)), /*#__PURE__*/React.createElement("div", {
    className: "eduintro-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h serif metal"
  }, hero), /*#__PURE__*/React.createElement("div", {
    className: "eduintro-kicker"
  }, kicker)), /*#__PURE__*/React.createElement("div", {
    className: "eduintro-foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ln"
  }), /*#__PURE__*/React.createElement("span", {
    className: "url"
  }, url), /*#__PURE__*/React.createElement("span", {
    className: "ln"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "eduintro-swipe"
  }, swipe, /*#__PURE__*/React.createElement(Arrow, null)));
}

// ============================================================
// 9 · OFERTA — EVALUACIÓN CON CRITERIO CLÍNICO
// ============================================================
function OfertaEvaluacion({
  eyebrow = "Evaluación con criterio clínico",
  hero = ["Primero te", /*#__PURE__*/React.createElement("br", {
    key: "b"
  }), /*#__PURE__*/React.createElement("em", {
    key: "e"
  }, "escuchamos.")],
  lead = "Estudiamos tu rostro y te recomendamos solo lo que necesitas. Sin presión de venta.",
  cta = "Agenda tu evaluación",
  url = "jcmedical.cl · Talca"
}) {
  return /*#__PURE__*/React.createElement(PostFrame, {
    surface: "ink",
    className: "s-intro manif-post"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ec-bg"
  }), /*#__PURE__*/React.createElement(IntroLines, null), /*#__PURE__*/React.createElement("div", {
    className: "ec-grain"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ec-vig"
  }), /*#__PURE__*/React.createElement("div", {
    className: "manif-frame"
  }), /*#__PURE__*/React.createElement("div", {
    className: "manif"
  }, /*#__PURE__*/React.createElement("div", {
    className: "manif-head"
  }, /*#__PURE__*/React.createElement(Logo, {
    surface: "dark",
    variant: "lockupWhite",
    className: "manif-lockup"
  }), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow manif-eye"
  }, eyebrow)), /*#__PURE__*/React.createElement("div", {
    className: "manif-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "manif-h serif metal"
  }, hero), /*#__PURE__*/React.createElement("div", {
    className: "manif-sub"
  }, lead), /*#__PURE__*/React.createElement("span", {
    className: "manif-cta"
  }, cta)), /*#__PURE__*/React.createElement("div", {
    className: "manif-foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ln"
  }), /*#__PURE__*/React.createElement("span", {
    className: "url"
  }, url), /*#__PURE__*/React.createElement("span", {
    className: "ln"
  }))));
}

// ============================================================
// 10 · PRESENTACIÓN — CONOCE A TU ESPECIALISTA (claro, editorial)
// ============================================================
function Presentacion({
  eyebrow = "Conoce a tu especialista",
  nombre = "Juan Claudio",
  apellido = "Parra",
  role = "Enfermero universitario · Medicina estética",
  quote = "Detrás de cada resultado natural hay criterio clínico y tiempo para entender tu rostro.",
  handle = "@jcmedical.cl",
  ciudad = "Talca",
  img = "assets/jc-retrato.jpg"
}) {
  return /*#__PURE__*/React.createElement(PostFrame, {
    surface: "light2",
    className: "pres-post"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pres-sheen"
  }), /*#__PURE__*/React.createElement("div", {
    className: "pres"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pres-photo"
  }, /*#__PURE__*/React.createElement("img", {
    src: img,
    alt: nombre + " " + apellido
  }), /*#__PURE__*/React.createElement("div", {
    className: "pres-photo-grade"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pres-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pres-top"
  }, /*#__PURE__*/React.createElement(Logo, {
    surface: "light",
    className: "pres-mark"
  }), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow pres-eye"
  }, eyebrow)), /*#__PURE__*/React.createElement("div", {
    className: "pres-name serif"
  }, nombre, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", null, apellido)), /*#__PURE__*/React.createElement("div", {
    className: "pres-role"
  }, role), /*#__PURE__*/React.createElement("div", {
    className: "pres-rule"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dia"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pres-quote serif"
  }, "\u201C", quote, "\u201D"), /*#__PURE__*/React.createElement("div", {
    className: "pres-foot"
  }, handle, " \xB7 ", ciudad))), /*#__PURE__*/React.createElement("div", {
    className: "pres-frame"
  }));
}
Object.assign(window, {
  Logo,
  Icon,
  Arrow,
  Sparkle,
  PostFrame,
  FeedCell,
  AntesDespues,
  FichaTratamiento,
  CarruselCover,
  CarruselSlide,
  Frase,
  Promo,
  Retrato,
  CTA,
  Educativo,
  EduIntro,
  OfertaEvaluacion,
  Presentacion
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "feed/posts.jsx", error: String((e && e.message) || e) }); }

// landing-tweaks.jsx
try { (() => {
/* Panel de Tweaks de la landing JC Medical.
   Sólo controla el estilo visual; la página es HTML estático.
   Usa los helpers globales de tweaks-panel.jsx (useTweaks, TweaksPanel, ...). */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "Carbón",
  "accent": "#6E8CA6",
  "contacto": "Formulario",
  "promo": true
} /*EDITMODE-END*/;
function LandingTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => {
    document.body.classList.toggle('theme-metal', t.theme === 'Metalizado');
  }, [t.theme]);
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--jc-accent', t.accent);
    root.style.setProperty('--jc-accent-bright', t.accent);
  }, [t.accent]);
  React.useEffect(() => {
    const sw = document.getElementById('contactSwitch');
    if (sw) sw.setAttribute('data-mode', t.contacto);
  }, [t.contacto]);
  React.useEffect(() => {
    const band = document.querySelector('.promo-band');
    const sec = band ? band.closest('.section') : null;
    if (sec) sec.style.display = t.promo ? '' : 'none';
  }, [t.promo]);
  return /*#__PURE__*/React.createElement(TweaksPanel, {
    title: "Tweaks"
  }, /*#__PURE__*/React.createElement(TweakSection, {
    label: "Estilo visual"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Fondo",
    value: t.theme,
    options: ['Carbón', 'Metalizado'],
    onChange: v => setTweak('theme', v)
  }), /*#__PURE__*/React.createElement(TweakColor, {
    label: "Acento",
    value: t.accent,
    options: ['#6E8CA6', '#8AA4BC', '#C58E86'],
    onChange: v => setTweak('accent', v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Contenido"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Agendar",
    value: t.contacto,
    options: ['Formulario', 'WhatsApp'],
    onChange: v => setTweak('contacto', v)
  }), /*#__PURE__*/React.createElement(TweakToggle, {
    label: "Mostrar promo",
    value: t.promo,
    onChange: v => setTweak('promo', v)
  }));
}
ReactDOM.createRoot(document.getElementById('tweaks-root')).render(/*#__PURE__*/React.createElement(LandingTweaks, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "landing-tweaks.jsx", error: String((e && e.message) || e) }); }

// resize-tool.js
try { (() => {
/* ============================================================
   JC Medical — Edición directa de tamaños
   Activa un modo donde el usuario hace clic en cualquier objeto
   de la landing y lo agranda / achica. Persiste en localStorage
   y se re-aplica aunque el DOM se regenere (vista móvil/desktop).
   ============================================================ */
(function () {
  'use strict';

  var STORE_KEY = 'jc_resize_map_v1';
  var MIN = 0.4,
    MAX = 3,
    STEP = 0.05;
  var root = function () {
    return document.getElementById('app') || document.body;
  };

  /* ---------- persistencia ---------- */
  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }
  function save(map) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(map));
    } catch (e) {}
  }
  var sizeMap = load();

  /* ---------- selector estable relativo a #app ---------- */
  function selectorFor(el) {
    if (!el || el === root()) return null;
    var parts = [];
    var node = el;
    while (node && node !== root() && node.nodeType === 1) {
      var tag = node.tagName.toLowerCase();
      var parent = node.parentNode;
      if (!parent) break;
      var sames = [];
      for (var i = 0; i < parent.children.length; i++) {
        if (parent.children[i].tagName.toLowerCase() === tag) sames.push(parent.children[i]);
      }
      var idx = sames.indexOf(node) + 1;
      parts.unshift(tag + ':nth-of-type(' + idx + ')');
      node = parent;
    }
    if (node !== root()) return null;
    return parts.join('>');
  }
  function resolve(sel) {
    if (!sel) return null;
    try {
      return root().querySelector(':scope>' + sel);
    } catch (e) {
      return null;
    }
  }

  /* ---------- aplicar tamaños ---------- */
  function applyOne(el, z) {
    if (!el) return;
    if (z && Math.abs(z - 1) > 0.001) {
      el.style.zoom = z;
      el.setAttribute('data-jc-zoomed', '1');
    } else {
      el.style.zoom = '';
      el.removeAttribute('data-jc-zoomed');
    }
  }
  function applyAll() {
    Object.keys(sizeMap).forEach(function (sel) {
      applyOne(resolve(sel), sizeMap[sel]);
    });
  }

  /* ---------- estado de edición ---------- */
  var editing = false;
  var selectedEl = null;
  var selectedSel = null;

  /* ---------- UI ---------- */
  var fab, toolbar, tbLabel, tbPct;
  function buildUI() {
    var style = document.createElement('style');
    style.textContent = ['#jc-rt-fab{position:fixed;left:20px;bottom:20px;z-index:9996;display:inline-flex;align-items:center;gap:9px;', 'padding:12px 18px;border-radius:999px;border:1px solid rgba(245,246,247,.18);cursor:pointer;', 'background:#0d1422;color:#f5f6f7;font-family:Jost,system-ui,sans-serif;font-size:13px;font-weight:500;', 'letter-spacing:.04em;box-shadow:0 8px 30px rgba(0,0,0,.45);transition:transform .25s,background .25s;}', '#jc-rt-fab:hover{transform:translateY(-1px);background:#142033;}', '#jc-rt-fab .dot{width:9px;height:9px;border-radius:50%;background:#8AA4BC;box-shadow:0 0 0 0 rgba(138,164,188,.5);}', 'body.jc-rt-on #jc-rt-fab{background:#8AA4BC;color:#0a0e16;border-color:transparent;}', 'body.jc-rt-on #jc-rt-fab .dot{background:#0a0e16;animation:jcPulse 1.4s infinite;}', '@keyframes jcPulse{0%{box-shadow:0 0 0 0 rgba(10,14,22,.5);}70%{box-shadow:0 0 0 7px rgba(10,14,22,0);}100%{box-shadow:0 0 0 0 rgba(10,14,22,0);}}', /* hover/seleccion highlight */
    'body.jc-rt-on [data-jc-hover]{outline:1.5px dashed rgba(138,164,188,.9)!important;outline-offset:2px!important;cursor:zoom-in!important;}', 'body.jc-rt-on [data-jc-selected]{outline:2px solid #8AA4BC!important;outline-offset:2px!important;}', /* toolbar */
    '#jc-rt-bar{position:fixed;left:50%;bottom:22px;transform:translateX(-50%) translateY(140%);z-index:9997;', 'display:flex;align-items:center;gap:6px;padding:8px;border-radius:16px;background:#0d1422;', 'border:1px solid rgba(245,246,247,.16);box-shadow:0 14px 40px rgba(0,0,0,.5);', 'font-family:Jost,system-ui,sans-serif;transition:transform .3s cubic-bezier(.2,.7,.2,1);opacity:0;}', '#jc-rt-bar.show{transform:translateX(-50%) translateY(0);opacity:1;}', '#jc-rt-bar .lbl{color:#9fb0c2;font-size:11px;letter-spacing:.14em;text-transform:uppercase;padding:0 10px 0 6px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}', '#jc-rt-bar button{appearance:none;border:1px solid rgba(245,246,247,.16);background:#172234;color:#f5f6f7;', 'cursor:pointer;border-radius:10px;height:38px;min-width:38px;font-size:17px;font-weight:500;display:inline-flex;align-items:center;justify-content:center;transition:background .2s;}', '#jc-rt-bar button:hover{background:#22324c;}', '#jc-rt-bar .pct{min-width:62px;text-align:center;color:#f5f6f7;font-size:14px;font-weight:600;font-variant-numeric:tabular-nums;}', '#jc-rt-bar .sep{width:1px;height:26px;background:rgba(245,246,247,.14);margin:0 4px;}', '#jc-rt-bar .txt{font-size:12px;letter-spacing:.04em;padding:0 12px;min-width:0;}', '#jc-rt-bar .ghost{background:transparent;border-color:transparent;color:#9fb0c2;}', '#jc-rt-bar .ghost:hover{background:#172234;color:#f5f6f7;}', '#jc-rt-bar .done{background:#8AA4BC;color:#0a0e16;border-color:transparent;font-weight:600;}', '#jc-rt-bar .done:hover{background:#9fb6cb;}'].join('');
    document.head.appendChild(style);
    fab = document.createElement('button');
    fab.id = 'jc-rt-fab';
    fab.innerHTML = '<span class="dot"></span><span class="t">Editar tamaños</span>';
    fab.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleEdit();
    });
    document.body.appendChild(fab);
    toolbar = document.createElement('div');
    toolbar.id = 'jc-rt-bar';
    toolbar.innerHTML = '<span class="lbl" id="jc-rt-label">Objeto</span>' + '<button data-act="parent" class="ghost" title="Seleccionar contenedor">⤢</button>' + '<span class="sep"></span>' + '<button data-act="minus" title="Más pequeño">−</button>' + '<span class="pct" id="jc-rt-pct">100%</span>' + '<button data-act="plus" title="Más grande">+</button>' + '<span class="sep"></span>' + '<button data-act="reset" class="ghost txt">Restablecer</button>' + '<button data-act="done" class="done txt">Listo</button>';
    document.body.appendChild(toolbar);
    tbLabel = toolbar.querySelector('#jc-rt-label');
    tbPct = toolbar.querySelector('#jc-rt-pct');
    toolbar.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      e.stopPropagation();
      var act = btn.getAttribute('data-act');
      if (act === 'minus') bump(-STEP);else if (act === 'plus') bump(STEP);else if (act === 'reset') setZoom(1);else if (act === 'parent') selectParent();else if (act === 'done') deselect();
    });
  }

  /* ---------- interacción ---------- */
  function onOver(e) {
    if (!editing) return;
    if (isUI(e.target)) return;
    clearHover();
    var el = e.target;
    if (el && el !== selectedEl) el.setAttribute('data-jc-hover', '1');
  }
  function clearHover() {
    var prev = document.querySelector('[data-jc-hover]');
    if (prev) prev.removeAttribute('data-jc-hover');
  }
  function isUI(el) {
    return el && el.closest && (el.closest('#jc-rt-fab') || el.closest('#jc-rt-bar'));
  }
  function onClick(e) {
    if (!editing) return;
    if (isUI(e.target)) return;
    var el = e.target;
    if (!el || !root().contains(el)) return;
    e.preventDefault();
    e.stopPropagation();
    select(el);
  }
  function onWheel(e) {
    if (!editing || !selectedEl) return;
    if (isUI(e.target)) return;
    // solo si el cursor está sobre el elemento seleccionado o su zona
    if (!selectedEl.contains(e.target) && e.target !== selectedEl) return;
    e.preventDefault();
    bump(e.deltaY < 0 ? STEP : -STEP);
  }
  function select(el) {
    deselectVisual();
    var sel = selectorFor(el);
    if (!sel) return;
    selectedEl = el;
    selectedSel = sel;
    el.setAttribute('data-jc-selected', '1');
    clearHover();
    refreshBar();
    toolbar.classList.add('show');
  }
  function selectParent() {
    if (!selectedEl) return;
    var p = selectedEl.parentNode;
    if (p && p !== root() && root().contains(p)) select(p);
  }
  function deselectVisual() {
    var prev = document.querySelector('[data-jc-selected]');
    if (prev) prev.removeAttribute('data-jc-selected');
  }
  function deselect() {
    deselectVisual();
    selectedEl = null;
    selectedSel = null;
    toolbar.classList.remove('show');
  }
  function currentZoom() {
    if (!selectedSel) return 1;
    return sizeMap[selectedSel] || 1;
  }
  function bump(d) {
    setZoom(currentZoom() + d);
  }
  function setZoom(z) {
    if (!selectedEl || !selectedSel) return;
    z = Math.round(Math.max(MIN, Math.min(MAX, z)) * 100) / 100;
    if (Math.abs(z - 1) < 0.001) delete sizeMap[selectedSel];else sizeMap[selectedSel] = z;
    save(sizeMap);
    applyOne(selectedEl, z);
    refreshBar();
  }
  function refreshBar() {
    if (!selectedEl) return;
    var tag = selectedEl.tagName.toLowerCase();
    var cls = selectedEl.className && typeof selectedEl.className === 'string' ? '.' + selectedEl.className.trim().split(/\s+/)[0] : '';
    tbLabel.textContent = tag + cls;
    tbPct.textContent = Math.round(currentZoom() * 100) + '%';
  }
  function toggleEdit() {
    editing = !editing;
    document.body.classList.toggle('jc-rt-on', editing);
    fab.querySelector('.t').textContent = editing ? 'Salir de edición' : 'Editar tamaños';
    if (!editing) {
      clearHover();
      deselect();
    }
  }

  /* ---------- arranque ---------- */
  function init() {
    buildUI();
    applyAll();
    document.addEventListener('mouseover', onOver, true);
    document.addEventListener('click', onClick, true);
    document.addEventListener('wheel', onWheel, {
      capture: true,
      passive: false
    });
    document.addEventListener('keydown', function (e) {
      if (!editing) return;
      if (e.key === 'Escape') {
        deselect();
      } else if (selectedEl && (e.key === '+' || e.key === '=')) {
        e.preventDefault();
        bump(STEP);
      } else if (selectedEl && (e.key === '-' || e.key === '_')) {
        e.preventDefault();
        bump(-STEP);
      }
    });

    // re-aplicar cuando la app regenera el DOM (cambio móvil/desktop)
    var ro = root();
    if (ro && window.MutationObserver) {
      var t;
      var mo = new MutationObserver(function () {
        clearTimeout(t);
        t = setTimeout(function () {
          applyAll();
          // si había selección, intentar re-vincular por selector
          if (editing && selectedSel) {
            var el = resolve(selectedSel);
            if (el) {
              deselectVisual();
              selectedEl = el;
              el.setAttribute('data-jc-selected', '1');
              refreshBar();
            } else deselect();
          }
        }, 80);
      });
      mo.observe(ro, {
        childList: true,
        subtree: true
      });
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(init, 60);
    });
  } else {
    setTimeout(init, 60);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "resize-tool.js", error: String((e && e.message) || e) }); }

// tweaks-panel.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
// Exports (to window): useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider,
//   TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// TweakRadio is the segmented control for 2–3 short options (auto-falls-back to
// TweakSelect past ~16/~10 chars per label); reach for TweakSelect directly when
// options are many or long. For color tweaks always curate 3-4 options rather than
// a free picker; an option can also be a whole 2–5 color palette (the stored value
// is the array). The Tweak* controls are a floor, not a ceiling — build custom
// controls inside the panel if a tweak calls for UI they don't cover.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
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

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
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
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
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

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-omelette-chrome": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return /*#__PURE__*/React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#fff'
}));

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "twk-row twk-row-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "twk-lbl"
    }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && /*#__PURE__*/React.createElement("span", null, sup.map((c, j) => /*#__PURE__*/React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && /*#__PURE__*/React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
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
})(); } catch (e) { __ds_ns.__errors.push({ path: "tweaks-panel.jsx", error: String((e && e.message) || e) }); }

})();
