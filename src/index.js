const { app, dialog } = require("electron");
const electron = require("electron");
const { ipcMain, Tray } = require("electron");
const path = require("path");
const BrowserWindow = electron.BrowserWindow;
var iconpath = path.join(__dirname, "icon.ico");
const updater = require("./updater");
var AutoLaunch = require("auto-launch");
const isDev = require("electron-is-dev");

//require("electron-reload")(__dirname);

let listWindow = null;
app.on("ready", () => {
	/*--------------------Circle Window ------------------------*/
	let display = electron.screen.getPrimaryDisplay();
	let width = display.bounds.width;
	let height = display.bounds.height;

	if (isDev) {
		//console.log("Running in development");
	} else {
		let asLauncher = new AutoLaunch({
			name: "AgustoSystems"
		});
		asLauncher.enable();
		setTimeout(updater.check, 10000);
	}

	var mainWindow = new BrowserWindow({
		width: 75,
		height: 75,
		frame: false,
		x: width - 10 - 85,
		y: height - 50 - 85,
		transparent: true,
		icon: "./src/app/icon.svg",
		resizable: false,
		webPreferences: {
			nodeIntegration: true
		}
	});
	mainWindow.loadURL(__dirname + "/app/main.html");
	mainWindow.setSkipTaskbar(true);
	//mainWindow.openDevTools();

	/*--------------------List Window ------------------------*/
	listWindow = new BrowserWindow({
		width: 400,
		height: 350,
		maxHeight: 350,
		x: width - 5 - 400,
		y: height - 35 - 350,
		show: false,
		transparent: true,
		frame: false,
		resizable: false,
		webPreferences: {
			nodeIntegration: true
		}
	});
	listWindow.loadURL(__dirname + "/app/list.html");
	listWindow.setSkipTaskbar(true);
	//listWindow.openDevTools();

	/*--------------------App Window ------------------------*/
	appWindow = new BrowserWindow({
		center: true,
		show: false,
		x: width - 5,
		minWidth: width - 500,
		minHeight: height - 200,
		width,
		height,
		autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: true
		}
	});

	//appWindow.openDevTools();

	appWindow.on("close", e => {
		e.preventDefault();
		appWindow.loadURL(__dirname + "/app/blank.html");
		appWindow.hide();
	});

	ipcMain.on("openList", () => {
		listWindow.show();
	});

	ipcMain.on("openApp", (value, url) => {
		appWindow.loadURL(url);
		appWindow.setSkipTaskbar(true);
		appWindow.show();
		appWindow.maximize();
	});

	ipcMain.on("hideList", () => {
		listWindow.hide();
	});
});

app.on("closed", () => {
	listWindow = null;
});
