import { Text, View, Pressable, ScrollView, Dimensions, StatusBar } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

// Simple safe calculator parser
const safeCalculate = (input: string) => {
  try {
    let sanitized = input.replace(/%/g, "/100"); // handle %
    // prevent trailing operators
    sanitized = sanitized.replace(/[\+\-\*\/\.]+$/, "");
    // eslint-disable-next-line no-eval
    const res = eval(sanitized);
    if (!isFinite(res)) return "Error";
    return res.toString();
  } catch {
    return "Error";
  }
};

export default function App() {
  const [display, setDisplay] = useState("0");

  const handlePress = (value: string) => {
    const operators = ["+", "-", "*", "/", "%"];
    const lastChar = display[display.length - 1];

    // AC clears everything
    if (value === "AC") {
      setDisplay("0");
      return;
    }

    // DEL removes last character
    if (value === "DEL") {
      setDisplay((prev) => {
        if (prev === "Error" || prev.length <= 1) return "0";
        return prev.slice(0, -1);
      });
      return;
    }

    // = calculates result
    if (value === "=") {
      setDisplay(safeCalculate(display));
      return;
    }

    // Prevent multiple operators
    if (operators.includes(value) && operators.includes(lastChar)) {
      setDisplay(display.slice(0, -1) + value);
      return;
    }

    // Prevent multiple dots in the same number
    if (value === ".") {
      // get last number segment
      const segments = display.split(/[\+\-\*\/%]/);
      if (segments[segments.length - 1].includes(".")) return;
    }

    // Normal input
    setDisplay((prev) => (prev === "0" ? value : prev + value));
  };

  // Live result preview
  const result = display !== "Error" ? safeCalculate(display) : "0";

  const BUTTONS = [
    "AC",
    "/",
    "*",
    "DEL",
    "7",
    "8",
    "9",
    "-",
    "4",
    "5",
    "6",
    "+",
    "1",
    "2",
    "3",
    "=",
    ".",
    "0",
    "%",
  ];

  const screenHeight = Dimensions.get("window").height;
  const buttonHeight = (screenHeight - 300) / 5; // subtract header & screen approx

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
      <StatusBar barStyle="light-content" />
      <View className="flex-1">
        <Text className="text-5xl font-bold text-blue-500 text-center p-6">
          Calculator
        </Text>

        {/* Display */}
        <View className="bg-gray-900 rounded-2xl p-5">
          <ScrollView
            horizontal
            contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
          >
            <Text className="text-amber-500 text-5xl text-right">
              {display}
            </Text>
          </ScrollView>
          <ScrollView
            horizontal
            contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
          >
            <Text className="text-white text-8xl text-right">{result}</Text>
          </ScrollView>
        </View>

        {/* Buttons */}
        <View className="flex-1 mt-4 rounded-2xl overflow-hidden">
          <View className="flex-row flex-wrap">
            {BUTTONS.map((num) => (
              <Pressable
                key={num}
                onPress={() => handlePress(num)}
                className={`w-1/4 border border-black items-center justify-center ${
                  ["=", "+", "-", "DEL"].includes(num)
                    ? "bg-blue-500"
                    : "bg-gray-700"
                }`}
                style={{ height: buttonHeight }}
              >
                <Text
                  className={`text-3xl ${
                    ["AC", "/", "*"].includes(num)
                      ? "text-red-500"
                      : "text-white"
                  }`}
                >
                  {num}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
