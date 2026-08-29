// The nine containers of the visual grammar framework, as geometry.
//
// Proportions come from the sentence artwork in "A Boy" — oval 382x208, diamond
// 237x205, hexagon 327x199 — normalised to one height, so a row of containers sits on
// a single baseline the way the framework draws it.
#pragma once

#include <string>

namespace shapecoder {

enum class Shape {
  Oval,
  Rectangle,
  Hexagon,
  Cloud,
  Semicircle,
  Triangle,
  TriangleRight,
  Diamond,
  SemicircleDown,
};

struct Box {
  double x = 0;
  double y = 0;
  double w = 0;
  double h = 0;
};

// The width this container takes at `height` before any widening for a long phrase.
double nominalWidth(Shape shape, double height);

// How much of the box a word may occupy. A point or a slope leaves far less room than
// the bounding box suggests, which is why these are not all the same.
double interiorFraction(Shape shape);

// Where the words sit in the box, as fractions: 0 is the top/left edge, 1 the
// bottom/right. The right-facing triangle holds its words left of centre because that
// is where the room is; the triangle holds them low for the same reason.
double interiorCentreY(Shape shape);
double interiorCentreX(Shape shape);

// One SVG element drawing the outline, filled and stroked.
std::string outline(Shape shape, const Box& box, const std::string& fill,
                    const std::string& line, double stroke);

// Advance width of `text`, in user units. An estimate: measuring properly would mean
// reading the font, and the only thing riding on it is whether a container is widened
// to hold a long phrase. Slack is built into interiorFraction above.
double estimateWidth(const std::string& text, double fontSize);

std::string escape(const std::string& text);

// A number written for an SVG attribute: fixed notation, two decimals, trailing zeros
// trimmed. Streaming a double straight out gives scientific notation at these
// magnitudes, which silently moves things.
std::string coord(double value);

}  // namespace shapecoder
