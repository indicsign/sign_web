#include "shapes.hpp"

#include <cmath>
#include <sstream>
#include <string>

namespace shapecoder {
namespace {

}  // namespace

std::string coord(double value) {
  std::ostringstream out;
  out.precision(2);
  out << std::fixed << value;
  std::string text = out.str();
  if (text.find('.') != std::string::npos) {
    while (!text.empty() && text.back() == '0') text.pop_back();
    if (!text.empty() && text.back() == '.') text.pop_back();
  }
  if (text == "-0") text = "0";
  return text;
}

namespace {

std::string num(double value) { return coord(value); }

std::string point(double x, double y) { return num(x) + "," + num(y); }

std::string polygon(const std::string& points, const std::string& fill,
                    const std::string& line, double stroke) {
  return "<polygon points=\"" + points + "\" fill=\"" + fill + "\" stroke=\"" + line +
         "\" stroke-width=\"" + num(stroke) + "\" stroke-linejoin=\"round\"/>";
}

std::string path(const std::string& d, const std::string& fill, const std::string& line,
                 double stroke) {
  return "<path d=\"" + d + "\" fill=\"" + fill + "\" stroke=\"" + line +
         "\" stroke-width=\"" + num(stroke) + "\" stroke-linejoin=\"round\"/>";
}

// The cloud, in the same coordinates as the mask in src/styles/shapes.css: four arcs
// over a flat base, cropped to the drawing's own bounds.
constexpr double kCloudX = 4;
constexpr double kCloudY = 6;
constexpr double kCloudW = 142;
constexpr double kCloudH = 78;

std::string cloudPath(const Box& box) {
  const double sx = box.w / kCloudW;
  const double sy = box.h / kCloudH;
  const auto px = [&](double x) { return box.x + (x - kCloudX) * sx; };
  const auto py = [&](double y) { return box.y + (y - kCloudY) * sy; };
  // An axis-aligned scale with no rotation carries straight into the arc radii.
  const auto arc = [&](double r, double x, double y) {
    return "A" + num(r * sx) + " " + num(r * sy) + " 0 0 1 " + point(px(x), py(y));
  };

  std::string d = "M" + point(px(30), py(84));
  d += arc(26, 30, 32);
  d += arc(30, 86, 22);
  d += arc(24, 126, 38);
  d += arc(24, 130, 84);
  d += "Z";
  return d;
}

}  // namespace

double nominalWidth(Shape shape, double height) {
  switch (shape) {
    case Shape::Oval:
    case Shape::Rectangle:
    case Shape::Semicircle:
    case Shape::SemicircleDown:
      return height * 382.0 / 208.0;
    case Shape::Hexagon:
      return height * 327.0 / 208.0;
    case Shape::Diamond:
      return height * 237.0 / 208.0;
    case Shape::Cloud:
      return height * kCloudW / kCloudH;
    case Shape::Triangle:
      return height * 1.75;
    case Shape::TriangleRight:
      return height * 1.875;
  }
  return height;
}

double interiorFraction(Shape shape) {
  switch (shape) {
    case Shape::Oval:
    case Shape::Rectangle:
    case Shape::Semicircle:
    case Shape::SemicircleDown:
      return 0.77;
    case Shape::Hexagon:
      return 0.72;
    case Shape::Cloud:
      return 0.66;
    case Shape::Triangle:
      return 0.60;
    case Shape::Diamond:
      return 0.58;
    case Shape::TriangleRight:
      return 0.54;
  }
  return 0.77;
}

double interiorCentreY(Shape shape) {
  switch (shape) {
    case Shape::Triangle:
      return 0.78;
    case Shape::SemicircleDown:
      return 0.28;
    default:
      return 0.5;
  }
}

double interiorCentreX(Shape shape) {
  return shape == Shape::TriangleRight ? 0.33 : 0.5;
}

std::string outline(Shape shape, const Box& box, const std::string& fill,
                    const std::string& line, double stroke) {
  const double x = box.x;
  const double y = box.y;
  const double w = box.w;
  const double h = box.h;
  const double rx = w / 2;
  const double ry = h / 2;

  switch (shape) {
    case Shape::Oval:
      return "<ellipse cx=\"" + num(x + rx) + "\" cy=\"" + num(y + ry) + "\" rx=\"" +
             num(rx) + "\" ry=\"" + num(ry) + "\" fill=\"" + fill + "\" stroke=\"" +
             line + "\" stroke-width=\"" + num(stroke) + "\"/>";

    case Shape::Rectangle:
      return "<rect x=\"" + num(x) + "\" y=\"" + num(y) + "\" width=\"" + num(w) +
             "\" height=\"" + num(h) + "\" fill=\"" + fill + "\" stroke=\"" + line +
             "\" stroke-width=\"" + num(stroke) + "\"/>";

    case Shape::Hexagon:
      return polygon(point(x + w * 0.25, y) + " " + point(x + w * 0.75, y) + " " +
                         point(x + w, y + ry) + " " + point(x + w * 0.75, y + h) + " " +
                         point(x + w * 0.25, y + h) + " " + point(x, y + ry),
                     fill, line, stroke);

    case Shape::Diamond:
      return polygon(point(x + rx, y) + " " + point(x + w, y + ry) + " " +
                         point(x + rx, y + h) + " " + point(x, y + ry),
                     fill, line, stroke);

    case Shape::Triangle:
      return polygon(point(x + rx, y) + " " + point(x + w, y + h) + " " + point(x, y + h),
                     fill, line, stroke);

    case Shape::TriangleRight:
      return polygon(point(x, y) + " " + point(x + w, y + ry) + " " + point(x, y + h),
                     fill, line, stroke);

    // Flat along the bottom, curved over the top.
    case Shape::Semicircle:
      return path("M" + point(x, y + h) + "L" + point(x, y + ry) + "A" + num(rx) + " " +
                      num(ry) + " 0 0 1 " + point(x + w, y + ry) + "L" +
                      point(x + w, y + h) + "Z",
                  fill, line, stroke);

    // The same turned over: flat along the top.
    case Shape::SemicircleDown:
      return path("M" + point(x, y) + "L" + point(x + w, y) + "L" + point(x + w, y + ry) +
                      "A" + num(rx) + " " + num(ry) + " 0 0 1 " + point(x, y + ry) + "Z",
                  fill, line, stroke);

    case Shape::Cloud:
      return path(cloudPath(box), fill, line, stroke);
  }
  return "";
}

double estimateWidth(const std::string& text, double fontSize) {
  double ems = 0;
  for (const unsigned char ch : text) {
    switch (ch) {
      case 'i': case 'j': case 'l': case 'I': case 't': case 'f': case 'r':
      case '.': case ',': case '\'': case '!': case ':': case ';':
        ems += 0.30;
        break;
      case ' ':
        ems += 0.28;
        break;
      case 'm': case 'w': case 'M': case 'W':
        ems += 0.85;
        break;
      default:
        // Bytes above ASCII arrive one at a time; counting each as a narrow advance
        // overshoots a multi-byte glyph, which errs towards a roomier container.
        ems += (ch >= 'A' && ch <= 'Z') ? 0.65 : 0.55;
        break;
    }
  }
  return ems * fontSize;
}

std::string escape(const std::string& text) {
  std::string out;
  out.reserve(text.size());
  for (const char ch : text) {
    switch (ch) {
      case '&': out += "&amp;"; break;
      case '<': out += "&lt;"; break;
      case '>': out += "&gt;"; break;
      case '"': out += "&quot;"; break;
      case '\'': out += "&apos;"; break;
      default: out += ch; break;
    }
  }
  return out;
}

}  // namespace shapecoder
