#include <cstdlib>
#include <fstream>
#include <iostream>
#include <string>
#include <vector>

#include "coder.hpp"

namespace {

const char* kUsage = R"(shapecoder — draw a sentence in the visual grammar framework

  shapecoder [options] <constituent>...

Each constituent is part:words. A word prefixed with * carries the part's colour and
the rest of the phrase stays in the plain ink — that is how "yellow for prepositions
only" and "brown for adverbs only" are written down. Without a marker the head is found by
position: a preposition opens its phrase, an adverb closes one.

Parts    subject  aux  verb  object  adj  prep  time  adverb  you

Options
  --out <dir>      write <Sentence>.svg into <dir>; default is stdout
  --tokens <path>  stylesheet to read colours from
                   (default src/styles/tokens.css)
  --height <px>    container height, everything else scales from it (default 208)
  -h, --help       this text

Example
  shapecoder --out src/assets/sentences \
    "subject:A boy" "aux:is" "verb:eating" "object:an apple"
)";

bool parseNumber(const std::string& text, double& out) {
  try {
    std::size_t used = 0;
    const double value = std::stod(text, &used);
    if (used != text.size() || value <= 0) return false;
    out = value;
    return true;
  } catch (const std::exception&) {
    return false;
  }
}

}  // namespace

int main(int argc, char** argv) {
  std::string outDir;
  std::string tokensPath = "src/styles/tokens.css";
  double height = 208;
  std::vector<shapecoder::Constituent> parts;

  for (int i = 1; i < argc; ++i) {
    const std::string arg = argv[i];
    const auto next = [&](const char* name) -> std::string {
      if (i + 1 >= argc) {
        std::cerr << "shapecoder: " << name << " needs a value\n";
        std::exit(2);
      }
      return argv[++i];
    };

    if (arg == "-h" || arg == "--help") {
      std::cout << kUsage;
      return 0;
    }
    if (arg == "--out") {
      outDir = next("--out");
      continue;
    }
    if (arg == "--tokens") {
      tokensPath = next("--tokens");
      continue;
    }
    if (arg == "--height") {
      if (!parseNumber(next("--height"), height)) {
        std::cerr << "shapecoder: --height wants a positive number\n";
        return 2;
      }
      continue;
    }
    if (!arg.empty() && arg[0] == '-') {
      std::cerr << "shapecoder: unknown option " << arg << "\n\n" << kUsage;
      return 2;
    }

    shapecoder::Constituent part;
    std::string error;
    if (!shapecoder::parseConstituent(arg, part, error)) {
      std::cerr << "shapecoder: " << error << "\n";
      return 2;
    }
    parts.push_back(part);
  }

  if (parts.empty()) {
    std::cerr << kUsage;
    return 2;
  }

  shapecoder::Palette palette;
  std::string error;
  if (!shapecoder::Palette::read(tokensPath, palette, error)) {
    std::cerr << "shapecoder: " << error << "\n"
              << "shapecoder: pass --tokens, or run from the repository root\n";
    return 1;
  }

  const std::string svg = shapecoder::render(parts, palette, height);

  for (const std::string& token : palette.missing()) {
    std::cerr << "shapecoder: " << tokensPath << " does not define " << token
              << ", drew it black\n";
  }

  if (outDir.empty()) {
    std::cout << svg;
    return 0;
  }

  const std::string path = outDir + "/" + shapecoder::fileNameOf(parts);
  std::ofstream file(path);
  if (!file) {
    std::cerr << "shapecoder: cannot write " << path << "\n";
    return 1;
  }
  file << svg;
  if (!file) {
    std::cerr << "shapecoder: failed while writing " << path << "\n";
    return 1;
  }
  std::cerr << path << "\n";
  return 0;
}
