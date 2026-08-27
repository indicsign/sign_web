// Turns an annotated sentence into shape-coded SVG.
//
// The framework in one table — this is what the file below encodes:
//
//   Sentence structure                Shape                   Text colour
//   Subject (who/what)                oval                    red
//   Object (who/what)                 rectangle               red
//   Verb (what doing)                 hexagon                 blue
//   Adjective phrase (what like)      cloud                   green
//   Prepositional phrase (where)      semicircle              yellow, preposition only
//   Time (when)                       triangle                black
//   Adverbs and means (how)           right-facing triangle   brown, adverb only
//   Auxiliary verb (is/are)           diamond                 blue
//   Second person                     downward semicircle     red
#pragma once

#include <map>
#include <string>
#include <vector>

#include "shapes.hpp"

namespace shapecoder {

enum class Part {
  Subject,
  Auxiliary,
  Verb,
  Object,
  Adjective,
  Prepositional,
  Time,
  Adverb,
  SecondPerson,
};

struct Word {
  std::string text;
  // The custom property the word is drawn in, e.g. "--color-role-noun".
  std::string colourToken;
};

struct Constituent {
  Part part = Part::Subject;
  std::vector<Word> words;
};

// Colours read from src/styles/tokens.css at run time, so the artwork and the page
// cannot drift apart. tokens.css is the only place a raw hex value lives in this
// project, and that holds here too.
class Palette {
 public:
  static bool read(const std::string& path, Palette& out, std::string& error);
  // Falls back to black for a token the stylesheet does not define, and records the
  // name so the caller can report it rather than shipping a silently black word.
  std::string operator[](const std::string& token) const;
  const std::vector<std::string>& missing() const { return missing_; }

 private:
  std::map<std::string, std::string> values_;
  mutable std::vector<std::string> missing_;
};

// `spec` is "part:words", e.g. "subject:A boy" or "prep:*at school". A word prefixed
// with * carries the part's colour and the rest of the phrase stays plain, which is
// how "yellow for prepositions only" and "brown for adverbs only" are written down.
bool parseConstituent(const std::string& spec, Constituent& out, std::string& error);

Shape shapeFor(Part part);

// Subject and second person take the Who fill, a prepositional phrase the Where fill;
// every other container is white, as the app draws them.
std::string fillTokenFor(Part part);

std::string sentenceOf(const std::vector<Constituent>& parts);
std::string fileNameOf(const std::vector<Constituent>& parts);

std::string render(const std::vector<Constituent>& parts, const Palette& palette,
                   double height);

}  // namespace shapecoder
