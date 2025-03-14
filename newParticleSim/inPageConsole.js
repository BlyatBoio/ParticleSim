let consoleInput;
let Console;
let logStartPos = 0;
let consolePosition = "Right" // "Left", "Right", "Top", "Bottom", "Center"

// colors natively use the colortheme.js and include functionality for setting themes
// 100% reccomended used alongside colortheme.js

function onScreenConsole()
{
    let yOff = 0;
    textWrap("Char")
    textSize(Console.logTextSize);
    setThemeFill(0);
    consoleInput.style("background-color", currentColorTheme.fillColors[1]);
    consoleInput.style("border", currentColorTheme.fillColors[1]);
    consoleInput.style("color", currentColorTheme.textColors[0]);

    rect(width / (5 / 4), 0, width / 5, height);
    for (let i = logStartPos; i < Console.logs.length; i++)
    {
        if (Console.logs[i][0] == "E" && Console.logs[i][0] == "R" && Console.logs[i][0] == "R") setThemeText(2);
        else setThemeText(0);
        text(Console.logs[i], (width / (5 / 4) + 1.5 * Console.logSpacing) + (textWidth(i + ":") + 5) / 2, Console.logSpacing + yOff + (i - logStartPos) * Console.logSpacing, width / 5 - (Console.logSpacing * 2));
        setThemeText(1);
        text(i + ":", (width / (5 / 4) + 1.5 * Console.logSpacing) - (textWidth(i + ":") + 5) / 2, Console.logSpacing + yOff + (i - logStartPos) * Console.logSpacing, width / 5 - (Console.logSpacing * 2));

        // if the charachter needs to be wrapped, add the extra line it takes into the y off
        if (textWidth(Console.logs[i]) > width / 5 - 30) yOff += ((ceil(textWidth(Console.logs[i]) / ((width / 5) - (Console.logSpacing * 2))) - 1) * Console.logSpacing);
        while (Console.logSpacing + yOff + (i - logStartPos) * Console.logSpacing > height) { logStartPos += 2; }
    }
    //logStartPos += round(mouseScrolled/50);
    //logStartPos = constrain(logStartPos, 0, Console.logs.length - 1);
}
function runInputComand()
{
    let cmd = consoleInput.value(); // simpler refference to input value
    let comandSplit = cmd.split(" "); // split the string by spaces

    // get the arguments to be passed into a run or say command 
    let comandArgs = copyArray(comandSplit);
    comandArgs.shift();
    let args = "";
    for (let i = 0; i < comandArgs.length; i++)
    {
        args += comandArgs[i] + " ";
    }

    //Console.log("Comand Entered: " + cmd); // log that the comand was inputed

    // handle key words for commands, relatively self explanatory
    switch (comandSplit[0])
    {
        case "get":
            Console.log(args + ": " + eval(args));
            break;
        case "run":
            Console.log(eval(args));
            break;
        case "say":
            Console.log("System: " + args);
            break;
        case "clear":
            Console.clear();
            break;
        case "reload":
            location.reload();
            break;
        case "saveLogs":
            Console.log("Logs Saved To C:/dowloads/DebugLog_" + timestamp());
            Console.saveLogs();
            break;
        case "setTheme":
            currentColorTheme = eval(args);
            Console.log("Set Theme To: " + args);
            break;
        case "screenshot":
            saveCanvas();
            Console.log("Saved Screenshot Of Canvas!");
            break;
        case "set":
            let saveArgs1 = comandArgs[0];
            eval(comandArgs[0] + "=" + comandArgs[1]);
            Console.log("Set: " + saveArgs1 + " To: " + comandArgs[1]);
            break;
        case "close":
            window.close();
            break;
        case "solve":
            let eqn = eval(args);
            Console.log("Result: " + args + " = " + eqn);
            break;
        case "FPS":
            Console.log("FPS: " + frameCount());
            break;
        case "addLogger":
            Console.addLogger(comandArgs[0], comandArgs[0] + ": ", eval(comandArgs[1]));
            Console.log("Logger Added: " + comandArgs[0]);
            break;
        case "clearLoggers":
            Console.log("Loggers Cleared!");
            Console.loggers = [];
            break;
        default:
            Console.error("Improper Key word Imputed: ");
            Console.error(cmd);
            break;
    }

    // clear console input
    consoleInput.value("");
}
function keyPressed()
{
    if (keyCode === 13 && consoleInput.value() != "")
    {
        runInputComand();
    }
}
class consoleClass
{
    constructor()
    {
        this.logs = [];
        this.logSpacing = 25;
        this.logTextSize = 15;
        this.loggers = [];
    }
    log(args)
    {
        this.logs.push(str(args));
    }
    error(args)
    {
        this.logs.push("ERROR: " + str(args));
    }
    clear()
    {
        this.logs = [];
        logStartPos = 0;
    }
    saveLogs()
    {
        let fileName = "DebugLog_" + timestamp();
        saveStrings(this.logs, fileName, "txt", true);
    }
    thingHappened()
    {
        this.logs.push("Something Happened!")
    }
    updateLoggers()
    {
        for (let i = 0; i < this.loggers.length; i++)
        {
            this.loggers[i].logSelf();
        }
    }
    addLogger(vars, formatting, onChange)
    {
        if(onChange == undefined) onChange = false;
        this.loggers.push(new logger(vars, formatting, onChange));
    }
}
class logger
{
    constructor(varToLog, formatting, onChange)
    {
        this.varToLog = varToLog;
        this.formatting = formatting;
        this.onChange = onChange;
        this.lastPrint = "";
        if (this.formatting == undefined) this.formatting = this.varToLog + ": ";
    }
    logSelf()
    {
        if (this.onChange == false || this.lastPrint != eval(this.varToLog)) Console.log(this.formatting + eval(this.varToLog));
        this.lastPrint = eval(this.varToLog);
    }
}