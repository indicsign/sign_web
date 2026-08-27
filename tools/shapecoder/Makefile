# No dependencies beyond a C++17 compiler. This tool is deliberately not wired into
# `npm run build` — the page must build without a C++ toolchain.

CXX      ?= c++
CXXFLAGS ?= -std=c++17 -O2 -Wall -Wextra -Wpedantic
BIN      := shapecoder
SRC      := main.cpp coder.cpp shapes.cpp
OBJ      := $(SRC:.cpp=.o)

$(BIN): $(OBJ)
	$(CXX) $(CXXFLAGS) -o $@ $(OBJ)

%.o: %.cpp coder.hpp shapes.hpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

clean:
	rm -f $(BIN) $(OBJ)

.PHONY: clean
