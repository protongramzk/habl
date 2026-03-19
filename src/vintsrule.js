// VintsRuler v0.2
class VintsRuler {
  constructor({
    origin = [0, 0],
    lineHeight = 16,
    fontMargin = 1,
    breakWidth = Infinity
  } = {}) {
    this.origin = origin;
    this.lineHeight = lineHeight;
    this.fontMargin = fontMargin;
    this.breakWidth = breakWidth;

    this.reset();
  }

  reset() {
    this.text = "";
    this.measures = [];
    this.positions = []; // [ [x,y], ... ]
    this.lines = []; // [[start,end], ...]
  }

  // =========================
  // CORE WRITE
  // =========================
  write(text, measures) {
    this.text = text;
    this.measures = measures;
    this._layout();
    return this.positions;
  }

  // =========================
  // INSERT
  // =========================
  insert(index, text, measures) {
    this.text =
      this.text.slice(0, index) +
      text +
      this.text.slice(index);

    this.measures = [
      ...this.measures.slice(0, index),
      ...measures,
      ...this.measures.slice(index)
    ];

    const oldPositions = this.positions.slice();

    this._layout();

    return {
      insertedRange: [index, index + text.length - 1],
      repositioned: this._diffPositions(oldPositions)
    };
  }

  // =========================
  // DELETE 1 CHAR
  // =========================
  delete(index) {
    return this.deleteRange(index, index);
  }

  // =========================
  // DELETE RANGE
  // =========================
  deleteRange(start, end) {
    this.text =
      this.text.slice(0, start) +
      this.text.slice(end + 1);

    this.measures = [
      ...this.measures.slice(0, start),
      ...this.measures.slice(end + 1)
    ];

    const oldPositions = this.positions.slice();

    this._layout();

    return {
      deletedRange: [start, end],
      repositioned: this._diffPositions(oldPositions)
    };
  }

  // =========================
  // GET POSITION
  // =========================
  getPosition(index) {
    return this.positions[index] || null;
  }

  // =========================
  // COORD -> INDEX (O(n), nanti bisa upgrade ke grid)
  // =========================
  getIndexFromCoord(x, y) {
    let closest = -1;
    let minDist = Infinity;

    for (let i = 0; i < this.positions.length; i++) {
      const [px, py] = this.positions[i];
      const dx = px - x;
      const dy = py - y;
      const d = dx * dx + dy * dy;

      if (d < minDist) {
        minDist = d;
        closest = i;
      }
    }

    return closest;
  }

  // =========================
  // LINES INFO
  // =========================
  getLines() {
    return this.lines;
  }

  getLineInfo(lineIndex) {
    const l = this.lines[lineIndex];
    if (!l) return null;

    return {
      start: l[0],
      end: l[1],
      y: this.origin[1] + lineIndex * this.lineHeight
    };
  }

  // =========================
  // SELECTION BOXES
  // =========================
  getSelectionRange(start, end) {
    const res = [];

    for (let i = start; i <= end; i++) {
      const pos = this.positions[i];
      const w = this.measures[i];

      if (!pos) continue;

      res.push({
        x: pos[0],
        y: pos[1],
        w,
        h: this.lineHeight
      });
    }

    return res;
  }

  // =========================
  // RELAYOUT
  // =========================
  layout() {
    this._layout();
    return this.positions;
  }

  setBreakWidth(w) {
    this.breakWidth = w;
    this._layout();
  }

  // =========================
  // DEBUG
  // =========================
  toString() {
    return this.text;
  }

  // =========================
  // INTERNAL LAYOUT
  // =========================
  _layout() {
    this.positions = [];
    this.lines = [];

    let x = this.origin[0];
    let y = this.origin[1];

    let lineStart = 0;
    let lineIndex = 0;

    for (let i = 0; i < this.text.length; i++) {
      const char = this.text[i];
      const w = this.measures[i] || 0;

      // manual break
      if (char === "\n") {
        this.lines.push([lineStart, i - 1]);
        lineStart = i + 1;

        lineIndex++;
        x = this.origin[0];
        y = this.origin[1] + lineIndex * this.lineHeight;
        continue;
      }

      // auto break
      if (x + w > this.breakWidth) {
        this.lines.push([lineStart, i - 1]);
        lineStart = i;

        lineIndex++;
        x = this.origin[0];
        y = this.origin[1] + lineIndex * this.lineHeight;
      }

      this.positions[i] = [x, y];

      x += w + this.fontMargin;
    }

    // last line
    if (this.text.length > 0) {
      this.lines.push([lineStart, this.text.length - 1]);
    }
  }

  // =========================
  // DIFF ENGINE
  // =========================
  _diffPositions(oldPos) {
    const changed = [];

    for (let i = 0; i < this.positions.length; i++) {
      const a = oldPos[i];
      const b = this.positions[i];

      if (!a || !b || a[0] !== b[0] || a[1] !== b[1]) {
        changed.push([i, b]);
      }
    }

    return changed;
  }
}
const text = "chat\ngpt";

// simulate measure dari canvas
const measures = [...text].map(() => 10);

const r = new VintsRuler({
  origin:[10,20],
  lineHeight:20,
  fontMargin:2,
  breakWidth:100
});

console.log(r.write(text, measures));

// delete demo
console.log(r.delete(2));

// insert demo
console.log(r.insert(2, "X", [10]));
