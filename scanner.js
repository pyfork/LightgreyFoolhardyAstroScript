//@version=5
// indicator("AMD 5HA Scanner", overlay=true)
indicator("AMD 5HA Scanner", overlay=true, max_bars_back=150)

// User-defined input for shape and text colors
color bullishShapeColor = input(color.new(#c8e6c9, 0), "Bullish Shape Color")
color bearishShapeColor = input(color.new(#fccbcd, 0), "Bearish Shape Color")
color bullishTextColor = input(color.new(#4caf50, 0), "Bullish Text Color")
color bearishTextColor = input(color.new(#f77c80, 0), "Bearish Text Color")

// User-defined input for percent change threshold
float percentChangeThreshold = input.float(0.05, title="Percent Change Threshold", minval=0.01, maxval=5.0)

var float haOpen = na  // Declare haOpen with an initial value
var float haClose = na  // Declare haClose with an initial value

// Heiken Ashi calculations
haClose := (open + high + low + close) / 4
haOpen := na(haOpen[1]) ? (open + close) / 2 : (haOpen[1] + haClose[1]) / 2

// Determine type of HA candles: 1 for bullish, -1 for bearish
var int haType = 0 // Initializing haType
haType := haClose > haOpen ? 1 : haClose < haOpen ? -1 : nz(haType[1], 0)

// Count consecutive candles of the same type
var int consecCandles = 0
consecCandles := haType == haType[1] ? consecCandles + 1 : 1

// Store the close of the first candle in the sequence
var float firstClose = na
firstClose := consecCandles == 1 ? haClose : firstClose

// Reset the first close after 5 candles to avoid referencing too far back in history
if consecCandles > 5
    firstClose := na

// Calculate total percent change over 5 consecutive candles of the same type
var float percentChange = 0.0
if consecCandles >= 5
    percentChange := 100 * (haClose - firstClose) / firstClose
percentChange := math.abs(percentChange)

// Condition for 5 consecutive candles of the same type with a total percent change greater than user-defined threshold
longCondition = consecCandles >= 5 and haType == 1 and percentChange > percentChangeThreshold
shortCondition = consecCandles >= 5 and haType == -1 and percentChange > percentChangeThreshold

// Plotting the signal with user-defined color for shape and text
plotshape(series=longCondition, location=location.belowbar, color=bullishShapeColor, style=shape.labelup, textcolor=bullishTextColor, text="Bullish 5HA")
plotshape(series=shortCondition, location=location.abovebar, color=bearishShapeColor, style=shape.labeldown, textcolor=bearishTextColor, text="Bearish 5HA")

// Optional: Plotting Heiken Ashi values for reference
plot(haClose, "HA Close", color=color.blue)
plot(haOpen, "HA Open", color=color.orange)