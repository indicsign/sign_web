#include "coder.hpp"

#include <algorithm>
#include <cctype>
#include <cmath>
#include <fstream>
#include <sstream>

namespace shapecoder {
namespace {

const std::string kInk = "--color-ink";

std::string trim(const std::string& text) {
  const auto begin = text.find_first_not_of(" \t\r\n");
  if (begin == std::string::npos) return "";
  const auto end = text.find_last_not_of(" \t\r\n");
  return text.substr(begin, end - begin + 1);
}

std::string lower(std::string text) {
  std::transform(text.begin(), text.end(), text.begin(),
                 [](unsigned char ch) { return static_cast<char>(std::tolower(ch)); });
  return text;
}

bool partFromKey(const std::string& key, Part& out) {
  static const std::map<std::string, Part> kParts = {
      {"subject", Part::Subject},
      {"aux", Part::Auxiliary},
      {"auxiliary", Part::Auxiliary},
      {"verb", Part::Verb},
      {"object", Part::Object},
      {"adj", Part::Adjective},
      {"adjective", Part::Adjective},
      {"prep", Part::Prepositional},
      {"prepositional", Part::Prepositional},
      {"time", Part::Time},
      {"adverb", Part::Adverb},
      {"you", Part::SecondPerson},
      {"second-person", Part::SecondPerson},
  };
  const auto found = kParts.find(lower(key));
  if (found == kParts.end()) return false;
  out = found->second;
  return true;
}

// The colour the part carries, before the per-word rules below narrow it.
std::string partColour(Part part) {
  switch (part) {
    case Part::Subject:
    case Part::Object:
    case Part::SecondPerson:
      return "--color-role-noun";
    case Part::Verb:
    case Part::Auxiliary:
      return "--color-role-verb";
    case Part::Adjective:
      return "--color-role-adjective";
    case Part::Prepositional:
      return "--color-role-preposition";
    case Part::Time:
      return "--color-role-time";
    case Part::Adverb:
      return "--color-role-adverb";
  }
  return kInk;
}

bool isArticle(const std::string& word) {
  const std::string text = lower(word);
  return text == "a" || text == "an" || text == "the";
}

// With no * marker, the head of the phrase is found by position: a preposition opens
// its phrase, an adverb closes one ("very quickly"). Everything else takes the part's
// colour throughout, except articles, which the artwork draws in their own colour.
void colourByRule(Part part, std::vector<Word>& words) {
  const std::string colour = partColour(part);
  for (std::size_t i = 0; i < words.size(); ++i) {
    switch (part) {
      case Part::Prepositional:
        words[i].colourToken = i == 0 ? colour : kInk;
        break;
      case Part::Adverb:
        words[i].colourToken = i + 1 == words.size() ? colour : kInk;
        break;
      case Part::Subject:
      case Part::Object:
      case Part::SecondPerson:
        words[i].colourToken = isArticle(words[i].text) ? "--color-role-article" : colour;
        break;
      default:
        words[i].colourToken = colour;
        break;
    }
  }
}

std::string joinWords(const std::vector<Constituent>& parts, char separator) {
  std::string out;
  for (const Constituent& part : parts) {
    for (const Word& word : part.words) {
      if (!out.empty()) out += separator;
      out += word.text;
    }
  }
  return out;
}

}  // namespace

bool Palette::read(const std::string& path, Palette& out, std::string& error) {
  std::ifstream file(path);
  if (!file) {
    error = "cannot open " + path;
    return false;
  }
  std::string line;
  while (std::getline(file, line)) {
    const auto start = line.find("--");
    if (start == std::string::npos) continue;
    const auto colon = line.find(':', start);
    if (colon == std::string::npos) continue;
    const auto semi = line.find(';', colon);
    if (semi == std::string::npos) continue;
    const std::string name = trim(line.substr(start, colon - start));
    const std::string value = trim(line.substr(colon + 1, semi - colon - 1));
    if (!name.empty() && !value.empty()) out.values_[name] = value;
  }
  if (out.values_.empty()) {
    error = path + " defines no custom properties";
    return false;
  }
  return true;
}

std::string Palette::operator[](const std::string& token) const {
  const auto found = values_.find(token);
  if (found != values_.end()) return found->second;
  if (std::find(missing_.begin(), missing_.end(), token) == missing_.end()) {
    missing_.push_back(token);
  }
  return "#000000";
}

bool parseConstituent(const std::string& spec, Constituent& out, std::string& error) {
  const auto colon = spec.find(':');
  if (colon == std::string::npos) {
    error = "expected part:words, got \"" + spec + "\"";
    return false;
  }
  if (!partFromKey(trim(spec.substr(0, colon)), out.part)) {
    error = "unknown part \"" + trim(spec.substr(0, colon)) + "\" in \"" + spec + "\"";
    return false;
  }

  std::istringstream words(spec.substr(colon + 1));
  std::string token;
  bool marked = false;
  while (words >> token) {
    Word word;
    if (token.front() == '*' && token.size() > 1) {
      word.text = token.substr(1);
      word.colourToken = partColour(out.part);
      marked = true;
    } else {
      word.text = token;
      word.colourToken = kInk;
    }
    out.words.push_back(word);
  }
  if (out.words.empty()) {
    error = "no words in \"" + spec + "\"";
    return false;
  }
  if (!marked) colourByRule(out.part, out.words);
  return true;
}

Shape shapeFor(Part part) {
  switch (part) {
    case Part::Subject: return Shape::Oval;
    case Part::Object: return Shape::Rectangle;
    case Part::Verb: return Shape::Hexagon;
    case Part::Adjective: return Shape::Cloud;
    case Part::Prepositional: return Shape::Semicircle;
    case Part::Time: return Shape::Triangle;
    case Part::Adverb: return Shape::TriangleRight;
    case Part::Auxiliary: return Shape::Diamond;
    case Part::SecondPerson: return Shape::SemicircleDown;
  }
  return Shape::Oval;
}

std::string fillTokenFor(Part part) {
  switch (part) {
    case Part::Subject:
    case Part::SecondPerson:
      return "--color-slot-who";
    case Part::Prepositional:
      return "--color-slot-where";
    default:
      return "--color-shape";
  }
}

std::string sentenceOf(const std::vector<Constituent>& parts) {
  return joinWords(parts, ' ');
}

std::string fileNameOf(const std::vector<Constituent>& parts) {
  std::string name = joinWords(parts, '_');
  std::string out;
  for (const char ch : name) {
    if (std::isalnum(static_cast<unsigned char>(ch)) || ch == '_') out += ch;
  }
  return out.empty() ? "sentence.svg" : out + ".svg";
}

std::string render(const std::vector<Constituent>& parts, const Palette& palette,
                   double height) {
  // Everything is proportional to the container height, so one --height changes the
  // whole drawing and nothing drifts out of step.
  const double fontSize = height * 16.0 / 76.8;
  const double gap = height * 16.0 / 76.8;
  const double margin = gap;
  const double stroke = std::max(1.0, height * 2.0 / 76.8);
  const double wordGap = fontSize * 0.3;

  struct Placed {
    Shape shape;
    Box box;
    const Constituent* source;
    double textWidth;
  };

  std::vector<Placed> placed;
  double x = margin;
  for (const Constituent& part : parts) {
    const Shape shape = shapeFor(part.part);

    double textWidth = 0;
    for (std::size_t i = 0; i < part.words.size(); ++i) {
      if (i > 0) textWidth += wordGap;
      textWidth += estimateWidth(part.words[i].text, fontSize);
    }

    // A long phrase widens its container rather than spilling out of it.
    const double needed = textWidth / interiorFraction(shape);
    const double width = std::max(nominalWidth(shape, height), needed);

    placed.push_back({shape, Box{x, margin, width, height}, &part, textWidth});
    x += width + gap;
  }

  const double totalWidth = x - gap + margin;
  const double totalHeight = height + margin * 2;

  std::ostringstream svg;
  svg << "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 "
      << static_cast<long>(std::lround(totalWidth)) << " "
      << static_cast<long>(std::lround(totalHeight)) << "\" width=\""
      << static_cast<long>(std::lround(totalWidth)) << "\" height=\""
      << static_cast<long>(std::lround(totalHeight)) << "\" role=\"img\" aria-label=\""
      << escape(sentenceOf(parts)) << "\">\n";

  for (const Placed& item : placed) {
    svg << "  " << outline(item.shape, item.box, palette[fillTokenFor(item.source->part)],
                           palette["--color-shape-line"], stroke)
        << "\n";
  }

  for (const Placed& item : placed) {
    const double centreX = item.box.x + item.box.w * interiorCentreX(item.shape);
    const double centreY = item.box.y + item.box.h * interiorCentreY(item.shape);
    // SVG places text on its baseline; the shift puts the cap-height block, not the
    // baseline, on the centre line the shapes are built around.
    const double baseline = centreY + fontSize * 0.35;

    double penX = centreX - item.textWidth / 2;
    for (std::size_t i = 0; i < item.source->words.size(); ++i) {
      const Word& word = item.source->words[i];
      if (i > 0) penX += wordGap;
      svg << "  <text x=\"" << coord(penX) << "\" y=\"" << coord(baseline)
          << "\" font-family=\"Mukta, system-ui, sans-serif\" font-size=\"" << coord(fontSize)
          << "\" font-weight=\"700\" text-decoration=\"underline\" fill=\""
          << palette[word.colourToken] << "\">" << escape(word.text) << "</text>\n";
      penX += estimateWidth(word.text, fontSize);
    }
  }

  svg << "</svg>\n";
  return svg.str();
}

}  // namespace shapecoder
